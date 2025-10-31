"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Transaction {
  date: string
  type: "income" | "expense"
  amount: number
}

export default function SpendingTrends({ transactions }: { transactions: Transaction[] }) {
  // Calculate cumulative expenses
  const sortedTx = [...transactions].sort((a, b) => a.date.localeCompare(b.date))

  const data = sortedTx
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, tx) => {
        const last = acc[acc.length - 1]
        acc.push({
          date: tx.date,
          total: (last?.total || 0) + tx.amount,
        })
        return acc
      },
      [] as Array<{ date: string; total: number }>,
    )
    .slice(-30) // Last 30 days
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ...d,
    }))

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">No expense data</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "0.5rem",
                }}
              />
              <Line type="monotone" dataKey="total" stroke="var(--destructive)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
