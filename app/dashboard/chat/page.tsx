"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, Smile, MoreVertical, Clock, CheckCheck, AlertTriangle } from "lucide-react"

interface Message {
  id: string
  sender: string
  message: string
  timestamp: string
  isFromUser: boolean
  status: string
}

const ErrorState = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <div className="p-4 bg-red-950/20 rounded-full">
      <AlertTriangle className="h-12 w-12 text-red-400" />
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-xl font-semibold text-white">Cluster 1 is Currently Down</h3>
      <p className="text-zinc-400">Please contact devs for assistance</p>
    </div>
  </div>
)

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return "Just now"
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else {
    return date.toLocaleDateString()
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [teamOnline, setTeamOnline] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/chat/messages")
      if (!response.ok) throw new Error("Failed to fetch messages")
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
      setError(true)
    }
  }

  const fetchTeamStatus = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/chat/team-status")
      if (!response.ok) throw new Error("Failed to fetch team status")
      const data = await response.json()
      setTeamOnline(data.online)
    } catch (error) {
      console.error("Error fetching team status:", error)
      setError(true)
    }
  }

  const sendMessage = async (messageText: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      })
      if (!response.ok) throw new Error("Failed to send message")
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error sending message:", error)
      setError(true)
      throw error
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(false)
      try {
        await Promise.all([fetchMessages(), fetchTeamStatus()])
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadData()

    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      if (!error) {
        fetchMessages()
        fetchTeamStatus()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [error])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: "You",
      message: newMessage,
      timestamp: new Date().toISOString(),
      isFromUser: true,
      status: "sending",
    }

    setMessages((prev) => [...prev, userMessage])
    const messageText = newMessage
    setNewMessage("")

    try {
      const sentMessage = await sendMessage(messageText)
      setMessages((prev) =>
        prev.map((msg) => (msg.id === userMessage.id ? { ...msg, ...sentMessage, status: "sent" } : msg)),
      )

      // Refresh messages to get any new responses
      setTimeout(() => {
        fetchMessages()
      }, 1000)
    } catch (error) {
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "failed" } : msg)))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <ErrorState />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-zinc-400">Loading chat...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Developer Chat
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${teamOnline ? "bg-green-500" : "bg-zinc-500"}`}></div>
                <p className="text-zinc-400 text-sm">{teamOnline ? "Team is online" : "Team is offline"}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isFromUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${message.isFromUser ? "order-2" : "order-1"}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.isFromUser ? "bg-white text-black ml-4" : "bg-zinc-800/50 text-white mr-4"
                  }`}
                >
                  {!message.isFromUser && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs bg-zinc-700 text-zinc-300">
                        {message.sender}
                      </Badge>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.message}</p>
                </div>
                <div
                  className={`flex items-center gap-2 mt-1 text-xs text-zinc-500 ${
                    message.isFromUser ? "justify-end mr-4" : "justify-start ml-4"
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  <span>{formatTimestamp(message.timestamp)}</span>
                  {message.isFromUser && (
                    <CheckCheck
                      className={`h-3 w-3 ${
                        message.status === "read"
                          ? "text-blue-400"
                          : message.status === "failed"
                            ? "text-red-400"
                            : "text-zinc-500"
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[70%]">
                <div className="bg-zinc-800/50 text-white rounded-2xl px-4 py-3 mr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs bg-zinc-700 text-zinc-300">
                      Developer Team
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-zinc-800/50 border-zinc-700">
            <div className="flex items-end gap-3 p-4">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white flex-shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-transparent border-none focus:ring-0 text-white placeholder-zinc-400 resize-none"
                />
              </div>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white flex-shrink-0">
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
          <p className="text-xs text-zinc-500 mt-2 text-center">
            Our team typically responds within a few hours during business hours
          </p>
        </div>
      </div>
    </div>
  )
}
