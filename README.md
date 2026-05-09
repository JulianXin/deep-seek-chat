# DeepSeek Chat CLI

一个基于 TypeScript 和 OpenAI SDK 封装的 DeepSeek 命令行聊天工具。

## 功能

- 通过 DeepSeek API 进行多轮对话
- 在本地保存当前会话上下文
- 支持清空历史、查看历史、退出程序
- 使用 `dotenv` 读取本地环境变量

## 运行环境

- Node.js 18+
- npm

## 安装依赖

```bash
npm install
```

## 配置环境变量

项目通过 `DEEPSEEK_API_KEY` 读取 API Key。

1. 参考仓库中的 `.env.exsample`
2. 在项目根目录创建 `.env`
3. 写入以下内容：

```env
DEEPSEEK_API_KEY=your_api_key_here
```

## 启动方式

开发模式：

```bash
npm run dev
```

构建项目：

```bash
npm run build
```

运行构建结果：

```bash
npm start
```

## CLI 命令

程序启动后可直接输入问题，也支持以下命令：

- `/clear`：清空当前会话历史
- `/history`：查看当前会话历史
- `/exit`：退出程序
- `/count`：查看当前消息数量

## 项目结构

```text
src/
  client.ts        DeepSeek API 客户端封装
  chat-session.ts  会话历史管理
  index.ts         CLI 入口
dist/              TypeScript 编译输出
```

## 实现说明

- `src/client.ts` 使用 OpenAI SDK，并通过 `baseURL` 指向 `https://api.deepseek.com`
- 默认模型为 `deepseek-chat`
- 当前请求方式为非流式返回

