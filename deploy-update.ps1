# GrowTree 应用更新部署脚本 (Windows PowerShell)
# 使用方法: .\deploy-update.ps1

$SERVER = "82.156.81.40"
$USER = "root"
$KEY = "$env:USERPROFILE\.ssh\growtree_key"
$REMOTE_DIR = "/var/www/growtree"
$LOCAL_DIR = "app\dist"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GrowTree 应用更新部署" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 检查本地构建目录是否存在
if (-not (Test-Path $LOCAL_DIR)) {
    Write-Host "错误: 本地构建目录 $LOCAL_DIR 不存在" -ForegroundColor Red
    Write-Host "请先运行: cd app && npm run build" -ForegroundColor Yellow
    exit 1
}

# 检查SSH密钥是否存在
if (-not (Test-Path $KEY)) {
    Write-Host "错误: SSH密钥 $KEY 不存在" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "1. 备份服务器当前版本..." -ForegroundColor Green
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
ssh -i $KEY "$USER@$SERVER" "cp -r $REMOTE_DIR ${REMOTE_DIR}_backup_$timestamp 2>/dev/null || true"

Write-Host ""
Write-Host "2. 清理服务器旧文件..." -ForegroundColor Green
ssh -i $KEY "$USER@$SERVER" "rm -rf $REMOTE_DIR/*"

Write-Host ""
Write-Host "3. 上传新版本文件..." -ForegroundColor Green
scp -i $KEY -r "$LOCAL_DIR\*" "$USER@$SERVER`:$REMOTE_DIR/"

Write-Host ""
Write-Host "4. 设置文件权限..." -ForegroundColor Green
ssh -i $KEY "$USER@$SERVER" "chmod -R 755 $REMOTE_DIR"

Write-Host ""
Write-Host "5. 验证部署..." -ForegroundColor Green
ssh -i $KEY "$USER@$SERVER" "ls -la $REMOTE_DIR"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  部署完成!" -ForegroundColor Green
Write-Host "  访问地址: http://$SERVER" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
