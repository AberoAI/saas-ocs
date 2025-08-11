"use client";
import React from "react";

export interface AvatarProps {
  /** URL gambar avatar */
  src: string;

  /** Teks alternatif untuk gambar (default: "Avatar") */
  alt?: string;

  /** Ukuran avatar dalam pixel (default: 40) */
  size?: number;

  /** Class tambahan opsional untuk styling custom */
  className?: string;
}

/**
 * Komponen Avatar sederhana berbentuk lingkaran.
 * Bisa mengatur ukuran, alt text, dan class tambahan.
 */
export const Avatar = ({
  src,
  alt = "Avatar",
  size = 40,
  className = "",
}: AvatarProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
