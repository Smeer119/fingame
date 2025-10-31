"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, Zap, Utensils, Briefcase } from "lucide-react"

const transactions = [
  { id: 1, label: "Coffee Shop", amount: -5.5, type: "expense", icon: Coffee, date: "Today" },
  { id: 2, label: "Freelance Income", amount: 150, type: "income", icon: Briefcase, date: "Yesterday" },
  { id: 3, label: "Electric Bill", amount: -42.0, type: "expense", icon: Zap, date: "2 days ago" },
  { id: 4, label: "Lunch", amount: -12.3, type: "expense", icon: Utensils, date: "3 days ago" },
]

export default function RecentTransactions() {
  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => {
            const Icon = tx.icon
            const isIncome = tx.type === "income"
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isIncome ? "bg-primary/10" : "bg-muted"}`}>
                    <Icon className={`w-4 h-4 ${isIncome ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{tx.label}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <span className={`font-semibold ${isIncome ? "text-primary" : "text-foreground"}`}>
                  {isIncome ? "+" : ""}
                  {isIncome ? "$" : "-$"}
                  {Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
