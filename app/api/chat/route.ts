import { streamText } from 'ai'
import { getProviderModel, type ProviderType } from '../../lib/providers'

export async function POST(req: Request) {
  const { messages, provider } = await req.json()
  
  console.log('🔍 API Route - Received provider:', provider)
  console.log('🔍 API Route - Messages count:', messages?.length)

  const model = getProviderModel(provider as ProviderType)
  console.log('🔍 API Route - Using model:', model.modelId)

  const result = await streamText({
    model,
    messages,
  })

  return result.toDataStreamResponse()
}