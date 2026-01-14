<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pduKMi5Dq0zjesKPeeCL1zAeC2bpLvcr

## Run Locally (frontend + backend)

**Prerequisites:** Node.js 20+ / Docker (optional)

1) 安装依赖  
```
npm install
(cd server && npm install)
```

2) 配置后端环境变量  
- 复制 `server/env.local.example` 为 `server/.env.local`，填入 `GEMINI_API_KEY`、`USERS_JSON`（默认 demo 账号已给出）。  
- 如用 docker-compose，可直接用环境变量注入。

3) 运行后端（本地 Node）  
```
cd server
npm run build
GEMINI_API_KEY=xxx USERS_JSON='[{"email":"demo@capvisor.ai","password":"capvisor123"}]' JWT_SECRET=change-me DATABASE_URL=postgres://postgres:postgres@localhost:5432/capvisor node dist/index.js
```

4) 运行前端  
```
npm run dev
# 默认前端 3000，后端 8787
```

## Docker / Compose（推荐最简单部署）
```
GEMINI_API_KEY=xxx USERS_JSON='[{"email":"demo@capvisor.ai","password":"capvisor123"}]' docker-compose up --build
```
这会启动 Postgres + 后端（端口 8787）。前端可以本地 dev，或将构建后的静态文件部署到任意静态托管，前端需设置 `VITE_API_BASE` 指向后端地址。

## 账号（≤3 个）
通过环境变量 `USERS_JSON` 配置种子用户，例如：
```
USERS_JSON='[{"email":"demo@capvisor.ai","password":"capvisor123"},{"email":"ops@capvisor.ai","password":"changeme"}]'
```
前端登录页面使用这些账号。

