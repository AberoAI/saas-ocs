"use client";
import React, { ReactNode } from "react";

export interface BadgeProps {
  /** Konten yang ditampilkan di dalam badge */
  children: ReactNode;

  /** Class tambahan untuk styling */
  className?: string;
}

/**
 * Komponen Badge sederhana untuk menampilkan label kecil.
 */
export const Badge = ({ children, className }: BadgeProps) => {
  return (
    <span
      className={`px-2 py-1 bg-gray-200 rounded text-sm ${className || ""}`}
    >
      {children}
    </span>
  );
};
