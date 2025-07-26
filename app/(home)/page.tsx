"use client";
import ProductCard from "@/components/productCard";
import SearchBar from "@/components/ui/search-bar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product } from "@/domain/interface";
import { getProductsByNameAndCategory } from "@/lib/supabase/repository";
import { useEffect, useState } from "react";
import OfferSection from "./components/offer_section";
import HeroSection from "./components/hero-section";

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");
  const [category,] = useState("");
  const [sortBy,] = useState<("price" | "review")>("price");
  const [sortOrder,] = useState<("asc" | "desc")>("asc");
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    setLoading(true);
    function fetchProductsAndUsers() {
      getProductsByNameAndCategory(searchText, "").then((data) => {
        const sortedProducts = data.sort((a, b) => {
          if (sortBy === "price") {
            return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
          } else {
            return sortOrder === "asc" ? a.rate - b.rate : b.rate - a.rate;
          }
        });

        setProducts(sortedProducts)
        setLoading(false)
      }).catch((error) => {
        console.error("Error fetching products:", error);
      });
    }

    fetchProductsAndUsers();
  }, [searchText, category, sortBy, sortOrder]);

  return (
    <main>
      <HeroSection />

      <section className="mb-8 flex justify-center -mt-8">
        <div className="w-full max-w-2xl">
          <SearchBar
            placeholder="Buscar productos y ofertas..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              if (!searchText) {
                setIsSearchFocused(false);
              }
            }}
          />
        </div>
      </section>

      {!searchText && !isSearchFocused && (
        <section className="mb-8">
          <OfferSection />
        </section>
      )}

      {/* Results Section */}
      {searchText || isSearchFocused ? (
        /* Grid sin barra blanca para búsqueda */
        <section className="px-4 pb-8">
          {searchText && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Resultados de búsqueda</h2>
            </div>
          )}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-25">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    user_id={product.user_id}
                    price={product.price}
                    image={product.imagesPath[0]}
                    product={product.title}
                    rating={product.rate}
                    update_at={product.updated_at}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No se encontraron productos</p>
                </div>
              )
              }

            </div>
          </div>
        </section>
      ) : (
        /* Carrusel con barra blanca para vista normal */
        <section className="px-4 pb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando...</p>
                </div>
              </div>
            ) : (
              /* Carrusel para vista normal */
              <div className="relative px-16">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-8 md:-ml-10">
                    {
                      products.length > 0 ? (
                        products.map((product) => (
                          <CarouselItem key={product.id} className="pl-4 md:pl-6 basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                            <div className="p-6">
                              <ProductCard
                                key={product.id}
                                id={product.id}
                                user_id={product.user_id}
                                price={product.price}
                                image={product.imagesPath[0]}
                                product={product.title}
                                rating={product.rate}
                                update_at={product.updated_at}
                              />
                            </div>
                          </CarouselItem>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <p className="text-muted-foreground">No se encontraron productos</p>
                        </div>
                      )
                    }
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-[#104912] hover:bg-[#104912]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 w-12 h-12" />
                  <CarouselNext className="right-0 bg-[#104912] hover:bg-[#104912]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 w-12 h-12" />
                </Carousel>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
