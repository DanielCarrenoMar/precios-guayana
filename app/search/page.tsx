"use client";
import ProductCard from "@/components/productCard";
import SearchBar from "@/components/ui/search-bar";
import { Product } from "@/domain/interface";
import { getProductsByNameAndCategory } from "@/lib/supabase/repository";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getProductsByNameAndCategory(searchText, "").then((data) => {
      setProducts(data);
    }).catch((error) => {
      console.error("Error fetching products:", error);
    });
  }, [searchText]);

  return (
    <div>
      <SearchBar
        placeholder="Buscar productos..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <h1>Buscar</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            price={product.price}
            image={product.imagePath}
            company={product.user_id.toString()}
            product={product.title}
            rating={product.rate}
          />
        ))}
      </ul>
    </div>
  );
}
