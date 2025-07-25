import { getProductById } from '@/lib/supabase/repository';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    productId: string; // El nombre de la carpeta dinámica ([productId])
  };
}

export default async function ProductPage({ params }: ProductPageProps){
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
