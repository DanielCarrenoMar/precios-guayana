import { UUID } from "crypto"

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

export interface Product {
    id: number
    user_id: UUID
    imagesPath: string[]
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
export interface ProductInsert {
    user_id: UUID
    title: string
    description: string
    price: number
    latitude?: number
    longitude?: number
    category: string
}
export interface ProductPetition extends ProductInsert {
    imagesPath: string[]
}

export interface Offer {
    id: number
    user_id: UUID
    imagesPath: string[]
    description: string
    url: string
    created_at: string
    updated_at: string
}
export interface OfferInsert {
    user_id: UUID
    imagesPath?: string[]
    description?: string
    url?: string
}
export interface OfferPetition extends OfferInsert {
    imagesPath: string[]
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