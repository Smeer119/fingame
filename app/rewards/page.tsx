"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Award, Zap } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"
import AchievementBadge from "@/components/achievement-badge"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  unlocked: boolean
  unlockedDate?: string
  condition: string
}

export default function RewardsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [lessons, setLessons] = useState([])

  useEffect(() => {
    setMounted(true)

    // Load data
    const savedAchievements = localStorage.getItem("achievements")
    const savedPoints = localStorage.getItem("reward-points")
    const savedTransactions = localStorage.getItem("transactions")
    const savedLessons = localStorage.getItem("lessons")

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions))
    if (savedLessons) setLessons(JSON.parse(savedLessons))

    const defaultAchievements: Achievement[] = [
      {
        id: "first-transaction",
        name: "First Step",
        description: "Record your first transaction",
        icon: "🎯",
        points: 10,
        unlocked: false,
        condition: "recorded_first_transaction",
      },
      {
        id: "tracking-master",
        name: "Tracking Master",
        description: "Record 10 transactions",
        icon: "📊",
        points: 25,
        unlocked: false,
        condition: "recorded_10_transactions",
      },
      {
        id: "savings-hero",
        name: "Savings Hero",
        description: "Save $500 or more",
        icon: "💰",
        points: 50,
        unlocked: false,
        condition: "saved_500",
      },
      {
        id: "learning-enthusiast",
        name: "Learning Enthusiast",
        description: "Complete your first lesson",
        icon: "📚",
        points: 20,
        unlocked: false,
        condition: "completed_first_lesson",
      },
      {
        id: "knowledge-seeker",
        name: "Knowledge Seeker",
        description: "Complete 3 lessons",
        icon: "🧠",
        points: 40,
        unlocked: false,
        condition: "completed_3_lessons",
      },
      {
        id: "finance-expert",
        name: "Finance Expert",
        description: "Complete all lessons",
        icon: "🏆",
        points: 100,
        unlocked: false,
        condition: "completed_all_lessons",
      },
      {
        id: "game-player",
        name: "Game Player",
        description: "Play a mini-game",
        icon: "🎮",
        points: 15,
        unlocked: false,
        condition: "played_game",
      },
      {
        id: "budget-master",
        name: "Budget Master",
        description: "Score 400+ on Budget Master game",
        icon: "💡",
        points: 75,
        unlocked: false,
        condition: "budget_master_400",
      },
      {
        id: "consistent-tracker",
        name: "Consistent Tracker",
        description: "Track expenses for 7 consecutive days",
        icon: "🔥",
        points: 35,
        unlocked: false,
        condition: "7_day_streak",
      },
      {
        id: "financial-freedom",
        name: "Financial Freedom",
        description: "Reach 50% savings rate",
        icon: "✨",
        points: 60,
        unlocked: false,
        condition: "50_percent_savings_rate",
      },
    ]

    let loadedAchievements = savedAchievements ? JSON.parse(savedAchievements) : defaultAchievements
    const points = savedPoints ? Number.parseInt(savedPoints) : 0

    // Check and unlock achievements
    loadedAchievements = checkAchievements(loadedAchievements, transactions, lessons, points)

    const unlockedPoints = loadedAchievements.reduce(
      (sum: number, a: Achievement) => (a.unlocked ? sum + a.points : sum),
      0,
    )

    setAchievements(loadedAchievements)
    setTotalPoints(unlockedPoints)
    setLevel(Math.floor(unlockedPoints / 100) + 1)

    localStorage.setItem("achievements", JSON.stringify(loadedAchievements))
    localStorage.setItem("reward-points", unlockedPoints.toString())
  }, [])

  const checkAchievements = (achvs: Achievement[], txns: any[], lesns: any[], pts: number): Achievement[] => {
    return achvs.map((achievement) => {
      if (achievement.unlocked) return achievement

      let shouldUnlock = false

      if (achievement.condition === "recorded_first_transaction" && txns.length >= 1) {
        shouldUnlock = true
      }
      if (achievement.condition === "recorded_10_transactions" && txns.length >= 10) {
        shouldUnlock = true
      }

      const totalIncome = txns
        .filter((t: any) => t.type === "income")
        .reduce((sum: number, t: any) => sum + t.amount, 0)
      const totalExpenses = txns
        .filter((t: any) => t.type === "expense")
        .reduce((sum: number, t: any) => sum + t.amount, 0)

      if (achievement.condition === "saved_500" && totalIncome - totalExpenses >= 500) {
        shouldUnlock = true
      }
      if (achievement.condition === "completed_first_lesson" && lesns.some((l: any) => l.completed)) {
        shouldUnlock = true
      }
      if (achievement.condition === "completed_3_lessons" && lesns.filter((l: any) => l.completed).length >= 3) {
        shouldUnlock = true
      }
      if (achievement.condition === "completed_all_lessons" && lesns.every((l: any) => l.completed)) {
        shouldUnlock = true
      }

      if (shouldUnlock) {
        return {
          ...achievement,
          unlocked: true,
          unlockedDate: new Date().toISOString(),
        }
      }

      return achievement
    })
  }

  if (!mounted) return null

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const nextLevelPoints = level * 100
  const pointsToNextLevel = nextLevelPoints - totalPoints

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardNav />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-foreground">Rewards & Achievements</h1>
              <p className="text-muted-foreground mt-2">
                Unlock achievements and earn points as you progress on your financial journey.
              </p>
            </div>

            {/* Level & Points Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level Card */}
              <Card className="border border-border bg-gradient-to-br from-primary/10 to-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" /> Current Level
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-5xl font-bold text-primary">{level}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{totalPoints} pts</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${((totalPoints % 100) / 100) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pointsToNextLevel} points to level {level + 1}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Total Points */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" /> Total Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-accent">{totalPoints}</div>
                  <p className="text-muted-foreground text-sm mt-2">from {unlockedCount} achievements</p>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" /> Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-primary">
                    {unlockedCount}/{achievements.length}
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">{achievements.length - unlockedCount} to unlock</p>
                </CardContent>
              </Card>
            </div>

            {/* Achievements Grid */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Unlock Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>

            {/* Badges Showcase */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Your Badges</CardTitle>
                <CardDescription>Achievements you've already unlocked</CardDescription>
              </CardHeader>
              <CardContent>
                {achievements.filter((a) => a.unlocked).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Complete tasks and lessons to unlock your first badge!
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {achievements
                      .filter((a) => a.unlocked)
                      .map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex flex-col items-center gap-2 p-4 rounded-lg bg-primary/10 border border-primary/20 hover:shadow-md transition"
                        >
                          <div className="text-5xl">{achievement.icon}</div>
                          <div className="text-center">
                            <p className="font-semibold text-sm text-foreground">{achievement.name}</p>
                            <p className="text-xs text-muted-foreground">+{achievement.points} pts</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border border-border bg-secondary/5">
              <CardHeader>
                <CardTitle className="text-base">Pro Tips to Level Up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">1.</span>
                  <p className="text-sm text-muted-foreground">
                    Track all your transactions to unlock tracking achievements
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">2.</span>
                  <p className="text-sm text-muted-foreground">Complete lessons to earn knowledge badges and points</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">3.</span>
                  <p className="text-sm text-muted-foreground">Play mini-games and score high for bonus achievements</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">4.</span>
                  <p className="text-sm text-muted-foreground">
                    Maintain a high savings rate to unlock financial achievements
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
