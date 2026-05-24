import type { Product as ApiProduct, Category as ApiCategory } from "@/lib/api/types"
import type { Product, ProductCategory } from "@/types/product"
import { getPlaceholderImage } from "@/lib/utils/placeholder"

const categoryNameToSlug: Record<string, string> = {
  "Milks & Dairies": "milks-dairies",
  "Wines & Drinks": "wines-drinks",
  "Clothing & Beauty": "clothing-beauty",
  "Pet Foods & Toys": "pet-foods",
  "Pet Foods": "pet-foods",
  "Baking Material": "baking-material",
  "Fresh Fruit": "fresh-fruit",
  Fruits: "fruits",
  Vegetables: "vegetables",
  "Bread & Juice": "bread-juice",
  "Fresh Seafood": "fresh-seafood",
  "Fast Food": "fast-food",
  "Cake & Milk": "cake-milk",
  "Coffee & Teas": "coffee-teas",
  "Meat & Poultry": "meat",
  Breakfast: "breakfast",
}

export function adaptProduct(apiProduct: ApiProduct | null | undefined): Product | null {
  if (!apiProduct) return null

  try {
    const catName = apiProduct.category?.name ?? ""
    const catSlug = categoryNameToSlug[catName] ?? apiProduct.category?.slug ?? ""

    const price = Number(apiProduct.price) || 0
    const comparePrice = apiProduct.compare_at_price ? Number(apiProduct.compare_at_price) : null

    const badge = comparePrice && comparePrice > price * 1.15 ? "Sale"
      : apiProduct.is_featured ? "Hot"
      : null

    return {
      id: apiProduct.id ?? 0,
      name: apiProduct.name ?? "",
      slug: apiProduct.slug ?? "",
      description: apiProduct.description ?? "",
      short_description: "",
      price,
      compare_price: comparePrice,
      cost_per_unit: null,
      image: apiProduct.image_url ?? getPlaceholderImage(),
      images: apiProduct.image_url ? [apiProduct.image_url] : [],
      category_id: apiProduct.category_id ?? 0,
      category_name: catName,
      category_slug: catSlug,
      rating: 4,
      review_count: 0,
      badge,
      badges: badge ? [badge] : [],
      is_featured: !!apiProduct.is_featured,
      is_on_sale: !!comparePrice,
      stock: apiProduct.stock_quantity ?? 0,
      unit: "each",
      weight: apiProduct.weight_kg ?? null,
      tags: [],
      created_at: apiProduct.created_at ?? "",
    }
  } catch {
    return null
  }
}

export function adaptProducts(apiProducts: ApiProduct[] | null | undefined): Product[] {
  if (!Array.isArray(apiProducts)) return []
  return apiProducts.map(adaptProduct).filter(Boolean) as Product[]
}

export function adaptCategory(apiCategory: ApiCategory | null | undefined): ProductCategory | null {
  if (!apiCategory) return null

  try {
    return {
      id: apiCategory.id ?? 0,
      name: apiCategory.name ?? "",
      slug: apiCategory.slug ?? "",
      description: apiCategory.description ?? "",
      image: apiCategory.image_url ?? "",
      icon: "",
      parent_id: apiCategory.parent_id ?? null,
      children: apiCategory.children?.map(adaptCategory).filter(Boolean) as ProductCategory[] | undefined,
      product_count: apiCategory.product_count ?? 0,
    }
  } catch {
    return null
  }
}

export function adaptCategories(apiCategories: ApiCategory[] | null | undefined): ProductCategory[] {
  if (!Array.isArray(apiCategories)) return []
  return apiCategories.map(adaptCategory).filter(Boolean) as ProductCategory[]
}
