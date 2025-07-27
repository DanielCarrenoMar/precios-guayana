import { useState } from 'react';
import { Store as StoreIcon, ShoppingBag as ShoppingBagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onShowBusinesses: () => void;
  onShowProducts: () => void;
}

type ActiveTab = 'businesses' | 'products';

export default function MapHeader({ onShowBusinesses, onShowProducts }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('businesses');

  const handleShowBusinesses = () => {
    setActiveTab('businesses');
    onShowBusinesses();
  };

  const handleShowProducts = () => {
    setActiveTab('products');
    onShowProducts();
  };

  return (
    <div className="flex w-full p-4 gap-4 md:gap-6 items-center justify-center">
      <Button
        onClick={handleShowBusinesses}
        variant={activeTab === 'businesses' ? 'default' : 'outline'}
      >
        <StoreIcon />
        Negocios
      </Button>

      <Button
        onClick={handleShowProducts}
        variant={activeTab === 'products' ? 'default' : 'outline'}
      >
        <ShoppingBagIcon />
        Productos
      </Button>
    </div>
  );
}