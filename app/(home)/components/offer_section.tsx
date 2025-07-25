"use client";

import OfferCard from "@/components/offerCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Offer } from "@/domain/interface";
import { getLastOffers } from "@/lib/supabase/repository";
import { useEffect, useState } from "react";

export default function OfferSection() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLastOffers(10).then((data) => {
            setOffers(data);
            setLoading(false);
        }).catch((error) => {
            console.error("Error fetching offers:", error);
        });
    }, [])

    return !loading ? (
        <section className="w-full">
            <Carousel>
                <CarouselContent>
                    {
                        offers.map(offer =>
                            <CarouselItem className="basis-1/3">
                                <OfferCard
                                    key={offer.id}
                                    id={offer.id}
                                    price={-1}
                                    image={offer.imagesPath[0]}
                                    company={offer.user_id.toString()}
                                    product={offer.description}
                                />
                            </CarouselItem>
                        )
                    }
                    <CarouselItem className="basis-1/3">.1..</CarouselItem>
                    <CarouselItem className="basis-1/3">.2..</CarouselItem>
                    <CarouselItem className="basis-1/3">.3..</CarouselItem>
                </CarouselContent>
            </Carousel>
        </section>
    ) : (
        <section>
            cargando
        </section>
    )

}