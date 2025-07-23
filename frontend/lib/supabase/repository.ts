import { createClient } from '@/lib/supabase/server'
import { Product } from '@/domain/interface'

export async function getAllProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('product')
      .select()

  if (error) throw error
  return data as Product[]
}