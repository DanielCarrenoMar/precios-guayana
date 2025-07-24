import { createClient } from '@/lib/supabase/client'
import { Offer, OfferPetition, Product, Review, UserPetition } from '@/domain/interface'
import { User } from '@supabase/supabase-js'

export async function getAllProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('product')
      .select()
      
  if (error) throw error

  const products = data as Product[]

  const productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const reviews = await getReviewsByProductId(product.id);
      const avgRating =
        reviews && reviews.length
          ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
          : 0;
      return { ...product, rate: avgRating };
    })
  );

  return productsWithRatings;
}

export async function getReviewsByProductId(productId: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('review')
      .select()
      .eq('product_id', productId)

  if (error) throw error
  return data as Review[]
}

export async function insertOffer(offer: OfferPetition) {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('offer')
      .insert(offer)

  if (error) throw error
  return data
}

export async function insertUser(user: UserPetition) {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('user')
      .insert(user)

  if (error) throw error
  return data
}
