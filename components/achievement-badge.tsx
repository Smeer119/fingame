"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Lock, Check } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  unlocked: boolean
  condition: string
}

export default function AchievementBadge({ achievement }: { achievement: Achievement }) {
  return (
    <Card
      className={`border transition-all ${
        achievement.unlocked
          ? "border-primary bg-primary/5 hover:shadow-md"
          : "border-border opacity-60 hover:opacity-80"
      }`}
    >
      <CardContent className="pt-6">
        <div className="text-center space-y-3">
          {/* Badge Icon */}
          <div className={`text-6xl mx-auto transition ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>
            {achievement.icon}
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="font-semibold text-foreground text-sm">{achievement.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
          </div>

          {/* Points */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-primary font-bold text-sm">+{achievement.points}</span>
            <span className="text-xs text-muted-foreground">points</span>
          </div>

          {/* Status */}
          {achievement.unlocked ? (
            <div className="flex items-center justify-center gap-1 text-primary text-xs font-semibold">
              <Check className="w-4 h-4" /> Unlocked
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
              <Lock className="w-4 h-4" /> Locked
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
