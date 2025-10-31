"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, CheckCircle2 } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"
import LessonDetail from "@/components/lesson-detail"

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

const lessons: Lesson[] = [
  {
    id: "1",
    title: "Budgeting Basics",
    description: "Learn how to create and maintain an effective monthly budget.",
    duration: "15 min",
    difficulty: "beginner",
    category: "Fundamentals",
    content: `A budget is a plan for your money. It helps you:
- Track where your money goes
- Ensure you spend less than you earn
- Save for goals
- Reduce financial stress

The 50/30/20 Rule:
- 50% for needs (housing, food, utilities)
- 30% for wants (entertainment, dining)
- 20% for savings and debt repayment

Start by listing all your income and expenses for the past month. Categorize them and identify areas to reduce.`,
    videoUrl: "https://www.youtube.com/embed/SDfKxdnr6PU",
    completed: false,
  },
  {
    id: "2",
    title: "Understanding Credit",
    description: "Discover how credit works and why your credit score matters.",
    duration: "12 min",
    difficulty: "beginner",
    category: "Fundamentals",
    content: `Credit is borrowed money you must repay. Key concepts:

Credit Score (300-850):
- 300-579: Poor
- 580-669: Fair
- 670-739: Good
- 740-799: Very Good
- 800+: Excellent

Factors affecting your score:
1. Payment history (35%) - Always pay on time
2. Credit utilization (30%) - Keep usage under 30%
3. Length of history (15%)
4. Credit mix (10%)
5. New inquiries (10%)

Building credit takes time but starts with one card used responsibly.`,
    videoUrl: "https://www.youtube.com/embed/Qkz03y4j_0c",
    completed: false,
  },
  {
    id: "3",
    title: "Emergency Fund Essentials",
    description: "Build financial security with an emergency fund.",
    duration: "10 min",
    difficulty: "beginner",
    category: "Savings",
    content: `An emergency fund is money set aside for unexpected expenses. Why you need it:
- Job loss
- Medical emergencies
- Car repairs
- Home maintenance

How much to save:
- Starter goal: $1,000
- Beginner goal: 1 month of expenses
- Full emergency fund: 3-6 months of expenses

How to build it:
1. Start small - Save $50-100/month
2. Automate transfers
3. Keep it separate from daily account
4. Don't touch it unless it's truly an emergency`,
    videoUrl: "https://www.youtube.com/embed/TfKzZr39k1o",
    completed: false,
  },
  {
    id: "4",
    title: "Investing 101",
    description: "Learn the fundamentals of investing and growing your wealth.",
    duration: "18 min",
    difficulty: "intermediate",
    category: "Investment",
    content: `Investing is making your money work for you. Key concepts:

Types of investments:
1. Stocks - Own shares in companies
2. Bonds - Loan money to entities
3. Index Funds - Diversified investment bundles
4. ETFs - Exchange-traded funds
5. Real Estate - Property investment

Risk vs. Return:
- Higher risk = Higher potential returns
- Lower risk = More stable but slower growth

Diversification:
- Don't put all eggs in one basket
- Spread investments across types
- Reduces overall risk

Time in market beats timing:
- Start early
- Invest regularly
- Stay consistent`,
    videoUrl: "https://www.youtube.com/embed/P6pXL9n-R1o",
    completed: false,
  },
  {
    id: "5",
    title: "Debt Management Strategies",
    description: "Master techniques to eliminate debt effectively.",
    duration: "14 min",
    difficulty: "intermediate",
    category: "Debt",
    content: `Debt strategies to pay down what you owe:

Common debt types:
- Credit cards (High interest 15-25%)
- Student loans (Lower interest 4-8%)
- Mortgages (Low interest 3-7%)
- Personal loans (Medium interest 6-12%)

Payoff strategies:

Snowball Method:
- Pay minimum on all debts
- Attack smallest debt first
- Build momentum with quick wins

Avalanche Method:
- Pay minimum on all debts
- Attack highest interest first
- Save the most money overall

Consolidation:
- Combine multiple debts
- Often lower interest rate
- Simplified payments

Key rules:
1. Stop accumulating new debt
2. Budget to pay more than minimum
3. Celebrate progress
4. Consider balance transfers`,
    videoUrl: "https://www.youtube.com/embed/tJbzf3x_OMc",
    completed: false,
  },
  {
    id: "6",
    title: "Passive Income Streams",
    description: "Explore ways to earn money while you sleep.",
    duration: "16 min",
    difficulty: "advanced",
    category: "Income",
    content: `Passive income is earnings with minimal ongoing effort.

Popular passive income sources:

Dividends:
- Earn from stocks paying dividends
- Compound interest magnifies returns
- Requires initial capital

Rental Income:
- Real estate properties
- Airbnb or vacation rentals
- Requires capital and management

Affiliate Marketing:
- Earn commissions on referrals
- Blog or social media based
- Takes time to build audience

Digital Products:
- E-books, courses, templates
- High initial effort, then scales
- Recurring revenue potential

Investments:
- Bond interest
- Interest-bearing accounts
- CDs and savings accounts

P2P Lending:
- Loan money to others
- Earn interest
- Platform dependent risk

Getting started:
1. Choose area of interest
2. Research thoroughly
3. Start small
4. Reinvest earnings`,
    videoUrl: "https://www.youtube.com/embed/HsHWlP8VqE0",
    completed: false,
  },
]

