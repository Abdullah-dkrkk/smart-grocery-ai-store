import { get, post, put, del } from "./client"

export interface Article {
  id: number
  nutritionist_id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image_url?: string
  is_published: boolean
  published_at?: string
  author_name?: string
  created_at: string
  updated_at: string
}

export interface ArticleInput {
  title: string
  excerpt?: string
  content: string
  is_published?: boolean
}

export const articlesApi = {
  list() {
    return get<Article[]>("/nutritionist/articles")
  },
  show(id: number) {
    return get<Article>(`/nutritionist/articles/${id}`)
  },
  create(data: ArticleInput) {
    return post<Article>("/nutritionist/articles", data)
  },
  update(id: number, data: Partial<ArticleInput>) {
    return put<Article>(`/nutritionist/articles/${id}`, data)
  },
  destroy(id: number) {
    return del<void>(`/nutritionist/articles/${id}`)
  },
}
