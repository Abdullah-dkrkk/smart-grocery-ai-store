"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, User, Tag, AlertCircle } from "lucide-react"
import { get } from "@/lib/api/client"
import type { ApiResponse } from "@/lib/api/client"
import { AnnouncementBarWrapper } from "@/components/sections/announcement-bar-wrapper"
import { Header } from "@/components/sections/header"
import { Footer } from "@/components/store/footer"

interface Article {
  id: number
  title: string
  slug: string
  content: string
  image_url: string | null
  category: string | null
  tags: string[] | null
  nutritionist: { id: number; name: string } | null
  published_at: string | null
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    get<Article[]>("/articles")
      .then((res: ApiResponse<Article[]>) => {
        setArticles(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load articles. Please try again later.")
        setLoading(false)
      })
  }, [])

  return (
    <>
      <AnnouncementBarWrapper />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-green text-white mb-4 text-xs px-3 py-1 rounded-full">Our Blog</span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">
              Fresh Insights & Stories
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Tips, recipes, and news from the SmartGrocery team.
            </p>
          </div>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                  <Skeleton className="h-52 w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <div className="flex gap-4 pt-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </span>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-brand-green hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="aspect-[16/9] bg-muted overflow-hidden">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                        <Calendar className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {article.category && (
                        <span className="inline-block bg-brand-green-light dark:bg-brand-green/20 text-brand-green text-[11px] font-medium px-2 py-0.5 rounded-full">
                          {article.category}
                        </span>
                      )}
                      {article.tags && article.tags.length > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Tag className="h-3 w-3" />
                          {article.tags.slice(0, 2).join(", ")}
                        </span>
                      )}
                    </div>
                    <h2 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-brand-green transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {article.content.replace(/<[^>]*>/g, "").slice(0, 120)}...
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {article.nutritionist && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.nutritionist.name}
                        </span>
                      )}
                      {article.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(article.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No articles published yet. Check back soon!
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
