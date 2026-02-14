#!/bin/bash

# GrowTree 网站部署脚本

echo "开始部署 GrowTree 网站..."

# 1. 安装 Nginx
echo "安装 Nginx..."
if [ -f /etc/yum.conf ]; then
    yum update -y && yum install -y nginx
elif [ -f /etc/apt/sources.list ]; then
    apt update && apt install -y nginx
fi

# 2. 启动 Nginx 并设置开机自启
echo "启动 Nginx 服务..."
systemctl start nginx
systemctl enable nginx

# 3. 创建网站根目录
echo "创建网站根目录..."
mkdir -p /var/www/growtree

# 4. 开放 80 端口
echo "配置防火墙..."
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --zone=public --add-port=80/tcp --permanent
    firewall-cmd --reload
elif command -v ufw &> /dev/null; then
    ufw allow 80
    ufw reload
fi

# 5. 配置 Nginx
echo "配置 Nginx..."
cat > /etc/nginx/conf.d/growtree.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/growtree;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 6. 测试 Nginx 配置并重启
echo "测试 Nginx 配置..."
nginx -t && systemctl restart nginx

# 7. 检查部署状态
echo "部署完成！"
echo "网站目录：/var/www/growtree"
echo "请确保已上传网站文件到该目录"
echo "访问地址：http://$(curl -s ifconfig.me)"
