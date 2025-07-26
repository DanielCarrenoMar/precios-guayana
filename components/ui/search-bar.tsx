import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ 
  placeholder = "Buscar...", 
  value = "", 
  onChange,
  onFocus,
  onBlur
}: { 
  placeholder?: string; 
  value?: string; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  return (
    <div className="w-full flex items-center border border-gray-200 rounded-full px-4 py-3 bg-white shadow-md hover:shadow-lg transition-shadow">
      <Search size={20} className="text-gray-400 mr-2" />
              <input
          type="text"
          className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-500"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
    </div>
  );
}
