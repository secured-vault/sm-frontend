"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Vault,
  Key,
  Eye,
  EyeOff,
  Copy,
  Edit,
  Trash2,
  MoreHorizontal,
  Shield,
  Clock,
  Activity,
  AlertTriangle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Dummy data
interface VaultData {
  id: string
  name: string
  description: string
  isDefault: boolean
  keyCount: number
  createdAt: string
}

interface ApiKeyData {
  id: string
  name: string
  value: string
  vaultId: string
  createdAt: string
  lastUsed: string
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

export default function DashboardPage() {
  const [selectedVault, setSelectedVault] = useState("main")
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [vaults, setVaults] = useState<VaultData[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchVaults = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/vaults")
      if (!response.ok) throw new Error("Failed to fetch vaults")
      const data = await response.json()
      setVaults(data)
    } catch (error) {
      console.error("Error fetching vaults:", error)
      setError(true)
    }
  }

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/keys")
      if (!response.ok) throw new Error("Failed to fetch API keys")
      const data = await response.json()
      setApiKeys(data)
    } catch (error) {
      console.error("Error fetching API keys:", error)
      setError(true)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(false)
      try {
        await Promise.all([fetchVaults(), fetchApiKeys()])
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
      <div className="p-6 space-y-8 bg-gradient-to-br from-transparent via-zinc-950/20 to-transparent min-h-screen">
        <ErrorState />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-gradient-to-br from-transparent via-zinc-950/20 to-transparent min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-zinc-400">Loading your vaults...</p>
          </div>
        </div>
      </div>
    )
  }

  const selectedVaultData = vaults.find((v) => v.id === selectedVault)
  const vaultKeys = apiKeys.filter((key) => key.vaultId === selectedVault)

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleKeys(newVisible)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-transparent via-zinc-950/20 to-transparent min-h-screen">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Vaults
          </h1>
          <p className="text-zinc-400 text-lg">Manage your API key vaults and secrets</p>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-zinc-300">{vaults.length} Vaults</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Key className="h-4 w-4 text-blue-400" />
              <span className="text-zinc-300">{apiKeys.length} API Keys</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-purple-400" />
              <span className="text-zinc-300">All Active</span>
            </div>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-white to-zinc-200 text-black hover:from-zinc-200 hover:to-zinc-300 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3">
          <Plus className="h-4 w-4 mr-2" />
          New Vault
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Vault className="h-5 w-5" />
            Your Vaults
          </h2>
          <div className="space-y-4">
            {vaults.map((vault) => (
              <Card
                key={vault.id}
                className={`cursor-pointer transition-all duration-300 border group hover:shadow-2xl hover:shadow-zinc-900/50 ${
                  selectedVault === vault.id
                    ? "bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-600 shadow-xl shadow-zinc-900/30"
                    : "bg-gradient-to-br from-zinc-950 to-black border-zinc-800 hover:border-zinc-700 hover:from-zinc-900 hover:to-zinc-950"
                }`}
                onClick={() => setSelectedVault(vault.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg flex items-center gap-3 group-hover:text-zinc-100 transition-colors">
                      <div
                        className={`p-2 rounded-lg ${selectedVault === vault.id ? "bg-zinc-700" : "bg-zinc-800 group-hover:bg-zinc-700"} transition-colors`}
                      >
                        <Vault className="h-4 w-4" />
                      </div>
                      {vault.name}
                    </CardTitle>
                    {vault.isDefault && (
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-zinc-700 to-zinc-600 text-zinc-200 border-0"
                      >
                        Default
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-zinc-400 text-sm ml-11">{vault.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm ml-11">
                    <div className="flex items-center gap-2">
                      <Key className="h-3 w-3 text-zinc-500" />
                      <span className="text-zinc-400">{vault.keyCount} keys</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      <span className="text-zinc-500">{vault.createdAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedVaultData && (
            <>
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-zinc-950/50 to-zinc-800/30 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-3 bg-zinc-800 rounded-xl">
                      <Vault className="h-6 w-6" />
                    </div>
                    {selectedVaultData.name}
                    {selectedVaultData.isDefault && (
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-zinc-700 to-zinc-600 text-zinc-200 border-0"
                      >
                        Default
                      </Badge>
                    )}
                  </h2>
                  <p className="text-zinc-400 text-base ml-12">{selectedVaultData.description}</p>
                  <div className="flex items-center gap-4 ml-12 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Key className="h-4 w-4 text-blue-400" />
                      <span className="text-zinc-300">{vaultKeys.length} API Keys</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-green-400" />
                      <span className="text-zinc-300">Created {selectedVaultData.createdAt}</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-white to-zinc-200 text-black hover:from-zinc-200 hover:to-zinc-300 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Key
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </h3>
                {vaultKeys.length === 0 ? (
                  <Card className="bg-gradient-to-br from-zinc-950 to-black border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                    <CardContent className="p-8 text-center">
                      <div className="p-4 bg-zinc-900 rounded-full w-fit mx-auto mb-4">
                        <Key className="h-8 w-8 text-zinc-600" />
                      </div>
                      <p className="text-zinc-400 text-lg mb-4">No API keys in this vault</p>
                      <Button className="bg-gradient-to-r from-white to-zinc-200 text-black hover:from-zinc-200 hover:to-zinc-300 shadow-lg hover:shadow-xl transition-all duration-200">
                        Add your first key
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {vaultKeys.map((key) => (
                      <Card
                        key={key.id}
                        className="bg-gradient-to-br from-zinc-950 to-black border-zinc-800 hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-900/30 transition-all duration-300 group"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-800 group-hover:bg-zinc-700 rounded-lg transition-colors">
                                  <Key className="h-4 w-4 text-zinc-400" />
                                </div>
                                <span className="text-white font-semibold text-lg">{key.name}</span>
                              </div>
                              <div className="flex items-center gap-3 ml-11">
                                <code className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-4 py-2 rounded-lg text-sm text-zinc-300 font-mono border border-zinc-700/50 flex-1 max-w-md">
                                  {visibleKeys.has(key.id) ? key.value : "••••••••••••••••••••••••"}
                                </code>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleKeyVisibility(key.id)}
                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-2"
                                  >
                                    {visibleKeys.has(key.id) ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(key.value)}
                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-2"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 ml-11 text-xs text-zinc-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Created: {key.createdAt}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Activity className="h-3 w-3" />
                                  <span>Last used: {key.lastUsed}</span>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-2"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-zinc-900 border-zinc-700 backdrop-blur-xl">
                                <DropdownMenuItem className="text-zinc-300 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-zinc-800 focus:bg-zinc-800">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
