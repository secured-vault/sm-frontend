"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Bell,
  Mail,
  Smartphone,
  Zap,
  Plus,
  Settings,
} from "lucide-react"

interface RealtimeData {
  time: string
  requests: number
  errors: number
  latency: number
}

interface SystemMetric {
  name: string
  status: string
  uptime: number
  responseTime: number
  lastCheck: string
}

interface Alert {
  id: number
  type: string
  title: string
  description: string
  service: string
  timestamp: string
  severity: string
}

interface AlertRule {
  id: number
  name: string
  condition: string
  enabled: boolean
  notifications: string[]
  severity: string
}

interface SystemStatus {
  status: string
  uptime: number
  activeAlerts: number
  avgResponse: number
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "healthy":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    case "error":
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <Clock className="h-5 w-5 text-zinc-400" />
  }
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    default:
      return <Activity className="h-4 w-4 text-blue-500" />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    default:
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
  }
}

export default function MonitoringPage() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [newAlertName, setNewAlertName] = useState("")
  const [newAlertCondition, setNewAlertCondition] = useState("")
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([])
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/monitoring/status")
      if (!response.ok) throw new Error("Failed to fetch system status")
      const data = await response.json()
      setSystemStatus(data)
    } catch (error) {
      console.error("Error fetching system status:", error)
      setError(true)
    }
  }

  const fetchRealtimeData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/monitoring/realtime")
      if (!response.ok) throw new Error("Failed to fetch realtime data")
      const data = await response.json()
      setRealtimeData(data)
    } catch (error) {
      console.error("Error fetching realtime data:", error)
      setError(true)
    }
  }

  const fetchSystemMetrics = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/monitoring/services")
      if (!response.ok) throw new Error("Failed to fetch system metrics")
      const data = await response.json()
      setSystemMetrics(data)
    } catch (error) {
      console.error("Error fetching system metrics:", error)
      setError(true)
    }
  }

  const fetchActiveAlerts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/monitoring/alerts")
      if (!response.ok) throw new Error("Failed to fetch active alerts")
      const data = await response.json()
      setActiveAlerts(data)
    } catch (error) {
      console.error("Error fetching active alerts:", error)
      setError(true)
    }
  }

  const fetchAlertRules = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/monitoring/alert-rules")
      if (!response.ok) throw new Error("Failed to fetch alert rules")
      const data = await response.json()
      setAlertRules(data)
    } catch (error) {
      console.error("Error fetching alert rules:", error)
      setError(true)
    }
  }

  const createAlertRule = async (name: string, condition: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/monitoring/alert-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, condition, severity: "medium" }),
      })
      if (!response.ok) throw new Error("Failed to create alert rule")
      await fetchAlertRules() // Refresh rules
    } catch (error) {
      console.error("Error creating alert rule:", error)
      setError(true)
    }
  }

  const toggleAlertRule = async (ruleId: number, enabled: boolean) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/monitoring/alert-rules/${ruleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      })
      if (!response.ok) throw new Error("Failed to toggle alert rule")
      setAlertRules(alertRules.map((rule) => (rule.id === ruleId ? { ...rule, enabled } : rule)))
    } catch (error) {
      console.error("Error toggling alert rule:", error)
      setError(true)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(false)
      try {
        await Promise.all([
          fetchSystemStatus(),
          fetchRealtimeData(),
          fetchSystemMetrics(),
          fetchActiveAlerts(),
          fetchAlertRules(),
        ])
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadData()

    // Set up polling for real-time data
    const interval = setInterval(() => {
      if (!error) {
        fetchRealtimeData()
        fetchSystemStatus()
        fetchActiveAlerts()
      }
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [error])

  if (error) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorState />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-zinc-400">Loading monitoring data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleCreateAlert = async () => {
    if (!newAlertName || !newAlertCondition) return
    await createAlertRule(newAlertName, newAlertCondition)
    setNewAlertName("")
    setNewAlertCondition("")
    setIsAlertDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">System Monitoring</h1>
            <p className="text-zinc-400 mt-1">Real-time monitoring and alerting for your infrastructure</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-zinc-200">
                  <Plus className="h-4 w-4 mr-2" />
                  New Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Alert Rule</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Set up a new monitoring alert for your system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="alert-name" className="text-white">
                      Alert Name
                    </Label>
                    <Input
                      id="alert-name"
                      placeholder="High CPU Usage"
                      value={newAlertName}
                      onChange={(e) => setNewAlertName(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="alert-condition" className="text-white">
                      Condition
                    </Label>
                    <Input
                      id="alert-condition"
                      placeholder="CPU usage > 80%"
                      value={newAlertCondition}
                      onChange={(e) => setNewAlertCondition(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Severity</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAlertDialogOpen(false)}
                    className="border-zinc-700 text-zinc-300"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAlert} className="bg-white text-black hover:bg-zinc-200">
                    Create Alert
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">System Status</p>
                  <p
                    className={`text-2xl font-bold ${systemStatus?.status === "healthy" ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {systemStatus?.status || "Unknown"}
                  </p>
                  <p className="text-zinc-400 text-xs mt-1">All systems operational</p>
                </div>
                <Shield
                  className={`h-8 w-8 ${systemStatus?.status === "healthy" ? "text-green-500" : "text-yellow-500"}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Uptime</p>
                  <p className="text-2xl font-bold text-white">{systemStatus?.uptime?.toFixed(1) || "0.0"}%</p>
                  <p className="text-zinc-400 text-xs mt-1">Last 30 days</p>
                </div>
                <Activity className="h-8 w-8 text-zinc-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Active Alerts</p>
                  <p className="text-2xl font-bold text-yellow-500">{systemStatus?.activeAlerts || 0}</p>
                  <p className="text-zinc-400 text-xs mt-1">Current alerts</p>
                </div>
                <Bell className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Avg Response</p>
                  <p className="text-2xl font-bold text-white">{systemStatus?.avgResponse || 0}ms</p>
                  <p className="text-zinc-400 text-xs mt-1">Last hour</p>
                </div>
                <Zap className="h-8 w-8 text-zinc-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="realtime" className="space-y-6">
          <TabsList className="bg-zinc-900 border-zinc-800">
            <TabsTrigger value="realtime" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Real-time Monitoring
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Service Health
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Alert Management
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Request Volume</CardTitle>
                  <CardDescription className="text-zinc-400">Real-time API request monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={realtimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Area type="monotone" dataKey="requests" stroke="#ffffff" fill="#ffffff" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Response Time</CardTitle>
                  <CardDescription className="text-zinc-400">Average response time over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={realtimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Line type="monotone" dataKey="latency" stroke="#ffffff" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Alerts</CardTitle>
                <CardDescription className="text-zinc-400">Latest system alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
                    >
                      <div className="flex items-center gap-4">
                        {getAlertIcon(alert.type)}
                        <div>
                          <h4 className="text-white font-medium">{alert.title}</h4>
                          <p className="text-zinc-400 text-sm">{alert.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                              {alert.service}
                            </Badge>
                            <span className="text-zinc-500 text-xs">{alert.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-4">
              {systemMetrics.map((service, index) => (
                <Card key={index} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(service.status)}
                        <div>
                          <h3 className="text-white font-semibold">{service.name}</h3>
                          <p className="text-zinc-400 text-sm">Last checked: {service.lastCheck}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-white font-medium">{service.uptime}%</p>
                          <p className="text-zinc-400 text-sm">Uptime</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{service.responseTime}ms</p>
                          <p className="text-zinc-400 text-sm">Response</p>
                        </div>
                        <div className="w-32">
                          <Progress
                            value={service.uptime}
                            className={`bg-zinc-800 ${
                              service.uptime >= 99.5
                                ? "[&>div]:bg-green-500"
                                : service.uptime >= 98
                                  ? "[&>div]:bg-yellow-500"
                                  : "[&>div]:bg-red-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid gap-4">
              {alertRules.map((rule) => (
                <Card key={rule.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(enabled) => toggleAlertRule(rule.id, enabled)}
                        />
                        <div>
                          <h3 className="text-white font-semibold">{rule.name}</h3>
                          <p className="text-zinc-400 text-sm">{rule.condition}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {rule.notifications.includes("email") && (
                              <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Badge>
                            )}
                            {rule.notifications.includes("sms") && (
                              <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                                <Smartphone className="h-3 w-3 mr-1" />
                                SMS
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getSeverityColor(rule.severity)}>{rule.severity}</Badge>
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Configure email alert settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-alerts" className="text-white">
                      Enable email alerts
                    </Label>
                    <Switch id="email-alerts" defaultChecked />
                  </div>
                  <div>
                    <Label htmlFor="email-address" className="text-white">
                      Email Address
                    </Label>
                    <Input
                      id="email-address"
                      type="email"
                      placeholder="alerts@company.com"
                      defaultValue="admin@secured.dev"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="digest" className="text-white">
                      Daily digest
                    </Label>
                    <Switch id="digest" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    SMS Notifications
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Configure SMS alert settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-alerts" className="text-white">
                      Enable SMS alerts
                    </Label>
                    <Switch id="sms-alerts" defaultChecked />
                  </div>
                  <div>
                    <Label htmlFor="phone-number" className="text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      defaultValue="+1 (555) 987-6543"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="critical-only" className="text-white">
                      Critical alerts only
                    </Label>
                    <Switch id="critical-only" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Notification History</CardTitle>
                <CardDescription className="text-zinc-400">Recent notifications sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-white text-sm">High Response Time Alert</p>
                        <p className="text-zinc-400 text-xs">Sent to admin@secured.dev</p>
                      </div>
                    </div>
                    <span className="text-zinc-400 text-xs">2 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-white text-sm">System Recovery Notification</p>
                        <p className="text-zinc-400 text-xs">Sent to +1 (555) 987-6543</p>
                      </div>
                    </div>
                    <span className="text-zinc-400 text-xs">1 hour ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-white text-sm">Daily System Digest</p>
                        <p className="text-zinc-400 text-xs">Sent to admin@secured.dev</p>
                      </div>
                    </div>
                    <span className="text-zinc-400 text-xs">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
