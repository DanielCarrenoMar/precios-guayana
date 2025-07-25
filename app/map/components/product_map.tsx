"use client";
import { Product } from '@/domain/interface';
import { getAllProducts } from '@/lib/supabase/repository';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import Link from 'next/link';

export default function ProductMap() {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        async function fetchLocationProducts() {
            const data = await (await getAllProducts()).filter(products => products.latitude && products.longitude);
            setProducts(data);  
        }
        fetchLocationProducts();
    }, []);
    return (
        <>
            <MapContainer center={[8.279540502204656, -62.76105724412922]} zoom={13} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
                {products.map((product) => (
                    <Marker key={product.id} position={[product.latitude!!, product.longitude!!]}  icon={new L.Icon({
                    iconUrl: product.imagePath, // Path to your image in the public folder
                    iconSize: [38, 38], // Size of the icon [width, height]
                    iconAnchor: [19, 38], // Point of the icon which will correspond to marker's location
                    popupAnchor: [0, -38] // Point from which the popup should open relative to the iconAnchor
                })}>
                    <Popup>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-semibold">{product.title}</h3>
                            <p>{product.description}</p>
                            <p className="text-sm text-gray-500">Precio: {product.price} Bs</p>
                            <Link href={`/product/${product.id}`} className="text-blue-500 hover:underline">Ver detalles</Link>
                        </div>
                    </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </>
    );
}

function LocationMarker() {
    const [position, setPosition] = useState<(null | LatLngExpression)>(null)
    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}