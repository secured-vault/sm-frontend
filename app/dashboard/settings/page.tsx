"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Bell, Trash2 } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* Security Settings */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription className="text-zinc-400">Configure your security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-zinc-300">Two-Factor Authentication</Label>
                <p className="text-sm text-zinc-500">Add an extra layer of security</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-zinc-300">Auto-lock Vaults</Label>
                <p className="text-sm text-zinc-500">Lock vaults after inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button className="bg-white text-black hover:bg-zinc-200">Change Password</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription className="text-zinc-400">Choose what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-zinc-300">Security Alerts</Label>
                <p className="text-sm text-zinc-500">Get notified of security events</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-zinc-300">Usage Reports</Label>
                <p className="text-sm text-zinc-500">Weekly usage summaries</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-zinc-950 border-red-900/20">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-zinc-400">Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
