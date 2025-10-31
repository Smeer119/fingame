"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"
import BudgetGame from "@/components/games/budget-game"
import SavingsGame from "@/components/games/savings-game"
import InvestmentGame from "@/components/games/investment-game"

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const games = [
    {
      id: "budget",
      title: "Budget Master",
      description: "Allocate your monthly income to different categories and see if you stay within budget.",
      icon: "📊",
      component: BudgetGame,
    },
    {
      id: "savings",
      title: "Savings Challenge",
      description: "Make smart spending decisions to reach your savings goal before time runs out.",
      icon: "🎯",
      component: SavingsGame,
    },
    {
      id: "investment",
      title: "Investment Tycoon",
      description: "Learn about diversification by managing a portfolio of different investments.",
      icon: "📈",
      component: InvestmentGame,
    },
  ]

  const game = games.find((g) => g.id === selectedGame)
  const GameComponent = game?.component

  if (selectedGame && GameComponent) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardNav />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <button
              onClick={() => setSelectedGame(null)}
              className="flex items-center gap-2 text-primary hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Games
            </button>
            <GameComponent />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardNav />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Interactive Mini-Games</h1>
              <p className="text-muted-foreground mt-2">
                Learn financial concepts through fun, interactive games that reward your knowledge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <Card
                  key={game.id}
                  className="border border-border hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedGame(game.id)}
                >
                  <CardHeader>
                    <div className="text-4xl mb-3">{game.icon}</div>
                    <CardTitle className="text-lg">{game.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{game.description}</p>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Play Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
