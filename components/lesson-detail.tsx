"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Play } from "lucide-react"

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  content: string
  videoUrl?: string
  completed: boolean
}

export default function LessonDetail({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const [completed, setCompleted] = useState(lesson.completed)

  const handleComplete = () => {
    setCompleted(true)
    onComplete()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {lesson.difficulty.toUpperCase()}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">{lesson.duration}</span>
          <span className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
            {lesson.category}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-2">{lesson.title}</h1>
        <p className="text-lg text-muted-foreground">{lesson.description}</p>
      </div>

      {lesson.videoUrl && (
        <Card className="border border-border overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" /> Video Lesson
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={lesson.videoUrl}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm text-foreground space-y-4 max-w-none">
            {lesson.content.split("\n\n").map((paragraph, idx) => {
              // Check if it's a heading or list
              if (paragraph.startsWith("-")) {
                return (
                  <ul key={idx} className="list-disc list-inside space-y-2 text-muted-foreground">
                    {paragraph
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, i) => (
                        <li key={i} className="text-sm">
                          {line.replace(/^- /, "")}
                        </li>
                      ))}
                  </ul>
                )
              }

              if (paragraph.match(/^\d+\./)) {
                return (
                  <ol key={idx} className="list-decimal list-inside space-y-2 text-muted-foreground">
                    {paragraph
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, i) => (
                        <li key={i} className="text-sm">
                          {line.replace(/^\d+\.\s*/, "")}
                        </li>
                      ))}
                  </ol>
                )
              }

              if (paragraph.endsWith(":")) {
                return (
                  <h3 key={idx} className="font-semibold text-foreground text-base mt-4">
                    {paragraph}
                  </h3>
                )
              }

              return (
                <p key={idx} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card className="border border-border bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">Understand core concepts</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">Apply knowledge to your finances</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">Build long-term financial habits</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Complete Button */}
      {!completed && (
        <Button
          onClick={handleComplete}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" /> Mark as Complete
        </Button>
      )}

      {completed && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-semibold text-foreground">Lesson Completed!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Great job! You're making progress on your financial journey.
          </p>
        </div>
      )}
    </div>
  )
}
