const slugToSvgKey: Record<string, string> = {
  "milks-dairies": "milks", "milk-diaries": "milks",
  "wines-drinks": "wines",
  "clothing-beauty": "clothing",
  "pet-foods": "pet", "pet-foods-toys": "pet",
  "baking-material": "baking",
  "fresh-fruit": "fruit", "fruits": "fruit",
  "vegetables": "vegetables",
  "bread-juice": "bread",
  "fresh-seafood": "seafood",
  "fast-food": "cake",
  "cake-milk": "cake",
  "coffee-teas": "coffee", "cookies-teas": "coffee",
  "meat": "seafood", "meat-poultry": "seafood",
  "breakfast": "baking",
}

const defaultSvg = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const categorySvgs: Record<string, React.ReactNode> = {
  default: defaultSvg,
  milks: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M8 2h8l1 3H7l1-3z" />
      <path d="M6 5h12l-1 14a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3L6 5z" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  ),
  wines: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M12 2v12" />
      <path d="M8 14a4 4 0 0 0 8 0" />
      <path d="M6 14c0 2.5 1.5 5 6 5s6-2.5 6-5" />
      <path d="M9 2h6" />
    </svg>
  ),
  clothing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M6 2L2 6v5h4v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-9h4V6l-4-4H6z" />
      <path d="M9 14h6" />
    </svg>
  ),
  pet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="5" cy="7" r="2.5" />
      <circle cx="19" cy="7" r="2.5" />
      <circle cx="12" cy="4" r="2" />
      <path d="M4 16c0-2.5 2-4 4-4h8c2 0 4 1.5 4 4" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  ),
  baking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M18 2l-8 8" />
      <path d="M20 4l-8 8" />
      <circle cx="6" cy="18" r="4" />
      <path d="M6 14v-2a4 4 0 0 1 4-4h4" />
    </svg>
  ),
  fruit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M12 7c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" />
      <path d="M12 3v4" />
      <path d="M8 5c-2 1-3 3-3 5" />
      <path d="M16 5c2 1 3 3 3 5" />
      <path d="M9 13h6" />
      <path d="M12 10v6" />
    </svg>
  ),
  vegetables: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M7 13c-1.5-1-3-3-3-6 0-2.5 2-4 4-4 1.5 0 3 1 4 2.5" />
      <path d="M7 13l-3 8h8l-2-4" />
      <path d="M11 9c1.5-1 3-2 5-2 2.5 0 4 1.5 4 4 0 2-1 4-2.5 5" />
      <path d="M13 11l3 7h-6l1-3" />
    </svg>
  ),
  bread: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M4 8c0-1.5 1-3 2.5-3h11C19 5 20 6.5 20 8v1c0 1-1 2-2 2H6c-1 0-2-1-2-2V8z" />
      <path d="M4 11v3c0 1.5 1.5 3 3 3h10c1.5 0 3-1.5 3-3v-3" />
      <path d="M15 14h2" />
    </svg>
  ),
  juice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M8 2h8l1 3H7l1-3z" />
      <path d="M6 5l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
      <circle cx="12" cy="12" r="2" />
      <path d="M10 5v2" />
      <path d="M14 5v2" />
    </svg>
  ),
  cake: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M3 15c0-1.5.5-3 1.5-3.5C5.5 11 7 12 8 13c1-1 2.5-2 3.5-1.5S13 13 14 14c1-1 2.5-2 3.5-1.5S19 14 20 15" />
      <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
      <path d="M12 4v3" />
      <path d="M9 5v2" />
      <path d="M15 5v2" />
    </svg>
  ),
  coffee: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M18 8h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" />
      <path d="M4 4h12v10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V4z" />
      <path d="M8 2v2" />
      <path d="M12 2v2" />
    </svg>
  ),
  seafood: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M4 18c2-2 5-3 8-3s6 1 8 3" />
      <path d="M2 14c3-3 6-5 10-5s7 2 10 5" />
      <path d="M6 10c2-2 5-3 8-3s5 1 7 3" />
      <path d="M12 3c1.5 0 3 1 4 2" />
    </svg>
  ),
}

export function getCategorySvg(slug: string): React.ReactNode {
  const key = slugToSvgKey[slug] || "default"
  return categorySvgs[key] ?? categorySvgs.default
}

export { slugToSvgKey, categorySvgs }
