"use client";
import React from "react";

export interface LoaderProps {
  /** Ukuran loader dalam pixel (default: 24) */
  size?: number;

  /** Class tambahan opsional untuk styling custom */
  className?: string;

  /** Warna loader, gunakan warna Tailwind seperti 'blue-500', 'gray-900', dll */
  colorClass?: string;
}

/**
 * Komponen Loader animasi spin sederhana.
 * Bisa mengatur ukuran, warna, dan menambahkan class custom.
 */
export const Loader = ({
  size = 24,
  className = "",
  colorClass = "border-blue-500",
}: LoaderProps) => {
  return (
    <div
      className={`animate-spin border-4 border-t-transparent rounded-full ${colorClass} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
