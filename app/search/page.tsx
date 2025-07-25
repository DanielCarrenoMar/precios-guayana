"use client";
import OfferCard from "@/components/offerCard";
import ProductCard from "@/components/productCard";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/search-bar";
import { Offer, Product } from "@/domain/interface";
import { getLastOffers, getProductsByNameAndCategory } from "@/lib/supabase/repository";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<("price" | "review")>("price");
  const [sortOrder, setSortOrder] = useState<("asc" | "desc")>("asc");
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"product" | "offer">("product");

  useEffect(() => {
    setLoading(true);
    function fetchProducts() {
      getProductsByNameAndCategory(searchText, "").then((data) => {
        const sortedProducts = data.sort((a, b) => {
          if (sortBy === "price") {
            return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
          } else {
            return sortOrder === "asc" ? a.rate - b.rate : b.rate - a.rate;
          }
        });
        setProducts(sortedProducts);
      }).catch((error) => {
        console.error("Error fetching products:", error);
      });
    }
    function fetchOffers() {
      getLastOffers(10).then((data) => {
        setOffers(data);
      }).catch((error) => {
        console.error("Error fetching offers:", error);
      });
    }

    console.log("Fetching data for type:", type);

    if (type === "product") {
      fetchProducts();
    } else {
      fetchOffers();
    }
    setLoading(false);
  }, [type, searchText, category, sortBy, sortOrder]);

  return (
    <>
      <section>
        <span className="flex gap-2 mb-4">
          <Button
            variant="outline"
            onClick={() => {
              setType("product");
              setSearchText("");
            }}
          >
            Buscar productos
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setType("offer");
              setSearchText("");
            }}
          >
            Buscar ofertas
          </Button>
        </span>
        {type}
        <SearchBar
          placeholder="Buscar productos..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </section>

      <h1>Buscar</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        { type === "product" ?
        products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            price={product.price}
            image={product.imagePath}
            company={product.user_id.toString()}
            product={product.title}
            rating={product.rate}

          />
        )) :
        offers.map((offer) => (
          <OfferCard
            key={offer.id}
            id={offer.id}
            price={-1}
            image={offer.imagePath}
            company={offer.user_id.toString()}
            product={offer.description}
          />
        ))}
      </ul>
    </>
  );
}
