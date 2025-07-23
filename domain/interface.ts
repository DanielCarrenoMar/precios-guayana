export interface Product {
    id: number
    imagePath: string
    title: string
    description: string
    price: number
    location: Location
    category: string
    created_at: string
    updated_at: string
    user_id: string
}

interface User {
    imageProfilePath: string
    name: string
    email: string
    bios: string
    location: Location
    created_at: string
}

interface Offer {
    id: number
    user_id: string
    description: string
    url: string
    created_at: string
    updated_at: string
}

interface Comment {
    id: number
    user_id: string
    product_id: number
    comment: string
    created_at: string
    updated_at: string
}

interface Review {
    id: number
    user_id: string
    product_id: number
    rating: number
    created_at: string
    updated_at: string
}

export interface Location {
    latitude: number
    longitude: number
}