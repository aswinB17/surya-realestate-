"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useCmsData } from "@/hooks/useCmsData";
import {
  Menu,
  ShieldCheck,
  Phone,
  ArrowRight,
} from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: cmsData } = useCmsData();

  const phone = cmsData?.company?.phone || "+91 77089 66452";
  const whatsapp = cmsData?.company?.whatsapp || "+91 78457 16453";
  const rawNumber = whatsapp.replace(/[^0-9]/g, "") || "917845716453";
  const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(
    language === "ta"
      ? "வணக்கம் சூர்யா புரமோட்டர்ஸ், உங்கள் மனை திட்டங்கள் குறித்த விவரங்களை அறிய விரும்புகிறேன்."
      : "Hello Surya Promoters, I am interested in your Madurai projects. Please share details."
  )}`;

  const navLinks = [
    { href: "/", labelEn: "Home", labelTa: "முகப்பு" },
    { href: "/projects", labelEn: "Our Projects", labelTa: "திட்டங்கள்" },
    { href: "/location", labelEn: "Location", labelTa: "இருப்பிடம்" },
    { href: "/gallery", labelEn: "Gallery", labelTa: "புகைப்படங்கள்" },
    { href: "/download", labelEn: "Download", labelTa: "பதிவிறக்கம்" },
    { href: "/about", labelEn: "About", labelTa: "எங்களைப் பற்றி" },
  ];

  const isHome = pathname === "/";

  return (
    <>
      {/* PREMIUM STICKY REAL ESTATE HEADER */}
      <header
        className={`sticky top-0 z-50 w-full ${isHome
          ? "bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#E8E2D7] shadow-xs"
          : "bg-gradient-to-r from-[#052617] via-[#083822] to-[#041D12] border-b border-[#0A3D25] shadow-lg backdrop-blur-xl"
          } select-none transition-colors duration-300`}
      >
        <div className="mx-auto flex h-16 sm:h-18 w-full max-w-[1760px] items-center justify-between px-3.5 sm:px-6 lg:px-8 gap-2.5 sm:gap-4 lg:gap-6">

          {/* Left: Brand Identity (S Logo + Surya Promoters) + Madurai Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 -ml-1 rounded-xl transition cursor-pointer ${isHome
                ? "text-[#171B18] hover:bg-[#F5F4EE]"
                : "text-[#D9A52E] hover:bg-white/10"
                }`}
              aria-label="Open Navigation Menu"
              title="Menu"
            >
              <Menu className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex flex-col">
                <div className="flex items-center whitespace-nowrap">
                  <span className="relative inline-flex items-center justify-center w-7 h-7 sm:w-7.5 sm:h-7.5 shrink-0 -mr-1">
                    <Image
                      src="/images/surya-gold-logo.png"
                      alt="S"
                      fill
                      priority
                      sizes="32px"
                      className="object-contain"
                    />
                  </span>
                  <span className="font-display text-lg sm:text-xl font-black tracking-[0.12em] text-[#D9A52E] leading-none uppercase">
                    URYA
                  </span>
                </div>
                <span
                  className={`font-display text-[9.5px] sm:text-[10.5px] font-extrabold tracking-[0.32em] uppercase leading-none mt-1 text-center pl-1 ${isHome ? "text-[#0A2617]" : "text-[#F1E4C3]"
                    }`}
                >
                  PROMOTERS
                </span>
                <div className="flex items-center gap-1.5 mt-1 justify-center">
                  <span className="h-[1px] w-3.5 bg-[#D9A52E]/40" />
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase font-bold ${isHome ? "text-[#64865A]" : "text-[#F1E4C3]/80"
                      }`}
                  >
                    ESTD. 2010 · MADURAI
                  </span>
                  <span className="h-[1px] w-3.5 bg-[#D9A52E]/40" />
                </div>
              </div>
            </Link>

            {/* Desktop Madurai Real Estate Badge */}
            {!isHome && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-[#E5A922]/50 text-xs font-bold text-[#0A2617] shadow-xs shrink-0 ml-2">
                <span className="w-2 h-2 rounded-full bg-[#E5A922] shrink-0 animate-pulse" />
                <span className="whitespace-nowrap">{language === "ta" ? "மதுரை ரியல் எஸ்டேட்" : "Madurai Real Estate"}</span>
              </div>
            )}
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${isActive
                    ? isHome
                      ? "bg-[#173D2B] text-white shadow-xs font-bold"
                      : "bg-gradient-to-r from-[#F5B731] via-[#EAB308] to-[#D98E14] text-[#0A1C12] shadow-xs font-bold"
                    : isHome
                      ? "text-[#171B18] hover:text-[#173D2B] hover:bg-[#F5F4EE]"
                      : "text-[#D8E6DE] hover:text-white hover:bg-white/10"
                    }`}
                >
                  {language === "ta" ? link.labelTa : link.labelEn}
                </Link>
              );
            })}
          </nav>

          {/* Right: Language switch + Veteran Badge + WhatsApp + Phone CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* IAF Veteran Trust Seal */}
            <div
              className={`hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs ${isHome
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-[#FAF5E8]/95 border border-[#D9A52E]/50 text-[#705820]"
                }`}
            >
              <ShieldCheck className={`h-3.5 w-3.5 ${isHome ? "text-emerald-600" : "text-[#B8860B]"}`} />
              <span className="whitespace-nowrap">16+ Yrs IAF Vet</span>
            </div>

            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-semibold shadow-xs transition cursor-pointer ${isHome
                ? "border-[#E8E2D7] bg-[#F5F4EE] hover:bg-white text-[#171B18]"
                : "border-neutral-200 bg-white/95 hover:border-[#E5A922]/50 text-[#0A1C12]"
                }`}
              title="Switch Language"
            >
              <span>{language === "ta" ? "English" : "தமிழ்"}</span>
            </button>

            {/* Phone Direct Button */}
            <a
              href={`tel:${phone}`}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0 hover:scale-105 active:scale-95 ${isHome
                ? "bg-[#173D2B] text-white hover:bg-[#112d20]"
                : "bg-[#051F12] border border-[#E5A922]/60 hover:border-[#E5A922] hover:bg-[#08301D] text-[#E5A922]"
                }`}
              title={`Call ${phone}`}
              aria-label={`Call ${phone}`}
            >
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>

            {/* Contact Us CTA Button */}
            <Link
              href="/contact"
              className={`hidden sm:inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-xs transition hover:scale-105 ${isHome
                ? "bg-[#173D2B] hover:bg-[#112d20] text-white"
                : "bg-gradient-to-r from-[#F5B731] via-[#EAB308] to-[#D98E14] text-[#0A1C12]"
                }`}
            >
              <span>{language === "ta" ? "தொடர்பு" : "Contact Us"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
