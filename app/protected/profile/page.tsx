"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/domain/interface";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data?.user) {
        router.replace("/auth/login");
      } else {
        const { data: profile, error: profileError } = await supabase
          .from("user")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profile) {
          setUser(null);
        } else {
          setUser(profile);
        }
      }
      setLoading(false);
    });
  }, [router]);

  const extra = {
    name: user?.name || "",
    bio: user?.bios || "",
    location: user?.latitude && user?.longitude
      ? `${user.latitude}, ${user.longitude}`
      : "",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-gray-500">Cargando perfil...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#ededed] flex flex-col items-center py-10">
      <div className="relative w-full max-w-2xl rounded-xl shadow bg-white overflow-hidden">
        {/* Green banner */}
        <div className="h-36 bg-gradient-to-b from-green-700 to-green-500 w-full" />
        {/* Avatar */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-12">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
            {/* SVG avatar */}
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="5" stroke="#558C2F" strokeWidth="2" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#558C2F" strokeWidth="2" />
            </svg>
          </div>
        </div>
        {/* Card content */}
        <div className="pt-16 pb-8 px-8 flex flex-col gap-2 items-start">
          <div className="font-semibold text-lg">{extra.name}</div>
          <div className="text-sm text-gray-700 whitespace-pre-line">{extra.bio}</div>
          <div className="flex items-center gap-2 mt-2 text-green-700">
            {/* Location icon */}
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" stroke="#558C2F" strokeWidth="2" />
              <circle cx="12" cy="11" r="2" stroke="#558C2F" strokeWidth="2" />
            </svg>
            <span className="text-sm">{extra.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}