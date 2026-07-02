# AI表情包工厂

输入一句话，AI秒速生成4种风格专属表情包。

## 技术栈
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- DeepSeek API

## 本地开发

1. 克隆项目
2. 安装依赖：`npm install`
3. 复制环境变量：`cp .env.example .env.local`
4. 填写 DeepSeek API Key
5. 启动开发服务器：`npm run dev`

## 部署到 Vercel

1. 将项目推送到 GitHub
2. 在 Vercel 中导入项目
3. 设置环境变量：DEEPSEEK_API_KEY、DEEPSEEK_BASE_URL
4. 部署完成

## 功能
- ✍️ 输入任意文字
- 🤖 AI 生成4种风格表情包（可爱/毒舌/摸鱼/正经）
- 💾 一键下载 PNG 图片
- 📋 复制到剪贴板
- 🖼️ 历史画廊
