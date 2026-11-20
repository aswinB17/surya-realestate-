"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
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

  const navLinks = [
    { href: "/", labelEn: "Home", labelTa: "முகப்பு" },
    { href: "/projects", labelEn: "Our Projects", labelTa: "திட்டங்கள்" },
    { href: "/location", labelEn: "Location", labelTa: "இருப்பிடம்" },
    { href: "/gallery", labelEn: "Gallery", labelTa: "புகைப்படங்கள்" },
    { href: "/download", labelEn: "Download", labelTa: "பதிவிறக்கம்" },
    { href: "/about", labelEn: "About", labelTa: "எங்களைப் பற்றி" },
  ];

  return (
    <>
      {/* PREMIUM STICKY REAL ESTATE HEADER */}
      <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#E8E2D7] shadow-xs select-none">
        <div className="mx-auto flex h-16 sm:h-18 w-full max-w-[1760px] items-center justify-between px-4 sm:px-8 gap-3 sm:gap-6">
          
          {/* Left: Brand Identity (S Logo + Surya Promoters) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 text-[#171B18] hover:bg-[#F5F4EE] rounded-xl transition cursor-pointer"
              aria-label="Open Navigation Menu"
              title="Menu"
            >
              <Menu className="h-6 w-6" />
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
                <span className="font-display text-[9.5px] sm:text-[10.5px] font-extrabold tracking-[0.32em] text-[#0A2617] uppercase leading-none mt-1 text-center pl-1">
                  PROMOTERS
                </span>
                <div className="flex items-center gap-1.5 mt-1 justify-center">
                  <span className="h-[1px] w-3.5 bg-[#D9A52E]/40" />
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase text-[#64865A] font-bold">
                    ESTD. 2010 · MADURAI
                  </span>
                  <span className="h-[1px] w-3.5 bg-[#D9A52E]/40" />
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#173D2B] text-white shadow-xs font-bold"
                      : "text-[#171B18] hover:text-[#173D2B] hover:bg-[#F5F4EE]"
                  }`}
                >
                  {language === "ta" ? link.labelTa : link.labelEn}
                </Link>
              );
            })}
          </nav>

          {/* Right: Language switch + Veteran Badge + Contact Us CTA Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#E8E2D7] bg-[#F5F4EE] hover:bg-white text-xs font-mono font-bold text-[#171B18] shadow-2xs transition cursor-pointer"
              title="Switch Language"
            >
              <span>{language === "ta" ? "English" : "தமிழ்"}</span>
            </button>

            {/* IAF Veteran Trust Seal */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>16+ Yrs IAF Vet</span>
            </div>

            {/* Contact Us CTA Button */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#173D2B] hover:bg-[#112d20] text-white text-xs sm:text-sm font-bold shadow-xs transition hover:scale-105"
            >
              <span>{language === "ta" ? "தொடர்பு கொள்ள" : "Contact Us"}</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#C6A66B]" />
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
