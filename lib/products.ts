export type Category = "men" | "women"
export type ProductType = "apparel" | "footwear"

export type Product = {
  id: string
  /** Человекочитаемый slug для URL вида /product/palto-iz-shersti */
  slug?: string
  name: string
  sku: string
  category: Category
  type: ProductType
  price: number
  oldPrice?: number
  image: string
  images: string[]
  colors: string[]
  sizes: string[]
  material: string
  description: string
  isNew?: boolean
  isFeatured?: boolean
  popularity: number
  rating: number
  tag?: string
}

export const categories: { slug: Category; label: string; image: string }[] = [
  { slug: "men", label: "Мужская коллекция", image: "/categories/men.png" },
  { slug: "women", label: "Женская коллекция", image: "/categories/women.png" },
]

export const products: Product[] = [
  // Каталог сейчас пуст — товары добавляются через админ-панель (/admin/products).
  // Когда вы залогинитесь как админ и добавите первые позиции, они появятся здесь автоматически.
]

export function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(value)
}

export function getProduct(idOrSlug: string) {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug)
}

export function getProductsByCategory(category?: Category) {
  if (!category) return products
  return products.filter((p) => p.category === category)
}

export function getProductsByType(type?: ProductType) {
  if (!type) return products
  return products.filter((p) => p.type === type)
}
