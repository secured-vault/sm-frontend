"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Activity, Key, Users, Shield, Clock, AlertTriangle } from "lucide-react"

interface UsageData {
  name: string
  requests: number
  errors: number
}

interface VaultUsage {
  name: string
  value: number
  color: string
}

interface TopKey {
  name: string
  requests: number
  vault: string
  lastUsed: string
}

interface AnalyticsMetrics {
  totalRequests: number
  activeKeys: number
  errorRate: number
  teamMembers: number
  trends: {
    requests: number
    keys: number
    errorRate: number
    members: number
  }
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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [usageData, setUsageData] = useState<UsageData[]>([])
  const [vaultUsage, setVaultUsage] = useState<VaultUsage[]>([])
  const [topKeys, setTopKeys] = useState<TopKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchAnalyticsMetrics = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/analytics/metrics?range=${timeRange}`)
      if (!response.ok) throw new Error("Failed to fetch metrics")
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error("Error fetching analytics metrics:", error)
      setError(true)
    }
  }

  const fetchUsageData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/analytics/usage?range=${timeRange}`)
      if (!response.ok) throw new Error("Failed to fetch usage data")
      const data = await response.json()
      setUsageData(data)
    } catch (error) {
      console.error("Error fetching usage data:", error)
      setError(true)
    }
  }

  const fetchVaultUsage = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/analytics/vaults?range=${timeRange}`)
      if (!response.ok) throw new Error("Failed to fetch vault usage")
      const data = await response.json()
      setVaultUsage(data)
    } catch (error) {
      console.error("Error fetching vault usage:", error)
      setError(true)
    }
  }

  const fetchTopKeys = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/analytics/top-keys?range=${timeRange}`)
      if (!response.ok) throw new Error("Failed to fetch top keys")
      const data = await response.json()
      setTopKeys(data)
    } catch (error) {
      console.error("Error fetching top keys:", error)
      setError(true)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(false)
      try {
        await Promise.all([fetchAnalyticsMetrics(), fetchUsageData(), fetchVaultUsage(), fetchTopKeys()])
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [timeRange])

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
              <p className="text-zinc-400">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-zinc-400 mt-1">Monitor your API usage and performance</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-zinc-900 border-zinc-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Total Requests</p>
                  <p className="text-2xl font-bold text-white">{metrics?.totalRequests?.toLocaleString() || "0"}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {(metrics?.trends.requests || 0) >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm ${(metrics?.trends.requests || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {metrics?.trends.requests > 0 ? "+" : ""}
                      {metrics?.trends.requests || 0}%
                    </span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-zinc-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Active Keys</p>
                  <p className="text-2xl font-bold text-white">{metrics?.activeKeys || 0}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {(metrics?.trends.keys || 0) >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${(metrics?.trends.keys || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {metrics?.trends.keys > 0 ? "+" : ""}
                      {metrics?.trends.keys || 0}
                    </span>
                  </div>
                </div>
                <Key className="h-8 w-8 text-zinc-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Error Rate</p>
                  <p className="text-2xl font-bold text-white">{metrics?.errorRate?.toFixed(2) || "0.00"}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    {(metrics?.trends.errorRate || 0) <= 0 ? (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm ${(metrics?.trends.errorRate || 0) <= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {metrics?.trends.errorRate > 0 ? "+" : ""}
                      {metrics?.trends.errorRate?.toFixed(2) || 0}%
                    </span>
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-zinc-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Team Members</p>
                  <p className="text-2xl font-bold text-white">{metrics?.teamMembers || 0}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {(metrics?.trends.members || 0) >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm ${(metrics?.trends.members || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {metrics?.trends.members > 0 ? "+" : ""}
                      {metrics?.trends.members || 0}
                    </span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-zinc-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usage" className="space-y-6">
          <TabsList className="bg-zinc-900 border-zinc-800">
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Usage Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Performance
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">API Requests Over Time</CardTitle>
                  <CardDescription className="text-zinc-400">Request volume and error rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="requests" fill="#ffffff" />
                      <Bar dataKey="errors" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Vault Usage Distribution</CardTitle>
                  <CardDescription className="text-zinc-400">Request distribution across vaults</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={vaultUsage}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {vaultUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {vaultUsage.map((vault, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vault.color }} />
                          <span className="text-white text-sm">{vault.name}</span>
                        </div>
                        <span className="text-zinc-400 text-sm">{vault.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Top API Keys by Usage</CardTitle>
                <CardDescription className="text-zinc-400">
                  Most frequently used API keys in the selected time range
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topKeys.map((key, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{key.name}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                              {key.vault}
                            </Badge>
                            <span className="text-zinc-400 text-sm flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {key.lastUsed}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{key.requests.toLocaleString()}</p>
                        <p className="text-zinc-400 text-sm">requests</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Response Times</CardTitle>
                  <CardDescription className="text-zinc-400">Average API response times over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Line type="monotone" dataKey="requests" stroke="#ffffff" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                  <CardDescription className="text-zinc-400">Current system performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">API Uptime</span>
                      <span className="text-green-500">99.9%</span>
                    </div>
                    <Progress value={99.9} className="bg-zinc-800" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">Response Time</span>
                      <span className="text-white">145ms</span>
                    </div>
                    <Progress value={85} className="bg-zinc-800" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">Success Rate</span>
                      <span className="text-green-500">99.3%</span>
                    </div>
                    <Progress value={99.3} className="bg-zinc-800" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Events
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Recent security-related activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-white text-sm">Successful login from new device</p>
                        <p className="text-zinc-400 text-xs">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-white text-sm">API key accessed from unusual location</p>
                        <p className="text-zinc-400 text-xs">6 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-white text-sm">Password changed successfully</p>
                        <p className="text-zinc-400 text-xs">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Security Score</CardTitle>
                  <CardDescription className="text-zinc-400">Overall security posture assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-500 mb-2">92</div>
                    <p className="text-zinc-400">Security Score</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Two-Factor Auth</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Key Rotation</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Access Logs</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
