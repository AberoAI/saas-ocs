"use client";

import React, { ReactNode, MouseEvent, ButtonHTMLAttributes } from "react";

export interface ButtonProps {
  /** Konten di dalam tombol */
  children: ReactNode;

  /** Class tambahan untuk styling */
  className?: string;

  /** Nama aplikasi yang akan ditampilkan di alert (WAJIB) */
  appName: string;

  /** Event klik opsional */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Tambahan dukungan untuk properti native <button>,
 * tanpa menimpa API yang sudah kamu pakai.
 */
type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "onClick" | "children" | "type"
> & {
  /** Jenis tombol; default: "button" agar tidak submit form tanpa sengaja */
  type?: "button" | "submit" | "reset";
};

export const Button = ({
  children,
  className = "px-4 py-2 bg-blue-600 text-white rounded",
  appName,
  onClick,
  type = "button",
  ...rest
}: ButtonProps & NativeButtonProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Jika disabled, abaikan interaksi
    if (rest.disabled) return;

    // Panggil handler user lebih dulu
    if (onClick) {
      onClick(event);
    }

    // Tampilkan alert hanya jika handler user tidak memanggil preventDefault()
    if (!event.defaultPrevented) {
      // eslint-disable-next-line no-alert
      alert(`Hello from your ${appName} app!`);
    }
  };

  return (
    <button
      {...rest}
      className={className}
      onClick={handleClick}
      type={type}
      aria-disabled={rest.disabled ? true : undefined}
    >
      {children}
    </button>
  );
};
