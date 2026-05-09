// ==================== 基于 OpenAI SDK 的 DeepSeek 客户端 ====================
import OpenAI from 'openai';
type Message = OpenAI.Chat.ChatCompletionMessageParam

class DeepSeekClient {
  private client: OpenAI;
  private model: string = 'deepseek-chat'; // 或 'deepseek-reasoner' 等
  private temperature: number = 0.7;
  private maxTokens: number = 2000;

  constructor(apiKey: string, baseURL?: string) {
    if (!apiKey) {
      throw new Error('DeepSeek API Key 未设置');
    }
    // 使用 OpenAI SDK 初始化，只需修改 baseURL 即可连接 DeepSeek API[reference:1]
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL || 'https://api.deepseek.com', 
    });
  }

  async chat(messages: Message[]): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        stream: false, // 本例为非流式请求，便于演示
      });

      // 打印 token 使用情况（SDK 已包含此信息）
      if (response.usage) {
        console.log(`\n📊 Token 使用: 提示 ${response.usage.prompt_tokens} | 回复 ${response.usage.completion_tokens} | 总计 ${response.usage.total_tokens}`);
      }

      const assistantMessage = response.choices[0]?.message?.content;
      if (!assistantMessage) {
        throw new Error('API 响应中没有有效的消息内容');
      }

      return assistantMessage;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`\n❌ API 调用失败: ${error.message}`);
        throw error;
      }
      throw new Error('API 调用失败');
    }
  }
}

export default DeepSeekClient