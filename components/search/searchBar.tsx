'use client';
import { useState } from "react";
import { Magnifer } from "@solar-icons/react";

interface Props {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ placeholder = "Search...", onChange }: Props) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center relative w-full rounded-full bg-gray/[0.1] pl-3">
      <Magnifer size={20} color="currentColor" />
      <input
        className="w-full p-[10px] bg-transparent rounded-lg outline-none placeholder:text-text/[0.8]"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {setQuery(e.target.value); if (onChange) onChange(e); }}
      />
    </div>
  );
}