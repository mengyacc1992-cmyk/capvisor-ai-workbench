# 部署指南

本指南将帮助你将 CapVisor AI Workbench 部署到云端，让其他人可以通过互联网访问。

## 🚀 推荐部署方案：Railway (后端) + Vercel (前端)

### 第一步：部署后端到 Railway

1. **注册 Railway 账号**
   - 访问 [railway.app](https://railway.app)
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库

3. **配置服务**
   - 点击 "New Service" → "GitHub Repo"
   - 选择仓库
   - 在设置中：
     - **Root Directory**: `services/server`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `node dist/index.js`

4. **添加环境变量**
   在 Railway 的 Variables 标签页添加：
   ```
   GEMINI_API_KEY=你的_Gemini_API_密钥
   JWT_SECRET=一个随机的安全字符串（至少32字符）
   USERS_JSON=[{"email":"demo@capvisor.ai","password":"capvisor123"}]
   CLIENT_ORIGIN=https://your-frontend.vercel.app
   PORT=8787
   DATABASE_URL=railway会自动提供
   ```

5. **添加 PostgreSQL 数据库**（可选）
   - 点击 "New" → "Database" → "Add PostgreSQL"
   - Railway 会自动设置 `DATABASE_URL`

6. **获取后端 URL**
   - 部署完成后，Railway 会提供一个 URL，例如：`https://capvisor-backend.railway.app`
   - 记下这个 URL，前端会用到

### 第二步：部署前端到 Vercel

1. **注册 Vercel 账号**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New" → "Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (根目录)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **添加环境变量**
   在 Environment Variables 中添加：
   ```
   VITE_API_BASE=https://your-railway-backend.railway.app
   ```
   （替换为你的 Railway 后端 URL）

5. **部署**
   - 点击 "Deploy"
   - 等待部署完成
   - Vercel 会提供一个 URL，例如：`https://capvisor-ai-workbench.vercel.app`

### 第三步：更新 CORS 设置

回到 Railway，更新 `CLIENT_ORIGIN` 环境变量为你的 Vercel 前端 URL：
```
CLIENT_ORIGIN=https://capvisor-ai-workbench.vercel.app
```

Railway 会自动重新部署。

## 🔄 更新部署

### 更新代码
1. 在本地修改代码
2. 提交到 GitHub：
   ```bash
   git add .
   git commit -m "Update: your changes"
   git push origin main
   ```
3. Railway 和 Vercel 会自动检测并重新部署

### 更新环境变量
- **Railway**: 在 Variables 标签页修改，会自动重新部署
- **Vercel**: 在 Settings → Environment Variables 修改，需要手动重新部署

## 📊 监控和日志

### Railway
- 在 Railway 项目页面可以查看：
  - 实时日志
  - 资源使用情况
  - 部署历史

### Vercel
- 在 Vercel 项目页面可以查看：
  - 部署状态
  - 访问分析
  - 函数日志

## 🔒 安全建议

1. **使用强密码**
   - 修改默认的 `capvisor123` 密码
   - 使用复杂的密码

2. **保护 API Key**
   - 不要将 API Key 提交到 GitHub
   - 使用环境变量存储

3. **HTTPS**
   - Railway 和 Vercel 都自动提供 HTTPS
   - 确保所有环境变量中的 URL 使用 `https://`

4. **JWT Secret**
   - 使用强随机字符串作为 `JWT_SECRET`
   - 可以使用：`openssl rand -base64 32`

## 💰 成本估算

### Railway
- **免费层**: $5 免费额度/月
- **Hobby**: $5/月（适合小规模使用）

### Vercel
- **免费层**: 无限个人项目
- **Pro**: $20/月（团队功能）

### Google Gemini API
- 按使用量付费
- 查看 [定价页面](https://ai.google.dev/pricing)

## 🐛 常见问题

### 后端无法启动
- 检查环境变量是否都设置了
- 查看 Railway 日志中的错误信息
- 确保 `GEMINI_API_KEY` 有效

### 前端无法连接后端
- 检查 `VITE_API_BASE` 是否正确
- 检查后端 CORS 设置
- 查看浏览器控制台的错误信息

### 数据库连接失败
- 如果使用 PostgreSQL，确保 `DATABASE_URL` 正确
- 如果使用 SQLite，确保有写入权限

## 📞 获取帮助

如果遇到问题：
1. 查看 Railway/Vercel 的日志
2. 检查环境变量配置
3. 在 GitHub 上提交 Issue
