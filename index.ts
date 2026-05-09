import * as readline from 'readline';
import * as dotenv from 'dotenv';
import DeepSeekClient from './client';
import ChatSession from './chat-session';
dotenv.config();
// ==================== 命令行界面 ====================
class CliInterface {
  private rl: readline.ReadLine;
  private session: ChatSession;

  constructor(session: ChatSession) {
    this.session = session;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '\n你> ',
    });
  }

  async start(): Promise<void> {
    console.clear();
    console.log('🤖 DeepSeek 聊天机器人 (基于 OpenAI SDK)');
    console.log('='.repeat(50));
    console.log('命令:');
    console.log('  /clear  - 清空对话历史');
    console.log('  /history- 查看对话历史');
    console.log('  /exit   - 退出程序');
    console.log('='.repeat(50));
    console.log('');

    this.rl.prompt();

    this.rl.on('line', async (line: string) => {
      const input = line.trim();

      if (input === '') {
        this.rl.prompt();
        return;
      }

      if (input.startsWith('/')) {
        await this.handleCommand(input);
        this.rl.prompt();
        return;
      }

      await this.handleUserMessage(input);
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log('\n👋 再见！');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('\n');
      this.rl.close();
    });
  }

  private async handleCommand(command: string): Promise<void> {
    switch (command.toLowerCase()) {
      case '/clear':
        this.session.clearHistory();
        break;
      case '/history':
        this.showHistory();
        break;
      case '/exit':
        this.rl.close();
        break;
      case '/count':
        console.log(`总计 ${this.session.getMessageCount()} 条消息\n`);
        break;
      default:
        console.log(`❓ 未知命令: ${command}`);
        console.log('可用命令: /clear, /history, /exit');
    }
  }

  private async handleUserMessage(input: string): Promise<void> {
    console.log('\n🤔 思考中...');
    try {
      const reply = await this.session.sendMessage(input);
      console.log(`\n🤖 助手: ${reply}\n`);
    } catch (error) {
      console.error(`\n❌ 错误: ${error instanceof Error ? error.message : '未知错误'}\n`);
    }
  }

  private showHistory(): void {
    const history = this.session.getHistory();
    if (history.length === 0) {
      console.log('\n📭 暂无对话历史\n');
      return;
    }

    console.log('\n📜 对话历史:');
    console.log('-'.repeat(40));
    history.forEach((msg, index) => {
      const role = msg.role === 'system' ? '系统' : msg.role === 'user' ? '用户' : '助手';
      const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
      console.log(`${index + 1}. [${role}] ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);
    });
    console.log('-'.repeat(40));
    console.log(`总计 ${history.length} 条消息\n`);
  }
}

// ==================== 主函数 ====================
async function main() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('❌ 错误: 请在 .env 文件中设置 DEEPSEEK_API_KEY');
    console.error('   参考 .env.example 文件创建 .env 并填入你的 API Key');
    process.exit(1);
  }

  try {
    const client = new DeepSeekClient(apiKey);
    const session = new ChatSession(client);
    const cli = new CliInterface(session);
    await cli.start();
  } catch (error) {
    console.error('❌ 初始化失败:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main().catch(console.error);