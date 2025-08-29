"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Shield } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="text-zinc-400 mt-1">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription className="text-zinc-400">Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">
                Full Name
              </Label>
              <Input id="name" defaultValue="John Doe" className="bg-zinc-900 border-zinc-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue="john@example.com"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <Button className="bg-white text-black hover:bg-zinc-200">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Plan</span>
              <Badge className="bg-zinc-700 text-zinc-300">Free</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Vaults</span>
              <span className="text-white">4 / 1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">API Keys</span>
              <span className="text-white">11 / 10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Member since</span>
              <span className="text-white">Jan 2024</span>
            </div>
            <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
