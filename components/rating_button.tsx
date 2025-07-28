"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';

interface RatingButtonProps {
    initialRating?: number;
    onRatingChange: (rating: number) => void;
    size?: number;
    className?: string;
}

export default function RatingButton({
    initialRating = 0,
    onRatingChange,
    size = 28,
    className,
}: RatingButtonProps) {
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(initialRating);

    const handleStarClick = (index: number) => {
        const newRating = index;
        setSelectedRating(newRating);
        onRatingChange(newRating);
    };


    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {[1, 2, 3, 4, 5].map((index) => {
                const isFilled = index <= (hoverRating || selectedRating);
                const starColor = isFilled ? "text-yellow-500" : "text-gray-400";

                return (
                    <Button key={index} variant="ghost" onClick={() => handleStarClick(index)}>
                        <Star
                            size={size}
                            className={`${starColor} cursor-pointer transition-colors duration-200`}
                            
                            fill={isFilled ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth={1.5}
                        />
                    </Button>

                );
            })}
        </div>
    );
}