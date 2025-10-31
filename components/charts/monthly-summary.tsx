"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Transaction {
  date: string
  type: "income" | "expense"
  amount: number
}

export default function MonthlySummary({ transactions }: { transactions: Transaction[] }) {
  // Group by month
  const monthlyData = transactions.reduce(
    (acc, tx) => {
      const monthKey = tx.date.slice(0, 7)
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, income: 0, expenses: 0 }
      }
      if (tx.type === "income") {
        acc[monthKey].income += tx.amount
      } else {
        acc[monthKey].expenses += tx.amount
      }
      return acc
    },
    {} as Record<string, { month: string; income: number; expenses: number }>,
  )

  const data = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12) // Last 12 months
    .map((d) => ({
      month: new Date(d.month).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      ...d,
    }))

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Monthly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="var(--primary)" />
              <Bar dataKey="expenses" fill="var(--destructive)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
