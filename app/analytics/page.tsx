"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardNav from "@/components/dashboard-nav"
import MonthlySummary from "@/components/charts/monthly-summary"
import SpendingTrends from "@/components/charts/spending-trends"
import CategoricalAnalysis from "@/components/charts/categorical-analysis"
import IncomeVsExpenses from "@/components/charts/income-vs-expenses"

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
  type: "income" | "expense"
}

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("transactions")
    if (saved) {
      setTransactions(JSON.parse(saved))
    }
  }, [])

  if (!mounted) return null

  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth))
  const totalIncome = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardNav />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-foreground">Analytics & Insights</h1>
              <p className="text-muted-foreground mt-2">Visualize your financial data and track trends over time.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">This Month Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">${totalIncome.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">This Month Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">${totalExpenses.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Net Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${(totalIncome - totalExpenses) >= 0 ? "text-primary" : "text-destructive"}`}
                  >
                    ${(totalIncome - totalExpenses).toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{savingsRate.toFixed(1)}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncomeVsExpenses transactions={transactions} />
              <SpendingTrends transactions={transactions} />
              <CategoricalAnalysis transactions={transactions} />
              <MonthlySummary transactions={transactions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
