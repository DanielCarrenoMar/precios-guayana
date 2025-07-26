import { createClient } from '@/lib/supabase/client'
import { Offer, OfferInsert, OfferPetition, Product, ProductInsert, ProductPetition, Review, UserPetition, User } from '@/domain/interface'
import { UUID } from 'crypto'

// Products

async function parseProduct(product: Product): Promise<Product> {
  const imagesPath = await getImagesByProductId(product.id)
  const reviews = await getReviewsByProductId(product.id)
  const avgRating =
    reviews && reviews.length
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0
  return { ...product, imagesPath, rate: avgRating }
}

export async function insertProduct(product: ProductPetition) {
  const supabase = await createClient()

  const query: ProductInsert = { 
    user_id: product.user_id,
    category: product.category,
    description: product.description,
    price: product.price,
    title: product.title,
    latitude: product.latitude,
    longitude: product.longitude
  }

  const { data, error } = await supabase
      .from('product')
      .insert(query)
      .select('id');
  if (error || !data[0].id) throw error
  const id = data[0].id

  insertProductImages(id, product.imagesPath)
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('product')
      .select()
      
  if (error) throw error

  let products = data as Product[]

  products = await Promise.all(
    products.map(product => parseProduct(product))
  )

  return products;
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
  return parseProduct(product)
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

  let products = data as Product[]

  products = await Promise.all(
    products.map(product => parseProduct(product))
  )

  return products;
}

// Product Images

async function getImagesByProductId(productId: number): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('product_image')
      .select('imagePath')
      .eq('product_id', productId)

  if (error) throw error
  const imagesPath = data.map((item: { imagePath: string }) => item.imagePath)
  return imagesPath.length > 0 ? imagesPath : [""]
}

async function insertProductImages(productId: number, imagesPath: string[]) {
  const supabase = await createClient()
  const imageObjects = imagesPath.map(imagePath => ({
    product_id: productId,
    imagePath
  }))
  const { error } = await supabase
      .from('product_image')
      .insert(imageObjects)
  if (error) throw error
}

// Offers

async function parseOffer(offer: Offer): Promise<Offer> {
  const imagesPath = await getImagesByOfferId(offer.id)
  return { ...offer, imagesPath }
}

export async function getLastOffers(numberOfOffers: number): Promise<Offer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('offer')
      .select()
      .order('created_at', { ascending: false })
      .limit(numberOfOffers)

  if (error) throw error

  let offers = data as Offer[]

  offers = await Promise.all(
    offers.map(offer => parseOffer(offer))
  )

  return offers
}

export async function insertOffer(offer: OfferPetition) {
  const supabase = await createClient()

  const query: OfferInsert = { 
    user_id: offer.user_id,
    description: offer.description,
    url: offer.url
  }

  const { data, error } = await supabase
      .from('offer')
      .insert(query)
      .select("id")
  if (error || !data[0].id) throw error
  const id = data[0].id

  insertOfferImages(id, offer.imagesPath)
}

export async function getOffersByUserId(userId: UUID): Promise<Offer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('offer')
      .select()
      .eq('user_id', userId)

  if (error) throw error
  let offers = data as Offer[]

  offers = await Promise.all(
    offers.map(offer => parseOffer(offer))
  )

  return offers
}

export async function getOfferById(id: number): Promise<Offer> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('offer')
      .select()
      .eq('id', id)
      .single()

  if (error) throw error
  return parseOffer(data as Offer)
}

// Offer Images

async function getImagesByOfferId(offerId: number): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('offer_image')
      .select('imagePath')
      .eq('offer_id', offerId)

  if (error) throw error
  const imagesPath = data.map((item: { imagePath: string }) => item.imagePath)
  return imagesPath.length > 0 ? imagesPath : [""]
}

async function insertOfferImages(offerId: number, imagesPath: string[]) {
  const supabase = await createClient()
  const imageObjects = imagesPath.map(imagePath => ({
    offer_id: offerId,
    imagePath
  }))
  const { error } = await supabase
      .from('offer_image')
      .insert(imageObjects)
  if (error) throw error
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
// storage

export async function uploadImage(file: File): Promise<string> {
  const supabase = await createClient()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}`
  const { error } = await supabase.storage
      .from('product-image')
      .upload(fileName, file)

  if (error) throw error

  const { publicUrl } = supabase.storage.from('product-image').getPublicUrl(fileName).data
  return publicUrl
}
