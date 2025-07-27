import { createClient } from "@/lib/supabase/server";
import { getProductsByUserId, getUserById } from "@/lib/supabase/repository";
import { UUID } from "crypto";
import Image from "next/image";
import { LinkIcon, MapPin } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/productCard";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userClaim = data?.claims;
  if (!userClaim) {
    return (
      <div>error</div>
    )
  }
  const userId = userClaim?.sub as UUID

  const user = await getUserById(userId)
  const products = await getProductsByUserId(userId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className=" text-primary min-h-screen font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        <header className="bg-primary-foreground p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            {user.imageProfilePath ?
              <Image
                src={user.imageProfilePath}
                alt={`Foto de perfil de ${user.name}`}
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-gray-700"
              /> :
              <div className="size-32 bg-primary text-4xl font-bold text-primary-foreground rounded-full flex justify-center items-center">
                {user.name.toUpperCase()[0]}
              </div>
            }
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <p className="text-primary/80 mt-2 max-w-2xl">{user.bios}</p>

            <div className="flex items-center justify-center sm:justify-start gap-6 mt-4 text-sm text-gray-400">
              {user.contact &&
                <span>
                  <LinkIcon size={16} />
                  <h3>{user.contact}</h3>
                </span>
              }
              {user.latitude && user.longitude &&
                <Link href={`/map?lat=${user.latitude}&lng=${user.longitude}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <MapPin size={16} />
                  <span>Ver en el mapa</span>
                </Link>
              }
            </div>
            <p className="text-xs text-gray-500 mt-3">Miembro desde {formatDate(user.created_at)}</p>
          </div>
        </header>

        <main className="mt-12 p-6 rounded-xl bg-primary-foreground">
          <span className="flex gap-4 items-center mb-6">
            <h2 className="text-4xl font-bold">Tus Productos</h2>
              <Button variant="default" >Subir producto</Button>
          </span>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  user_id={product.user_id}
                  price={product.price}
                  image={product.imagesPath[0]}
                  product={product.title}
                  rating={product.rate}
                  update_at={product.updated_at}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Este usuario aún no ha subido productos.</p>
          )}
        </main>
      </div>
    </div>
  );
}