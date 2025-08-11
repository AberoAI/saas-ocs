"use client";
import React, { ReactNode } from "react";

export interface ModalProps {
  /** Status modal terbuka atau tertutup */
  open: boolean;

  /** Konten modal */
  children: ReactNode;

  /** Fungsi optional untuk menutup modal */
  onClose?: () => void;
}

/**
 * Komponen Modal sederhana dengan backdrop dan tombol close opsional.
 */
export const Modal = ({ open, children, onClose }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="relative bg-white p-4 rounded shadow-lg">
        {onClose && (
          <button
            type="button"
            className="absolute top-2 right-2"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
