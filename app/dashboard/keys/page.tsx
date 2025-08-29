"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, Plus, Trash2, Calendar, Shield, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface VaultData {
  id: string
  name: string
  isDefault: boolean
}

interface ApiKeyData {
  id: string
  name: string
  key: string
  vaultId: string
  vaultName: string
  createdAt: string
  lastUsed: string
  permissions: string[]
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

export default function APIKeysPage() {
  const [keys, setKeys] = useState<ApiKeyData[]>([])
  const [vaults, setVaults] = useState<VaultData[]>([])
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [selectedVault, setSelectedVault] = useState("")
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
      setKeys(data)
    } catch (error) {
      console.error("Error fetching API keys:", error)
      setError(true)
    }
  }

  const createApiKey = async (name: string, vaultId: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, vaultId }),
      })
      if (!response.ok) throw new Error("Failed to create API key")
      const newKey = await response.json()
      setKeys([...keys, newKey])
    } catch (error) {
      console.error("Error creating API key:", error)
      setError(true)
    }
  }

  const deleteApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/keys/${keyId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete API key")
      setKeys(keys.filter((key) => key.id !== keyId))
    } catch (error) {
      console.error("Error deleting API key:", error)
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
      <div className="p-8 space-y-8">
        <ErrorState />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-zinc-400">Loading your API keys...</p>
          </div>
        </div>
      </div>
    )
  }

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

  const deleteKey = (keyId: string) => {
    deleteApiKey(keyId)
  }

  const createNewKey = async () => {
    if (!newKeyName || !selectedVault) return

    await createApiKey(newKeyName, selectedVault)
    setNewKeyName("")
    setSelectedVault("")
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            API Keys
          </h1>
          <p className="text-zinc-400 mt-2">Manage your API keys across all vaults</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 border border-zinc-600/50 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-b from-zinc-950 to-black border border-zinc-800/50">
            <DialogHeader>
              <DialogTitle className="text-white">Create New API Key</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Generate a new API key for your selected vault
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="keyName" className="text-zinc-300">
                  Key Name
                </Label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="bg-zinc-900/50 border-zinc-700/50 text-white placeholder:text-zinc-500"
                />
              </div>
              <div>
                <Label htmlFor="vault" className="text-zinc-300">
                  Select Vault
                </Label>
                <Select value={selectedVault} onValueChange={setSelectedVault}>
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-700/50 text-white">
                    <SelectValue placeholder="Choose a vault" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700/50">
                    {vaults.map((vault) => (
                      <SelectItem key={vault.id} value={vault.id} className="text-white hover:bg-zinc-800">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {vault.name}
                          {vault.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={createNewKey}
                  disabled={!newKeyName || !selectedVault}
                  className="flex-1 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600"
                >
                  Create Key
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-700 border border-zinc-600/50">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{keys.length}</p>
                <p className="text-zinc-400 text-sm">Total API Keys</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-700 border border-zinc-600/50">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{keys.filter((k) => k.lastUsed !== "Never").length}</p>
                <p className="text-zinc-400 text-sm">Active Keys</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-700 border border-zinc-600/50">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{vaults.length}</p>
                <p className="text-zinc-400 text-sm">Connected Vaults</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Your API Keys</h2>
        <div className="grid gap-4">
          {keys.map((apiKey) => (
            <Card
              key={apiKey.id}
              className="bg-gradient-to-r from-zinc-900/50 to-zinc-950/30 border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white text-lg">{apiKey.name}</h3>
                      <Badge variant="secondary" className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50">
                        {apiKey.vaultName}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-sm">
                      <span className="text-zinc-400">{visibleKeys.has(apiKey.id) ? apiKey.key : "•".repeat(32)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="h-8 w-8 p-0 hover:bg-zinc-800/50"
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="h-4 w-4 text-zinc-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-zinc-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="h-8 w-8 p-0 hover:bg-zinc-800/50"
                      >
                        <Copy className="h-4 w-4 text-zinc-400" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-zinc-400">
                      <span>Created: {apiKey.createdAt}</span>
                      <span>Last used: {apiKey.lastUsed}</span>
                      <div className="flex gap-1">
                        {apiKey.permissions.map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs border-zinc-700/50 text-zinc-400">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteKey(apiKey.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
