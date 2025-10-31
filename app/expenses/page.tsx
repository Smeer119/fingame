"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, TrendingDown, TrendingUp, Upload, Loader2 } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"
import ExpenseChart from "@/components/expense-chart"

interface Transaction {
  id: string
  description: string
  amount: number
  category: "income" | "food" | "utilities" | "entertainment" | "transport" | "health" | "other"
  date: string
  type: "income" | "expense"
}

interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
  category: string
}

interface InvestmentPlan {
  dailyAmount: number
  projectedMonth: number
  projectedYear: number
}

const categoryColors: Record<string, string> = {
  food: "bg-orange-100 text-orange-700",
  utilities: "bg-blue-100 text-blue-700",
  entertainment: "bg-purple-100 text-purple-700",
  transport: "bg-green-100 text-green-700",
  health: "bg-red-100 text-red-700",
  income: "bg-primary/10 text-primary",
  other: "bg-gray-100 text-gray-700",
}

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [mounted, setMounted] = useState(false)
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("food")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [showReceiptUpload, setShowReceiptUpload] = useState(false)
  const [receiptLoading, setReceiptLoading] = useState(false)
  const [showGoals, setShowGoals] = useState(false)
  const [showInvestment, setShowInvestment] = useState(false)
  const [investmentPlan, setInvestmentPlan] = useState<InvestmentPlan>({
    dailyAmount: 10,
    projectedMonth: 300,
    projectedYear: 3650,
  })

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("transactions")
    if (saved) {
      setTransactions(JSON.parse(saved))
    }
    const savedGoals = localStorage.getItem("financial-goals")
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("transactions", JSON.stringify(transactions))
    }
  }, [transactions, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("financial-goals", JSON.stringify(goals))
    }
  }, [goals, mounted])

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setReceiptLoading(true)
    // Simulate AI processing with a delay
    setTimeout(() => {
      // Mock AI extraction of receipt data
      const mockExtracts = [
        { desc: "Grocery Store", amt: 45.99, cat: "food" },
        { desc: "Gas Station", amt: 52.5, cat: "transport" },
        { desc: "Restaurant", amt: 28.75, cat: "food" },
      ]
      const extracted = mockExtracts[Math.floor(Math.random() * mockExtracts.length)]

      setDescription(extracted.desc)
      setAmount(extracted.amt.toString())
      setCategory(extracted.cat)
      setShowReceiptUpload(false)
      setReceiptLoading(false)
    }, 1500)
  }

  const handleAddTransaction = () => {
    if (!description || !amount) return

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount: Number.parseFloat(amount),
      category: type === "income" ? "income" : (category as any),
      date: new Date().toISOString().split("T")[0],
      type,
    }

    setTransactions([newTransaction, ...transactions])
    setDescription("")
    setAmount("")
    setCategory("food")
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((tx) => tx.id !== id))
  }

  const handleInvestmentChange = (dailyAmount: number) => {
    const monthlyAmount = dailyAmount * 30
    const yearlyAmount = dailyAmount * 365
    setInvestmentPlan({
      dailyAmount,
      projectedMonth: monthlyAmount,
      projectedYear: yearlyAmount,
    })
  }

  if (!mounted) return null

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netBalance = totalIncome - totalExpenses

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardNav />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-foreground">Expense & Income Tracker</h1>
              <p className="text-muted-foreground mt-2">Track every transaction to understand your spending habits</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Total Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">${totalIncome.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-destructive" /> Total Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">${totalExpenses.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${netBalance >= 0 ? "text-primary" : "text-destructive"}`}>
                    ${netBalance.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Transaction Form */}
              <Card className="lg:col-span-1 border border-border">
                <CardHeader>
                  <CardTitle className="text-base">Add Transaction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Type</label>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setType("expense")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                          type === "expense"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        Expense
                      </button>
                      <button
                        onClick={() => setType("income")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                          type === "income"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        Income
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <Input
                      placeholder="e.g., Grocery shopping"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-2 border border-input bg-input"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Amount</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-2 border border-input bg-input"
                    />
                  </div>

                  {type === "expense" && (
                    <div>
                      <label className="text-sm font-medium text-foreground">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-input bg-input rounded-lg text-sm text-foreground"
                      >
                        <option value="food">Food</option>
                        <option value="utilities">Utilities</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="transport">Transport</option>
                        <option value="health">Health</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  )}

                  <Button
                    onClick={handleAddTransaction}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Transaction
                  </Button>

                  <div className="border-t pt-4">
                    <label className="text-sm font-medium text-foreground block mb-2">Upload Receipt (AI)</label>
                    <label className="w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        disabled={receiptLoading}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition text-center">
                        {receiptLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-xs text-muted-foreground">Extracting...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Upload receipt</span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions List & Chart */}
              <div className="lg:col-span-2 space-y-6">
                <ExpenseChart transactions={transactions} />

                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Transaction History</CardTitle>
                    <CardDescription>{transactions.length} total transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {transactions.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No transactions yet. Add one to get started!
                        </p>
                      ) : (
                        transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm text-foreground">{tx.description}</p>
                              <div className="flex gap-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded ${categoryColors[tx.category]}`}>
                                  {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                                </span>
                                <span className="text-xs text-muted-foreground">{tx.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`font-semibold text-sm ${
                                  tx.type === "income" ? "text-primary" : "text-foreground"
                                }`}
                              >
                                {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                              </span>
                              <button
                                onClick={() => handleDeleteTransaction(tx.id)}
                                className="text-muted-foreground hover:text-destructive transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Goals Section */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-base">Financial Goals</CardTitle>
                <CardDescription>Set and track your savings goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No goals set yet. Add one to get started!</p>
                ) : (
                  <div className="space-y-3">
                    {goals.map((goal) => (
                      <div key={goal.id} className="p-3 rounded-lg border border-border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-foreground">{goal.name}</p>
                            <p className="text-xs text-muted-foreground">Deadline: {goal.deadline}</p>
                          </div>
                          <button
                            onClick={() => setGoals(goals.filter((g) => g.id !== goal.id))}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(goal.current / goal.target) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    const goalName = prompt("Goal name (e.g., Emergency Fund):")
                    const goalAmount = prompt("Target amount:")
                    const goalDeadline = prompt("Deadline (YYYY-MM-DD):")

                    if (goalName && goalAmount && goalDeadline) {
                      const newGoal: Goal = {
                        id: Date.now().toString(),
                        name: goalName,
                        target: Number.parseFloat(goalAmount),
                        current: 0,
                        deadline: goalDeadline,
                        category: "savings",
                      }
                      setGoals([...goals, newGoal])
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Goal
                </Button>
              </CardContent>
            </Card>

            {/* Investment Calculator */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-base">Daily Investment Calculator</CardTitle>
                <CardDescription>See how much you'll save by investing daily</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Daily Amount: ${investmentPlan.dailyAmount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={investmentPlan.dailyAmount}
                    onChange={(e) => handleInvestmentChange(Number.parseInt(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs text-muted-foreground">Monthly Projection</p>
                    <p className="text-xl font-bold text-primary">${investmentPlan.projectedMonth.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <p className="text-xs text-muted-foreground">Yearly Projection</p>
                    <p className="text-xl font-bold text-accent">${investmentPlan.projectedYear.toFixed(2)}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  If you save ${investmentPlan.dailyAmount}/day, you'll have ${investmentPlan.projectedMonth.toFixed(0)}{" "}
                  by end of month and ${investmentPlan.projectedYear.toFixed(0)} by year-end!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
