"use client";
import React, { ReactNode } from "react";

export interface CodeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Komponen Code sederhana untuk menampilkan inline code block.
 */
export const Code = ({ children, className }: CodeProps) => {
  return <code className={className ?? "font-mono text-sm"}>{children}</code>;
};
