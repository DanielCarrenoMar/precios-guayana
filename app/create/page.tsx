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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
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
    if (!imageFile) return;
    setUploading(true);
    setErrorText("");

    uploadImage(imageFile).then(url => {
      setImageUrl(url);
      setUploading(false);
    }).catch(error => {
      setErrorText("Error al subir la imagen");
      setUploading(false);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) {
      setErrorText("Primero sube una imagen");
      return;
    }
    // Aquí puedes llamar a tu función para insertar el producto en la base de datos
    // usando title, description, price, lat, lng, category, imageUrl
    insertProduct({
      user_id: userId,
      title: title,
      description: description,
      price: parseFloat(price),
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      category: category,
      imagePath: imageUrl,
    });
    alert("Producto listo para subir a la base de datos con imagen: " + imageUrl);
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Crear Publicación</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Latitud"
          value={lat}
          onChange={e => setLat(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Longitud"
          value={lng}
          onChange={e => setLng(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        />
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={!imageFile || uploading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {uploading ? "Subiendo imagen..." : "Subir imagen"}
        </button>
        {imageUrl && (
          <div className="mt-2">
            <img src={imageUrl} alt="Imagen subida" className="max-h-40" />
            <p className="text-xs break-all">URL: {imageUrl}</p>
          </div>
        )}
        {errorText && <p className="text-red-500">{errorText}</p>}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Crear publicación</button>
      </form>
    </div>
  );
}
