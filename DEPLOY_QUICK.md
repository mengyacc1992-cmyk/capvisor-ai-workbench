# 快速部署指南

## 🎯 目标：让其他人可以通过互联网访问你的应用

## 📋 部署前准备

### 1. 环境变量清单

**后端（Railway）需要的环境变量：**
```
GEMINI_API_KEY=你的_Gemini_API_密钥
JWT_SECRET=一个随机安全字符串（至少32字符）
USERS_JSON=[{"email":"demo@capvisor.ai","password":"capvisor123"}]
CLIENT_ORIGIN=https://your-frontend.vercel.app（稍后更新）
PORT=8787
```

**前端（Vercel）需要的环境变量：**
```
VITE_API_BASE=https://your-railway-backend.railway.app
```

## 🚀 部署步骤

### 步骤 1: 部署后端到 Railway

1. **访问 Railway**
   - 打开 https://railway.app
   - 使用 GitHub 账号登录

2. **创建项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择仓库：`mengyacc1992-cmyk/capvisor-ai-workbench`

3. **配置服务**
   - 点击服务名称进入设置
   - 在 "Settings" → "Source" 中：
     - Root Directory: `services/server`
     - Branch: `main`
   - 在 "Settings" → "Deploy" 中：
     - Build Command: `npm install && npm run build`
     - Start Command: `node dist/index.js`

4. **添加环境变量**
   - 点击 "Variables" 标签页
   - 添加以下变量：
     ```
     GEMINI_API_KEY=你的密钥
     JWT_SECRET=生成一个随机字符串（可以用: openssl rand -base64 32）
     USERS_JSON=[{"email":"demo@capvisor.ai","password":"capvisor123"}]
     PORT=8787
     ```
   - 先不设置 `CLIENT_ORIGIN`，等前端部署后再更新

5. **等待部署完成**
   - Railway 会自动开始部署
   - 部署完成后，点击 "Settings" → "Networking"
   - 点击 "Generate Domain" 生成一个域名
   - 记下这个 URL（例如：`https://xxx.railway.app`）

### 步骤 2: 部署前端到 Vercel

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New" → "Project"
   - 选择仓库：`mengyacc1992-cmyk/capvisor-ai-workbench`

3. **配置项目**
   - Framework Preset: `Vite`
   - Root Directory: `./`（根目录）
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **添加环境变量**
   - 在 "Environment Variables" 中添加：
     ```
     VITE_API_BASE=https://你的-railway-后端-url.railway.app
     ```
   - 替换为步骤 1 中获得的 Railway URL

5. **部署**
   - 点击 "Deploy"
   - 等待部署完成
   - Vercel 会给你一个 URL（例如：`https://xxx.vercel.app`）

### 步骤 3: 更新 CORS 设置

1. **回到 Railway**
   - 进入你的服务
   - 点击 "Variables" 标签页
   - 添加或更新 `CLIENT_ORIGIN`：
     ```
     CLIENT_ORIGIN=https://你的-vercel-前端-url.vercel.app
     ```
   - Railway 会自动重新部署

## ✅ 完成！

现在你的应用可以通过以下方式访问：
- **前端**: `https://your-app.vercel.app`
- **后端**: `https://your-app.railway.app`

## 🔐 登录信息

默认账号：
- Email: `demo@capvisor.ai`
- Password: `capvisor123`

## 🐛 故障排查

### Railway 显示 "Repository is empty"
- 确保代码已推送到 GitHub
- 在 Railway 中点击刷新按钮
- 检查 Root Directory 是否正确设置为 `services/server`

### 前端无法连接后端
- 检查 `VITE_API_BASE` 是否正确
- 检查后端 `CLIENT_ORIGIN` 是否包含前端 URL
- 查看浏览器控制台的错误信息

### 后端启动失败
- 检查所有环境变量是否都已设置
- 查看 Railway 的日志（Logs 标签页）
- 确保 `GEMINI_API_KEY` 有效

## 📞 需要帮助？

如果遇到问题，检查：
1. Railway 的部署日志
2. Vercel 的构建日志
3. 浏览器控制台的错误信息
