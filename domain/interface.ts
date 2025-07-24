import { UUID } from "crypto"

export interface Product {
    id: number
    user_id: UUID
    imagePath: string
    rate: number
    title: string
    description: string
    price: number
    latitude?: number
    longitude?: number
    category: string
    created_at: string
    updated_at: string
}
export interface ProductPetition {
    user_id?: UUID
    imagePath?: string
    title?: string
    description?: string
    price?: number
    latitude?: number
    longitude?: number
    category?: string
}

export interface UserPetition {
    id: UUID
    imageProfilePath?: string
    name?: string
    bios?: string
    latitude?: number
    longitude?: number
    contact?: string
    created_at?: string
}
export interface User {
    id: UUID
    imageProfilePath?: string
    name: string
    bios: string
    latitude?: number
    longitude?: number
    contact?: string
    created_at: string
}

export interface OfferPetition {
    id: UUID
    user_id?: number
    imagePath?: string
    description?: string
    url?: string
    created_at?: string
    updated_at?: string
}
export interface Offer {
    id: number
    user_id: number
    imagePath: string
    description: string
    url: string
    created_at: string
    updated_at: string
}

export interface Comment {
    id: number
    user_id: UUID
    product_id: number
    comment: string
    created_at: string
    updated_at: string
}

export interface Review {
    id: number
    user_id: UUID
    product_id: number
    rating: number
    created_at: string
    updated_at: string
}