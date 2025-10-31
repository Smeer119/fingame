"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Target, Trophy, Plus, Gamepad2, MessageCircle } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"
import FinancialOverview from "@/components/financial-overview"
import RecentTransactions from "@/components/recent-transactions"
import LearningPath from "@/components/learning-path"

export default function Page() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [finances, setFinances] = useState({
    balance: 2450,
    income: 3200,
    expenses: 750,
    savings: 1500,
    streak: 12,
    level: 4,
  })

  const dailyChallenges = [
    {
      id: 1,
      title: "Track Your Spending",
      description: "Log 5 transactions today",
      icon: "📊",
      reward: 50,
    },
    {
      id: 2,
      title: "Save Daily Goal",
      description: "Save $10 today",
      icon: "💰",
      reward: 25,
    },
    {
      id: 3,
      title: "Learn Something New",
      description: "Complete one lesson",
      icon: "📚",
      reward: 75,
    },
  ]

  useEffect(() => {
    setMounted(true)
    // Load from localStorage
    const saved = localStorage.getItem("finances")
    if (saved) {
      setFinances(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("finances", JSON.stringify(finances))
    }
  }, [finances, mounted])

  if (!mounted) return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardNav />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Welcome, Learner</h1>
              <p className="text-muted-foreground">
                Master your finances through interactive learning and real-world practice.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <span className="text-primary">💰</span> Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${finances.balance}</div>
                  <p className="text-xs text-muted-foreground mt-1">+$200 this month</p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${finances.income}</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent" /> Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${finances.savings}</div>
                  <p className="text-xs text-muted-foreground mt-1">46.8% of income</p>
                </CardContent>
              </Card>

              <Card className="border border-border bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" /> Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{finances.level}</div>
                  <p className="text-xs text-muted-foreground mt-1">{finances.streak} day streak 🔥</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <FinancialOverview />
                <RecentTransactions />
              </div>

              <div className="space-y-6">
                <LearningPath />

                {/* Quick Actions */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      onClick={() => router.push('/expenses')}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Transaction
                    </Button>
                    <Button 
                      onClick={() => router.push('/games')}
                      variant="outline" 
                      className="w-full bg-transparent flex gap-2"
                    >
                      <Gamepad2 className="w-4 h-4" /> Play Mini-Game
                    </Button>
                    <Button 
                      onClick={() => router.push('/assistant')}
                      variant="outline" 
                      className="w-full bg-transparent flex gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat with AI
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
