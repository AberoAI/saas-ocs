"use client";
import React, { ReactNode, useState } from "react";

export interface DropdownProps {
  /** Label tombol dropdown */
  label: string;

  /** Isi dropdown (biasanya <DropdownItem> atau elemen lainnya) */
  children: ReactNode;

  /** Class tambahan untuk styling container utama */
  className?: string;
}

/**
 * Komponen Dropdown sederhana.
 * Tampilkan konten dropdown di dalam `children`.
 */
export const Dropdown = ({ label, children, className }: DropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative inline-block ${className || ""}`}>
      <button
        className="px-4 py-2 bg-gray-200 rounded"
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
      </button>

      {open && (
        <div className="absolute mt-2 bg-white border rounded shadow z-10">
          {children}
        </div>
      )}
    </div>
  );
};
