"use client";
import dynamic from 'next/dynamic';
import ProductMap from './components/product_map';

const DynamicProductMap = dynamic(
  () => import('./components/product_map'), {
  ssr: false,
});

export default function MapPage() {
  return (
    <div className='w-full h-full'>
      <DynamicProductMap />
    </div>
  );
}
