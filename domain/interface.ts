export interface Product {
    id: number
    user_id: number
    imagePath: string
    title: string
    description: string
    price: number
    location: Location
    category: string
    created_at: string
    updated_at: string
}

export interface UserPetition {
    imageProfilePath?: string
    name?: string
    email?: string
    bios?: string
    location?: Location
    created_at?: string
}
export interface User {
    imageProfilePath: string
    name: string
    email: string
    bios: string
    location: Location
    created_at: string
}

export interface OfferPetition {
    id?: number
    user_id?: number
    description?: string
    url?: string
    created_at?: string
    updated_at?: string
}
export interface Offer {
    id: number
    user_id: number
    description: string
    url: string
    created_at: string
    updated_at: string
}

export interface Comment {
    id: number
    user_id: number
    product_id: number
    comment: string
    created_at: string
    updated_at: string
}

export interface Review {
    id: number
    user_id: number
    product_id: number
    rating: number
    created_at: string
    updated_at: string
}

export interface Location {
    latitude: number
    longitude: number
}