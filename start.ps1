$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Backend = Join-Path $Root "tourism-backend"
$Frontend = Join-Path $Root "tourism-frontend"
$Logs = Join-Path $Root "logs"
New-Item -ItemType Directory -Force -Path $Logs | Out-Null

function Stop-PortProcess([int]$Port) {
  $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
  $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($itemPid in $pids) {
    if ($itemPid -and $itemPid -ne $PID) {
      Stop-Process -Id $itemPid -Force -ErrorAction SilentlyContinue
    }
  }
}

function Get-MavenCommand {
  $mvn = Get-Command mvn -ErrorAction SilentlyContinue
  if ($mvn) { return "mvn" }

  $tools = Join-Path $Root "tools"
  $mvnHome = Join-Path $tools "apache-maven-3.9.9"
  $mvnCmd = Join-Path $mvnHome "bin\mvn.cmd"
  if (!(Test-Path $mvnCmd)) {
    New-Item -ItemType Directory -Force -Path $tools | Out-Null
    $zip = Join-Path $tools "maven.zip"
    Write-Host "正在准备项目内置 Maven..."
    Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip" -OutFile $zip
    Expand-Archive -Path $zip -DestinationPath $tools -Force
  }
  return $mvnCmd
}

function Wait-HttpOk([string]$Url, [int]$Seconds) {
  $deadline = (Get-Date).AddSeconds($Seconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) { return $true }
    } catch {
      Start-Sleep -Seconds 1
    }
  }
  return $false
}

Write-Host "正在清理旧服务端口..."
Stop-PortProcess 8080
Stop-PortProcess 5173

$mvnCmd = Get-MavenCommand

Write-Host "正在构建后端..."
Push-Location $Backend
& $mvnCmd -q -DskipTests package
Pop-Location

$jar = Join-Path $Backend "target\logistics-backend-1.0.0.jar"
if (!(Test-Path $jar)) { throw "后端 jar 未生成：$jar" }

Write-Host "正在启动后端：http://localhost:8080"
$backendCmd = "cd '$Backend'; java -jar '$jar' *> '$Logs\backend.log'"
Start-Process powershell -WindowStyle Hidden -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $backendCmd

if (!(Wait-HttpOk "http://localhost:8080/api/routes?size=1" 45)) {
  Write-Host "后端启动失败，请查看日志：$Logs\backend.log"
  Get-Content -LiteralPath (Join-Path $Logs "backend.log") -Tail 80
  throw "后端接口未能正常响应"
}

Write-Host "正在启动前端：http://localhost:5173"
$frontCmd = "cd '$Frontend'; if (!(Test-Path 'node_modules')) { npm install --no-audit }; npm run dev *> '$Logs\frontend.log'"
Start-Process powershell -WindowStyle Hidden -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $frontCmd

if (!(Wait-HttpOk "http://localhost:5173" 45)) {
  Write-Host "前端启动失败，请查看日志：$Logs\frontend.log"
  Get-Content -LiteralPath (Join-Path $Logs "frontend.log") -Tail 80
  throw "前端页面未能正常响应"
}

Write-Host "启动完成，正在打开浏览器..."
Start-Process "http://localhost:5173"
Write-Host "前台/后台入口：http://localhost:5173"
Write-Host "测试账号（密码均为 123456）："
Write-Host "  - 系统管理员：admin"
Write-Host "  - 寄件客户：sender1"
Write-Host "  - 物流专员：specialist1"
