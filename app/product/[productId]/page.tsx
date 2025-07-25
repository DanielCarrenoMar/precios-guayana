import { getProductById } from '@/lib/supabase/repository';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ productId: string }>
}

export default async function ProductPage({ params }: Props){
  const { productId } = await params
  const productIdNum = parseInt(await productId)

  if (isNaN(productIdNum)) {
    notFound();
  }

  const product = await getProductById(productIdNum);

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
