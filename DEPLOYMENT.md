# GrowTree 成长树 Web应用部署说明文档

## 1. 部署概述

- **项目名称**: GrowTree 成长树
- **部署日期**: 2026年2月14日
- **部署状态**: 成功
- **访问地址**: http://82.156.81.40

## 2. 服务器信息

### 2.1 基本配置
- **服务器IP**: 82.156.81.40
- **操作系统**: Linux (CentOS/RHEL系列)
- **内核版本**: 6.6.117-45.2.oc9.x86_64
- **Web服务器**: Nginx 1.26.3

### 2.2 SSH连接信息
- **SSH用户**: root
- **SSH端口**: 22
- **认证方式**: SSH密钥认证
- **密钥文件**: `~/.ssh/growtree_key` (本地)

### 2.3 连接命令
```powershell
# Windows PowerShell
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40

# Linux/Mac
ssh -i ~/.ssh/growtree_key root@82.156.81.40
```

## 3. 部署目录结构

### 3.1 应用目录
```
/var/www/growtree/
├── index.html          # 主页面
├── test.html           # 测试页面
└── assets/             # 静态资源目录
    ├── index-y8HNwgQK.js      # JavaScript文件
    └── index-qcgWeCOq.css     # CSS文件
```

### 3.2 配置文件目录
```
/etc/nginx/
├── nginx.conf          # Nginx主配置文件
├── conf.d/             # 额外配置目录
│   └── growtree.conf.bak    # 备份配置文件
├── mime.types          # MIME类型配置
└── default.d/          # 默认配置目录
```

### 3.3 日志文件目录
```
/var/log/nginx/
├── access.log          # 访问日志
└── error.log           # 错误日志
```

## 4. Nginx配置说明

### 4.1 主配置文件 (/etc/nginx/nginx.conf)
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;

include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    types_hash_max_size 4096;
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    include /etc/nginx/conf.d/*.conf;

    server {
        listen 80;
        listen [::]:80;
        server_name _;
        root /var/www/growtree;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        error_page 404 /index.html;
        location = /index.html {
            internal;
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }
}
```

### 4.2 配置要点说明
- **监听端口**: 80 (HTTP)
- **服务器名称**: _ (接受所有主机名)
- **根目录**: /var/www/growtree
- **默认首页**: index.html
- **SPA路由支持**: `try_files $uri $uri/ /index.html;` 确保前端路由正常工作
- **404错误处理**: 重定向到index.html，支持SPA应用

## 5. SSH免密登录配置

### 5.1 密钥生成
```powershell
# 创建.ssh目录
New-Item -ItemType Directory -Path $env:USERPROFILE\.ssh -Force

# 生成SSH密钥对
ssh-keygen -t rsa -b 2048 -f $env:USERPROFILE\.ssh\growtree_key
```

### 5.2 公钥部署到服务器
```powershell
# 复制公钥到服务器
type $env:USERPROFILE\.ssh\growtree_key.pub | ssh root@82.156.81.40 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

### 5.3 测试免密登录
```powershell
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "echo 'Login successful'"
```

## 6. 部署步骤

### 6.1 首次部署
```powershell
# 1. 编译项目
cd d:\trae-work\work_growcoco\app
npm run build

# 2. 压缩编译后的文件
cd dist
Compress-Archive -Path * -DestinationPath growtree-deploy.zip

# 3. 上传到服务器
scp -i $env:USERPROFILE\.ssh\growtree_key growtree-deploy.zip root@82.156.81.40:/tmp/

# 4. 登录服务器并解压
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40
cd /var/www/growtree
unzip -o /tmp/growtree-deploy.zip
rm /tmp/growtree-deploy.zip

# 5. 重启Nginx
systemctl restart nginx
```

### 6.2 更新部署
```powershell
# 1. 编译项目
cd d:\trae-work\work_growcoco\app
npm run build

# 2. 上传并部署
cd dist
scp -i $env:USERPROFILE\.ssh\growtree_key -r * root@82.156.81.40:/var/www/growtree/

# 3. 清理Nginx缓存（如果需要）
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "systemctl reload nginx"
```

## 7. 常见问题排查

### 7.1 网站无法访问
```powershell
# 检查Nginx服务状态
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "systemctl status nginx"

# 检查端口监听
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "netstat -tuln | grep 80"

# 检查防火墙
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "iptables -L | grep 80"
```

### 7.2 301/302重定向循环
```powershell
# 检查Nginx配置
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "nginx -t"

# 查看错误日志
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "tail -50 /var/log/nginx/error.log"

# 检查try_files指令
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "grep -n 'try_files' /etc/nginx/nginx.conf"
```

### 7.3 静态资源加载失败
```powershell
# 检查文件权限
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "ls -la /var/www/growtree/assets/"

# 检查文件是否存在
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "ls -la /var/www/growtree/"

# 测试静态资源访问
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "curl -I http://localhost/assets/index-y8HNwgQK.js"
```

### 7.4 500内部服务器错误
```powershell
# 查看详细错误日志
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "tail -100 /var/log/nginx/error.log"

# 检查Nginx配置语法
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "nginx -t"

# 检查文件权限
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "ls -la /var/www/growtree/"
```

## 8. 维护命令

### 8.1 Nginx服务管理
```powershell
# 启动Nginx
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "systemctl start nginx"

# 停止Nginx
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "systemctl stop nginx"

# 重启Nginx
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "systemctl restart nginx"

# 重新加载配置（不中断服务）
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "systemctl reload nginx"

# 检查Nginx状态
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "systemctl status nginx"
```

### 8.2 日志查看
```powershell
# 查看访问日志（最后20行）
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "tail -20 /var/log/nginx/access.log"

# 查看错误日志（最后20行）
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "tail -20 /var/log/nginx/error.log"

# 实时查看访问日志
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "tail -f /var/log/nginx/access.log"

# 清空日志文件
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "truncate -s 0 /var/log/nginx/access.log /var/log/nginx/error.log"
```

### 8.3 文件管理
```powershell
# 查看部署目录
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "ls -la /var/www/growtree/"

# 查看磁盘使用情况
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "du -sh /var/www/growtree/"

# 备份当前版本
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "tar -czf /tmp/growtree-backup-$(date +%Y%m%d).tar.gz -C /var/www/growtree ."

# 恢复备份
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "tar -xzf /tmp/growtree-backup-YYYYMMDD.tar.gz -C /var/www/growtree/"
```

### 8.4 性能监控
```powershell
# 查看系统资源使用
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "top -n 1"

# 查看内存使用
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "free -h"

# 查看磁盘使用
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "df -h"

# 查看网络连接
ssh -i $env:USERPROFILE\.ssh\growtree_key root@82.156.81.40 "netstat -tuln"
```

## 9. 安全建议

### 9.1 定期更新
- 定期更新系统补丁: `yum update` 或 `dnf update`
- 定期更新Nginx: `yum update nginx` 或 `dnf update nginx`
- 定期检查安全漏洞

### 9.2 访问控制
- 配置防火墙规则，限制不必要的端口访问
- 考虑配置HTTPS（SSL/TLS证书）
- 定期检查SSH登录日志

### 9.3 备份策略
- 定期备份应用文件和配置
- 定期备份Nginx配置文件
- 建立灾难恢复计划

## 10. 联系信息

- **项目仓库**: d:\trae-work\work_growcoco
- **本地配置文件**: d:\trae-work\work_growcoco\nginx.conf
- **部署日期**: 2026年2月14日
- **文档版本**: 1.0

---

**注意**: 本文档包含敏感的服务器信息，请妥善保管，不要泄露给未授权人员。
