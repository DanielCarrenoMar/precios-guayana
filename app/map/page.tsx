"use client";
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import MapHeader from './components/map_header';
import { Product, User } from '@/domain/interface';
import { getAllProducts, getAllUser } from '@/lib/supabase/repository';
import Link from 'next/link';
import L from 'leaflet';

const DynamicProductMap = dynamic(
  () => import('./components/product_map'), {
  ssr: false,
});

export default function MapPage() {
  const searchParams = useSearchParams()
  const [targetCoords, setTargetCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [showType, setShowType] = useState<"businesses" | "products">("products")

  useEffect(() => {
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (lat && lng) {
      const latNum = parseFloat(lat)
      const lngNum = parseFloat(lng)
      setTargetCoords({ lat: latNum, lng: lngNum })
    }
  }, [])

  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function fetchLocationProducts() {
      const data = await (await getAllProducts()).filter(products => products.latitude && products.longitude);
      setProducts(data);
    }

    async function fetchLocationUsers() {
      const data = await (await getAllUser()).filter(user => user.latitude && user.longitude);
      console.log(data)
      setUsers(data);
    }

    if (showType == "businesses") fetchLocationUsers()
    else fetchLocationProducts();
    
  }, [showType]);

  return (
    <div className='w-full h-full'>
      <MapHeader onShowBusinesses={() => { setShowType("businesses") }} onShowProducts={() => { setShowType("products") }} />
      <DynamicProductMap>
        {targetCoords && <FlyTo lat={targetCoords.lat} lng={targetCoords.lng} zoom={13} />}
        {showType == "products" ?
        products.map((product) => (
          product.latitude && product.longitude &&
          <Marker key={product.id} position={[product.latitude, product.longitude]} icon={new L.Icon({
            iconUrl: product.imagesPath[0],
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38]
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
        )) :
        users.map((user) => (
          user.latitude && user.longitude &&
          <Marker key={user.id} position={[user.latitude, user.longitude]} icon={new L.Icon({
            iconUrl: user.imageProfilePath || "/businesse.png",
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38]
          })}>
            <Popup>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p>{user.bios}</p>
                <Link href={`/user/${user.id}`} className="text-blue-500 hover:underline">Ver detalles</Link>
              </div>
            </Popup>
          </Marker>
        ))
        }
      </DynamicProductMap>
    </div>
  );
}

function FlyTo({ lat, lng, zoom = 15 }: { lat: number, lng: number, zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
}
