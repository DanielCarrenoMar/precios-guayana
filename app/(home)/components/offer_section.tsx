"use client";

import OfferCard from "@/components/offerCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Offer, User } from "@/domain/interface";
import { getLastOffers, getUserById } from "@/lib/supabase/repository";
import { useEffect, useState } from "react";

interface OfferAndUser {
    offer: Offer,
    user: User
}

export default function OfferSection() {
    const [offersAndUsers, setOffersAndUsers] = useState<OfferAndUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function fetchOffersAndUsers() {
            getLastOffers(10).then((data) => {
                const offerAndUserPromises = data.map(async (offer) => {
                    const user = await getUserById(offer.user_id);
                    return {
                        offer: offer,
                        user: user,
                    };
                });

                Promise.all(offerAndUserPromises).then(data => {
                    setOffersAndUsers(data)
                    setLoading(false)
                }).catch((error) => {
                    console.error("Error fetching Users:", error);
                });
            }).catch((error) => {
                console.error("Error fetching offers:", error);
            });
        }
        fetchOffersAndUsers()
    }, [])

    return (
        <section className="px-4 pb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Ofertas Destacadas</h2>
                </div>

                {!loading ? (
                    <div className="relative px-16">
                        <Carousel className="w-full">
                            <CarouselContent className="-ml-8 md:-ml-10">
                                {offersAndUsers.map((data) => (
                                    <CarouselItem key={data.offer.id} className="pl-4 md:pl-6 basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                        <div className="p-2">
                                            <OfferCard
                                                id={data.offer.id}
                                                image={data.offer.imagesPath[0]}
                                                company={data.user.name}
                                                product={data.offer.description}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-0 bg-secondary hover:bg-secondary/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 w-12 h-12" />
                            <CarouselNext className="right-0 bg-secondary hover:bg-secondary/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 w-12 h-12" />
                        </Carousel>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Cargando ofertas...</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );

}