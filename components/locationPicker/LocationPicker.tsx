'use client';
import { useEffect, useRef, useState } from "react";
import { MapPoint } from "@solar-icons/react";
import { useOutsideClick } from "../../customHooks/useOutsideClick";

interface LocationPickerProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationPicker = ({ selectedLocation, onLocationChange }: LocationPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(selectedLocation || "");
    const inputRef = useRef<HTMLInputElement>(null);
    const popupRef = useOutsideClick(() => setIsOpen(false), false);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") {
            onLocationChange(value);
            setIsOpen(false);
        }
    }
    return (
        <div className="relative">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-[4px] text-[10px] leading-[14px] bg-gray/[0.09] rounded font-semibold"
        >
            {selectedLocation || "Select Location"}
        </button>

        {isOpen && (
            <div
            ref={popupRef}
            className="absolute top-full left-0 mt-2 w-80 bg-background border border-gray/[0.2] rounded-xl shadow-xl z-50 max-h-96 overflow-hidden flex flex-col"
            >
            {/* Header */}
            <div className="flex items-center px-4 gap-2 border-b border-gray/[0.2]">
                <MapPoint size={16} />
                <input
                ref={inputRef}
                type="text"
                placeholder="Type location..."
                value={value}
                onBlur={() => onLocationChange(value)}
                onKeyUp={(e) => handleKey(e)}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-lg py-4 text-sm focus:outline-none"
                />
            </div>
            </div>
        )}
        </div>
    );
};

export default LocationPicker;
