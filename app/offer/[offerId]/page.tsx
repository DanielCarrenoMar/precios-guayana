import { getOfferById } from '@/lib/supabase/repository';
import { notFound } from 'next/navigation';

export default async function OfferPage({ params }: { params: { offerId: string } }){
  const offerId = parseInt(params.offerId);

  if (isNaN(offerId)) {
    notFound();
  }

  const offer = await getOfferById(offerId);

  if (!offer) {
    notFound();
  }

  return (
    <>
      <h1>Oferta</h1>
      <div>
        <img src={offer.imagesPath[0]} alt="Imagen de la oferta" />
        <p>{offer.description}</p>
        <p>Precio: {offer.url}</p>
      </div>
    </>
  );
}
