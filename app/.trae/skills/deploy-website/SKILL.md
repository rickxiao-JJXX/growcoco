---
name: "deploy-website"
description: "Deploys website to remote server via SSH. Invoke when user asks to deploy website, update existing deployment, or specify deployment tasks."
---

# Deploy Website Skill

## Overview

This skill handles website deployment to remote servers using SSH. It automates the process of uploading built files and configuring the web server.

## When to Use

Invoke this skill when:
- User asks to deploy a website to a remote server
- User wants to update an existing deployment
- User needs to configure server settings for web hosting
- User specifies deployment-related tasks

## Features

- Uploads built website files to remote server
- Configures web server (Nginx) settings
- Validates deployment status
- Supports incremental updates

## Usage Example

```bash
# Deploy website to server
scp -r dist/* user@server:/var/www/html/

# Restart web server
ssh user@server "systemctl restart nginx"
```

## Deployment Steps

1. Build the website project (if not already built)
2. Compress built files for efficient transfer
3. Upload files to remote server
4. Configure web server settings
5. Restart web server if necessary
6. Validate deployment by checking website access

## Supported Servers

- Linux-based servers with SSH access
- Web servers: Nginx, Apache
- Requires root or sudo privileges for server configuration

## Prerequisites

- Local SSH keys configured for passwordless access
- Remote server with web server installed
- Built website files ready for deployment