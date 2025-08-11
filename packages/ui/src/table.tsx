"use client";
import React, { ReactNode } from "react";

export interface TableProps {
  /** Konten di dalam tabel (thead, tbody, tr, dll.) */
  children: ReactNode;

  /** Class tambahan untuk styling tabel */
  className?: string;
}

/**
 * Komponen Table sederhana.
 * Gunakan untuk menampilkan data tabular dengan styling dasar.
 */
export const Table = ({ children, className }: TableProps) => {
  return (
    <table
      className={`min-w-full border border-gray-300 border-collapse ${className || ""}`}
    >
      {children}
    </table>
  );
};
