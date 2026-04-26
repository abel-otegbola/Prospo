'use client'
import { useEffect, useState } from "react";

type ToastProps = {
  message?: string;
  type?: "error" | "success";
  duration?: number;
  timestamp?: number; // Add timestamp to force re-trigger with same message
};

export default function Toast({ message, type = "success", duration = 5000, timestamp }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      const resetTimer = setTimeout(() => setIsVisible(false), 0);
      return () => clearTimeout(resetTimer);
    }

    // Small delay to trigger animation
    const showTimer = setTimeout(() => setIsVisible(true), 50);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message, duration, timestamp]);

  if (!message) {
    return null;
  }

  return (
    <div
      className={`
        bg-background p-4 font-bold
        transition-all duration-300 ease-out overflow-hidden fixed top-4 left-4 z-[1000]
        rounded-md shadow-md m-2
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
        ${type === "error" ? "border-b border-red-400" : "border-b border-green-400"}
      `}
    >
      <p className={type === "error" ? "text-[var(--color-red)]" : "text-[var(--color-green)]"}>
        {message}
      </p>
    </div>
  );
}
