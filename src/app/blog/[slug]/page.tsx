"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, User, Tag, ArrowLeft, AlertCircle } from "lucide-react"
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

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!params.slug) return
    get<Article>(`/articles/${params.slug}`)
      .then((res: ApiResponse<Article>) => {
        setArticle(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("Article not found.")
        setLoading(false)
      })
  }, [params.slug])

  return (
    <>
      <AnnouncementBarWrapper />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand-green mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {loading && (
            <div className="space-y-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-80 w-full rounded-xl" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </span>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Link href="/blog" className="text-sm text-brand-green hover:underline">
                Back to Blog
              </Link>
            </div>
          )}

          {!loading && !error && article && (
            <article>
              <div className="flex items-center gap-2 mb-3">
                {article.category && (
                  <span className="inline-block bg-brand-green-light dark:bg-brand-green/20 text-brand-green text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {article.category}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-4">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                {article.nutritionist && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {article.nutritionist.name}
                  </span>
                )}
                {article.published_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              {article.image_url && (
                <div className="rounded-xl overflow-hidden mb-8">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <div
                className="prose prose-sm sm:prose-base max-w-none dark:prose-invert
                  prose-headings:font-heading prose-headings:font-semibold
                  prose-a:text-brand-green prose-img:rounded-xl
                  prose-img:my-6 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-10 pt-6 border-t border-border">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
