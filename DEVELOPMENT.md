# GrowTree 应用开发与部署指南

## 项目概述

- **项目名称：** GrowTree (成长树)
- **功能描述：** 儿童成长追踪应用
- **技术栈：** React + TypeScript + Vite + Tailwind CSS

---

## 仓库地址

- **GitHub：** https://github.com/rickxiao-JJXX/growcoco
- **生产环境：** http://82.156.81.40

---

## 本地开发环境

### 启动本地开发服务器

```powershell
# 进入项目目录
cd d:\trae-work\work_growcoco\app

# 启动开发服务器 (端口 5173)
powershell -ExecutionPolicy Bypass -File serve.ps1
```

访问地址：http://localhost:5173

### 构建生产版本

```powershell
cd d:\trae-work\work_growcoco\app
npm run build
```

构建产物位于 `app/dist/` 目录。

---

## 后期开发更新部署流程

### 方法一：使用部署脚本（推荐）

**Windows 用户：**
```powershell
# 1. 进入项目目录
cd d:\trae-work\work_growcoco

# 2. 构建新版本
cd app
npm run build
cd ..

# 3. 执行部署脚本
.\deploy-update.ps1
```

**Linux/Mac 用户：**
```bash
# 1. 进入项目目录
cd /path/to/work_growcoco

# 2. 构建新版本
cd app && npm run build && cd ..

# 3. 执行部署脚本
chmod +x deploy-update.sh
./deploy-update.sh
```

### 方法二：手动部署

```powershell
# 1. 构建应用
cd app
npm run build

# 2. 上传到服务器
scp -i $env:USERPROFILE\.ssh\growtree_key -r dist/* root@82.156.81.40:/var/www/growtree/
```

---

## 部署脚本功能说明

| 步骤 | 说明 |
|------|------|
| 1. 备份 | 自动备份服务器当前版本（带时间戳） |
| 2. 清理 | 清理服务器旧文件 |
| 3. 上传 | 上传新版本文件到服务器 |
| 4. 权限 | 设置正确的文件权限 (755) |
| 5. 验证 | 列出部署文件确认成功 |

---

## 服务器配置

- **服务器 IP：** 82.156.81.40
- **SSH 用户：** root
- **SSH 密钥：** `~/.ssh/growtree_key`
- **网站目录：** `/var/www/growtree`
- **Nginx 配置：** `/etc/nginx/nginx.conf`

### 常用服务器命令

```bash
# SSH 登录服务器
ssh -i ~/.ssh/growtree_key root@82.156.81.40

# 重启 Nginx
systemctl restart nginx

# 查看 Nginx 状态
systemctl status nginx

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 查看网站文件
ls -la /var/www/growtree
```

---

## Git 版本控制

### 提交代码到 GitHub

```powershell
# 查看更改
git status

# 添加所有更改
git add .

# 提交
git commit -m "描述你的更改"

# 推送到远程仓库
git push origin main
```

### 常用 Git 命令

```powershell
# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v

# 拉取最新代码
git pull origin main
```

---

## 项目结构

```
work_growcoco/
├── app/                    # 前端应用
│   ├── src/               # 源代码
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── context/       # Context
│   │   ├── hooks/         # 自定义 Hooks
│   │   └── lib/           # 工具函数
│   ├── dist/              # 构建产物
│   ├── package.json       # 依赖配置
│   └── vite.config.ts     # Vite 配置
├── deploy-update.ps1      # Windows 部署脚本
├── deploy-update.sh       # Linux/Mac 部署脚本
├── nginx.conf             # Nginx 配置
└── DEVELOPMENT.md         # 本文档
```

---

## 注意事项

1. **部署前务必先构建：** 确保运行 `npm run build` 生成最新的 `dist` 目录
2. **备份机制：** 部署脚本会自动备份旧版本，如需回滚可登录服务器恢复
3. **SSH 密钥：** 确保 `~/.ssh/growtree_key` 文件存在且有正确权限
4. **端口占用：** 本地开发时如遇端口占用，可修改 `serve.ps1` 中的端口号

---

*最后更新：2026年2月14日*
