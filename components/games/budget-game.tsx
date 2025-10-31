"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BudgetCategory {
  name: string
  limit: number
  spent: number
}

export default function BudgetGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [totalIncome] = useState(3000)
  const [allocated, setAllocated] = useState(0)
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { name: "Housing", limit: 900, spent: 0 },
    { name: "Food", limit: 400, spent: 0 },
    { name: "Transport", limit: 200, spent: 0 },
    { name: "Entertainment", limit: 200, spent: 0 },
    { name: "Utilities", limit: 150, spent: 0 },
    { name: "Savings", limit: 300, spent: 0 },
  ])

  const handleBudgetChange = (index: number, value: number) => {
    const newCategories = [...categories]
    const diff = value - newCategories[index].limit
    newCategories[index].limit = value
    setCategories(newCategories)
    setAllocated(allocated + diff)
  }

  const handleCompleteBudget = () => {
    const totalAllocated = categories.reduce((sum, cat) => sum + cat.limit, 0)
    let gameScore = 0

    if (totalAllocated === totalIncome) {
      gameScore += 100
    } else if (totalAllocated < totalIncome) {
      gameScore += Math.floor((totalAllocated / totalIncome) * 80)
    } else {
      gameScore = Math.max(0, Math.floor(((totalIncome / totalAllocated) * 100 - 50) * 0.8))
    }

    const optimalAllocation = {
      Housing: 900,
      Food: 400,
      Transport: 200,
      Entertainment: 200,
      Utilities: 150,
      Savings: 150,
    }

    categories.forEach((cat) => {
      const optimal = optimalAllocation[cat.name as keyof typeof optimalAllocation] || 0
      if (Math.abs(cat.limit - optimal) < 50) {
        gameScore += 20
      }
    })

    setScore(Math.min(gameScore, 500))
    setGameStarted(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Budget Master</h2>
        <p className="text-muted-foreground">
          You have ${totalIncome} monthly income. Allocate it wisely across categories to maximize your score!
        </p>
      </div>

      {!gameStarted ? (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Monthly Budget Allocation</span>
              <span className="text-lg text-primary">
                ${totalIncome - allocated} / ${totalIncome}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category, index) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground">{category.name}</label>
                  <span className="text-sm text-muted-foreground">${category.limit}</span>
                </div>
                <Input
                  type="number"
                  min="0"
                  value={category.limit}
                  onChange={(e) => handleBudgetChange(index, Number(e.target.value))}
                  className="border border-input bg-input"
                />
              </div>
            ))}

            <div className="pt-4">
              <div className="mb-4 p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground">Total Allocated</div>
                <div
                  className={`text-2xl font-bold ${
                    allocated === 0 ? "text-foreground" : allocated <= totalIncome ? "text-primary" : "text-destructive"
                  }`}
                >
                  ${allocated}
                </div>
              </div>

              <Button
                onClick={handleCompleteBudget}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Submit Budget
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border bg-primary/5">
          <CardHeader>
            <CardTitle>Your Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">{score}</div>
              <p className="text-muted-foreground">out of 500 points</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                {score >= 400
                  ? "Excellent budgeting skills!"
                  : "Good effort! Try to align your budget with recommended allocations."}
              </p>
            </div>
            <Button
              onClick={() => {
                setGameStarted(false)
                setScore(0)
                setAllocated(0)
                setCategories([
                  { name: "Housing", limit: 900, spent: 0 },
                  { name: "Food", limit: 400, spent: 0 },
                  { name: "Transport", limit: 200, spent: 0 },
                  { name: "Entertainment", limit: 200, spent: 0 },
                  { name: "Utilities", limit: 150, spent: 0 },
                  { name: "Savings", limit: 300, spent: 0 },
                ])
              }}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
