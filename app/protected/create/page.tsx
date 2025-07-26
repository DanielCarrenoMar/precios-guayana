"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { insertProduct, uploadImage } from "@/lib/supabase/repository";
import { redirect } from "next/navigation";
import { UUID } from "crypto";

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [category, setCategory] = useState("");
  // Change imageFile to an array of Files
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // Change imageUrl to an array of strings
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [userId, setUserId] = useState<UUID>();

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
  }, []);

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
        // Decide if you want to stop on first error or continue
        throw error; // Re-throw to catch in .allSettled
      }
    });

    try {
      // Use Promise.allSettled to handle all promises and see their status
      await Promise.allSettled(uploadPromises);
      setImageUrls(uploadedUrls); // Set all successfully uploaded URLs
    } catch (error) {
      // Error handling for any failed uploads caught above
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
    if (!userId){
      setErrorText("No esta registrado");
      return;
    }

    insertProduct({
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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Crear Publicación</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Latitud"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Longitud"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          multiple // Key change: allow multiple file selection
          onChange={(e) => {
            if (e.target.files) {
              setImageFiles(Array.from(e.target.files)); // Convert FileList to array
            } else {
              setImageFiles([]);
            }
          }}
          className="border p-2 rounded"
        />
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={imageFiles.length === 0 || uploading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {uploading ? "Subiendo imágenes..." : "Subir imágenes"}
        </button>
        {imageUrls.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold mb-2">Imágenes Subidas:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-xs break-all truncate absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-b">
                    URL: {url.substring(url.lastIndexOf("/") + 1)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {errorText && <p className="text-red-500">{errorText}</p>}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Crear publicación
        </button>
      </form>
    </div>
  );
}