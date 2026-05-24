"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
}

export function SearchBar({
  onSearch,
  placeholder = "Search products...",
  className,
  autoFocus = false,
  suggestions,
  onSuggestionClick,
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query.trim())
      inputRef.current?.blur()
    }
  }

  const showSuggestions = isFocused && suggestions && suggestions.length > 0 && query.length > 0

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="pl-9 pr-9 h-10"
          autoFocus={autoFocus}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); inputRef.current?.focus() }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-card shadow-lg z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors flex items-center gap-2"
              onClick={() => { setQuery(s); onSuggestionClick?.(s); setIsFocused(false) }}
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
