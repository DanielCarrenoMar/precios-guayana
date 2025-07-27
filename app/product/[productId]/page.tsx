import { getProductById, getProductsByNameAndCategory, getUserById } from '@/lib/supabase/repository';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/productCard';

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
  const user = await getUserById(product.user_id)
  const date = new Date(user.created_at);

  if (!product) {
    notFound();
  }

  // Obtener productos relacionados por categoría (excluyendo el actual)
  const relatedProducts = (await getProductsByNameAndCategory('', product.category))
    .filter(p => p.id !== product.id)
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-[#EBEBEB] py-8">
      <div className="max-w-6xl mx-auto px-4">

        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/" className="hover:text-primary">Ofertas</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.title}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center h-96">
                <img
                  src={product.imagesPath[0]}
                  alt={product.title}
                  className="max-h-80 max-w-full object-contain rounded-lg"
                />
              </div>

              {product.imagesPath.length > 1 && (
                <div className="flex space-x-2">
                  {product.imagesPath.slice(1, 4).map((image, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-center w-20 h-20">
                      <img
                        src={image}
                        alt={`${product.title} ${index + 2}`}
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-primary">{product.price}$</span>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < product.rate ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">({product.rate}.0)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Categoría</h3>
                <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>

              {product.latitude && product.longitude && <div className="space-y-3 pt-4">
                <Link href={`/map?lat=${product.latitude}&lng=${product.longitude}`}>
                  <Button variant="default" className="w-full py-3 text-lg">
                    <MapPin className="w-5 h-5" /> Ver en Mapa
                  </Button>
                </Link>
              </div>}

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Vendedor</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.name.toString().charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <Link href={`/user/${user.id}`}>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">Miembro desde {date.getFullYear()}</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  user_id={p.user_id}
                  price={p.price}
                  image={p.imagesPath[0]}
                  product={p.title}
                  rating={p.rate}
                  update_at={p.updated_at}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center col-span-full">
                <p className="text-gray-500">No hay productos similares en esta categoría.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
