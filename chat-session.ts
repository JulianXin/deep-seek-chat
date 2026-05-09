
import OpenAI from "openai"
import DeepSeekClient from "./client"
// ==================== 类型定义 ====================
// 直接复用 SDK 中的类型定义，更加可靠
type Message = OpenAI.Chat.ChatCompletionMessageParam
// ==================== 聊天会话管理 ====================

class ChatSession {
  private messages: Message[]
  private client: DeepSeekClient

  constructor(client: DeepSeekClient, systemPrompt?: string) {
    this.client = client
    this.messages = []

    // 添加系统提示
    this.messages.push({
      role: 'system',
      content: systemPrompt || '你是一个有用的 AI 助手，请用中文友好地回答用户的问题。',
    })
  }

  async sendMessage(userInput: string): Promise<string> {
    // 添加用户消息到历史
    this.messages.push({
      role: 'user',
      content: userInput,
    })

    try {
      // 调用 API
      const reply = await this.client.chat(this.messages)

      // 添加助手回复到历史
      this.messages.push({
        role: 'assistant',
        content: reply,
      })

      return reply
    } catch (error) {
      // 发生错误时，移除刚添加的用户消息，保持历史一致性
      this.messages.pop()
      throw error
    }
  }

  getMessageCount(): number {
    return this.messages.length
  }

  getHistory(): Message[] {
    return [...this.messages]
  }

  clearHistory(): void {
    // 保留系统提示
    const systemMessage = this.messages.find(m => m.role === 'system')
    this.messages = systemMessage ? [systemMessage] : []
    console.log('✅ 对话历史已清空')
  }
}

export default ChatSession