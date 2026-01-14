#!/bin/bash

# CapVisor AI Workbench - 快速部署脚本

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 CapVisor AI Workbench 部署助手"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查是否已初始化 Git
if [ ! -d ".git" ]; then
    echo "❌ 未检测到 Git 仓库"
    echo "正在初始化 Git 仓库..."
    git init
    echo "✅ Git 仓库已初始化"
    echo ""
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 检测到未提交的更改"
    read -p "是否现在提交？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "请输入提交信息: " commit_msg
        git commit -m "${commit_msg:-Update: deploy preparation}"
        echo "✅ 代码已提交"
    fi
else
    echo "✅ 没有未提交的更改"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 部署选项："
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 推送到 GitHub（首次）"
echo "2. 推送到 GitHub（更新）"
echo "3. 查看部署文档"
echo "4. 退出"
echo ""
read -p "请选择 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📦 首次推送到 GitHub"
        echo ""
        read -p "GitHub 仓库 URL (例如: https://github.com/username/repo.git): " repo_url
        if [ -z "$repo_url" ]; then
            echo "❌ 未提供仓库 URL"
            exit 1
        fi
        
        # 检查是否已有远程仓库
        if git remote get-url origin > /dev/null 2>&1; then
            echo "⚠️  已存在远程仓库，更新为: $repo_url"
            git remote set-url origin "$repo_url"
        else
            git remote add origin "$repo_url"
        fi
        
        git branch -M main
        git push -u origin main
        echo ""
        echo "✅ 代码已推送到 GitHub"
        echo ""
        echo "📖 下一步："
        echo "   1. 访问 https://railway.app 部署后端"
        echo "   2. 访问 https://vercel.com 部署前端"
        echo "   3. 查看 DEPLOYMENT.md 了解详细步骤"
        ;;
    2)
        echo ""
        echo "🔄 更新 GitHub 仓库"
        git push origin main
        echo ""
        echo "✅ 代码已更新"
        ;;
    3)
        echo ""
        echo "📖 打开部署文档..."
        if [ -f "DEPLOYMENT.md" ]; then
            cat DEPLOYMENT.md | head -50
            echo ""
            echo "... (查看完整文档: cat DEPLOYMENT.md)"
        else
            echo "❌ 未找到 DEPLOYMENT.md"
        fi
        ;;
    4)
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac
