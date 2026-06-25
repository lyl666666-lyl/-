# 旅游管理系统课程设计

本项目已经改为默认演示模式：不需要手动启动 MySQL、不需要导入 SQL、不需要配置数据库密码。

直接运行：

```powershell
cd D:\codex\旅游管理系统-20260622
.\start.ps1
```

脚本会自动完成：

- 清理旧的 `8080` / `5173` 端口占用
- 构建并启动 Spring Boot 后端
- 使用内嵌 H2 数据库自动初始化演示数据
- 启动 Vue 前端
- 等待前后端可访问
- 自动打开浏览器

访问地址：

- 前端页面：http://localhost:5173
- 后端接口：http://localhost:8080
- H2 控制台：http://localhost:8080/h2-console

测试账号：

- 管理员：`admin / 123456`
- 游客：`tourist1 / 123456`
- 游客：`tourist2 / 123456`

## 项目结构

- `tourism-backend`：Spring Boot 3 + MyBatis Plus + JWT + Spring Security + POI
- `tourism-frontend`：Vue 3 + Vite + Element Plus + Axios + Pinia
- `tourism-backend/src/main/resources/schema.sql`：演示模式自动建表
- `tourism-backend/src/main/resources/data.sql`：演示模式自动数据
- `tourism-backend/src/main/resources/sql/init.sql`：MySQL 8 课程设计建库 SQL，作为交付材料保留
- `tourism-backend/src/main/resources/application-mysql.yml`：可选 MySQL 配置模板

## 答辩演示流程

1. 管理员登录后台。
2. 管理员维护景点、线路、套餐和导游。
3. 游客登录，维护常用出行人。
4. 游客浏览线路详情并提交预订订单。
5. 管理员在订单核对中确认或退回订单。
6. 管理员为确认订单创建出行安排。
7. 游客查看订单详情和出行提醒。
8. 游客提交售后咨询。
9. 管理员回复售后。
10. 管理员在报表页筛选订单并导出 Excel。

## 使用 MySQL 的方式

如果课程老师要求必须连接 MySQL，可以使用 `tourism-backend/src/main/resources/sql/init.sql` 初始化 MySQL 8，然后将 `application-mysql.yml` 中的数据库密码改为你的本机密码，再用：

```powershell
cd D:\codex\旅游管理系统-20260622\tourism-backend
..\tools\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```

普通演示不需要这一步。
