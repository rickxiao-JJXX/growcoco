#!/bin/bash

# GrowTree 应用更新部署脚本
# 使用方法: ./deploy-update.sh

SERVER="82.156.81.40"
USER="root"
KEY="$HOME/.ssh/growtree_key"
REMOTE_DIR="/var/www/growtree"
LOCAL_DIR="app/dist"

echo "========================================"
echo "  GrowTree 应用更新部署"
echo "========================================"

# 检查本地构建目录是否存在
if [ ! -d "$LOCAL_DIR" ]; then
    echo "错误: 本地构建目录 $LOCAL_DIR 不存在"
    echo "请先运行: cd app && npm run build"
    exit 1
fi

# 检查SSH密钥是否存在
if [ ! -f "$KEY" ]; then
    echo "错误: SSH密钥 $KEY 不存在"
    exit 1
fi

echo ""
echo "1. 备份服务器当前版本..."
ssh -i "$KEY" "$USER@$SERVER" "cp -r $REMOTE_DIR ${REMOTE_DIR}_backup_$(date +%Y%m%d_%H%M%S) 2>/dev/null || true"

echo ""
echo "2. 清理服务器旧文件..."
ssh -i "$KEY" "$USER@$SERVER" "rm -rf $REMOTE_DIR/*"

echo ""
echo "3. 上传新版本文件..."
scp -i "$KEY" -r "$LOCAL_DIR"/* "$USER@$SERVER:$REMOTE_DIR/"

echo ""
echo "4. 设置文件权限..."
ssh -i "$KEY" "$USER@$SERVER" "chmod -R 755 $REMOTE_DIR"

echo ""
echo "5. 验证部署..."
ssh -i "$KEY" "$USER@$SERVER" "ls -la $REMOTE_DIR"

echo ""
echo "========================================"
echo "  部署完成!"
echo "  访问地址: http://$SERVER"
echo "========================================"
