import { getOfferById } from '@/lib/supabase/repository';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ offerId: string }>
}

export default async function OfferPage({params}: Props){
  const { offerId } = await params
  const offerIdNum = parseInt( offerId)

  if (isNaN(offerIdNum)) {
    notFound();
  }

  const offer = await getOfferById(offerIdNum);

  if (!offer) {
    notFound();
  }

  return (
    <>
      <h1>Oferta</h1>
      <div>
        {offer.imagesPath && offer.imagesPath.length > 0 && (
          <img src={offer.imagesPath[0]} alt="Imagen de la oferta" />
        )}
        <p>{offer.description}</p>
        <p>Precio: {offer.url}</p>
      </div>
    </>
  );
}
