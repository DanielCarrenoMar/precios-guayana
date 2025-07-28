// components/Starfield.tsx
"use client";

import { useMemo } from 'react';
import { Star } from 'lucide-react';

// Define un tipo para las propiedades de las estrellas para mayor claridad
interface StarProps {
  id: number;
  style: React.CSSProperties;
}

export default function Starfield() {
  const stars: StarProps[] = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      style: {
        // Posición horizontal aleatoria
        left: `${Math.random() * 100}%`,
        // Tamaño aleatorio para dar profundidad
        width: `${Math.random() * 2 + 10}px`,
        height: `${Math.random() * 2 + 10}px`,
        // Duración y retraso de animación aleatorios para un efecto natural
        animationDuration: `${Math.random() * 8 + 5}s`, // Duración entre 5s y 13s
        animationDelay: `-${Math.random() * 10}s`, // Empiezan en momentos diferentes
      },
    }));
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {stars.map((star) => (
        <Star
          key={star.id}
          className="animate-fall text-secondary absolute"
          style={star.style}
          fill="currentColor" // Rellena la estrella
        />
      ))}
    </div>
  );
}