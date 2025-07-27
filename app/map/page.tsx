"use client";
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

const DynamicProductMap = dynamic(
  () => import('./components/product_map'), {
  ssr: false,
});

export default function MapPage() {
  const searchParams = useSearchParams()
  const [targetCoords, setTargetCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(()=>{
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (lat && lng){
      const latNum = parseFloat(lat)
      const lngNum = parseFloat(lng)
      setTargetCoords({lat:latNum, lng:lngNum})
    }
  }, [])

  return (
    <div className='w-full h-full'>
      <DynamicProductMap>
        {targetCoords && <FlyTo lat={targetCoords.lat} lng={targetCoords.lng} zoom={13} />}
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
