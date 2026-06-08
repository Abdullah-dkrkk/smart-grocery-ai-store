"use client"

import { BookOpen, Plus, Eye, Calendar as CalendarIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const articles = [
  { id: 1, title: "10 Tips for Healthy Eating on a Budget", category: "Nutrition", status: "Published", views: 1240, date: "2026-06-05" },
  { id: 2, title: "Understanding Macros: Protein, Carbs & Fats", category: "Education", status: "Published", views: 890, date: "2026-06-01" },
  { id: 3, title: "Meal Prep Guide for Busy Professionals", category: "Lifestyle", status: "Draft", views: 0, date: "2026-06-08" },
]

export function Articles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Articles & Resources</h2>
          <p className="text-base text-muted-foreground">Share nutrition knowledge with your clients.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Article</Button>
      </div>

      {articles.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No articles yet</h3>
          <p className="text-sm text-muted-foreground">Create your first nutrition article.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10">
                  <BookOpen className="h-6 w-6 text-brand-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{article.title}</p>
                    <Badge variant={article.status === "Published" ? "default" : "secondary"} className="text-[10px]">{article.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span>{article.category}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.views} views</span>
                    <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{new Date(article.date).toLocaleDateString()}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
