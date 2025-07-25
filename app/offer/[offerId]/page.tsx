import { getOfferById } from '@/lib/supabase/repository';
import { notFound } from 'next/navigation';

interface OfferPageProps {
  params: {
    offerId: string; // El nombre de la carpeta dinámica ([offerId])
  };
}

export default async function OfferPage({ params}: OfferPageProps){
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
        <img src={offer.imagePath} alt="Imagen de la oferta" />
        <p>{offer.description}</p>
        <p>Precio: {offer.url}</p>
      </div>
    </>
  );
}
