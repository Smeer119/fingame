"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface Transaction {
  id: string
  category: string
  amount: number
  type: "income" | "expense"
}

const COLORS = {
  food: "oklch(0.65 0.1 30)",
  utilities: "oklch(0.55 0.1 220)",
  entertainment: "oklch(0.5 0.12 280)",
  transport: "oklch(0.6 0.12 140)",
  health: "oklch(0.5 0.15 10)",
  other: "oklch(0.7 0.05 0)",
}

export default function ExpenseChart({ transactions }: { transactions: Transaction[] }) {
  const expenses = transactions.filter((t) => t.type === "expense")

  // Group by category
  const categoryData = Object.entries(
    expenses.reduce(
      (acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Number.parseFloat(value.toFixed(2)),
  }))

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-base">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">No expense data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || COLORS.other}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
