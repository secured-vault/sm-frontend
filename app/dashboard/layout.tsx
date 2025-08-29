"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Vault,
  Key,
  Settings,
  User,
  Menu,
  X,
  ScrollText,
  MessageCircle,
  Users,
  BarChart3,
  Shield,
  CheckCircle,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Vaults",
    href: "/dashboard",
    icon: Vault,
  },
  {
    title: "API Keys",
    href: "/dashboard/keys",
    icon: Key,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Monitoring",
    href: "/dashboard/monitoring",
    icon: Shield,
  },
  {
    title: "Approvals",
    href: "/dashboard/approvals",
    icon: CheckCircle,
  },
  {
    title: "Logs",
    href: "/dashboard/logs",
    icon: ScrollText,
  },
  {
    title: "Developer Chat",
    href: "/dashboard/chat",
    icon: MessageCircle,
  },
]

const bottomItems = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:bg-zinc-800/50 backdrop-blur-sm border border-zinc-800/50"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-zinc-950/95 to-black/95 backdrop-blur-xl border-r border-zinc-800/50 transform transition-all duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-zinc-800/50">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 relative">
                <Image src="/secured-logo.png" alt="Secured" fill className="object-contain" />
              </div>
              <div>
                <div className="text-xl font-semibold group-hover:text-zinc-300 transition-colors">Secured</div>
                <div className="text-xs text-zinc-500">API Key Management</div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-zinc-800 to-zinc-800/50 text-white shadow-lg border border-zinc-700/50"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/30 hover:border-zinc-700/30 border border-transparent",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isActive ? "text-white" : "group-hover:scale-110",
                    )}
                  />
                  <span className="font-medium">{item.title}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-zinc-800/50 space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-zinc-800 to-zinc-800/50 text-white shadow-lg border border-zinc-700/50"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/30 hover:border-zinc-700/30 border border-transparent",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isActive ? "text-white" : "group-hover:scale-110",
                    )}
                  />
                  <span className="font-medium">{item.title}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
