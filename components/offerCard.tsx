
import Link from "next/link";
import React from "react";

interface OfferCardProps {
  id: number;
  company: string;
  description: string;
  image: string;
}

export default function OfferCard({ id, company, description, image }: OfferCardProps) {
  return (
    <Link href={`/offer/${id}`} className="group max-w-64 bg-primary-foreground rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col h-80">
      <div className="relative bg-gray-50 p-4 flex items-center justify-center h-48 overflow-hidden flex-shrink-0">
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-bold shadow-md z-10">
          Oferta
        </div>
        
        <img
          src={image}
          alt={description}
          className="max-h-32 max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4 bg-primary text-primary-foreground flex-1 flex flex-col justify-between min-h-[120px] overflow-hidden">
        <h4 className="text-xs font-bold uppercase tracking-wide mb-1 text-primary-foreground">
          {company}
        </h4>
        <p className=" text-primary-foreground text-base mb-2 line-clamp-2 flex-1 text-wrap">
          {description}
        </p>
      </div>
    </Link>
  );
}
