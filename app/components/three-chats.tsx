"use client"

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ArrowUp,
  Copy,
  Globe,
  Mic,
  MoreHorizontal,
  Pencil,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react"
import { useChat } from '@ai-sdk/react'
import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { PROVIDERS, type ProviderType } from "../lib/providers"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ChatWindowProps {
  chatId: string
  title: string
  initialProvider?: ProviderType
}

const ChatWindow = forwardRef<ChatWindowRef, ChatWindowProps>(({ chatId, title, initialProvider = 'openai' }, ref) => {
  const [provider, setProvider] = useState<ProviderType>(initialProvider)
  const { messages, isLoading, append } = useChat({
    api: '/api/chat',
    id: chatId,
    experimental_prepareRequestBody: ({ messages }) => {
      console.log('🚀 Client - Preparing request with provider:', provider)
      return {
        messages,
        provider,
      }
    },
  })

  useImperativeHandle(ref, () => ({
    sendMessage: (message: string) => {
      append({ role: 'user', content: message })
    },
    isLoading,
  }))

  console.log('🚀 Client - Current provider state:', provider)

  return (
    <div key={`${chatId}-${provider}`} className="flex h-full flex-col overflow-hidden border border-border rounded-lg">
      <div className="px-4 py-2 border-b border-border bg-muted/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {PROVIDERS.find(p => p.id === provider)?.icon} {PROVIDERS.find(p => p.id === provider)?.name}
          </span>
        </div>
        <Select value={provider} onValueChange={(value) => setProvider(value as ProviderType)}>
          <SelectTrigger className="w-[120px] h-6 text-xs">
            <SelectValue>
              <span className="flex items-center gap-1">
                <span>{PROVIDERS.find(p => p.id === provider)?.icon}</span>
                <span>{PROVIDERS.find(p => p.id === provider)?.name}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PROVIDERS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span className="flex items-center gap-2">
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ChatContainerRoot className="relative flex-1 space-y-0 overflow-y-auto px-2 py-6">
        <ChatContainerContent className="space-y-12 px-2 py-6">
          {messages.map((message, index) => {
            const isAssistant = message.role === "assistant"
            const isLastMessage = index === messages.length - 1

            return (
              <Message
                key={message.id}
                className={cn(
                  "mx-auto flex w-full max-w-full flex-col gap-2 px-0 md:px-3",
                  isAssistant ? "items-start" : "items-end"
                )}
              >
                {isAssistant ? (
                  <div className="group flex w-full flex-col gap-0">
                    <MessageContent
                      className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-0"
                      markdown
                    >
                      {message.content}
                    </MessageContent>
                    <MessageActions
                      className={cn(
                        "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                        isLastMessage && "opacity-100"
                      )}
                    >
                      <MessageAction tooltip="Copy" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <Copy />
                        </Button>
                      </MessageAction>
                      <MessageAction tooltip="Upvote" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <ThumbsUp />
                        </Button>
                      </MessageAction>
                      <MessageAction tooltip="Downvote" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <ThumbsDown />
                        </Button>
                      </MessageAction>
                    </MessageActions>
                  </div>
                ) : (
                  <div className="group flex flex-col items-end gap-1">
                    <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]">
                      {message.content}
                    </MessageContent>
                    <MessageActions
                      className={cn(
                        "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                      )}
                    >
                      <MessageAction tooltip="Edit" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <Pencil />
                        </Button>
                      </MessageAction>
                      <MessageAction tooltip="Delete" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <Trash />
                        </Button>
                      </MessageAction>
                      <MessageAction tooltip="Copy" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <Copy />
                        </Button>
                      </MessageAction>
                    </MessageActions>
                  </div>
                )}
              </Message>
            )
          })}
          {isLoading && (
            <Message className="mx-auto flex w-full max-w-full flex-col gap-2 px-0 md:px-3 items-start">
              <div className="group flex w-full flex-col gap-0">
                <MessageContent className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-0">
                  Thinking...
                </MessageContent>
              </div>
            </Message>
          )}
        </ChatContainerContent>
      </ChatContainerRoot>
    </div>
  )
})

ChatWindow.displayName = 'ChatWindow'

interface ChatWindowRef {
  sendMessage: (message: string) => void
  isLoading: boolean
}

function ThreeChats() {
  const [prompt, setPrompt] = useState("")
  
  const chat1Ref = useRef<ChatWindowRef>(null)
  const chat2Ref = useRef<ChatWindowRef>(null)
  const chat3Ref = useRef<ChatWindowRef>(null)

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    const userMessage = prompt.trim()
    setPrompt("")
    
    // Send to each chat window directly
    chat1Ref.current?.sendMessage(userMessage)
    chat2Ref.current?.sendMessage(userMessage)
    chat3Ref.current?.sendMessage(userMessage)
  }

  const anyLoading = chat1Ref.current?.isLoading || chat2Ref.current?.isLoading || chat3Ref.current?.isLoading

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-hidden">
        <ChatWindow ref={chat1Ref} key="chat-1" chatId="chat-1" title="Chat 1" />
        <ChatWindow ref={chat2Ref} key="chat-2" chatId="chat-2" title="Chat 2" />
        <ChatWindow ref={chat3Ref} key="chat-3" chatId="chat-3" title="Chat 3" />
      </div>
      
      <div className="inset-x-0 bottom-0 mx-auto w-full max-w-4xl shrink-0 px-3 pb-3 md:px-5 md:pb-5">
        <PromptInput
          isLoading={anyLoading}
          value={prompt}
          onValueChange={setPrompt}
          onSubmit={handleSubmit}
          className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
        >
          <div className="flex flex-col">
            <PromptInputTextarea
              placeholder="Ask anything (will send to all 3 chats)"
              className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
            />

            <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
              <div className="flex items-center gap-2">
                <PromptInputAction tooltip="Add a new action">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full"
                  >
                    <Plus size={18} />
                  </Button>
                </PromptInputAction>

                <PromptInputAction tooltip="Search">
                  <Button variant="outline" className="rounded-full">
                    <Globe size={18} />
                    Search
                  </Button>
                </PromptInputAction>

                <PromptInputAction tooltip="More actions">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full"
                  >
                    <MoreHorizontal size={18} />
                  </Button>
                </PromptInputAction>
              </div>
              <div className="flex items-center gap-2">
                <PromptInputAction tooltip="Voice input">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full"
                  >
                    <Mic size={18} />
                  </Button>
                </PromptInputAction>

                <Button
                  size="icon"
                  disabled={!prompt.trim() || anyLoading}
                  onClick={handleSubmit}
                  className="size-9 rounded-full"
                >
                  {!anyLoading ? (
                    <ArrowUp size={18} />
                  ) : (
                    <span className="size-3 rounded-xs bg-white" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>
  )
}

export { ThreeChats }