"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Portfolio {
  name: string
  symbol: string
  amount: number
  growth: number
  value: number
}

export default function InvestmentGame() {
  const [gameEnded, setGameEnded] = useState(false)
  const [portfolio, setPortfolio] = useState<Portfolio[]>([
    { name: "Stocks", symbol: "STK", amount: 0, growth: 0.08, value: 0 },
    { name: "Bonds", symbol: "BND", amount: 0, growth: 0.03, value: 0 },
    { name: "Real Estate", symbol: "RES", amount: 0, growth: 0.05, value: 0 },
    { name: "Cash", symbol: "CASH", amount: 5000, growth: 0, value: 5000 },
  ])

  const totalValue = portfolio.reduce((sum, p) => sum + p.value, 0)
  const investedAmount = portfolio.slice(0, 3).reduce((sum, p) => sum + p.amount, 0)

  const handleInvest = (index: number, amount: number) => {
    const cashIndex = portfolio.findIndex((p) => p.symbol === "CASH")
    if (portfolio[cashIndex].amount < amount) return

    const newPortfolio = [...portfolio]
    newPortfolio[index].amount += amount
    newPortfolio[index].value = newPortfolio[index].amount * (1 + newPortfolio[index].growth)
    newPortfolio[cashIndex].amount -= amount
    newPortfolio[cashIndex].value = newPortfolio[cashIndex].amount

    setPortfolio(newPortfolio)
  }

  const handleSimulateYear = () => {
    const newPortfolio = portfolio.map((p) => ({
      ...p,
      value: p.symbol === "CASH" ? p.value : p.value * (1 + p.growth + (Math.random() * 0.1 - 0.05)), // Add volatility
    }))
    setPortfolio(newPortfolio)
  }

  const handleFinish = () => {
    setGameEnded(true)
  }

  if (gameEnded) {
    const finalValue = portfolio.reduce((sum, p) => sum + p.value, 0)
    const gain = finalValue - 5000

    return (
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Game Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-muted-foreground text-sm mb-1">Starting Amount</p>
            <p className="text-3xl font-bold text-foreground mb-4">$5,000</p>

            <p className="text-muted-foreground text-sm mb-1">Final Amount</p>
            <p className="text-3xl font-bold text-primary">${finalValue.toFixed(2)}</p>

            <p className={`text-lg font-semibold mt-4 ${gain >= 0 ? "text-primary" : "text-destructive"}`}>
              {gain >= 0 ? "+" : ""}
              {gain.toFixed(2)} ({((gain / 5000) * 100).toFixed(1)}%)
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Final Portfolio:</p>
            {portfolio.map((p) => (
              <div key={p.symbol} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{p.name}</span>
                <span className="font-medium">${p.value.toFixed(2)}</span>
              </div>
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

  return (
    <div className="space-y-6">
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Investment Tycoon</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Allocate your $5,000 across different investments. Simulate years to see growth!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Value */}
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-muted-foreground text-sm">Total Portfolio Value</p>
            <p className="text-4xl font-bold text-primary">${totalValue.toFixed(2)}</p>
          </div>

          {/* Portfolio */}
          <div className="space-y-4">
            {portfolio.map((inv, idx) => (
              <Card key={inv.symbol} className="border border-border">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground">{inv.name}</p>
                        <p className="text-xs text-muted-foreground">{inv.growth * 100}% annual growth</p>
                      </div>
                      <p className="text-xl font-bold text-primary">${inv.value.toFixed(2)}</p>
                    </div>

                    {inv.symbol !== "CASH" && (
                      <div className="flex gap-2 pt-2">
                        {[100, 500, 1000].map((amount) => (
                          <Button
                            key={amount}
                            onClick={() => handleInvest(idx, amount)}
                            disabled={portfolio[3].amount < amount}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            +${amount}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <Button
              onClick={handleSimulateYear}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Simulate 1 Year
            </Button>
            <Button onClick={handleFinish} variant="outline" className="flex-1 bg-transparent">
              Finish Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
