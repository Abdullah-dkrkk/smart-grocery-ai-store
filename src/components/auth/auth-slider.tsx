"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuthSlide {
  image: string
  title: string
  subtitle: string
}

const slides: AuthSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=1200&fit=crop",
    title: "Fresh Groceries",
    subtitle: "Delivered to Your Doorstep",
  },
  {
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&h=1200&fit=crop",
    title: "AI-Powered Recommendations",
    subtitle: "Smart shopping tailored to you",
  },
  {
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&h=1200&fit=crop",
    title: "Organic & Fresh",
    subtitle: "Hand-picked quality produce",
  },
  {
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1200&fit=crop",
    title: "Smart Shopping",
    subtitle: "Save time with AI-powered lists",
  },
]

export function AuthSlider() {
  const [slideIndex, setSlideIndex] = useState(0)

  const prevSlide = useCallback(() => {
    setSlideIndex((p) => (p === 0 ? slides.length - 1 : p - 1))
  }, [])

  const nextSlide = useCallback(() => {
    setSlideIndex((p) => (p === slides.length - 1 ? 0 : p + 1))
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <div className="relative w-full h-full bg-muted overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === slideIndex ? "opacity-100" : "opacity-0",
          )}
        >
          <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-16 px-10 lg:px-14 z-10">
        <div className="flex items-end justify-between">
          <div className="flex-1 relative min-h-[100px]">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={cn(
                  "absolute inset-x-0 top-0 transition-opacity duration-700",
                  i === slideIndex ? "opacity-100" : "opacity-0",
                )}
              >
                <h2 className="text-white text-2xl lg:text-3xl font-heading font-bold">
                  {slide.title}
                </h2>
                <p className="text-white/80 mt-1.5 lg:mt-2 text-base lg:text-lg">
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-6">
            <button
              type="button"
              onClick={prevSlide}
              className="h-11 w-11 rounded-full border border-white/20 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all outline-none focus:outline-none active:outline-none text-white"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="h-11 w-11 rounded-full border border-white/20 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all outline-none focus:outline-none active:outline-none text-white"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSlideIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all outline-none focus:outline-none active:outline-none",
              i === slideIndex ? "w-8 bg-white" : "w-2 bg-white/40",
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
