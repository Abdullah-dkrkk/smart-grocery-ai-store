"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { BookOpen, Plus, Eye, Calendar as CalendarIcon, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { articlesApi } from "@/lib/api/articles"
import { setAuthToken } from "@/lib/api/config"
import type { Article } from "@/lib/api/articles"

export function Articles() {
  const { data: session, status: authStatus } = useSession()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = () => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view articles.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    articlesApi.list()
      .then((res) => setArticles(Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []))
      .catch((err) => setError(err.message || "Failed to load articles."))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchArticles() }, [authStatus, session])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Articles & Resources</h2>
          <p className="text-base text-muted-foreground">Loading articles...</p>
        </div>
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-card border rounded-xl animate-pulse" />)}
      </div>
    )
  }

  if (error && articles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Articles & Resources</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load articles</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Articles & Resources</h2>
          <p className="text-base text-muted-foreground">Share nutrition knowledge with your clients.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Article</Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

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
                    <Badge variant={article.is_published ? "default" : "secondary"} className="text-[10px]">{article.is_published ? "Published" : "Draft"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span>{article.author_name ?? "You"}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.slug ? "Viewable" : "—"}</span>
                    <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{new Date(article.created_at).toLocaleDateString()}</span>
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
