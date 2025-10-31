"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Gamepad2, BookOpen, MessageCircle, TrendingUp } from "lucide-react"

const navigation = [
  { label: "Dashboard", href: "/", icon: BarChart3 },
  { label: "Expenses", href: "/expenses", icon: TrendingUp },
  { label: "Games", href: "/games", icon: Gamepad2 },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "AI Assistant", href: "/assistant", icon: MessageCircle },
]

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 border-r border-border bg-sidebar p-6 overflow-y-auto">
      {/* Logo */}
      <div className="mb-8 pb-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">FinLearn</h1>
        <p className="text-xs text-muted-foreground mt-1">Master Money Management</p>
      </div>

      {/* Main Navigation */}
      <div className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-6 left-6 right-6 space-y-4">
        <div className="p-4 rounded-lg bg-sidebar-accent/10 border border-sidebar-border">
          <h3 className="font-semibold text-sm text-sidebar-foreground">Today's Challenge</h3>
          <p className="text-xs text-muted-foreground mt-2">Track your spending for a bonus reward</p>
          <button className="mt-3 text-xs font-semibold text-sidebar-primary">Start Challenge</button>
        </div>
      </div>
    </nav>
  )
}
