"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  XCircle,
  Key,
  Vault,
  UserPlus,
  Trash2,
  Settings,
  MessageSquare,
  Calendar,
  AlertTriangle,
} from "lucide-react"

interface User {
  name: string
  email: string
  avatar?: string
}

interface ApprovalRequest {
  id: number
  type: string
  title: string
  description: string
  requestedBy: User
  requestedAt: string
  priority: string
  details: Record<string, any>
  approvers: string[]
  status: string
}

interface ApprovalHistory {
  id: number
  type: string
  title: string
  requestedBy: User
  approvedBy?: User
  rejectedBy?: User
  requestedAt: string
  approvedAt?: string
  rejectedAt?: string
  status: string
  comment?: string
}

interface WorkflowRule {
  id: number
  name: string
  description: string
  enabled: boolean
  requiredApprovers: number
  approverRoles: string[]
  autoApprove: boolean
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

const getTypeIcon = (type: string) => {
  switch (type) {
    case "vault_creation":
      return <Vault className="h-5 w-5 text-blue-500" />
    case "vault_deletion":
      return <Trash2 className="h-5 w-5 text-red-500" />
    case "team_member_add":
      return <UserPlus className="h-5 w-5 text-green-500" />
    case "key_deletion":
      return <Key className="h-5 w-5 text-yellow-500" />
    default:
      return <Settings className="h-5 w-5 text-zinc-400" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    default:
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "rejected":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    default:
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function ApprovalsPage() {
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [approvalComment, setApprovalComment] = useState("")
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([])
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([])
  const [workflowRules, setWorkflowRules] = useState<WorkflowRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchPendingApprovals = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/approvals/pending")
      if (!response.ok) throw new Error("Failed to fetch pending approvals")
      const data = await response.json()
      setPendingApprovals(data)
    } catch (error) {
      console.error("Error fetching pending approvals:", error)
      setError(true)
    }
  }

  const fetchApprovalHistory = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/approvals/history")
      if (!response.ok) throw new Error("Failed to fetch approval history")
      const data = await response.json()
      setApprovalHistory(data)
    } catch (error) {
      console.error("Error fetching approval history:", error)
      setError(true)
    }
  }

  const fetchWorkflowRules = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/approvals/workflows")
      if (!response.ok) throw new Error("Failed to fetch workflow rules")
      const data = await response.json()
      setWorkflowRules(data)
    } catch (error) {
      console.error("Error fetching workflow rules:", error)
      setError(true)
    }
  }

  const handleApprovalAction = async (action: "approve" | "reject", approvalId?: number) => {
    const id = approvalId || selectedApproval?.id
    if (!id) return

    try {
      const response = await fetch(`http://localhost:8080/api/v1/approvals/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: approvalComment }),
      })
      if (!response.ok) throw new Error(`Failed to ${action} approval`)

      // Refresh data
      await Promise.all([fetchPendingApprovals(), fetchApprovalHistory()])

      setIsDetailDialogOpen(false)
      setApprovalComment("")
    } catch (error) {
      console.error(`Error ${action}ing approval:`, error)
      setError(true)
    }
  }

  const toggleWorkflowRule = async (ruleId: number, enabled: boolean) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/approvals/workflows/${ruleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      })
      if (!response.ok) throw new Error("Failed to toggle workflow rule")

      setWorkflowRules(workflowRules.map((rule) => (rule.id === ruleId ? { ...rule, enabled } : rule)))
    } catch (error) {
      console.error("Error toggling workflow rule:", error)
      setError(true)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(false)
      try {
        await Promise.all([fetchPendingApprovals(), fetchApprovalHistory(), fetchWorkflowRules()])
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
              <p className="text-zinc-400">Loading approval data...</p>
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
            <h1 className="text-3xl font-bold text-white">Approval Workflows</h1>
            <p className="text-zinc-400 mt-1">Manage approval requests and workflow configurations</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              {pendingApprovals.length} Pending
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-zinc-900 border-zinc-800">
            <TabsTrigger value="pending" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Pending Approvals ({pendingApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Approval History
            </TabsTrigger>
            <TabsTrigger value="workflows" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              Workflow Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {pendingApprovals.length === 0 ? (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">No Pending Approvals</h3>
                  <p className="text-zinc-400">All approval requests have been processed</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingApprovals.map((approval) => (
                  <Card
                    key={approval.id}
                    className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {getTypeIcon(approval.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-semibold">{approval.title}</h3>
                              <Badge className={getPriorityColor(approval.priority)}>{approval.priority}</Badge>
                            </div>
                            <p className="text-zinc-400 text-sm mb-3">{approval.description}</p>
                            <div className="flex items-center gap-4 text-sm text-zinc-500">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={approval.requestedBy.avatar || "/placeholder.svg"}
                                    alt={approval.requestedBy.name}
                                  />
                                  <AvatarFallback className="bg-zinc-800 text-white text-xs">
                                    {approval.requestedBy.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{approval.requestedBy.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(approval.requestedAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedApproval(approval)
                              setIsDetailDialogOpen(true)
                            }}
                            className="border-zinc-700 text-zinc-300 bg-transparent"
                          >
                            Review
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprovalAction("approve", approval.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovalAction("reject", approval.id)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid gap-4">
              {approvalHistory.map((approval) => (
                <Card key={approval.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {getTypeIcon(approval.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold">{approval.title}</h3>
                            <Badge className={getStatusColor(approval.status)}>{approval.status}</Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-zinc-500 mb-3">
                            <div className="flex items-center gap-2">
                              <span>Requested by:</span>
                              <Avatar className="h-5 w-5">
                                <AvatarImage
                                  src={approval.requestedBy.avatar || "/placeholder.svg"}
                                  alt={approval.requestedBy.name}
                                />
                                <AvatarFallback className="bg-zinc-800 text-white text-xs">
                                  {approval.requestedBy.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white">{approval.requestedBy.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>{approval.status === "approved" ? "Approved by:" : "Rejected by:"}</span>
                              <Avatar className="h-5 w-5">
                                <AvatarImage
                                  src={
                                    approval.status === "approved"
                                      ? approval.approvedBy?.avatar
                                      : approval.rejectedBy?.avatar
                                  }
                                  alt={
                                    approval.status === "approved"
                                      ? approval.approvedBy?.name
                                      : approval.rejectedBy?.name
                                  }
                                />
                                <AvatarFallback className="bg-zinc-800 text-white text-xs">
                                  {(approval.status === "approved"
                                    ? approval.approvedBy?.name
                                    : approval.rejectedBy?.name
                                  )
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white">
                                {approval.status === "approved" ? approval.approvedBy?.name : approval.rejectedBy?.name}
                              </span>
                            </div>
                          </div>
                          {approval.comment && (
                            <div className="bg-zinc-800/50 p-3 rounded-lg">
                              <div className="flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 text-zinc-400 mt-0.5" />
                                <p className="text-zinc-300 text-sm">{approval.comment}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-zinc-500">
                        <p>Requested: {formatDate(approval.requestedAt)}</p>
                        <p>
                          {approval.status === "approved" ? "Approved" : "Rejected"}:{" "}
                          {formatDate(approval.status === "approved" ? approval.approvedAt! : approval.rejectedAt!)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <div className="grid gap-4">
              {workflowRules.map((rule) => (
                <Card key={rule.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(enabled) => toggleWorkflowRule(rule.id, enabled)}
                        />
                        <div>
                          <h3 className="text-white font-semibold">{rule.name}</h3>
                          <p className="text-zinc-400 text-sm">{rule.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                            <span>Required approvers: {rule.requiredApprovers}</span>
                            <span>Roles: {rule.approverRoles.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Approval Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                {selectedApproval && getTypeIcon(selectedApproval.type)}
                {selectedApproval?.title}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">{selectedApproval?.description}</DialogDescription>
            </DialogHeader>
            {selectedApproval && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Requested by</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={selectedApproval.requestedBy.avatar || "/placeholder.svg"}
                          alt={selectedApproval.requestedBy.name}
                        />
                        <AvatarFallback className="bg-zinc-800 text-white text-xs">
                          {selectedApproval.requestedBy.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white text-sm">{selectedApproval.requestedBy.name}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Priority</Label>
                    <div className="mt-1">
                      <Badge className={getPriorityColor(selectedApproval.priority)}>{selectedApproval.priority}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-white">Request Details</Label>
                  <div className="mt-2 bg-zinc-800/50 p-4 rounded-lg space-y-2">
                    {Object.entries(selectedApproval.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-zinc-400 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                        <span className="text-white">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="approval-comment" className="text-white">
                    Comment (Optional)
                  </Label>
                  <Textarea
                    id="approval-comment"
                    placeholder="Add a comment about your decision..."
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDetailDialogOpen(false)}
                className="border-zinc-700 text-zinc-300"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleApprovalAction("reject")}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button onClick={() => handleApprovalAction("approve")} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
