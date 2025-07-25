import { getProductById } from '@/lib/supabase/repository';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: { productId: string } }){
  const productId = parseInt(params.productId);

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1>Producto {productId}</h1>
      {product.title}
      <input type="text" placeholder="Buscar productos..." />
    </div>
  );
}
