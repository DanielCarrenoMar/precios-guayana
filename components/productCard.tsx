
import React from "react";

interface ProductCardProps {
  price: number;
  company: string;
  product: string;
  image: string;
  rating?: number; // 0-5
}

export default function ProductCard({ price, company, product, image, rating = 4 }: ProductCardProps) {
  return (
    <div className="w-40 h-56 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between bg-white overflow-hidden">
      {/* Price badge */}
      <div className="flex justify-center mt-2">
        <div className="bg-primary text-primary-foreground rounded-full px-6 py-1 text-lg font-bold shadow-sm">
          {price}
        </div>
      </div>
      {/* Image area */}
      <div className="flex-1 flex items-center justify-center">
          <img
            src={image}
            alt={product}
            className="max-h-24 max-w-[80%] object-contain rounded-md shadow-sm"
          />
      </div>
      {/* Company and product */}
      <div className="bg-primary/80 px-2 py-1 text-center">
        <span className="text-white font-bold text-sm tracking-wide uppercase">{company}</span>
      </div>
      <div className="bg-secondary/10 px-2 py-1 text-center">
        <span className="text-secondary font-semibold text-xs tracking-wide uppercase">{product}</span>
      </div>
      {/* Rating */}
      <div className="flex justify-center items-center pb-2 pt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={
            i < rating
              ? "text-primary text-lg"
              : "text-gray-300 text-lg"
          }>
            ★
          </span>
        ))}
      </div>
    </div>
  );
}
