"use client";
import React from "react";

export interface TabsProps {
  /** Daftar nama tab */
  tabs: string[];

  /** Tab yang sedang aktif */
  active: string;

  /** Callback saat tab diganti */
  onChange: (tab: string) => void;

  /** Class tambahan opsional untuk container */
  className?: string;
}

/**
 * Komponen Tabs sederhana yang menampilkan daftar tab
 * dan memanggil callback `onChange` saat tab dipilih.
 */
export const Tabs = ({ tabs, active, onChange, className = "" }: TabsProps) => {
  return (
    <div className={`flex gap-4 border-b ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`py-2 transition-colors ${
              isActive
                ? "font-semibold border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
