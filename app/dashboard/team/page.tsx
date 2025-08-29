"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  Crown,
  Shield,
  User,
  Mail,
  Calendar,
  Activity,
  AlertTriangle,
} from "lucide-react"

interface TeamMember {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
  joinedAt: string
  lastActive: string
  vaultsAccess: number
  status: string
}

interface PendingInvite {
  id: number
  email: string
  role: string
  invitedBy: string
  invitedAt: string
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

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Owner":
      return <Crown className="h-4 w-4 text-yellow-500" />
    case "Admin":
      return <Shield className="h-4 w-4 text-blue-500" />
    default:
      return <User className="h-4 w-4 text-zinc-400" />
  }
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Owner":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "Admin":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
  }
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Developer")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/team/members")
      if (!response.ok) throw new Error("Failed to fetch team members")
      const data = await response.json()
      setTeamMembers(data)
    } catch (error) {
      console.error("Error fetching team members:", error)
      setError(true)
    }
  }

  const fetchPendingInvites = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/team/invites")
      if (!response.ok) throw new Error("Failed to fetch pending invites")
      const data = await response.json()
      setPendingInvites(data)
    } catch (error) {
      console.error("Error fetching pending invites:", error)
      setError(true)
    }
  }

  const sendInvite = async (email: string, role: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      })
      if (!response.ok) throw new Error("Failed to send invite")
      await fetchPendingInvites() // Refresh invites
    } catch (error) {
      console.error("Error sending invite:", error)
      setError(true)
    }
  }

  const removeMember = async (memberId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/team/members/${memberId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to remove member")
      setTeamMembers(teamMembers.filter((member) => member.id !== memberId))
    } catch (error) {
      console.error("Error removing member:", error)
      setError(true)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(false)
      try {
        await Promise.all([fetchTeamMembers(), fetchPendingInvites()])
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
              <p className="text-zinc-400">Loading team data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendInvite = async () => {
    if (!inviteEmail || !inviteRole) return
    await sendInvite(inviteEmail, inviteRole)
    setInviteEmail("")
    setInviteRole("Developer")
    setIsInviteDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Team Management</h1>
            <p className="text-zinc-400 mt-1">Manage your team members and their permissions</p>
          </div>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-zinc-200">
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-white">Invite Team Member</DialogTitle>
                <DialogDescription className="text-zinc-400">Send an invitation to join your team</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-white">
                    Role
                  </Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="Developer">Developer</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(false)}
                  className="border-zinc-700 text-zinc-300"
                >
                  Cancel
                </Button>
                <Button onClick={handleSendInvite} className="bg-white text-black hover:bg-zinc-200">
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="bg-zinc-900 border-zinc-800">
            <TabsTrigger value="members" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Team Members ({teamMembers.length})
            </TabsTrigger>
            <TabsTrigger value="invites" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Pending Invites ({pendingInvites.length})
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Role Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            {/* Team Members */}
            <div className="grid gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback className="bg-zinc-800 text-white">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{member.name}</h3>
                            {getRoleIcon(member.role)}
                          </div>
                          <p className="text-zinc-400 text-sm">{member.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {member.joinedAt}
                            </span>
                            <span className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              {member.lastActive}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
                          <p className="text-xs text-zinc-500 mt-1">Access to {member.vaultsAccess} vaults</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                            <DropdownMenuItem className="text-white hover:bg-zinc-700">
                              Edit Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-zinc-700">View Activity</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => removeMember(member.id)}
                              className="text-red-400 hover:bg-zinc-700"
                            >
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invites" className="space-y-6">
            <div className="grid gap-4">
              {pendingInvites.map((invite) => (
                <Card key={invite.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Mail className="h-6 w-6 text-zinc-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{invite.email}</h3>
                          <p className="text-zinc-400 text-sm">Invited by {invite.invitedBy}</p>
                          <p className="text-xs text-zinc-500 mt-1">Sent on {invite.invitedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getRoleBadgeColor(invite.role)}>{invite.role}</Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 bg-transparent">
                            Resend
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Owner
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Full access to all features and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li>• Manage team members and permissions</li>
                    <li>• Create and delete vaults</li>
                    <li>• Access all API keys and secrets</li>
                    <li>• Billing and subscription management</li>
                    <li>• Export and backup data</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Admin
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Manage team and most vault operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li>• Invite and manage team members</li>
                    <li>• Create and manage assigned vaults</li>
                    <li>• View team activity logs</li>
                    <li>• Manage API keys in assigned vaults</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-zinc-400" />
                    Developer
                  </CardTitle>
                  <CardDescription className="text-zinc-400">Access to assigned vaults and keys</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li>• View and use assigned API keys</li>
                    <li>• Create keys in assigned vaults</li>
                    <li>• View own activity logs</li>
                    <li>• Access CLI and SDK tools</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
