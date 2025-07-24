import { createClient } from '@/lib/supabase/client'
import { Offer, OfferPetition, Product, ProductPetition, Review, UserPetition } from '@/domain/interface'
import { UUID } from 'crypto'
import { User } from '@supabase/supabase-js'

// Products

async function calReviewProduct(product: Product): Promise<Product> {
  const reviews = await getReviewsByProductId(product.id)
  const avgRating =
    reviews && reviews.length
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0
  return { ...product, rate: avgRating }
}

export async function insertProduct(product: ProductPetition) {
  const supabase = await createClient()
  const { error } = await supabase
      .from('product')
      .insert(product)
  if (error) throw error
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('product')
      .select()
      
  if (error) throw error

  const products = data as Product[]

  const productsWithRatings = await Promise.all(
    products.map(product => calReviewProduct(product))
  )

  return productsWithRatings;
}

export async function getProductById(id: number): Promise<Product> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('product')
      .select()
      .eq('id', id)
      .single()

  if (error) throw error

  const product = data as Product
  return calReviewProduct(product)
}

export async function getProductsByNameAndCategory(name: string, category: string): Promise<Product[]> {
  const supabase = await createClient()

  let query = supabase.from('product').select()
  if (name && name.trim() !== "") {
    query = query.ilike('title', `%${name}%`)
  }
  if (category && category.trim() !== "") {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw error

  const products = data as Product[]
  return Promise.all(products.map(product => calReviewProduct(product)))
}

// Reviews

export async function getReviewsByProductId(productId: number): Promise<Review[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('review')
      .select()
      .eq('product_id', productId)

  if (error) throw error
  return data as Review[]
}

export async function insertReview(review: Review) {
  const supabase = await createClient()
  const { error } = await supabase
      .from('review')
      .insert(review)
  if (error) throw error
}

// Offers

export async function getLastOffers(numberOfOffers: number): Promise<Offer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('offer')
      .select()
      .order('created_at', { ascending: false })
      .limit(numberOfOffers)

  if (error) throw error
  return data as Offer[]
}

export async function insertOffer(offer: OfferPetition) {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('offer')
      .insert(offer)

  if (error) throw error
  return data
}

export async function getOffersByUserId(userId: UUID): Promise<Offer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('offer')
      .select()
      .eq('user_id', userId)

  if (error) throw error
  return data as Offer[]
}

export async function getOfferById(id: number): Promise<Offer> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('offer')
      .select()
      .eq('id', id)
      .single()

  if (error) throw error
  return data as Offer
}

// Users

export async function getUserById(id: UUID): Promise<User> {
  const supabase = await createClient()
  const { data, error } = await supabase
      .from('user')
      .select()
      .eq('id', id)
      .single()
  if (error) throw error
  return data as User
}

export async function insertUser(user: UserPetition) {
  const supabase = await createClient()

  const { error } = await supabase
      .from('user')
      .insert(user)

  if (error) throw error
}
