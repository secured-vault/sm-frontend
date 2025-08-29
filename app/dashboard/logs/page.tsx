"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Database,
  Key,
  Shield,
  User,
  Clock,
  ScrollText,
  AlertTriangle,
} from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  action: string
  description: string
  type: string
  user: string
  vault: string | null
  ip: string
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

const getActionIcon = (type: string) => {
  switch (type) {
    case "create":
    case "update":
      return Key
    case "access":
      return Shield
    case "auth":
      return User
    case "system":
      return Database
    default:
      return Clock
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "failed":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    case "warning":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
  }
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  }
}

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/logs")
      if (!response.ok) throw new Error("Failed to fetch logs")
      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error("Error fetching logs:", error)
      setError(true)
    }
  }

  const exportLogs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/logs/export")
      if (!response.ok) throw new Error("Failed to export logs")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `logs-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting logs:", error)
      setError(true)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(false)
      try {
        await fetchLogs()
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorState />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-zinc-400">Loading activity logs...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || log.type === selectedType
    return matchesSearch && matchesType
  })

  const handleRefresh = async () => {
    setError(false)
    await fetchLogs()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Activity Logs
            </h1>
            <p className="text-zinc-400 mt-1">Monitor all activities and system events</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-zinc-700 hover:bg-zinc-800 bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportLogs}
              className="border-zinc-700 hover:bg-zinc-800 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-zinc-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-zinc-800/50 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
              >
                <option value="all">All Types</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="access">Access</option>
                <option value="auth">Authentication</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Logs List */}
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const ActionIcon = getActionIcon(log.type)
            const { date, time } = formatTimestamp(log.timestamp)

            return (
              <Card
                key={log.id}
                className="bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/50 transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                        <ActionIcon className="h-5 w-5 text-zinc-400" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white">{log.action}</h3>
                        <Badge className={`text-xs ${getStatusColor(log.status)}`}>{log.status}</Badge>
                      </div>

                      <p className="text-zinc-400 text-sm mb-3">{log.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.user}
                        </div>
                        {log.vault && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {log.vault}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {date} at {time}
                        </div>
                        <div>IP: {log.ip}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredLogs.length === 0 && (
          <Card className="bg-zinc-900/30 border-zinc-800/50 p-12 text-center">
            <ScrollText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-400 mb-2">No logs found</h3>
            <p className="text-zinc-500">Try adjusting your search or filter criteria</p>
          </Card>
        )}
      </div>
    </div>
  )
}
