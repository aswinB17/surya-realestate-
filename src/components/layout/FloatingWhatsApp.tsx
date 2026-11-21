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
      ? "வணக்கம் சூர்யா புரமோட்டர்ஸ், உங்கள் மனை திட்டங்கள் குறித்த விவரங்களை அறிய விரும்புகிறேன்."
      : "Hello Surya Promoters, I am interested in your Madurai projects. Please share details.";

  const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;

  return (
    <aside
      aria-label="WhatsApp Quick Contact"
      className="fixed bottom-20 right-4 sm:right-6 md:bottom-6 md:right-6 lg:bottom-7 lg:right-7 z-50 pointer-events-auto"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          language === "ta"
            ? "வாட்ஸ்அப்பில் சூர்யா புரமோட்டர்ஸுடன் தொடர்பு கொள்க"
            : "Chat with Surya Promoters on WhatsApp"
        }
        title={language === "ta" ? "வாட்ஸ்அப்பில் பேச" : "Chat on WhatsApp"}
        className="group relative flex items-center justify-center h-13 w-13 sm:h-14 sm:w-14 md:h-15 md:w-15 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer filter drop-shadow-[0_8px_20px_rgba(37,211,102,0.45)] hover:drop-shadow-[0_12px_28px_rgba(37,211,102,0.7)]"
      >
        {/* Pulsing online badge */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5 z-20 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-xs"></span>
        </span>

        {/* Desktop Tooltip Hover Bubble */}
        <div className="hidden md:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-20">
          <div className="bg-[#0A2617]/95 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-[#E5A922]/40 backdrop-blur-xs flex items-center gap-1.5">
            <span>{language === "ta" ? "வாட்ஸ்அப்பில் பேச" : "Chat on WhatsApp"}</span>
          </div>
        </div>

        {/* 3D Round WhatsApp Icon */}
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src="/images/whatsapp-3d.png"
            alt="WhatsApp Chat"
            fill
            sizes="(max-width: 640px) 56px, 60px"
            priority
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </a>
    </aside>
  );
}
