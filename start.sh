#!/bin/bash

echo "🚀 CapVisor AI Workbench 启动脚本"
echo "================================"
echo ""

# 检查 .env 文件
if [ ! -f ".env" ]; then
  echo "⚠️  未找到 .env 文件，正在创建模板..."
  cat > .env << EOF
GEMINI_API_KEY=你的_Gemini_API_Key_请替换
USERS_JSON='[{"email":"demo@capvisor.ai","password":"capvisor123"}]'
EOF
  echo "✅ 已创建 .env 文件，请编辑并填入你的 GEMINI_API_KEY"
  echo ""
  read -p "按 Enter 继续（确保已配置 .env）..."
fi

# 检查 Docker
if ! command -v docker &> /dev/null; then
  echo "❌ 未安装 Docker，请先安装 Docker Desktop"
  exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
  echo "❌ 未安装 Docker Compose"
  exit 1
fi

echo "📦 启动后端服务（Docker Compose）..."
cd services
source ../.env 2>/dev/null || true

if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "你的_Gemini_API_Key_请替换" ]; then
  echo "❌ 请在 .env 文件中配置 GEMINI_API_KEY"
  exit 1
fi

echo "启动中..."
docker-compose up -d --build || docker compose up -d --build

echo ""
echo "⏳ 等待服务启动（10秒）..."
sleep 10

echo ""
echo "✅ 后端服务已启动！"
echo "   - 数据库: localhost:5432"
echo "   - API: http://localhost:8787"
echo ""
echo "📱 现在启动前端..."
cd ..

if [ ! -d "node_modules" ]; then
  echo "安装前端依赖..."
  npm install
fi

echo ""
echo "🎉 前端将在 http://localhost:3000 启动"
echo ""
echo "登录信息："
echo "  邮箱: demo@capvisor.ai"
echo "  密码: capvisor123"
echo ""
echo "按 Ctrl+C 停止前端（后端会继续运行）"
echo ""

npm run dev
