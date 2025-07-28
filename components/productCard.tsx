
'use client';
import { User } from "@/domain/interface";
import { getUserById } from "@/lib/supabase/repository";
import { UUID } from "crypto";
import Link from "next/link";
import { useState, useEffect } from 'react';

interface ProductCardProps {
  id: number;
  user_id: UUID
  price: number;
  product: string;
  image: string;
  rating?: number; // 0-5
  update_at: string
}

export default function ProductCard({ id, user_id, price, product, image, update_at, rating = 4 }: ProductCardProps) {
  const date = new Date(update_at);

  const [user, setUser] = useState<User>();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(user_id);
        setUser(userData);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUser();
  }, [user_id]);

  return (
    <Link href={`/product/${id}`} className="group max-w-64 bg-primary-foreground rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col h-86">
      <div className="relative bg-gray-50 p-4 flex items-center justify-center h-48 overflow-hidden">
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-bold shadow-md z-10">
          {price}$
        </div>
        <img
          src={image || "/no-image.png"}
          alt={product}
          className="max-h-32 max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product info */}
      <div className="p-4 bg-primary text-primary-foreground flex-1 flex flex-col justify-between min-h-12">
        <h4 className="text-xs font-bold uppercase tracking-wide mb-1 text-primary-foreground">
          {user?.name}
        </h4>

        <div>
          <h3 className="font-bold text-primary-foreground text-base mb-2 line-clamp-2 flex-1">
          {product}
        </h3>
        <h4 className="font-bold text-primary-foreground text-xs mb-2 line-clamp-2 flex-1">
          Actualizado:&nbsp;
          {new Intl.DateTimeFormat('es-ES', {
            dateStyle: 'full',
          }).format(date)}
        </h4>
        </div>
        
        <div className="flex items-center mt-auto">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}