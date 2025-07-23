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

export interface Location {
    latitude: number
    longitude: number
}