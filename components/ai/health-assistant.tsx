"use client"

import type React from "react"

import { useState } from "react"
import { Bot, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface HealthAssistantProps {
  userType?: "patient" | "provider"
}

export function HealthAssistant({ userType = "patient" }: HealthAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        userType === "provider"
          ? "Hello doctor, how can I assist you with patient care today?"
          : "Hello! I'm your health assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (userType === "provider") {
        if (input.toLowerCase().includes("treatment") || input.toLowerCase().includes("protocol")) {
          response =
            "Based on the latest clinical guidelines, I recommend reviewing the updated treatment protocols for this condition. Would you like me to provide a summary of the recent changes?"
        } else if (input.toLowerCase().includes("diagnosis") || input.toLowerCase().includes("symptoms")) {
          response =
            "The symptoms you've described could indicate several conditions. Have you considered ordering these specific tests to narrow down the diagnosis?"
        } else {
          response =
            "I understand your query. As a healthcare provider, you might find these recent medical journal articles relevant to this case. Would you like me to summarize the key findings?"
        }
      } else {
        if (input.toLowerCase().includes("headache") || input.toLowerCase().includes("pain")) {
          response =
            "I understand you're experiencing pain. For headaches, it's important to stay hydrated and rest in a quiet, dark room. If the pain persists for more than 24 hours or is severe, please consult with your doctor."
        } else if (input.toLowerCase().includes("appointment") || input.toLowerCase().includes("schedule")) {
          response =
            'To schedule an appointment, you can use the "Book Appointment" feature in your dashboard. Would you like me to guide you through the process?'
        } else {
          response =
            "Thank you for sharing that information. While I can provide general health information, it's always best to consult with your healthcare provider for personalized medical advice."
        }
      }

      const assistantMessage: Message = { role: "assistant", content: response }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Health Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[300px] overflow-y-auto p-2">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className={`h-8 w-8 ${message.role === "user" ? "bg-primary" : "bg-muted"}`}>
                  <AvatarFallback>
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8 bg-muted">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-muted">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce delay-150"></div>
                    <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Type your health question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 resize-none"
          />
          <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

