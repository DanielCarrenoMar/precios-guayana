"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { insertProduct, uploadImage } from "@/lib/supabase/repository";
import { redirect } from "next/navigation";
import { UUID } from "crypto";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button"; // Assuming this is your Shadcn UI Button

interface LocationPickerMapProps {
  initialLat: number;
  initialLng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

function LocationPickerMap({
  initialLat,
  initialLng,
  onLocationChange,
}: LocationPickerMapProps) {
  const [position, setPosition] = useState<[number, number]>([
    initialLat,
    initialLng,
  ]);

  // Update map position if initialLat/Lng change (e.g., from geolocation)
  useEffect(() => {
    setPosition([initialLat, initialLng]);
  }, [initialLat, initialLng]);

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationChange(e.latlng.lat, e.latlng.lng);
      },
      locationfound: (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      className="h-80 w-full rounded-md shadow-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents />
      {position && (
        <Marker
          position={position}
          icon={
            new L.Icon({
              iconUrl: "/marker-icon.png",
              iconSize: [24, 32],
              iconAnchor: [12, 32],
              popupAnchor: [0, -32],
            })
          }
        ></Marker>
      )}
    </MapContainer>
  );
}

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [category, setCategory] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [userId, setUserId] = useState<UUID>();
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const GUAYANA_CITY_LAT = 8.3546;
  const GUAYANA_CITY_LNG = -62.6416;

  useEffect(() => {
    async function fetchSession() {
      const supabase = createClient();
      const { error, data } = await supabase.auth.getSession();
      if (error || !data?.session) {
        console.error("Authentication error:", error);
        redirect("/auth/login");
      } else {
        setUserId(data.session.user.id as UUID);
      }
    }
    fetchSession();

    setLat(GUAYANA_CITY_LAT.toString());
    setLng(GUAYANA_CITY_LNG.toString());
  }, []);

  useEffect(() => {
    if (useCurrentLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLat(position.coords.latitude.toString());
            setLng(position.coords.longitude.toString());
            setErrorText("");
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            setErrorText(
              "No se pudo obtener la ubicación actual. Por favor, selecciona manualmente en el mapa."
            );
            setUseCurrentLocation(false);

            setLat(GUAYANA_CITY_LAT.toString());
            setLng(GUAYANA_CITY_LNG.toString());
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
    setLat(newLat.toString());
    setLng(newLng.toString());
    setUseCurrentLocation(false);
  };

  async function handleImageUpload() {
    if (imageFiles.length === 0) {
      setErrorText("Selecciona al menos una imagen para subir.");
      return;
    }
    setUploading(true);
    setErrorText("");

    const uploadedUrls: string[] = [];
    const uploadPromises = imageFiles.map(async (file) => {
      try {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      } catch (error) {
        console.error("Error uploading image:", file.name, error);
        setErrorText(`Error al subir la imagen: ${file.name}`);
        throw error;
      }
    });

    try {
      await Promise.allSettled(uploadPromises);
      setImageUrls(uploadedUrls);
    } catch (error) {
      console.error("One or more image uploads failed.", error);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (imageUrls.length === 0) {
      setErrorText("Primero sube al menos una imagen.");
      return;
    }
    if (!userId) {
      setErrorText("No está registrado.");
      return;
    }
    if (!lat || !lng || parseFloat(lat) === 0 || parseFloat(lng) === 0) {
      setErrorText("Por favor, selecciona una ubicación o usa tu ubicación actual.");
      return;
    }

    await insertProduct({ // Use await here
      user_id: userId,
      title: title,
      description: description,
      price: parseFloat(price),
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      category: category,
      imagesPath: imageUrls,
    });

    redirect("/protected/profile");
  }

  return (
    <div className="max-w-screen-lg mx-auto my-8 p-8 bg-primary-foreground rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">Crear Nueva Publicación</h1>
      <div className="flex flex-col md:flex-row gap-8"> {/* Main container for two columns */}
        {/* Left Column: Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:w-1/2"> {/* Take half width on medium screens */}
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Detalles del Producto</h2>
          <input
            type="text"
            placeholder="Título del Producto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            placeholder="Descripción detallada del producto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-y"
          />
          <input
            type="number"
            placeholder="Precio en dolares (ej: 10.00$)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className="border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Categoría (ej: Electrónica, Ropa)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="image-upload" className="block text-xl font-semibold">Imágenes del Producto:</label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setImageFiles(Array.from(e.target.files));
                } else {
                  setImageFiles([]);
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 cursor-pointer"
            />
            <Button
              type="button" // Important: Prevent form submission
              variant="secondary"
              onClick={handleImageUpload}
              disabled={imageFiles.length === 0 || uploading}
            >
              {uploading ? "Subiendo imágenes..." : "Subir imágenes"}
            </Button>
          </div>

          {imageUrls.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-gray-700 mb-2">Imágenes Subidas:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-video rounded overflow-hidden">
                    <img
                      src={url}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <p className="text-xs break-all truncate absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-1 rounded-b-md">
                      {url.substring(url.lastIndexOf("/") + 1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {errorText && <p className="text-red-500 mt-4 text-sm">{errorText}</p>}

          <Button
            type="submit"
            variant="default"
            disabled={uploading || imageUrls.length === 0 || !userId || !lat || !lng}
            className="text-xl py-6"
          >
            Crear Publicación
          </Button>
        </form>

        {/* Right Column: Location Picker Map */}
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
                initialLat={parseFloat(lat || GUAYANA_CITY_LAT.toString())}
                initialLng={parseFloat(lng || GUAYANA_CITY_LNG.toString())}
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
  );
}