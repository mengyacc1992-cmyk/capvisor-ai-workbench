# GitHub 仓库设置指南

## 📦 创建 GitHub 仓库

### 方法 1: 使用 GitHub CLI（推荐）

```bash
# 安装 GitHub CLI（如果还没有）
# macOS: brew install gh
# 或访问 https://cli.github.com

# 登录 GitHub
gh auth login

# 创建仓库并推送代码
cd /Users/chengchi/Downloads/capvisor-ai-workbench-v2.0
gh repo create capvisor-ai-workbench --public --source=. --remote=origin --push
```

### 方法 2: 使用 GitHub 网页

1. **在 GitHub 上创建新仓库**
   - 访问 [github.com/new](https://github.com/new)
   - 仓库名称：`capvisor-ai-workbench`（或你喜欢的名称）
   - 选择 Public 或 Private
   - **不要**初始化 README、.gitignore 或 license（我们已经有了）

2. **连接本地仓库到 GitHub**

```bash
cd /Users/chengchi/Downloads/capvisor-ai-workbench-v2.0

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: CapVisor AI Workbench v2.0"

# 添加远程仓库（替换 YOUR_USERNAME 和 YOUR_REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

## 🔐 设置 GitHub Secrets（用于 CI/CD）

如果你的部署平台需要从 GitHub Actions 访问，可以设置 Secrets：

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下 secrets（可选）：
   - `GEMINI_API_KEY`: 你的 Google Gemini API Key（仅用于测试构建）

## 📝 提交代码的最佳实践

### 提交信息格式

```bash
# 功能添加
git commit -m "feat: 添加图片生成功能"

# 问题修复
git commit -m "fix: 修复登录失败问题"

# 文档更新
git commit -m "docs: 更新部署文档"

# 代码重构
git commit -m "refactor: 重构 API 客户端"
```

### 常用 Git 命令

```bash
# 查看状态
git status

# 添加文件
git add .

# 提交
git commit -m "你的提交信息"

# 推送到 GitHub
git push origin main

# 查看提交历史
git log --oneline

# 创建新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 合并分支
git merge feature/new-feature
```

## 🌿 分支策略建议

- **main**: 生产环境代码，保持稳定
- **develop**: 开发分支
- **feature/xxx**: 新功能分支
- **fix/xxx**: 修复分支

## 📋 提交前的检查清单

- [ ] 代码已测试
- [ ] 没有敏感信息（API keys、密码等）
- [ ] `.gitignore` 已正确配置
- [ ] 提交信息清晰明确
- [ ] 没有大文件（>100MB）

## 🚀 快速开始

```bash
# 1. 初始化并提交
git add .
git commit -m "Initial commit: CapVisor AI Workbench v2.0"

# 2. 创建 GitHub 仓库（使用 GitHub CLI）
gh repo create capvisor-ai-workbench --public --source=. --remote=origin --push

# 或手动添加远程仓库
# git remote add origin https://github.com/YOUR_USERNAME/capvisor-ai-workbench.git
# git push -u origin main
```

## 🔄 后续更新

每次修改代码后：

```bash
git add .
git commit -m "描述你的更改"
git push origin main
```

Railway 和 Vercel 会自动检测并重新部署！
