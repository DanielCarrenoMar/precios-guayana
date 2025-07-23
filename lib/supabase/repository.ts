import { createClient } from '@/lib/supabase/server'
import { Offer, OfferPetition, Product } from '@/domain/interface'

export async function getAllProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('product')
      .select()

  console.log('data antes', data)

  if (error) throw error
  return data as Product[]
}
export async function insertOffer(offer: OfferPetition) {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('offer')
      .insert(offer)

  if (error) throw error
  return data
}
