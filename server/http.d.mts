import type { IncomingMessage, ServerResponse } from 'node:http'

export type TranslateServerOptions = {
  apiKey?: string
  model?: string
  provider?: 'openai' | 'openrouter'
}

export function handleTranslateRequest(
  request: IncomingMessage,
  response: ServerResponse,
  options?: TranslateServerOptions,
): Promise<void>
