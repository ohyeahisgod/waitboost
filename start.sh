#!/bin/bash
# WaitBoost 快速啟動腳本
# 在你的電腦終端機執行：bash start.sh

set -e

echo "⚡ WaitBoost 設定開始..."
echo ""

# 1. 檢查 Node.js
if ! command -v node &> /dev/null; then
  echo "❌ 請先安裝 Node.js (https://nodejs.org)"
  exit 1
fi
echo "✅ Node.js $(node --version)"

# 2. 安裝依賴
echo ""
echo "📦 安裝依賴套件（約 1-2 分鐘）..."
npm install

# 3. 建立環境變數檔
if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo ""
  echo "⚠️  已建立 .env.local，請填入以下資料："
  echo "   - NEXT_PUBLIC_SUPABASE_URL"
  echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
  echo "   - SUPABASE_SERVICE_ROLE_KEY"
  echo "   - STRIPE_SECRET_KEY (可先跳過)"
  echo ""
  echo "填好後再執行：npm run dev"
else
  echo ""
  echo "🚀 啟動開發伺服器..."
  npm run dev
fi
