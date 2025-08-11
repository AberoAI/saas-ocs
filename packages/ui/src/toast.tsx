"use client";
import React, { ReactNode } from "react";

export interface ToastProps {
  /** Pesan yang akan ditampilkan, bisa berupa teks atau elemen React */
  message: ReactNode;

  /** Jenis toast untuk menentukan warna */
  type?: "success" | "error" | "info";

  /** Opsional: Callback ketika toast ditutup */
  onClose?: () => void;

  /** Class tambahan untuk styling */
  className?: string;
}

/**
 * Komponen Toast sederhana untuk menampilkan notifikasi singkat.
 */
export const Toast = ({
  message,
  type = "info",
  onClose,
  className = "",
}: ToastProps) => {
  const colors: Record<typeof type, string> = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div className={`relative p-2 rounded shadow ${colors[type]} ${className}`}>
      {message}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-white hover:text-gray-200"
        >
          ✕
        </button>
      )}
    </div>
  );
};
