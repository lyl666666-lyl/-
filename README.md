# 智能在线物流系统设计

本项目已全面重构并改为默认演示模式：不需要手动启动 MySQL、不需要导入 SQL、不需要配置数据库密码。

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
- 寄件人：`sender1 / 123456`
- 物流专员：`specialist1 / 123456`

## 项目结构

- `logistics-backend`：Spring Boot 3 + MyBatis Plus + JWT + Spring Security + POI
- `logistics-frontend`：Vue 3 + Vite + Element Plus + Axios + Pinia
- `logistics-backend/src/main/resources/schema.sql`：演示模式自动建表
- `logistics-backend/src/main/resources/data.sql`：演示模式自动数据
- `logistics-backend/src/main/resources/application-mysql.yml`：可选 MySQL 配置模板

## 答辩演示流程

1. **公开轨迹查询**：免登录在首页查询单号 `WL202606290001` 的实时轨迹。
2. **寄件下单**：寄件人 `sender1` 登录前台，填写寄收件人地址与托寄物，提交下单（系统自动计费）。
3. **专员揽收**：物流专员 `specialist1` 登录后台，查看待处理订单，执行“上门揽收”并分拣入库。
4. **运输中转**：专员更新包裹的运输轨迹（添加中转记录，模拟各城市运转流程）。
5. **派送签收**：专员发起派送并最终录入收件人姓名进行“签收登记”。
6. **运营监控与统计**：管理员 `admin` 登录后台，维护物流网点与运输线路，全局监控所有物流订单，分析运营统计报表，并使用 Apache POI 导出物流数据明细 Excel。
