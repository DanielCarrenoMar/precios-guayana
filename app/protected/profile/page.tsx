"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/auth-js";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data?.user) {
        router.replace("/auth/login");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-gray-500">Cargando perfil...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#EBEBEB] py-12">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8 mt-12">
        <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-[#558C2F] flex items-center justify-center text-white text-3xl font-bold mb-4">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="text-lg font-semibold">{user.email}</div>
        </div>
        <div className="mb-4">
          <span className="block text-gray-600 text-sm">ID de usuario:</span>
          <span className="block text-xs">{user.id}</span>
        </div>
        {/* Aquí puedes agregar más campos del usuario o un formulario de edición */}
        <Button
          className="mt-8 w-full"
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.replace("/auth/login");
          }}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
