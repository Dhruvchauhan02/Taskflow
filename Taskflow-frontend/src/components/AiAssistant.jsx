import { useEffect, useMemo, useRef, useState } from "react"
import { Bot, Send, X } from "lucide-react"
import { chatWithAssistant } from "../services/aiService.js"
import { useAuth } from "../context/AuthContext"

const initialMessages = [
  {
    role: "assistant",
    content: "Hi, I can help you plan, prioritize, or make sense of your tasks.",
  },
]

const sharedStorageKey = "taskflowAiAssistantMessages"
const storageKeyPrefix = "taskflowAiAssistantMessages"

const getUserStorageId = (authData) =>
  authData?.user?.id ||
  authData?.user?._id ||
  authData?.user?.email ||
  "anonymous"

const loadMessages = (storageKey) => {
  try {
    const savedMessages = JSON.parse(localStorage.getItem(storageKey))

    if (
      Array.isArray(savedMessages) &&
      savedMessages.every(
        (item) =>
          ["assistant", "user"].includes(item?.role) &&
          typeof item?.content === "string"
      )
    ) {
      return savedMessages
    }
  } catch {
    localStorage.removeItem(storageKey)
  }

  return initialMessages
}

function AiAssistant({ open, onClose, onTasksChanged, tasks }) {
  const { user } = useAuth()
  const storageKey = useMemo(
    () => `${storageKeyPrefix}:${getUserStorageId(user)}`,
    [user]
  )
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(() => loadMessages(storageKey))
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    localStorage.removeItem(sharedStorageKey)
    setMessages(loadMessages(storageKey))
  }, [storageKey])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages.slice(-30)))
  }, [messages, storageKey])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" })
  }, [messages, loading])

  if (!open) {
    return null
  }

  const sendMessage = async () => {
    const nextMessage = message.trim()

    if (!nextMessage || loading) {
      return
    }

    setMessage("")
    setMessages((items) => [
      ...items,
      {
        role: "user",
        content: nextMessage,
      },
    ])
    setLoading(true)

    try {
      const response = await chatWithAssistant(nextMessage, tasks)
      if (response.tasksChanged) {
        await onTasksChanged?.()
      }

      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          content: response.reply || "I could not generate a reply right now.",
        },
      ])
    } catch (error) {
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "AI chat failed. Try again in a moment.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 flex h-[min(560px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-[1.5rem] bg-white/[0.06] shadow-2xl shadow-black/35 ring-1 ring-white/[0.08] backdrop-blur-xl sm:right-6">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[1rem] bg-white/[0.92] text-slate-950">
            <Bot size={17} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">AI Assistant</h2>
            <p className="text-xs text-slate-500">Productivity support</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[0.9rem] bg-white/[0.055] text-slate-300 ring-1 ring-white/[0.07] transition hover:bg-white/[0.09] hover:text-white"
          aria-label="Close AI Assistant"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[82%] rounded-[1rem] px-3.5 py-2.5 text-sm leading-6 ${
                item.role === "user"
                  ? "bg-white text-slate-950"
                  : "bg-black/[0.16] text-slate-200 ring-1 ring-white/[0.06]"
              }`}
            >
              {item.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-[1rem] bg-black/[0.16] px-3.5 py-2.5 text-sm text-slate-400 ring-1 ring-white/[0.06]">
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/[0.08] p-3">
        <div className="flex gap-2 rounded-[1.1rem] bg-black/[0.14] p-2 ring-1 ring-white/[0.07]">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage()
              }
            }}
            placeholder="Ask about your tasks..."
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-600"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={loading}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] bg-white text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AiAssistant