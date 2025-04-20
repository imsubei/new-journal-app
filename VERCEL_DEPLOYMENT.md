# Vercel部署指南

## 准备工作

1. 确保你有一个GitHub账户，并已创建仓库用于存放项目代码
2. 确保你有一个Vercel账户，可以在[vercel.com](https://vercel.com)注册

## 环境变量设置

在Vercel部署时，需要设置以下环境变量：

- `JWT_SECRET`: 用于JWT令牌加密的密钥，可以是任意复杂字符串
- `CLOUDFLARE_ACCOUNT_ID`: 你的Cloudflare账户ID
- `D1_DATABASE_ID`: Cloudflare D1数据库的ID

## 部署步骤

1. 将项目代码推送到GitHub仓库：
   ```bash
   cd new-project
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

2. 登录Vercel并导入项目：
   - 访问[vercel.com/new](https://vercel.com/new)
   - 选择"Import Git Repository"
   - 授权GitHub访问权限（如果尚未授权）
   - 选择你刚刚推送代码的仓库

3. 配置项目：
   - 项目名称：可以使用默认名称或自定义
   - 框架预设：确保选择"Next.js"
   - 根目录：保持默认（通常是"/"）
   - 构建命令：保持默认（`next build`）
   - 输出目录：保持默认（`.next`）

4. 环境变量设置：
   - 点击"Environment Variables"部分
   - 添加上述提到的所有环境变量及其值
   - 确保生产环境和预览环境都设置了这些变量

5. 点击"Deploy"按钮开始部署

6. 部署完成后，Vercel会提供一个域名（例如：your-project.vercel.app）

## 常见问题解决

1. **部署失败**：
   - 检查构建日志，查找错误信息
   - 确保所有必要的环境变量都已正确设置
   - 确保项目代码没有语法错误或其他问题

2. **数据库连接问题**：
   - 确认Cloudflare账户ID和数据库ID是否正确
   - 检查Cloudflare D1数据库是否已创建并包含必要的表
   - 确保Vercel和Cloudflare之间的连接权限已正确设置

3. **样式渲染问题**：
   - 如果部署后样式不正确，检查构建日志中是否有Tailwind相关警告
   - 确保`next.config.js`中的配置正确

## 后续维护

1. 每次代码更新后，只需推送到GitHub仓库，Vercel会自动重新部署
2. 可以在Vercel仪表板中监控应用性能和部署状态
3. 考虑设置自定义域名，可以在Vercel项目设置中完成
