import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ placeholder = "Buscar...", value = "", onChange }: { placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="w-full flex items-center border-2 border-green-200 rounded-full px-3 py-1 bg-white">
      <Search size={20} className="text-primary mr-2" />
      <input
        type="text"
        className="flex-1 outline-none bg-transparent text-primary placeholder-primary/80"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
