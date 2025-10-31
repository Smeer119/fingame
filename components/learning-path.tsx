"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

const lessons = [
  { id: 1, title: "Budgeting Basics", completed: true },
  { id: 2, title: "Saving Strategies", completed: true },
  { id: 3, title: "Investment 101", completed: false },
  { id: 4, title: "Debt Management", completed: false },
]

export default function LearningPath() {
  const completed = lessons.filter((l) => l.completed).length
  const progress = (completed / lessons.length) * 100

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-base">Learning Path</CardTitle>
        <CardDescription>Your progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
            >
              {lesson.completed ? (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <span
                className={`text-sm ${lesson.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {lesson.title}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
