"use client"
import { Button } from "@/components/ui/button";
import { User, UserPetition } from "@/domain/interface";
import { createClient } from "@/lib/supabase/client";
import { getUserById, updateUser } from "@/lib/supabase/repository";
import { UUID } from "crypto";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";

const LocationPickerMap = dynamic(
  () => import('../../../components/location-picker-map'), {
  ssr: false,
});

export default function EditProfilePage() {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updateMessage, setUpdateMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [errorText, setErrorText] = useState("");
    const [lat, setLat] = useState<number>();
    const [lng, setLng] = useState<number>();
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const GUAYANA_CITY_LAT = 8.3546;
    const GUAYANA_CITY_LNG = -62.6416;

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user.id) {
                const userId = session.user.id as UUID;
                const userData = await getUserById(userId);
                setUser(userData);
            }
        };
        fetchUser();
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        setUpdateMessage(null);

        const formData = new FormData(event.currentTarget);
        const updatedData: UserPetition = {
            id: user.id,
            name: formData.get('name') as string,
            bios: formData.get('bios') as string,
            contact: formData.get('contact') as string,
            latitude: lat,
            longitude: lng,
        };

        try {
            await updateUser(updatedData);
            setUpdateMessage({ text: "¡Perfil actualizado con éxito!", type: 'success' });
        } catch (error) {
            console.error("Failed to update user:", error);
            setUpdateMessage({ text: "Error al actualizar. Intenta de nuevo.", type: 'error' });
        } finally {
            setIsSubmitting(false);
            // El mensaje desaparecerá después de 3 segundos
            setTimeout(() => {
                setUpdateMessage(null);
            }, 3000);
        }
    }

    useEffect(() => {
    if (useCurrentLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
            setErrorText("");
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            setErrorText(
              "No se pudo obtener la ubicación actual. Por favor, selecciona manualmente en el mapa."
            );
            setUseCurrentLocation(false);

            setLat(GUAYANA_CITY_LAT);
            setLng(GUAYANA_CITY_LNG);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        setErrorText("Tu navegador no soporta la geolocalización.");
        setUseCurrentLocation(false);
      }
    } else {
      // If "use current location" is unchecked, reset to default or allow map selection
      // We don't clear lat/lng here, so the last selected map position (or default) remains
      // until a new one is selected on the map.
    }
  }, [useCurrentLocation]);

    const handleLocationChange = (newLat: number, newLng: number) => {
        setLat(newLat);
        setLng(newLng);
        setUseCurrentLocation(false);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="text-gray-800 pb-12 font-sans p-4 sm:p-6 md:p-8">
            <div className="container mx-auto ">
                <nav className="mb-8">
                    <Link href="/protected/profile" className="hover:text-primary">Volver a tu perfil</Link>
                </nav>
                <header className="mb-8 text-primary">
                    <h1 className="text-4xl font-bold">Editar Perfil</h1>
                </header>

                <div className="flex flex-col md:flex-row gap-8 bg-primary-foreground p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col justify-between gap-4 md:w-1/2">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                defaultValue={user.name}
                                className="w-full bg-background border border-border rounded-lg p-3"
                                required
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="bios" className="block text-sm font-medium mb-2">Descripción (Bio)</label>
                            <textarea
                                id="bios"
                                name="bios"
                                defaultValue={user.bios ?? ''}
                                rows={4}
                                className="w-full bg-background border border-border rounded-lg p-3"
                            />
                        </div>

                        {/* Contact */}
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium mb-2">Contacto (Email, Teléfono, etc.)</label>
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                defaultValue={user.contact ?? ''}
                                className="w-full bg-background border border-border rounded-lg p-3"
                            />
                        </div>
                        {errorText && <p className="text-red-500 mt-4 text-sm">{errorText}</p>}

                        {/* ✨ Contenedor para el botón y el mensaje de notificación */}
                        <div className="flex justify-end items-center pt-4 gap-4">
                            {updateMessage && (
                                <p className={`text-sm ${updateMessage.type === 'success' ? 'text-primary' : 'text-red-600'}`}>
                                    {updateMessage.text}
                                </p>
                            )}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                variant="default"
                                className="w-full py-6"
                            >
                                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </div>
                    </form>

                    <div className="md:w-1/2 flex flex-col gap-4"> {/* Take half width on medium screens */}
                        <h2 className="text-xl font-semibold mb-2 text-gray-700">Ubicación del Producto</h2>
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                id="useCurrentLocation"
                                checked={useCurrentLocation}
                                onChange={(e) => setUseCurrentLocation(e.target.checked)}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                            />
                            <label htmlFor="useCurrentLocation" className="text-gray-700 font-medium cursor-pointer">
                                Usar mi ubicación actual
                            </label>
                        </div>

                        {!useCurrentLocation && (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    O selecciona la ubicación en el mapa:
                                </label>
                                <LocationPickerMap
                                    initialLat={lat || GUAYANA_CITY_LAT}
                                    initialLng={lng || GUAYANA_CITY_LNG}
                                    onLocationChange={handleLocationChange}
                                />
                            </>
                        )}

                        {lat && lng && (
                            <p className="mt-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-md">
                                Ubicación seleccionada: Latitud: **{lat}**, Longitud: **{lng}**
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}