"use client"
import { getProductById, getProductsByNameAndCategory, getReviewsByProductId, getUserById, insertReview, updateReview } from '@/lib/supabase/repository';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/productCard';
import { useEffect, useState } from 'react';
import { Product, User } from '@/domain/interface';
import RatingButton from '@/components/rating_button';
import { fetchBolivarConversion } from '@/lib/dollarApi/dollarApi';

interface Props {
  params: Promise<{ productId: string }>
}

export default function ProductPage({ params }: Props) {
  const [product, setProduct] = useState<Product>()
  const [relatedProducts, setRelatedProducts] = useState<Product[]>()
  const [user, setUser] = useState<User>()
  const [date, setDate] = useState<Date>()
  const [priceBs, setPriceBs] = useState<number>()

  useEffect(() => {
    params.then(data => {
      const productIdNum = parseInt(data.productId)
      if (isNaN(productIdNum)) {
        notFound();
      }
      getProductById(productIdNum).then(product => {
        setProduct(product)
        fetchBolivarConversion(product.price).then(priceBs => {
          setPriceBs(priceBs)
        })
        getUserById(product.user_id).then(user => {
          setUser(user)
          setDate(new Date(user.created_at))
        })
        getProductsByNameAndCategory('', product.category).then(relatedProducts => {
          setRelatedProducts(
            relatedProducts
              .filter(p => p.id !== product.id)
              .slice(0, 8)
          )
        })
      }).catch(() => {
        notFound();
      })
    })
  }, [])

  function onRateChange(rate: number) {
    if (!product || !user) return

    getReviewsByProductId(product.id).then(reviews => {
      const actualReview = reviews.find(r => r.user_id === user.id)
      if (!actualReview) {
        insertReview({
          product_id: product.id,
          rating: rate,
          user_id: user.id,
        })
      } else {
        updateReview({
          id: actualReview.id,
          rating: rate
        })
      }
    })
  }


  if (!product || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

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
                  src={product.imagesPath[0] || "/no-image.png"}
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
                  <span className="flex gap-2 align-baseline">
                    <h3 className='text-4xl font-bold text-primary'>{product.price}$</h3>
                    <h4 className="text-xl text-gray-500">({priceBs && Math.floor(priceBs * 100) / 100}bs)</h4>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <RatingButton initialRating={product.rate} onRatingChange={onRateChange} />
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
                      <p className="text-sm text-gray-600">Miembro desde {date?.getFullYear()}</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-primary-foreground p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts && relatedProducts.length > 0 ? (
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

