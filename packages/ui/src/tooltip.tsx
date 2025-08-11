"use client";
import React, { ReactNode } from "react";

export interface TooltipProps {
  /** Konten tooltip yang akan ditampilkan saat hover */
  content: ReactNode;

  /** Elemen anak yang akan memunculkan tooltip saat di-hover */
  children: ReactNode;

  /** Optional class tambahan untuk styling tooltip */
  className?: string;
}

/**
 * Komponen Tooltip sederhana.
 * Tampilkan informasi tambahan saat user hover pada elemen anak.
 */
export const Tooltip = ({ content, children, className }: TooltipProps) => {
  return (
    <span className="relative inline-block group">
      {children}
      <span
        className={`absolute hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap -top-8 left-1/2 -translate-x-1/2 ${className || ""}`}
      >
        {content}
      </span>
    </span>
  );
};
