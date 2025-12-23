#!/bin/bash

echo "🚀 启动 AI需求交付平台..."
echo ""

# 检查node_modules
if [ ! -d "client/node_modules" ] || [ ! -d "server/node_modules" ]; then
  echo "📦 检测到依赖未安装，正在安装..."
  npm run install:all
fi

echo ""
echo "🔧 启动后端服务 (http://localhost:3001)"
echo "🎨 启动前端服务 (http://localhost:5173)"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

npm run dev
