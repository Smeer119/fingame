"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, Lightbulb } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("assistant-messages")
    if (saved) {
      const parsedMessages = JSON.parse(saved)
      setMessages(
        parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      )
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "I encountered an error. Please make sure you have configured the API. For now, here's some general financial advice: Start by tracking your expenses, create a budget using the 50/30/20 rule, and build an emergency fund with 3-6 months of expenses.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const suggestedPrompts = [
    "How do I create a budget?",
    "What's the 50/30/20 rule?",
    "How should I start investing?",
    "How do I build an emergency fund?",
    "What's the best way to pay off debt?",
    "How does compound interest work?",
  ]

  if (!mounted) return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardNav />

      <main className="flex-1 overflow-auto">
        <div className="p-8 h-full flex flex-col">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Financial Mentor</h1>
            <p className="text-muted-foreground mt-2">Chat with your AI-powered financial advisor</p>
          </div>

          <div className="flex-1 flex flex-col">
            {/* Chat Container */}
            <Card className="flex-1 border border-border flex flex-col mb-4 bg-card">
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-5xl mb-4">🎓</div>
                    <h2 className="text-lg font-semibold text-foreground">Welcome to Your Financial Mentor</h2>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      I'm here to guide you through budgeting, saving, investing, and building lasting financial habits.
                      Ask me anything!
                    </p>

                    <div className="mt-8 w-full max-w-md space-y-2">
                      <p className="text-xs text-muted-foreground font-medium mb-3">Try asking me about:</p>
                      <div className="space-y-2">
                        {suggestedPrompts.map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => {
                              setInput(prompt)
                              setTimeout(() => {
                                const event = new KeyboardEvent("keypress", { key: "Enter" })
                                document.dispatchEvent(event)
                              }, 0)
                            }}
                            className="w-full text-left p-2 rounded-lg bg-muted hover:bg-muted/80 transition text-sm text-foreground"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground border border-border"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p
                            className={`text-xs mt-2 ${message.role === "user" ? "opacity-70" : "text-muted-foreground"}`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-muted text-foreground px-4 py-3 rounded-lg flex gap-2 items-center border border-border">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Your mentor is thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Input Area */}
            <div className="flex gap-3">
              <Input
                placeholder="Ask your mentor about budgeting, investing, saving, or any financial question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={loading}
                className="flex-1 border border-input bg-input"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 flex gap-2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 flex gap-2">
              <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                💡 Tip: Ask specific questions about your financial situation for personalized advice!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
