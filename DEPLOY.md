# Vercel部署指南

本文档提供了将"每日随记与反拖延"应用部署到Vercel的详细步骤。

## 准备工作

1. 确保你有一个GitHub账号
2. 确保你有一个Vercel账号（可以使用GitHub账号登录）

## 部署步骤

### 1. 将代码推送到GitHub

```bash
# 添加远程仓库（替换为你的GitHub仓库URL）
git remote add origin https://github.com/你的用户名/anti-procrastination-app.git

# 推送代码到GitHub
git push -u origin master
```

### 2. 在Vercel上导入项目

1. 登录Vercel账号
2. 点击"Add New..."按钮，然后选择"Project"
3. 从GitHub导入仓库，选择"anti-procrastination-app"
4. 保持默认设置，Vercel会自动检测到这是一个Next.js项目
5. 点击"Deploy"按钮

### 3. 部署配置

项目已经包含了`vercel.json`配置文件，指定了以下设置：

```json
{
  "buildCommand": "next build",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "github": {
    "silent": true
  }
}
```

这些设置确保了Vercel能够正确构建和部署Next.js应用。

### 4. 环境变量

本项目使用localStorage进行数据存储，不需要设置环境变量。

### 5. 自定义域名（可选）

如果你想使用自定义域名，可以在Vercel项目设置中的"Domains"部分添加。

## 常见问题排查

### 构建失败

如果遇到构建失败，请检查以下几点：

1. 确保`package.json`中的依赖版本兼容
2. 检查是否有未解决的TypeScript错误
3. 查看Vercel构建日志，找出具体错误

### 部署成功但应用无法正常工作

1. 检查浏览器控制台是否有错误
2. 确保应用的数据持久化功能在生产环境中正常工作

## 更新部署

每次推送到GitHub仓库的master分支时，Vercel会自动重新部署应用。
