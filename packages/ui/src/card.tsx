"use client";
import React, { ReactNode } from "react";

export interface CardProps {
  /** Optional className untuk styling */
  className?: string;

  /** Judul Card */
  title: string;

  /** Konten Card */
  children: ReactNode;

  /** Link tujuan */
  href: string;
}

export const Card = ({ className, title, children, href }: CardProps) => {
  return (
    <a
      className={
        className || "block p-4 border rounded hover:shadow-md transition"
      }
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2 className="text-lg font-semibold mb-2">
        {title} <span>-&gt;</span>
      </h2>
      <p className="text-gray-600">{children}</p>
    </a>
  );
};
