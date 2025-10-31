"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SavingsGame() {
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing")
  const [balance, setBalance] = useState(0)
  const [goal] = useState(1000)
  const [month, setMonth] = useState(1)
  const [decisions, setDecisions] = useState<string[]>([])
  const [monthlyIncome] = useState(500)

  const scenarios = [
    {
      description: "There's a sale on electronics. Buy a $200 gadget?",
      spend: 200,
      reward: "You decided against impulse buying. +$150 to savings!",
      decision: "Saved",
    },
    {
      description: "Your friends invite you to an expensive dinner. Go?",
      spend: 80,
      reward: "You cooked at home instead. +$80 to savings!",
      decision: "Declined",
    },
    {
      description: "New software subscription for $30/month. Subscribe?",
      spend: 30,
      reward: "You found a free alternative. +$30 to savings!",
      decision: "Passed",
    },
    {
      description: "Car needs maintenance: $150. Get it fixed?",
      spend: -150,
      reward: "Maintenance prevents bigger issues. +$0 (investment in future)",
      decision: "Invested",
    },
  ]

  const currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)]

  const handleChoice = (spent: boolean) => {
    if (spent) {
      const newBalance = balance + monthlyIncome - currentScenario.spend
      setBalance(Math.max(0, newBalance))
      setDecisions([...decisions, `Month ${month}: ${currentScenario.decision}`])

      if (newBalance <= 0) {
        setGameState("lost")
      } else if (newBalance >= goal) {
        setGameState("won")
      } else {
        setMonth(month + 1)
      }
    } else {
      const newBalance = balance + monthlyIncome
      setBalance(newBalance)
      setDecisions([...decisions, `Month ${month}: Saved`])

      if (newBalance >= goal) {
        setGameState("won")
      } else {
        setMonth(month + 1)
      }
    }
  }

  if (gameState === "won") {
    return (
      <Card className="border border-border bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">You Won!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-lg font-semibold text-foreground">Goal: ${goal}</p>
            <p className="text-lg font-semibold text-primary">Final Balance: ${balance}</p>
            <p className="text-muted-foreground mt-2">Reached your goal in {month} months!</p>
          </div>
          <div className="bg-card p-4 rounded-lg space-y-2">
            <p className="font-semibold text-foreground text-sm">Your Journey:</p>
            {decisions.map((d, i) => (
              <p key={i} className="text-xs text-muted-foreground">
                {d}
              </p>
            ))}
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (gameState === "lost") {
    return (
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Game Over</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">You ran out of money! Remember: every dollar counts.</p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Savings Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">
                ${balance} / ${goal}
              </span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${(balance / goal) * 100}%` }} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Month</p>
              <p className="text-2xl font-bold text-foreground">{month}</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold text-primary">${balance}</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Monthly Income</p>
              <p className="text-2xl font-bold text-foreground">${monthlyIncome}</p>
            </div>
          </div>

          {/* Scenario */}
          <div className="p-4 bg-card border border-border rounded-lg">
            <p className="text-lg font-semibold text-foreground mb-4">{currentScenario.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleChoice(true)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Yes (-${currentScenario.spend})
              </Button>
              <Button
                onClick={() => handleChoice(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                No - Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
