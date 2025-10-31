"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Transaction {
  date: string
  type: "income" | "expense"
  amount: number
}

export default function IncomeVsExpenses({ transactions }: { transactions: Transaction[] }) {
  // Group by date
  const dailyData = transactions.reduce(
    (acc, tx) => {
      if (!acc[tx.date]) {
        acc[tx.date] = { date: tx.date, income: 0, expenses: 0 }
      }
      if (tx.type === "income") {
        acc[tx.date].income += tx.amount
      } else {
        acc[tx.date].expenses += tx.amount
      }
      return acc
    },
    {} as Record<string, { date: string; income: number; expenses: number }>,
  )

  const data = Object.values(dailyData)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ...d,
    }))

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="income" type="number" name="Income" stroke="var(--muted-foreground)" />
              <YAxis dataKey="expenses" type="number" name="Expenses" stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "0.5rem",
                }}
              />
              <Scatter name="Daily" data={data} fill="var(--primary)" />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
