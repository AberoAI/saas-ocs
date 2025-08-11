"use client";
import React, { ReactNode } from "react";

export interface AlertProps {
  /** Konten yang akan ditampilkan di dalam alert */
  children: ReactNode;

  /** Tipe alert untuk menentukan warna: success, error, warning, atau info */
  type?: "success" | "error" | "warning" | "info";
}

/**
 * Komponen Alert sederhana dengan variasi warna berdasarkan tipe alert.
 */
export const Alert = ({ children, type = "info" }: AlertProps) => {
  const colors: Record<NonNullable<AlertProps["type"]>, string> = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className={`p-3 rounded ${colors[type]}`} role="alert">
      {children}
    </div>
  );
};
