"use client";
import React, { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input komponen generik dengan style default.
 * Bisa menerima semua props bawaan <input>.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`border p-2 rounded ${className}`.trim()}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
