
import Link from "next/link";
import React from "react";

interface OfferCardProps {
  id: number;
  price: number;
  company: string;
  product: string;
  image: string;
}

export default function OfferCard({ id, price, company, product, image }: OfferCardProps) {
  return (
    <Link href={`/offer/${id}`} className="w-40 h-56 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between bg-white">
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
    </Link>
  );
}
