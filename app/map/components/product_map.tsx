"use client";
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L from 'leaflet';

export default function ProductMap({ children }: { children?: React.ReactNode }) {
    
    return (
        <MapContainer center={[8.279540502204656, -62.76105724412922]} zoom={13} scrollWheelZoom={true} style={{ width: "100%", height: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {children}
            <LocationMarker />
        </MapContainer>
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
        },
    })

    return position === null ? null : (
        <Marker position={position} icon={
            new L.Icon({
                iconUrl: "/marker-icon.png",
                iconSize: [24, 32],
                iconAnchor: [12, 32],
                popupAnchor: [0, -32],
            })
        }>
            <Popup>You are here</Popup>
        </Marker>
    )
}