"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(img)}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-[#E8E2D7] bg-[#F8F5EF] transition hover:border-[#C6A15B]"
          >
            <Image
              src={img}
              alt={`${title} - View ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-[#242820]/30 opacity-0 transition group-hover:opacity-100 flex items-center justify-center">
              <ZoomIn className="h-5 w-5 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 z-30 h-11 w-11 rounded-full bg-red-600 hover:bg-red-700 text-white border-2 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl ring-4 ring-red-600/30"
            aria-label="Close"
          >
            <X className="h-6 w-6 stroke-[3]" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const cur = images.indexOf(activeImage);
                  const prev = (cur - 1 + images.length) % images.length;
                  setActiveImage(images[prev]);
                }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-black/60 hover:bg-[#EAB308] text-white hover:text-[#0A0D12] border border-white/30 flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl"
                title="Previous image"
              >
                <ChevronLeft className="h-7 w-7 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const cur = images.indexOf(activeImage);
                  const next = (cur + 1) % images.length;
                  setActiveImage(images[next]);
                }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-black/60 hover:bg-[#EAB308] text-white hover:text-[#0A0D12] border border-white/30 flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl"
                title="Next image"
              >
                <ChevronRight className="h-7 w-7 stroke-[2.5]" />
              </button>
            </>
          )}

          <div
            className="relative aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