export default function LearnPage() {
  const [allLessons, setAllLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all")

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("lessons")
    if (saved) {
      setAllLessons(JSON.parse(saved))
    } else {
      setAllLessons(lessons)
      localStorage.setItem("lessons", JSON.stringify(lessons))
    }
  }, [])

  const handleCompleteLesson = (lessonId: string) => {
    const updated = allLessons.map((l) => (l.id === lessonId ? { ...l, completed: true } : l))
    setAllLessons(updated)
    localStorage.setItem("lessons", JSON.stringify(updated))
    setSelectedLesson(null)
  }

  if (!mounted) return null

  if (selectedLesson) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardNav />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 text-primary hover:underline mb-6"
            >
              ← Back to Lessons
            </button>
            <LessonDetail lesson={selectedLesson} onComplete={() => handleCompleteLesson(selectedLesson.id)} />
          </div>
        </main>
      </div>
    )
  }

  const filteredLessons = allLessons.filter((lesson) => filter === "all" || lesson.difficulty === filter)

  const completedCount = allLessons.filter((l) => l.completed).length
  const categories = [...new Set(allLessons.map((l) => l.category))]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardNav />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-foreground">Learning Hub</h1>
              <p className="text-muted-foreground mt-2">
                Master financial concepts through structured lessons and practical education.
              </p>
            </div>

            {/* Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {completedCount}/{allLessons.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {allLessons.reduce((sum, l) => sum + Number.parseInt(l.duration), 0)} min
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(completedCount / allLessons.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.round((completedCount / allLessons.length) * 100)}% complete
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {["all", "beginner", "intermediate", "advanced"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Lessons Grid */}
            <div className="space-y-6">
              {categories.map((category) => {
                const categoryLessons = filteredLessons.filter((l) => l.category === category)
                if (categoryLessons.length === 0) return null

                return (
                  <div key={category}>
                    <h2 className="text-xl font-semibold text-foreground mb-4">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryLessons.map((lesson) => (
                        <Card
                          key={lesson.id}
                          className="border border-border hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-base">{lesson.title}</CardTitle>
                                <CardDescription className="mt-2">{lesson.description}</CardDescription>
                              </div>
                              {lesson.completed && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex gap-2">
                              <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                                {lesson.difficulty}
                              </span>
                              <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </div>
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex gap-2">
                              <Play className="w-4 h-4" /> {lesson.completed ? "Review" : "Start"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
