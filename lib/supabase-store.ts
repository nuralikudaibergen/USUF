import type { PromoCode } from "@/lib/brand-config"
import type { NavCategory } from "@/lib/admin-store"
import type { Product } from "@/lib/products"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"
import type { OrderItem } from "@/lib/whatsapp-order"

type ProductRow = {
  id: string
  name: string
  slug: string | null
  sku: string
  category: "men" | "women"
  type: "apparel" | "footwear"
  price: number
  old_price: number | null
  image: string
  images: string[]
  colors: string[]
  sizes: string[]
  material: string
  description: string
  is_new: boolean
  is_featured: boolean
  popularity: number
  rating: number
  tag: string | null
}

type CategoryRow = {
  id: string
  slug: string
  label: string
  image: string
  href: string
}

type PromoRow = {
  code: string
  type: "percent" | "fixed"
  value: number
  description: string
}

export function canUseSupabase() {
  return isSupabaseConfigured && Boolean(supabase)
}

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.warn("Supabase products read failed:", error.message)
    return null
  }
  return (data as ProductRow[]).map(rowToProduct)
}

export async function saveProductToSupabase(product: Product): Promise<Product | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from("products")
    .upsert(productToRow(product))
    .select("*")
    .single()
  if (error) {
    console.warn("Supabase product save failed:", error.message)
    return null
  }
  return rowToProduct(data as ProductRow)
}

export async function deleteProductFromSupabase(productOrId: Product | string) {
  if (!supabase) return true
  const id = typeof productOrId === "string" ? productOrId : productOrId.id
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) console.warn("Supabase product delete failed:", error.message)
  if (error) return false

  if (typeof productOrId !== "string") {
    await deleteProductImagesFromSupabase(productOrId)
  }

  return true
}

export async function fetchCategoriesFromSupabase(): Promise<NavCategory[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true })
  if (error) {
    console.warn("Supabase categories read failed:", error.message)
    return null
  }
  return (data as CategoryRow[]).map(rowToCategory)
}

export async function saveCategoryToSupabase(category: NavCategory): Promise<NavCategory | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from("categories")
    .upsert(categoryToRow(category))
    .select("*")
    .single()
  if (error) {
    console.warn("Supabase category save failed:", error.message)
    return null
  }
  return rowToCategory(data as CategoryRow)
}

export async function deleteCategoryFromSupabase(id: string) {
  if (!supabase) return false
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) console.warn("Supabase category delete failed:", error.message)
  return !error
}

export async function fetchPromosFromSupabase(): Promise<PromoCode[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.warn("Supabase promos read failed:", error.message)
    return null
  }
  return (data as PromoRow[]).map(rowToPromo)
}

export async function savePromoToSupabase(promo: PromoCode) {
  if (!supabase) return false
  const { error } = await supabase.from("promos").upsert(promoToRow(promo))
  if (error) console.warn("Supabase promo save failed:", error.message)
  return !error
}

export async function deletePromoFromSupabase(code: string) {
  if (!supabase) return false
  const { error } = await supabase.from("promos").delete().eq("code", code)
  if (error) console.warn("Supabase promo delete failed:", error.message)
  return !error
}

export async function uploadStoreImage(file: File, folder: "products" | "categories") {
  if (!supabase) return null
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || undefined,
    upsert: false,
  })
  if (error) {
    console.warn("Supabase image upload failed:", error.message)
    return null
  }
  const { data } = supabase.storage.from("product-images").getPublicUrl(path)
  return data.publicUrl
}

async function deleteProductImagesFromSupabase(product: Product) {
  if (!supabase) return
  const paths = Array.from(
    new Set([product.image, ...(product.images ?? [])].map(getProductImageStoragePath).filter(isString)),
  )
  if (paths.length === 0) return
  const { error } = await supabase.storage.from("product-images").remove(paths)
  if (error) console.warn("Supabase product image delete failed:", error.message)
}

function getProductImageStoragePath(src: string | undefined): string | null {
  if (!src) return null
  const marker = "/storage/v1/object/public/product-images/"
  const index = src.indexOf(marker)
  if (index < 0) return null
  const rawPath = src.slice(index + marker.length).split("?")[0]
  try {
    return decodeURIComponent(rawPath)
  } catch {
    return rawPath
  }
}

function isString(value: string | null): value is string {
  return Boolean(value)
}

export async function saveOrderToSupabase({
  customer,
  items,
  subtotal,
  discount,
  total,
  promoCode,
  message,
}: {
  customer: {
    name: string
    phone: string
    city: string
    address?: string
  }
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  promoCode?: string
  message: string
}) {
  if (!supabase) return false
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_city: customer.city,
      customer_address: customer.address ?? null,
      promo_code: promoCode ?? null,
      subtotal,
      discount,
      total,
      whatsapp_message: message,
      status: "new",
    })
    .select("id")
    .single()

  if (orderError || !order) {
    console.warn("Supabase order save failed:", orderError?.message)
    return false
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
    })),
  )
  if (itemsError) console.warn("Supabase order items save failed:", itemsError.message)
  return !itemsError
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? undefined,
    sku: row.sku,
    category: row.category,
    type: row.type,
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    image: row.image,
    images: row.images ?? [],
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    material: row.material,
    description: row.description,
    isNew: row.is_new,
    isFeatured: row.is_featured,
    popularity: row.popularity,
    rating: Number(row.rating),
    tag: row.tag ?? undefined,
  }
}

function productToRow(product: Product): ProductRow {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug ?? null,
    sku: product.sku,
    category: product.category,
    type: product.type,
    price: product.price,
    old_price: product.oldPrice ?? null,
    image: product.image,
    images: product.images,
    colors: product.colors,
    sizes: product.sizes,
    material: product.material,
    description: product.description,
    is_new: Boolean(product.isNew),
    is_featured: Boolean(product.isFeatured),
    popularity: product.popularity,
    rating: product.rating,
    tag: product.tag ?? null,
  }
}

function rowToCategory(row: CategoryRow): NavCategory {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    image: row.image,
    href: row.href,
  }
}

function categoryToRow(category: NavCategory): CategoryRow {
  return {
    id: category.id,
    slug: category.slug,
    label: category.label,
    image: category.image,
    href: category.href,
  }
}

function rowToPromo(row: PromoRow): PromoCode {
  return {
    code: row.code,
    type: row.type,
    value: row.value,
    description: row.description,
  }
}

function promoToRow(promo: PromoCode): PromoRow {
  return {
    code: promo.code,
    type: promo.type,
    value: promo.value,
    description: promo.description,
  }
}
