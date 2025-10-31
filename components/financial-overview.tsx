"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", balance: 1800, savings: 400 },
  { month: "Feb", balance: 2100, savings: 600 },
  { month: "Mar", balance: 2000, savings: 550 },
  { month: "Apr", balance: 2450, savings: 800 },
  { month: "May", balance: 2800, savings: 950 },
]

export default function FinancialOverview() {
  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Your Financial Journey</CardTitle>
        <CardDescription>Balance and savings growth over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area type="monotone" dataKey="balance" stroke="var(--primary)" fillOpacity={1} fill="url(#colorBalance)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
