import { getOfferById, getLastOffers } from '@/lib/supabase/repository';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import OfferCard from '@/components/offerCard';

interface Props {
  params: Promise<{ offerId: string }>
}

export default async function OfferPage({ params }: Props) {
  const { offerId } = await params;
  const offerIdNum = parseInt(offerId);

  if (isNaN(offerIdNum)) {
    notFound();
  }

  const offer = await getOfferById(offerIdNum);
  if (!offer) {
    notFound();
  }

  // Buscar ofertas relacionadas (excluyendo la actual)
  const relatedOffers = (await getLastOffers(12))
    .filter(o => o.id !== offer.id)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-[#EBEBEB] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/" className="hover:text-primary">Ofertas</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Oferta #{offer.id}</li>
          </ol>
        </nav>

        {/* Offer Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Offer Image */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center h-96">
                <img
                  src={offer.imagesPath[0]}
                  alt={offer.description}
                  className="max-h-80 max-w-full object-contain rounded-lg"
                />
              </div>
              {/* Additional Images (if any) */}
              {offer.imagesPath.length > 1 && (
                <div className="flex space-x-2">
                  {offer.imagesPath.slice(1, 4).map((image, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-center w-20 h-20">
                      <img
                        src={image}
                        alt={`Oferta ${offer.id} ${index + 2}`}
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Offer Info */}
            <div className="space-y-6">
              {/* Title and URL */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Oferta Especial</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-primary">Oferta</span>
                  <Link href={offer.url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">Ver Detalle</Link>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">{offer.description}</p>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>Ubicación: Ciudad Guayana, Venezuela</span>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Link href="/map">
                  <Button variant="outline" className="w-full py-3 text-lg">
                    Ver en Mapa
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Offers Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ofertas Relacionadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedOffers.length > 0 ? (
              relatedOffers.map((o) => (
                <OfferCard
                  key={o.id}
                  id={o.id}
                  image={o.imagesPath[0]}
                  company={o.user_id.toString()}
                  product={o.description}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center col-span-full">
                <p className="text-gray-500">No hay ofertas similares.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
