"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { useCmsData } from "@/hooks/useCmsData";

export default function FloatingWhatsApp() {
  const { language } = useLanguage();
  const { data } = useCmsData();

  const companyWhatsapp = data?.company?.whatsapp || "+91 78457 16453";
  const rawNumber = companyWhatsapp.replace(/[^0-9]/g, "") || "917845716453";

  const message =
    language === "ta"
      ? "வணக்கம் சூரியா புரமோட்டர்ஸ், உங்கள் மனை திட்டங்கள் குறித்த விவரங்களை அறிய விரும்புகிறேன்."
      : "Hello Surya Promoters, I am interested in your Madurai projects. Please share details.";

  const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;

  return (
    <aside
      aria-label="WhatsApp Quick Contact"
      className="fixed bottom-20 right-4 md:bottom-7 md:right-7 z-40 pointer-events-auto"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Surya Promoters on WhatsApp"
        className="group relative flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer filter drop-shadow-[0_8px_24px_rgba(37,211,102,0.5)] hover:drop-shadow-[0_12px_32px_rgba(37,211,102,0.75)]"
        title="Chat on WhatsApp"
      >
        {/* Pulsing online badge */}
        <span className="absolute top-0 right-0 flex h-4 w-4 z-10 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-xs"></span>
        </span>

        {/* 3D Round WhatsApp Icon */}
        <div className="relative w-full h-full">
          <Image
            src="/images/whatsapp-3d.png"
            alt="WhatsApp Chat"
            fill
            sizes="(max-width: 640px) 56px, 64px"
            priority
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </a>
    </aside>
  );
}
