import { openai } from '@ai-sdk/openai'
import { xai } from '@ai-sdk/xai'
import { google } from '@ai-sdk/google'

export type ProviderType = 'openai' | 'xai' | 'google'

export interface ProviderConfig {
  id: ProviderType
  name: string
  model: string
  icon: string
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    model: 'gpt-4o-mini',
    icon: '🤖'
  },
  {
    id: 'xai',
    name: 'XAI',
    model: 'grok-3',
    icon: '🚀'
  },
  {
    id: 'google',
    name: 'Gemini',
    model: 'gemini-2.5-flash',
    icon: '💎'
  }
]

export function getProviderModel(providerId: ProviderType) {
  switch (providerId) {
    case 'openai':
      return openai('gpt-4o-mini')
    case 'xai':
      return xai('grok-3')
    case 'google':
      return google('gemini-2.5-flash')
    default:
      return openai('gpt-4o-mini')
  }
}

export function getProviderConfig(providerId: ProviderType): ProviderConfig {
  return PROVIDERS.find(p => p.id === providerId) || PROVIDERS[0]
}