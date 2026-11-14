"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useCmsData } from "@/hooks/useCmsData";
import { CmsCategory } from "@/types/cms";
import {
  Building2,
  MapPin,
  Camera,
  ShieldCheck,
  Download,
  Phone,
  MessageCircle,
  Mail,
  Navigation,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Star,
  Play,
  Folder,
  Layers,
  FileText,
  Search,
  Sparkles,
  Maximize2,
  FileCheck,
  Home,
  Trees,
  Briefcase,
  SlidersHorizontal,
  Compass,
  Grid,
  Info,
  PhoneCall,
  Share2,
  Car,
  HeartPulse,
  GraduationCap,
  Droplets,
  TrendingUp,
  DollarSign,
  ThumbsUp,
  Building,
  Factory,
  Warehouse,
  Landmark,
  TreePine,
  Clock,
} from "lucide-react";
import { PROJECT_DETAILS_MAP } from "@/data/projectDetailsExtra";

// Project Data Model for Surya Promoters App-Store Experience
interface AppProject {
  id: string;
  name: { en: string; ta: string };
  category: string;
  categoryLabel: { en: string; ta: string };
  subcategory: string;
  subcategoryLabel: { en: string; ta: string };
  location: { en: string; ta: string };
  distanceInfo: { en: string; ta: string };
  image: string;
  blueprint?: string;
  blueprints?: { title: { en: string; ta: string }; image: string; tag?: { en: string; ta: string } }[];
  mapbhoomiUrl?: string;
  suitableActivities?: { en: string[]; ta: string[] };
  marketingBanner?: { en: string; ta: string };
  statusBadge: { en: string; ta: string };
  rating: string;
  description: { en: string; ta: string };
  highlights: { en: string[]; ta: string[] };
  mapsUrl: string;
  specs: { label: { en: string; ta: string }; value: { en: string; ta: string } }[];
}

export default function HomePage() {
  const { language, toggleLanguage } = useLanguage();
  const { data: cmsData } = useCmsData();

  const ALL_PROJECTS: AppProject[] = (cmsData?.projects || []) as AppProject[];
  const GALLERY_VIDEO_FOLDERS = cmsData?.gallery?.videoFolders || [];
  const GALLERY_IMAGE_FOLDERS = cmsData?.gallery?.imageFolders || [];
  const DOWNLOAD_ITEMS = cmsData?.downloads?.items || [];
  const companyInfo = cmsData?.company;
  const heroContent = cmsData?.hero;
  const statsList = cmsData?.stats?.items || [];
  const servicesList = cmsData?.services?.items || [];

  const phone = companyInfo?.phone || "+91 77089 66452";
  const whatsapp = companyInfo?.whatsapp || "+91 77089 66452";
  const rawWhatsapp = (whatsapp || "917708966452").replace(/[^0-9]/g, "");
  const email = companyInfo?.email || "suryapromotersmdu@gmail.com";
  const address = companyInfo?.address || "120 Feet Road, Near Mattuthavani Bus Stand, K.K. Nagar Corridor, Madurai, Tamil Nadu 625020";
  const mapsLink = companyInfo?.mapsLink || "https://maps.google.com/?q=Mattuthavani+Madurai";

  // Navigation State: Which of the 5 Main Icons / Sections is Active
  // 'home' | 'projects' | 'location' | 'gallery' | 'about' | 'download'
  const [activeTab, setActiveTab] = useState<"home" | "projects" | "location" | "gallery" | "about" | "download" | "contact">("home");

  // In "Our Projects": Which Category is Active
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Dynamic Categories from CMS
  const categoriesList: CmsCategory[] = useMemo<CmsCategory[]>(() => {
    if (cmsData?.categories && cmsData.categories.length > 0) {
      return cmsData.categories;
    }
    return [
      {
        id: "residential",
        name: { en: "Residential", ta: "குடியிருப்பு" },
        description: {
          en: "Surya Nagar 3 BHK Duplex Villa & Plotted Layouts",
          ta: "சூர்யா நகர் 3 BHK டூப்ளக்ஸ் வில்லா & மனைப்பிரிவுகள்",
        },
        icon: "Home",
      },
      {
        id: "commercial",
        name: { en: "Commercial", ta: "வணிக நிலங்கள்" },
        description: {
          en: "Manalur, Vandiyur & Pandi Kovil High-Exposure Corridors",
          ta: "மணலூர், வண்டியூர் & பாண்டி கோவில் பெருநிலங்கள்",
        },
        icon: "Briefcase",
      },
      {
        id: "farm",
        name: { en: "Farm Land", ta: "பண்ணை நிலம்" },
        description: {
          en: "Madurai Farms & Fruits Managed Agro Acreage",
          ta: "மதுரை பார்ம்ஸ் & புரூட்ஸ் இயற்கை பண்ணை நிலங்கள்",
        },
        icon: "TreePine",
      },
    ];
  }, [cmsData?.categories]);

  const currentCategoryObj = useMemo(() => {
    return categoriesList.find((c: CmsCategory) => c.id === activeCategory);
  }, [categoriesList, activeCategory]);

  const getPageCategoryIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case "home":
        return Home;
      case "building2":
      case "building":
        return Building2;
      case "treepine":
      case "trees":
      case "wheat":
      case "tree":
        return Trees;
      case "factory":
        return Factory;
      case "warehouse":
        return Warehouse;
      case "briefcase":
        return Briefcase;
      case "landmark":
        return Landmark;
      default:
        return Folder;
    }
  };

  // Search input query
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Popups
  const [selectedProject, setSelectedProject] = useState<AppProject | null>(null);
  const [selectedFolderImages, setSelectedFolderImages] = useState<{ title: string; images: string[] } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; duration: string } | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lock body & background scrolling whenever any modal popup is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(selectedProject || selectedFolderImages || selectedVideo || isEnquiryModalOpen);
    if (isAnyModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [selectedProject, selectedFolderImages, selectedVideo, isEnquiryModalOpen]);

  // Project Details Modal interactive media & tab states
  const [modalActiveImage, setModalActiveImage] = useState<string | null>(null);
  const [modalMediaMode, setModalMediaMode] = useState<"photos" | "video">("photos");
  const [modalSectionTab, setModalSectionTab] = useState<"overview" | "locality" | "valuation" | "reviews">("overview");
  const [modalActiveBlueprintIndex, setModalActiveBlueprintIndex] = useState<number>(0);

  useEffect(() => {
    if (selectedProject) {
      setModalActiveImage(selectedProject.image);
      setModalMediaMode("photos");
      setModalSectionTab("overview");
      setModalActiveBlueprintIndex(0);
    }
  }, [selectedProject]);

  // Filter projects inside active category
  const activeCategoryProjects = activeCategory
    ? ALL_PROJECTS.filter((p) => {
      const matchesCategory = p.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.ta.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.en.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    : [];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const residentialCount = ALL_PROJECTS.filter((p) => p.category === "residential").length;
  const commercialCount = ALL_PROJECTS.filter((p) => p.category === "commercial").length;
  const farmCount = ALL_PROJECTS.filter((p) => p.category === "farm").length;

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#0A0D12] font-sans antialiased flex flex-col selection:bg-[#EAB308] selection:text-[#0A0D12]">

      {/* ------------------------------------------------------------------------- */}
      {/* 1. TOP APP STORE WINDOW HEADER (Search & Quick Controls)                  */}
      {/* ------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs select-none">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Left Brand Identity: "S" Logo + Surya Promoters */}
          <Link href="/" className="flex items-center  gap-1.5 sm:gap-2  shrink-0 group">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/surya-gold-logo.png"
                alt="Surya Promoters Logo"
                fill
                priority
                sizes="44px"
                className="object-contain"
              />
            </div>
            <div className="flex items-center -ml-2 sm:-ml-2.5">
              <span className="font-black text-lg sm:text-xl text-[#0A0D12] group-hover:text-[#B45309] transition-colors leading-none flex items-center">
                <span className="tracking-tighter">URYA</span>
                <span className="ml-1.5 font-extrabold text-[#0A0D12] tracking-tight">PROMOTERS</span>
              </span>
              <span className="hidden sm:inline-flex ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-[#FEF08A] text-[#854D0E] border border-amber-300 whitespace-nowrap">
                ESTD. 2010
              </span>
            </div>
          </Link>

          {/* Center: Search Bar (Microsoft Store Window Search) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "ta"
                  ? "திட்டங்கள், இடங்கள், வணிக நிலங்களைத் தேடுங்கள்..."
                  : "Search projects, locations, farm land, and more..."
              }
              className="w-full pl-10 pr-9 py-2 bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white text-xs font-semibold text-neutral-800 placeholder-neutral-400 rounded-xl border border-neutral-200 focus:border-[#EAB308] focus:ring-2 focus:ring-[#EAB308]/20 outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right: Quick Controls, Language Switch & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">

            {/* IAF Veteran Trust Seal */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#854D0E] font-bold">
              <ShieldCheck className="h-3.5 w-3.5 text-[#B45309]" />
              <span>16+ Yrs IAF Vet</span>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#0A0D12] font-bold border border-neutral-200 transition-colors cursor-pointer"
            >
              {language === "en" ? "தமிழ்" : "English"}
            </button>

            {/* WhatsApp Direct */}
            <a
              href={`https://wa.me/${rawWhatsapp}?text=Hello%20Surya%20Promoters,%20I%20am%20interested%20in%20your%20Madurai%20projects.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold transition-all shadow-xs cursor-pointer"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>

            {/* Call Now */}
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0A0D12] hover:bg-neutral-800 text-[#EAB308] font-bold transition-all shadow-xs cursor-pointer"
            >
              <Phone className="h-3.5 w-3.5 text-[#EAB308]" />
              <span className="hidden xs:inline">{phone}</span>
            </a>
          </div>

        </div>
      </header>

      {/* ------------------------------------------------------------------------- */}
      {/* 2. MAIN APPLICATION STORE BODY (Left Vertical Nav + Content Window)       */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-1 flex max-w-[1760px] w-full mx-auto overflow-hidden">

        {/* LEFT VERTICAL APP STORE NAVIGATION BAR (Like Microsoft Store Left Rail - Desktop Only) */}
        <aside className="hidden md:flex md:w-56 shrink-0 bg-[#FFFFFF] border-r border-[#E5E7EB] flex-col justify-between py-4 select-none">
          <div className="space-y-1.5 px-2">

            {/* Nav Item: Home */}
            <button
              onClick={() => setActiveTab("home")}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer relative ${activeTab === "home"
                  ? "bg-neutral-100 text-[#0A0D12] font-black"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-semibold"
                }`}
            >
              {activeTab === "home" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-[#EAB308]" />
              )}
              <Home className={`h-5 w-5 shrink-0 ${activeTab === "home" ? "text-[#EAB308]" : "text-neutral-500"}`} />
              <span className="hidden md:inline text-xs truncate">
                {language === "ta" ? "முகப்பு" : "Store Home"}
              </span>
            </button>

            {/* Nav Item: Our Projects */}
            <button
              onClick={() => {
                setActiveTab(activeTab === "projects" ? "home" : "projects");
                setActiveCategory(null);
              }}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer relative ${activeTab === "projects"
                  ? "bg-neutral-100 text-[#0A0D12] font-black"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-semibold"
                }`}
            >
              {activeTab === "projects" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-[#EAB308]" />
              )}
              <Building2 className={`h-5 w-5 shrink-0 ${activeTab === "projects" ? "text-[#B45309]" : "text-neutral-500"}`} />
              <span className="hidden md:inline text-xs truncate">
                {language === "ta" ? "திட்டங்கள்" : "Our Projects"}
              </span>
            </button>

            {/* Nav Item: Site Location */}
            <button
              onClick={() => setActiveTab(activeTab === "location" ? "home" : "location")}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer relative ${activeTab === "location"
                  ? "bg-neutral-100 text-[#0A0D12] font-black"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-semibold"
                }`}
            >
              {activeTab === "location" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-[#EAB308]" />
              )}
              <MapPin className={`h-5 w-5 shrink-0 ${activeTab === "location" ? "text-blue-600" : "text-neutral-500"}`} />
              <span className="hidden md:inline text-xs truncate">
                {language === "ta" ? "தள அமைவிடம்" : "Site Location"}
              </span>
            </button>

            {/* Nav Item: Gallery */}
            <button
              onClick={() => setActiveTab(activeTab === "gallery" ? "home" : "gallery")}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer relative ${activeTab === "gallery"
                  ? "bg-neutral-100 text-[#0A0D12] font-black"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-semibold"
                }`}
            >
              {activeTab === "gallery" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-[#EAB308]" />
              )}
              <Camera className={`h-5 w-5 shrink-0 ${activeTab === "gallery" ? "text-purple-600" : "text-neutral-500"}`} />
              <span className="hidden md:inline text-xs truncate">
                {language === "ta" ? "புகைப்படங்கள் & வீடியோ" : "Gallery Folders"}
              </span>
            </button>

            {/* Nav Item: About Company */}
            <button
              onClick={() => setActiveTab(activeTab === "about" ? "home" : "about")}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer relative ${activeTab === "about"
                  ? "bg-neutral-100 text-[#0A0D12] font-black"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-semibold"
                }`}
            >
              {activeTab === "about" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-[#EAB308]" />
              )}
              <ShieldCheck className={`h-5 w-5 shrink-0 ${activeTab === "about" ? "text-emerald-700" : "text-neutral-500"}`} />
              <span className="hidden md:inline text-xs truncate">
                {language === "ta" ? "நிறுவனம் பற்றி" : "About Company"}
              </span>
            </button>

            {/* Nav Item: Download Layout */}
            <button
              onClick={() => setActiveTab(activeTab === "download" ? "home" : "download")}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer relative ${activeTab === "download"
                  ? "bg-neutral-100 text-[#0A0D12] font-black"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-semibold"
                }`}
            >
              {activeTab === "download" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-[#EAB308]" />
              )}


              <Download className={`h-5 w-5 shrink-0 ${activeTab === "download" ? "text-amber-700" : "text-neutral-500"}`} />
              <span className="hidden md:inline text-xs truncate">
                {language === "ta" ? "வரைபடம் பதிவிறக்கம்" : "Download Layout"}
              </span>
            </button>

            {/* Nav Item: Contact */}
            <button
              onClick={() => setActiveTab(activeTab === "contact" ? "home" : "contact")}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer relative ${activeTab === "contact"
                  ? "bg-neutral-100 text-[#0A0D12] font-black"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-semibold"
                }`}
            >
              {activeTab === "contact" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-[#EAB308]" />
              )}
              <PhoneCall className={`h-5 w-5 shrink-0 ${activeTab === "contact" ? "text-[#B45309]" : "text-neutral-500"}`} />
              <span className="hidden md:inline text-xs truncate">
                {language === "ta" ? "நேரடி தொடர்பு" : "Contact Us"}
              </span>
            </button>

          </div>

          {/* Bottom Rail: Direct Communication Link */}
          <div className="px-2 pt-3 border-t border-neutral-100 space-y-1">
            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left text-neutral-700 hover:bg-amber-50 hover:text-[#B45309] transition-colors cursor-pointer font-bold"
            >
              <PhoneCall className="h-5 w-5 text-[#B45309] shrink-0" />
              <span className="hidden md:inline text-xs truncate">
                {language === "ta" ? "நேரடி தொடர்பு" : "Direct Contact"}
              </span>
            </button>
          </div>
        </aside>

        {/* MAIN STORE CONTENT CANVAS */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pb-28 md:pb-8">

          {/* =================================================================== */}
          {/* 1. STORE HOME SCREEN (Visible ONLY when activeTab === "home")        */}
          {/* =================================================================== */}
          {activeTab === "home" && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">

              {/* ------------------------------------------------------------------- */}
              {/* THE 6 MAIN APP-STORE ICONS (Apps we think you'll love row)           */}
              {/* ------------------------------------------------------------------- */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-lg font-black text-neutral-900 flex items-center gap-1.5">
                    <span>{language === "ta" ? "பிரதான சேவைகள் & அம்சங்கள்" : "Explore Surya Promoters (6 Main Icons)"}</span>
                    <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
                  </h2>
                </div>

                {/* The 6 Rounded Squircle App Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">

                  {/* App Tile 1: Our Projects */}
                  <button
                    onClick={() => {
                      setActiveTab("projects");
                      setActiveCategory(null);
                    }}
                    className="p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer group flex flex-col justify-between bg-[#FFFFFF] hover:bg-neutral-50 border-neutral-200/80 shadow-xs hover:border-[#EAB308]/60 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                      <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-2xl bg-amber-50 text-[#B45309] border border-amber-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black bg-[#FEF08A] text-[#854D0E]">
                        3 Types
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-xs sm:text-sm text-neutral-900 group-hover:text-[#B45309] transition-colors">
                        {language === "ta" ? "எங்கள் திட்டங்கள்" : "Our Projects"}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                        {language === "ta" ? "3 பிரிவுகள் · 9 தளங்கள்" : "Residential, Commercial & Farm"}
                      </p>
                    </div>
                  </button>

                  {/* App Tile 2: Site Location */}
                  <button
                    onClick={() => setActiveTab("location")}
                    className="p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer group flex flex-col justify-between bg-[#FFFFFF] hover:bg-neutral-50 border-neutral-200/80 shadow-xs hover:border-blue-400/60 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                      <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black bg-blue-100 text-blue-700">
                        GPS Live
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-xs sm:text-sm text-neutral-900 group-hover:text-blue-600 transition-colors">
                        {language === "ta" ? "தள அமைவிடம்" : "Site Location"}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                        {language === "ta" ? "கூகிள் மேப்ஸ் & 3D வரைபடங்கள்" : "3D Cadastral & GPS Maps"}
                      </p>
                    </div>
                  </button>

                  {/* App Tile 3: Gallery */}
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className="p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer group flex flex-col justify-between bg-[#FFFFFF] hover:bg-neutral-50 border-neutral-200/80 shadow-xs hover:border-purple-400/60 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                      <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black bg-purple-100 text-purple-700">
                        HD Media
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-xs sm:text-sm text-neutral-900 group-hover:text-purple-600 transition-colors">
                        {language === "ta" ? "புகைப்படங்கள் & வீடியோ" : "Gallery"}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                        {language === "ta" ? "கோப்பு முறை மையம்" : "Videos & Photos Folders"}
                      </p>
                    </div>
                  </button>

                  {/* App Tile 4: About Company */}
                  <button
                    onClick={() => setActiveTab("about")}
                    className="p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer group flex flex-col justify-between bg-[#FFFFFF] hover:bg-neutral-50 border-neutral-200/80 shadow-xs hover:border-emerald-500/60 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                      <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black bg-emerald-100 text-emerald-800">
                        IAF Vet
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-xs sm:text-sm text-neutral-900 group-hover:text-emerald-700 transition-colors">
                        {language === "ta" ? "நிறுவனம் பற்றி" : "About Company"}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                        {language === "ta" ? "நிறுவனர் & 16+ வரலாறு" : "Founder & 16+ Yrs Legacy"}
                      </p>
                    </div>
                  </button>

                  {/* App Tile 5: Download Layout */}
                  <button
                    onClick={() => setActiveTab("download")}
                    className="p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer group flex flex-col justify-between bg-[#FFFFFF] hover:bg-neutral-50 border-neutral-200/80 shadow-xs hover:border-amber-500/60 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                      <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <Download className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black bg-amber-100 text-amber-800">
                        PDF Hub
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-xs sm:text-sm text-neutral-900 group-hover:text-amber-700 transition-colors">
                        {language === "ta" ? "வரைபடம் பதிவிறக்கம்" : "Download Layout"}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                        {language === "ta" ? "புளூபிரிண்ட், வரைபடம், கையேடுகள்" : "Blueprints, Layouts & PDFs"}
                      </p>
                    </div>
                  </button>

                  {/* App Tile 6: Contact Us */}
                  <button
                    onClick={() => setActiveTab("contact")}
                    className="p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer group flex flex-col justify-between bg-[#FFFFFF] hover:bg-neutral-50 border-neutral-200/80 shadow-xs hover:border-[#EAB308]/60 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                      <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-2xl bg-amber-50 text-[#B45309] border border-[#EAB308] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <PhoneCall className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black bg-[#FEF08A] text-[#854D0E]">
                        24/7 Live
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-xs sm:text-sm text-neutral-900 group-hover:text-[#B45309] transition-colors">
                        {language === "ta" ? "நேரடி தொடர்பு" : "Contact Us"}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                        {language === "ta" ? "அழைப்பு, வாட்ஸ்அப் & அலுவலகம்" : "Phone, WhatsApp & Office"}
                      </p>
                    </div>
                  </button>

                </div>
              </section>
            </div>
          )}

          {/* =================================================================== */}
          {/* =================================================================== */}
          {/* 2. TAB 1: OUR PROJECTS (Screen Changes Completely: Categories vs Cards) */}
          {/* =================================================================== */}
          {activeTab === "projects" && (
            <section className="space-y-6 animate-fadeIn pt-1">
              {activeCategory === null ? (
                /* ----------------------------------------------------------------- */
                /* SCREEN A: 3 CATEGORY SELECTION CARDS ONLY (No project cards below) */
                /* ----------------------------------------------------------------- */
                <div className="space-y-6">
                  {/* Back to Home & Section Title Header */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab("home")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-xs"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>{language === "ta" ? "முகப்புக்கு திரும்புக" : "Back to Home"}</span>
                      </button>
                      <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-neutral-900 leading-tight">
                          {language === "ta" ? "எங்கள் திட்டங்கள் (3 முக்கிய பிரிவுகள்)" : "Our Projects (3 Main Categories)"}
                        </h3>
                        <p className="text-[11px] text-neutral-500 hidden sm:block">
                          {language === "ta" ? "பிரிவை கிளிக் செய்து அந்த பிரிவின் திட்டங்களை தனி பக்கத்தில் காண்க" : "Click any category below to navigate to its dedicated project cards"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("home")}
                      className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                      title="Close section and return to Home"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* 3 Categories Main Hub Box */}
                  <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200/80 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#B45309] tracking-wider block mb-0.5">
                          {language === "ta" ? "படி 1: திட்ட பிரிவை தேர்ந்தெடுக்கவும்" : "Step 1: Choose Property Category"}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
                          {language === "ta"
                            ? `${categoriesList.length} பிரிவுகள் (${categoriesList.map((c) => c.name.ta).join(" · ")})`
                            : `Our ${categoriesList.length} Property Categories`}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {language === "ta" ? "கீழே உள்ள பிரிவை கிளிக் செய்யவும் — திட்டங்கள் புதிய பக்கத்தில் திறக்கும்" : "Click a category card to open that category's dedicated project page"}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3.5 py-1.5 rounded-full w-fit">
                        {ALL_PROJECTS.length} Total Developments
                      </span>
                    </div>

                    {/* Categories Box / Icons Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {categoriesList.map((cat, idx) => {
                        const count = ALL_PROJECTS.filter((p) => p.category === cat.id).length;
                        const IconComp = getPageCategoryIcon(cat.icon);
                        const catNum = String(idx + 1).padStart(2, "0");

                        return (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className="p-5 sm:p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden bg-white hover:bg-amber-50/40 text-neutral-900 border-neutral-200 shadow-xs hover:shadow-lg hover:border-[#EAB308] hover:-translate-y-0.5"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-xs bg-amber-50 text-[#B45309] border border-amber-200">
                                <IconComp className="h-7 w-7" />
                              </div>
                              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-[#B45309]">
                                {count} {count === 1 ? "Project" : "Projects"}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest block text-neutral-400 mb-1">
                                Category {catNum}
                              </span>
                              <h4 className="text-base sm:text-lg font-black leading-snug group-hover:text-[#B45309] transition-colors">
                                {idx + 1}. {cat.name[language] || cat.name.en}
                              </h4>
                              <p className="text-xs mt-1.5 leading-relaxed text-neutral-500 line-clamp-2">
                                {cat.description?.[language] || cat.description?.en || `${count} Projects available`}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#B45309]">
                              <span>{language === "ta" ? "கார்டுகளை காண கிளிக் செய்க" : "Click to View Cards"}</span>
                              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Direct Contact strip */}
                    <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-700">{language === "ta" ? "நேரடி ஆலோசனை:" : "Direct Assistance:"}</span>
                        <a href={`tel:${phone}`} className="font-mono font-bold text-neutral-900 hover:text-[#B45309]">
                          {phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ----------------------------------------------------------------- */
                /* SCREEN B: DEDICATED CATEGORY PROJECTS VIEW (Cards ONLY, no hub)   */
                /* ----------------------------------------------------------------- */
                <div className="space-y-6">
                  {/* Back to Categories Navigation Header */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {/* Back to Categories Button */}
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A0D12] hover:bg-neutral-800 text-white text-xs sm:text-sm font-black transition-all hover:scale-105 cursor-pointer shadow-md"
                      >
                        <ArrowLeft className="h-4 w-4 text-[#EAB308]" />
                        <span>{language === "ta" ? "அனைத்து பிரிவுகளுக்கும் திரும்புக" : "Back to Categories"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab("home");
                          setActiveCategory(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Home className="h-3.5 w-3.5" />
                        <span>{language === "ta" ? "முகப்பு" : "Home"}</span>
                      </button>

                      <div className="h-4 w-px bg-neutral-200 hidden md:block" />

                      {/* Breadcrumb */}
                      <div className="text-xs text-neutral-500 font-medium hidden sm:flex items-center gap-1.5">
                        <span>Our Projects</span>
                        <span>/</span>
                        <span className="font-bold text-neutral-900">
                          {currentCategoryObj
                            ? currentCategoryObj.name[language] || currentCategoryObj.name.en
                            : activeCategory}
                        </span>
                      </div>
                    </div>

                    {/* Category Switcher Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {categoriesList.map((cat, idx) => {
                        const isCatActive = activeCategory === cat.id;
                        const pCount = ALL_PROJECTS.filter((p) => p.category === cat.id).length;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                              isCatActive
                                ? "bg-[#0A0D12] text-[#EAB308] shadow-xs font-black ring-1 ring-[#EAB308]"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            }`}
                          >
                            {idx + 1}. {cat.name[language] || cat.name.en} ({pCount})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Page Title Banner */}
                  <div className="bg-gradient-to-r from-[#0A0D12] via-[#111827] to-[#1F2937] text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-neutral-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#EAB308] text-xs font-bold mb-2">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>
                            {language === "ta" ? "பிரிவு:" : "Category:"} {currentCategoryObj ? (currentCategoryObj.name[language] || currentCategoryObj.name.en) : activeCategory}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          {currentCategoryObj ? (currentCategoryObj.name[language] || currentCategoryObj.name.en) : activeCategory}
                        </h3>
                        {currentCategoryObj?.description && (
                          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                            {currentCategoryObj.description[language] || currentCategoryObj.description.en}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1 border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
                        <span className="text-2xl font-black text-[#EAB308]">{activeCategoryProjects.length}</span>
                        <span className="text-xs text-neutral-400 font-semibold">{language === "ta" ? "திட்டங்கள் உள்ளன" : "Verified Projects"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cards Grid for activeCategory */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 ${activeCategoryProjects.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-5`}>
                    {activeCategoryProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-xs hover:shadow-xl hover:border-[#EAB308]/60 transition-all duration-300 flex flex-col group cursor-pointer"
                      >
                        {/* Card Thumbnail */}
                        <div className="relative h-56 w-full overflow-hidden bg-neutral-900">
                          <Image
                            src={project.image}
                            alt={project.name.en}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                          {/* Sold Out Visual Watermark Overlay */}
                          {(project as any).status === "sold" && (
                            <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[30%] flex items-center justify-center pointer-events-none z-10">
                              <span className="px-4 py-1.5 rounded-xl bg-rose-600/95 text-white font-black text-xs uppercase tracking-widest border border-rose-300 shadow-xl rotate-[-6deg]">
                                {language === "ta" ? "100% விற்பனையானது" : "100% SOLD OUT"}
                              </span>
                            </div>
                          )}

                          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20 pointer-events-none">
                            {(project as any).status === "sold" ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-md uppercase tracking-wider border border-rose-400">
                                {language === "ta" ? "விற்பனையானது" : "SOLD OUT"}
                              </span>
                            ) : (project as any).status === "upcoming" ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-black shadow-md uppercase tracking-wider border border-amber-300">
                                {language === "ta" ? "வரவிருக்கும் திட்டம்" : "UPCOMING"}
                              </span>
                            ) : (project as any).status === "completed" ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-md uppercase tracking-wider border border-blue-400">
                                {language === "ta" ? "நிறைவடைந்தது" : "COMPLETED"}
                              </span>
                            ) : null}

                            <div className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0A0D12]/90 text-[#EAB308] border border-[#EAB308]/40">
                              {project.statusBadge[language]}
                            </div>
                          </div>

                          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                            {project.mapbhoomiUrl && (
                              <a
                                href={project.mapbhoomiUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-[#0A0D12]/95 hover:bg-[#EAB308] text-[#EAB308] hover:text-[#0A0D12] border border-[#EAB308]/60 flex items-center gap-1 shadow-md transition-all hover:scale-105 cursor-pointer pointer-events-auto"
                                title="Open map on Mapbhoomi"
                              >
                                <Compass className="h-3 w-3" />
                                <span>Mapbhoomi ↗</span>
                              </a>
                            )}
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/90 text-[#0A0D12] pointer-events-none">
                              {project.subcategoryLabel[language]}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                            <h3 className="text-base font-black leading-tight drop-shadow-md group-hover:text-[#EAB308] transition-colors">
                              {project.name[language]}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-300 mt-0.5">
                              <MapPin className="h-3 w-3 text-[#EAB308] shrink-0" />
                              <span className="line-clamp-1">{project.location[language]}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-3">
                              {project.description[language]}
                            </p>

                            <div className="space-y-1 mb-4 pb-3 border-b border-neutral-100">
                              {project.highlights[language].slice(0, 2).map((h, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-700 font-medium">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                                  <span className="line-clamp-1">{h}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProject(project);
                                }}
                                className="w-full py-2 px-3 rounded-xl bg-neutral-100 group-hover:bg-[#0A0D12] text-neutral-900 group-hover:text-white text-xs font-bold transition-all text-center cursor-pointer"
                              >
                                {language === "ta" ? "முழு விவரம்" : "Project Details"}
                              </button>

                              <a
                                href={`https://wa.me/${rawWhatsapp}?text=Hello%20Surya%20Promoters,%20I%20want%20details%20for%20${encodeURIComponent(
                                  project.name.en
                                )}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-full py-2 px-3 rounded-xl bg-[#EAB308] hover:bg-[#CA8A04] text-[#0A0D12] text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>{language === "ta" ? "விசாரிக்க" : "Enquire"}</span>
                              </a>
                            </div>

                            {/* Direct Mapbhoomi Layout Button */}
                            {project.mapbhoomiUrl && (
                              <a
                                href={project.mapbhoomiUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-full py-2 px-3 rounded-xl bg-[#0A0D12] hover:bg-neutral-800 text-[#EAB308] hover:text-white border border-[#EAB308]/50 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm group/mb cursor-pointer"
                              >
                                <Compass className="h-3.5 w-3.5 text-[#EAB308] group-hover/mb:rotate-45 transition-transform shrink-0" />
                                <span>{language === "ta" ? "Mapbhoomi வரைபடம் (Open map ↗)" : "Open map (Mapbhoomi) ↗"}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Back Button */}
                  <div className="flex items-center justify-center pt-4 pb-2">
                    <button
                      onClick={() => {
                        setActiveCategory(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 shadow-sm hover:shadow-md text-xs sm:text-sm font-bold transition-all cursor-pointer hover:border-[#EAB308]"
                    >
                      <ArrowLeft className="h-4 w-4 text-[#B45309]" />
                      <span>{language === "ta" ? "← அனைத்து 3 பிரிவுகளுக்கும் திரும்புக" : "← Back to All 3 Categories"}</span>
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 2: LOCATION (All Project Maps in Card Style)                    */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === "location" && (
            <section className="space-y-5 animate-fadeIn pt-1">
              {/* Back to Home Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("home")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{language === "ta" ? "முகப்புக்கு திரும்புக" : "Back to Home"}</span>
                  </button>
                  <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
                  <h3 className="text-sm font-black text-neutral-900 leading-tight">
                    {language === "ta" ? "திட்டங்களின் அமைவிடம் (Google Maps)" : "All Project Map Locations (Google Maps)"}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("home")}
                  className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                  title="Close section"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="max-w-xl">
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block mb-1">
                    Geolocation & Mapbhoomi Hub
                  </span>
                  <h3 className="text-xl font-black text-neutral-900 mb-1">
                    {language === "ta" ? "அனைத்து திட்டங்களின் அமைவிடம் & Mapbhoomi" : "All Project Map Locations & Mapbhoomi"}
                  </h3>
                  <p className="text-xs text-neutral-600">
                    {language === "ta"
                      ? "மதுரையின் முக்கிய தேசிய நெடுஞ்சாலைகள், ரிங் ரோடு மற்றும் Mapbhoomi நேரடி மனை வரைபடங்களை பார்வையிடவும்."
                      : "Directly navigate to each development along Madurai's NH-44, Ring Road, and interactive Mapbhoomi 3D cadastral layouts."}
                  </p>
                </div>
                <a
                  href="https://mapbhoomi.com/l/surya-promoters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0A0D12] text-[#EAB308] hover:bg-neutral-800 text-xs font-black transition-all border border-[#EAB308]/40 shadow-md shrink-0 w-fit"
                >
                  <Compass className="h-4 w-4 text-[#EAB308]" />
                  <span>{language === "ta" ? "Mapbhoomi நேரடி தளம் ↗" : "Surya Promoters on Mapbhoomi ↗"}</span>
                </a>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_PROJECTS.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs hover:shadow-md hover:border-[#EAB308]/60 transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative h-13 w-13 rounded-xl overflow-hidden shrink-0 border border-neutral-200">
                          <Image
                            src={project.image}
                            alt={project.name.en}
                            fill
                            sizes="52px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <span className="px-2 py-0.2 rounded-md text-[9px] font-black uppercase bg-blue-50 text-blue-700">
                            {project.categoryLabel[language]}
                          </span>
                          <h4 className="font-black text-neutral-900 group-hover:text-[#B45309] text-sm mt-0.5 leading-snug transition-colors">
                            {project.name[language]}
                          </h4>
                        </div>
                      </div>

                      <div className="bg-neutral-50 rounded-xl p-3 mb-3 border border-neutral-100 space-y-1.5 text-xs">
                        <div className="flex items-start gap-1.5 text-neutral-700">
                          <MapPin className="h-3.5 w-3.5 text-[#B45309] shrink-0 mt-0.5" />
                          <span className="font-semibold">{project.location[language]}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-[11px] text-neutral-500">
                          <Navigation className="h-3 w-3 text-blue-600 shrink-0 mt-0.5" />
                          <span>{project.distanceInfo[language]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {project.mapbhoomiUrl && (
                        <a
                          href={project.mapbhoomiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-2 px-3 rounded-xl bg-[#0A0D12] hover:bg-neutral-800 text-[#EAB308] border border-[#EAB308]/40 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Compass className="h-3.5 w-3.5 text-[#EAB308]" />
                          <span>{language === "ta" ? "Mapbhoomi நேரடி வரைபடம் ↗" : "Open Mapbhoomi Cadastral ↗"}</span>
                        </a>
                      )}

                      <a
                        href={project.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Navigation className="h-3 w-3" />
                        <span>{language === "ta" ? "கூகிள் மேப்ஸில் திறக்க" : "Open in Google Maps"}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        className="w-full py-1.5 px-3 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white text-neutral-800 text-xs font-bold transition-all text-center cursor-pointer"
                      >
                        {language === "ta" ? "திட்டத்தின் குறிப்புகள்" : "View Overview"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 3: GALLERY (Videos and Images in Folder Style)                  */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === "gallery" && (
            <section className="space-y-6 animate-fadeIn pt-1">
              {/* Back to Home Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("home")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{language === "ta" ? "முகப்புக்கு திரும்புக" : "Back to Home"}</span>
                  </button>
                  <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
                  <h3 className="text-sm font-black text-neutral-900 leading-tight">
                    {language === "ta" ? "புகைப்படங்கள் & வீடியோ (Folder Style Gallery)" : "Photo & Video Gallery (Folder Style)"}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("home")}
                  className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                  title="Close section"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs">
                <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider block mb-1">
                  Multimedia Center
                </span>
                <h3 className="text-xl font-black text-neutral-900 mb-1">
                  {language === "ta" ? "கோப்பு முறை புகைப்பட & வீடியோ மையம்" : "Folder-Style Media Gallery"}
                </h3>
                <p className="text-xs text-neutral-600">
                  {language === "ta"
                    ? "ட்ரோன் வீடியோக்கள் மற்றும் தள புகைப்படங்கள் கோப்பு வடிவில் ஏற்பாடு செய்யப்பட்டுள்ளன."
                    : "4K aerial drone videos and high-resolution site photos organized by project folders."}
                </p>
              </div>

              {/* Videos Folders */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-purple-600" />
                  <h4 className="text-sm font-black text-neutral-900">
                    {language === "ta" ? "1. வீடியோ கோப்புகள் (Folder Style)" : "1. Video Folders (Folder Style)"}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {GALLERY_VIDEO_FOLDERS.map((folder) => (
                    <div
                      key={folder.id}
                      className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 flex items-center gap-1">
                            <Folder className="h-3 w-3 fill-purple-700" />
                            {folder.count}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400">4K Reel</span>
                        </div>

                        <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-3 bg-neutral-900 group">
                          <Image
                            src={folder.thumbnail}
                            alt={folder.title.en}
                            fill
                            sizes="300px"
                            className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="h-10 w-10 rounded-full bg-white text-purple-700 flex items-center justify-center shadow-md">
                              <Play className="h-4 w-4 fill-purple-700 ml-0.5" />
                            </div>
                          </div>
                        </div>

                        <h5 className="font-extrabold text-neutral-900 text-sm mb-2">{folder.title[language]}</h5>

                        <div className="space-y-1 mb-3">
                          {folder.videos.map((vid, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedVideo({ title: vid.title[language], duration: vid.duration })}
                              className="w-full text-left flex items-center justify-between p-1.5 rounded-lg hover:bg-neutral-50 text-[11px] text-neutral-700 cursor-pointer"
                            >
                              <span className="font-semibold truncate">▶ {vid.title[language]}</span>
                              <span className="text-[9px] text-neutral-400 font-mono ml-2 shrink-0">{vid.duration}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedVideo({ title: folder.videos[0].title[language], duration: folder.videos[0].duration })}
                        className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5 fill-purple-700" />
                        <span>{language === "ta" ? "வீடியோ பார்க்க" : "Play Reel"}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Folders */}
              <div className="space-y-3 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-[#B45309]" />
                  <h4 className="text-sm font-black text-neutral-900">
                    {language === "ta" ? "2. புகைப்பட கோப்புகள் (Folder Style)" : "2. Image Folders (Folder Style)"}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {GALLERY_IMAGE_FOLDERS.map((folder) => (
                    <div
                      key={folder.id}
                      className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-[#B45309] text-[10px] font-bold border border-amber-200 flex items-center gap-1">
                            <Folder className="h-3 w-3 fill-[#B45309]" />
                            {folder.count}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400">HD Photos</span>
                        </div>

                        <div
                          onClick={() => setSelectedFolderImages({ title: folder.title[language], images: folder.images })}
                          className="relative h-40 w-full rounded-2xl overflow-hidden mb-3 bg-neutral-900 cursor-pointer group"
                        >
                          <Image
                            src={folder.thumbnail}
                            alt={folder.title.en}
                            fill
                            sizes="300px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="h-9 w-9 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-md">
                              <Maximize2 className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        <h5 className="font-extrabold text-neutral-900 text-sm mb-1">{folder.title[language]}</h5>
                        <p className="text-[11px] text-neutral-500 mb-3">High-resolution site photography</p>
                      </div>

                      <button
                        onClick={() => setSelectedFolderImages({ title: folder.title[language], images: folder.images })}
                        className="w-full py-2 rounded-xl bg-neutral-100 hover:bg-[#0A0D12] text-neutral-900 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        <span>{language === "ta" ? "புகைப்படங்கள் பார்க்க" : "View Photo Folder"}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </section>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 4: ABOUT (Surya Promoters Details & Founder Profile)             */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === "about" && (
            <section className="space-y-6 animate-fadeIn pt-1">
              {/* Back to Home Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("home")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{language === "ta" ? "முகப்புக்கு திரும்புக" : "Back to Home"}</span>
                  </button>
                  <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
                  <h3 className="text-sm font-black text-neutral-900 leading-tight">
                    {language === "ta" ? "எங்களைப் பற்றி (About Surya Promoters)" : "About Surya Promoters (Founder & Legacy)"}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("home")}
                  className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                  title="Close section"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Founder Profile Banner */}
              <div className="bg-[#0A0D12] text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="relative h-44 w-44 rounded-2xl overflow-hidden shrink-0 border-2 border-[#EAB308] bg-white/10 shadow-lg">
                  <Image
                    src="/images/founder/founder.png"
                    alt="Mr. Manickam Natarajan - Founder & Director"
                    fill
                    sizes="176px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-1 left-1 right-1 py-0.5 rounded-md bg-[#0A0D12]/90 text-[9px] font-black text-center text-[#EAB308]">
                    IAF VETERAN
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EAB308]/20 text-[#EAB308] text-[10px] font-black uppercase tracking-wider mb-2 inline-block">
                    Founder & Managing Director
                  </span>
                  <h3 className="text-2xl font-black text-white mb-1">
                    {language === "ta" ? "திரு. மாணிக்கம் நடராஜன்" : "Mr. Manickam Natarajan"}
                  </h3>
                  <p className="text-xs font-semibold text-amber-300 mb-3">
                    Indian Air Force Veteran · Established Surya Promoters in 2010
                  </p>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
                    {language === "ta"
                      ? "விமானப்படை ஒழுங்குமுறை, நேர்மை மற்றும் வெளிப்படைத்தன்மையுடன் 2010 ஆம் ஆண்டு தொடங்கப்பட்டது. ஒவ்வொரு மனைக்கும் 100% தெளிவான கணினி பட்டா உறுதி செய்யப்படுகிறது."
                      : "Founded in 2010 on principles of military precision, unyielding honesty, and zero-compromise on legal due diligence. Every land parcel carries verified 30-year parent documentation."}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl p-4 border border-neutral-200 text-center">
                  <span className="text-3xl font-black text-[#B45309]">16+</span>
                  <p className="text-xs font-bold text-neutral-800 mt-0.5">Years Experience</p>
                  <p className="text-[10px] text-neutral-400">Since 2010</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-neutral-200 text-center">
                  <span className="text-3xl font-black text-[#0A0D12]">1000+</span>
                  <p className="text-xs font-bold text-neutral-800 mt-0.5">Happy Families</p>
                  <p className="text-[10px] text-neutral-400">Settled in Tamil Nadu</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-neutral-200 text-center">
                  <span className="text-3xl font-black text-emerald-700">100%</span>
                  <p className="text-xs font-bold text-neutral-800 mt-0.5">Clear Patta</p>
                  <p className="text-[10px] text-neutral-400">Zero disputes</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-neutral-200 text-center">
                  <span className="text-3xl font-black text-[#EAB308]">4.9 ★</span>
                  <p className="text-xs font-bold text-neutral-800 mt-0.5">Client Rating</p>
                  <p className="text-[10px] text-neutral-400">Verified Reviews</p>
                </div>
              </div>

            </section>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 5: DOWNLOAD MAP (Blueprints, Layout Maps, Brochures)            */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === "download" && (
            <section className="space-y-5 animate-fadeIn pt-1">
              {/* Back to Home Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("home")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{language === "ta" ? "முகப்புக்கு திரும்புக" : "Back to Home"}</span>
                  </button>
                  <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
                  <h3 className="text-sm font-black text-neutral-900 leading-tight">
                    {language === "ta" ? "பதிவிறக்க மையம் (Downloads Hub)" : "Download Map & Resources Hub"}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("home")}
                  className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                  title="Close section"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs">
                <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block mb-1">
                  Downloads Hub
                </span>
                <h3 className="text-xl font-black text-neutral-900 mb-1">
                  {language === "ta" ? "வரைபடம், புளூபிரிண்ட் & கையேடுகள் பதிவிறக்கம்" : "Download Project Maps & Resources"}
                </h3>
                <p className="text-xs text-neutral-600">
                  {language === "ta"
                    ? "ஆரஞ்ச் கார்டன், வைகை எலைட் உள்ளிட்ட அனைத்து திட்டங்களின் கள வரைபடம், கையேடுகள் மற்றும் வீடியோக்களை பதிவிறக்குங்கள்."
                    : "Download high-resolution cadastral layout maps, blueprints, project brochures, and video reels directly."}
                </p>
              </div>

              {toastMessage && (
                <div className="p-3.5 rounded-2xl bg-[#0A0D12] text-[#EAB308] border border-[#EAB308]/40 shadow-lg flex items-center justify-between text-xs font-bold">
                  <span>✓ {toastMessage}</span>
                  <button onClick={() => setToastMessage(null)} className="text-white">✕</button>
                </div>
              )}

              {/* Downloads Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DOWNLOAD_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-50 text-[#854D0E]">
                          {item.category[language]}
                        </span>
                        <span className="text-xs font-mono text-neutral-400">{item.fileSize}</span>
                      </div>
                      <h4 className="font-extrabold text-neutral-900 text-sm mb-1">{item.title[language]}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
                        <FileText className="h-3.5 w-3.5 text-[#B45309]" />
                        <span>{item.fileType}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold">{item.badge}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={item.downloadUrl}
                        download
                        onClick={() => triggerToast(`Downloading ${item.title[language]}...`)}
                        className="py-2 px-3 rounded-xl bg-[#0A0D12] hover:bg-neutral-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5 text-[#EAB308]" />
                        <span>{language === "ta" ? "பதிவிறக்க" : "Download"}</span>
                      </a>

                      <a
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>{language === "ta" ? "முன்னோட்டம்" : "Preview"}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =================================================================== */}
          {/* TAB 6: CONTACT (Direct Communication Channels, Office HQ & Enquiry) */}
          {/* =================================================================== */}
          {activeTab === "contact" && (
            <section className="space-y-6 animate-fadeIn pt-1">
              {/* Back to Home Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("home")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{language === "ta" ? "முகப்புக்கு திரும்புக" : "Back to Home"}</span>
                  </button>
                  <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
                  <h3 className="text-sm font-black text-neutral-900 leading-tight">
                    {language === "ta" ? "நேரடி தொடர்பு மையம் (Contact Us)" : "Direct Communication Channels & Contact"}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("home")}
                  className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                  title="Close section"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Contact Top Banner */}
              <div className="bg-[#0A0D12] text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-xl">

                  <h2 className="text-2xl sm:text-3xl font-black mb-2">
                    {language === "ta" ? "எங்களை நேரடியாக தொடர்பு கொள்ளவும்" : "Direct Communication Channels"}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {language === "ta"
                      ? "மதுரையின் சிறந்த குடியிருப்பு, வணிகம் மற்றும் பண்ணை நிலங்களுக்கான நேரடி ஆலோசனை மற்றும் களப் பார்வை முன்பதிவு."
                      : "Connect directly with our veteran land advisory team for certified computer patta verification, free site inspection cabs, and transparent pricing."}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-center sm:items-end gap-2 text-center sm:text-right">
                  <span className="text-xs text-neutral-400 font-semibold">{language === "ta" ? "அலுவலக நேரம்:" : "Office Hours:"}</span>
                  <span className="text-sm font-black text-[#EAB308]">8:30 AM – 8:30 PM (7 Days a Week)</span>
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Site Visits Available Every Day
                  </span>
                </div>
              </div>

              {/* 4 Interactive Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* 1. Phone Call */}
                <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-xs hover:border-[#EAB308]/80 hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-amber-50 text-[#B45309] border border-amber-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Phone className="h-6 w-6 text-[#B45309]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#B45309] block mb-0.5">
                      {language === "ta" ? "தொலைபேசி அழைப்பு" : "Direct Call"}
                    </span>
                    <h4 className="text-base font-black text-neutral-900 mb-1">{phone}</h4>
                    <p className="text-xs text-neutral-500 mb-4">
                      {language === "ta" ? "நில ஆலோசகருடன் உடனே பேச நேரடி அழைப்பு." : "Speak directly with our senior land acquisition specialist."}
                    </p>
                  </div>
                  <a
                    href={`tel:${phone}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0A0D12] hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-[#EAB308]" />
                    <span>{language === "ta" ? "அழைக்க" : "Call Now"}</span>
                  </a>
                </div>

                {/* 2. WhatsApp Business */}
                <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-xs hover:border-emerald-500/80 hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <MessageCircle className="h-6 w-6 text-emerald-600 fill-emerald-100" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-0.5">
                      {language === "ta" ? "வாட்ஸ்அப் அரட்டை" : "WhatsApp Chat"}
                    </span>
                    <h4 className="text-base font-black text-neutral-900 mb-1">WhatsApp Official</h4>
                    <p className="text-xs text-neutral-500 mb-4">
                      {language === "ta" ? "மனை வரைபடங்கள், விலை பட்டியல் மற்றும் வீடியோ பெற." : "Instant layout blueprints, pricing quotes, and video reels."}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${rawWhatsapp}?text=Hello%20Surya%20Promoters,%20I%20am%20interested%20in%20your%20Madurai%20projects.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="h-3.5 w-3.5 fill-white" />
                    <span>{language === "ta" ? "வாட்ஸ்அப் தொடர்பு" : "Chat on WhatsApp"}</span>
                  </a>
                </div>

                {/* 3. Corporate Email */}
                <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-xs hover:border-blue-500/80 hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block mb-0.5">
                      {language === "ta" ? "மின்னஞ்சல்" : "Official Email"}
                    </span>
                    <h4 className="text-base font-black text-neutral-900 mb-1 truncate">{email}</h4>
                    <p className="text-xs text-neutral-500 mb-4">
                      {language === "ta" ? "கார்ப்பரேட் கோரிக்கைகள் மற்றும் கூட்டாண்மை விசாரணை." : "Send corporate inquiries, deeds verification, or proposals."}
                    </p>
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-neutral-300"
                  >
                    <Mail className="h-3.5 w-3.5 text-blue-600" />
                    <span>{language === "ta" ? "மின்னஞ்சல் அனுப்ப" : "Send Email"}</span>
                  </a>
                </div>

                {/* 4. Book Free Site Inspection Cab */}
                <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-xs hover:border-[#EAB308]/80 hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-amber-50 text-[#854D0E] border border-amber-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <FileCheck className="h-6 w-6 text-[#EAB308]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#854D0E] block mb-0.5">
                      {language === "ta" ? "களப் பார்வை முன்பதிவு" : "Site Visit & Booking"}
                    </span>
                    <h4 className="text-base font-black text-neutral-900 mb-1">{language === "ta" ? "இலவச வாகன வசதி" : "Enquiry"}</h4>
                    <p className="text-xs text-neutral-500 mb-4">
                      {language === "ta" ? "குடும்பத்துடன் இடத்தை நேரில் பார்வையிட இலவச ஏற்பாடு." : "Complimentary pick-up & drop cab across Madurai."}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEnquiryModalOpen(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#EAB308] hover:bg-[#CA8A04] text-[#0A0D12] font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{language === "ta" ? "முன்பதிவு படிவம்" : "Book Site Inspection"}</span>
                  </button>
                </div>

              </div>

              {/* Head Office Information & Map Link (Buttons Aligned to Right Side) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-[#B45309]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#B45309]">
                      {language === "ta" ? "தலைமை அலுவலகம்" : "Corporate Headquarters"}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 mb-2">
                    SURYA PROMOTERS · MADURAI
                  </h3>
                  <div className="space-y-2 text-xs text-neutral-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#B45309] shrink-0 mt-0.5" />
                      <span>{address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700 font-semibold">
                      <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Mon – Sun: 8:30 AM to 8:30 PM (Direct Site Visits Every Day)</span>
                    </div>
                  </div>
                </div>

                {/* Right Aligned Action Buttons */}
                <div className="shrink-0 flex flex-wrap sm:flex-nowrap items-center md:justify-end gap-2.5">
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#0A0D12] hover:bg-neutral-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Navigation className="h-3.5 w-3.5 text-[#EAB308]" />
                    <span>{language === "ta" ? "கூகிள் மேப்ஸ் வழித்தடம்" : "Open in Google Maps"}</span>
                  </a>
                  <a
                    href="https://mapbhoomi.com/l/surya-promoters"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-300 shadow-2xs"
                  >
                    <Compass className="h-3.5 w-3.5 text-[#EAB308]" />
                    <span>Mapbhoomi 3D Store ↗</span>
                  </a>
                </div>
              </div>

            </section>
          )}

        </main>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* MOBILE BOTTOM APP NAVIGATION DOCK (Play Store / Mobile App Style)         */}
      {/* ------------------------------------------------------------------------- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-xl border-t border-neutral-200/90 shadow-2xl px-2 py-1.5 flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${activeTab === "home" ? "text-[#0A0D12] font-black" : "text-neutral-500 font-medium"
            }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${activeTab === "home" ? "bg-[#EAB308] text-[#0A0D12] shadow-xs" : "text-neutral-500"}`}>
            <Home className="h-4.5 w-4.5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">
            {language === "ta" ? "முகப்பு" : "Home"}
          </span>
        </button>

        {/* Our Projects */}
        <button
          onClick={() => {
            setActiveTab("projects");
            setActiveCategory(null);
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${activeTab === "projects" ? "text-[#0A0D12] font-black" : "text-neutral-500 font-medium"
            }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${activeTab === "projects" ? "bg-[#EAB308] text-[#0A0D12] shadow-xs" : "text-neutral-500"}`}>
            <Building2 className="h-4.5 w-4.5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">
            {language === "ta" ? "திட்டங்கள்" : "Projects"}
          </span>
        </button>

        {/* Site Location */}
        <button
          onClick={() => setActiveTab("location")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${activeTab === "location" ? "text-blue-600 font-black" : "text-neutral-500 font-medium"
            }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${activeTab === "location" ? "bg-blue-600 text-white shadow-xs" : "text-neutral-500"}`}>
            <MapPin className="h-4 w-4" />
          </div>
          <span className="text-[9px] mt-0.5 leading-none">
            {language === "ta" ? "அமைவிடம்" : "Site Location"}
          </span>
        </button>

        {/* Download Layout */}
        <button
          onClick={() => setActiveTab("download")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${activeTab === "download" ? "text-amber-700 font-black" : "text-neutral-500 font-medium"
            }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${activeTab === "download" ? "bg-amber-600 text-white shadow-xs" : "text-neutral-500"}`}>
            <Download className="h-4 w-4" />
          </div>
          <span className="text-[9px] mt-0.5 leading-none">
            {language === "ta" ? "வரைபடம்" : "Layout"}
          </span>
        </button>

        {/* Contact */}
        <button
          onClick={() => setActiveTab("contact")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${activeTab === "contact" ? "text-[#B45309] font-black" : "text-neutral-500 font-medium"
            }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${activeTab === "contact" ? "bg-[#0A0D12] text-[#EAB308] shadow-xs" : "text-neutral-500"}`}>
            <PhoneCall className="h-4 w-4" />
          </div>
          <span className="text-[9px] mt-0.5 leading-none">
            {language === "ta" ? "தொடர்பு" : "Contact"}
          </span>
        </button>
      </nav>

      {/* ------------------------------------------------------------------------- */}
      {/* 3. INDIVIDUAL PROJECT DETAILS MODAL                                       */}
      {/* ------------------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedProject && (() => {
          const projectExtra = PROJECT_DETAILS_MAP[selectedProject.id];
          const gallery = projectExtra?.galleryImages && projectExtra.galleryImages.length > 0
            ? projectExtra.galleryImages
            : [selectedProject.image];
          const activeImage = modalActiveImage || selectedProject.image;
          const videoUrl = projectExtra?.videoUrl;

          return (
            <div
              data-lenis-prevent
              onClick={() => setSelectedProject(null)}
              onWheel={(e) => e.stopPropagation()}
              className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
                data-lenis-prevent
                className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[90vh] sm:max-h-[88vh] my-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-30 h-9 w-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Sold Out Banner Notification */}
                {(selectedProject as any).status === "sold" && (
                  <div className="bg-rose-50 border-b border-rose-200 px-5 py-3 flex items-center justify-between text-xs font-bold text-rose-800 z-20">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] uppercase font-mono font-black">
                        {language === "ta" ? "விற்பனையானது" : "SOLD OUT"}
                      </span>
                      <span>
                        {language === "ta"
                          ? "இத்திட்டத்தின் அனைத்து மனைகளும் 100% விற்பனை செய்யப்பட்டு பதிவு நிறைவடைந்தது."
                          : "This property is 100% Sold Out & Handed Over. All units are occupied."}
                      </span>
                    </div>
                    <span className="text-[11px] text-rose-600 font-semibold hidden md:inline">
                      {language === "ta" ? "அடுத்த கட்ட திட்டங்களுக்கு எங்களை தொடர்பு கொள்ளவும்" : "Contact us for upcoming phases & similar lands"}
                    </span>
                  </div>
                )}

                {/* Scrollable Container */}
                <div
                  id="project-modal-scroll-container"
                  data-lenis-prevent
                  onWheel={(e) => e.stopPropagation()}
                  className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-7 space-y-6 overscroll-contain scroll-smooth"
                >
                  {/* 1. MEDIA BANNER & VIDEO TOUR */}
                  <div className="space-y-3">
                    <div className="relative h-60 sm:h-80 w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-inner">
                      {modalMediaMode === "video" && videoUrl ? (
                        <video
                          src={videoUrl}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <Image
                            src={activeImage}
                            alt={selectedProject.name.en}
                            fill
                            sizes="900px"
                            className="object-cover transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        </>
                      )}

                      {/* Top Badges & Media Switcher */}
                      <div className="absolute top-3 left-3 right-14 flex items-center justify-between gap-2 z-10 pointer-events-auto">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#EAB308] text-[#0A0D12]">
                            {selectedProject.categoryLabel[language]}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/70 text-white backdrop-blur-md">
                            {selectedProject.subcategoryLabel[language]}
                          </span>
                        </div>

                        {videoUrl && (
                          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/20">
                            <button
                              onClick={() => setModalMediaMode("photos")}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${modalMediaMode === "photos"
                                  ? "bg-[#EAB308] text-[#0A0D12]"
                                  : "text-white/80 hover:text-white"
                                }`}
                            >
                              Photos ({gallery.length})
                            </button>
                            <button
                              onClick={() => setModalMediaMode("video")}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${modalMediaMode === "video"
                                  ? "bg-[#EAB308] text-[#0A0D12]"
                                  : "text-white/80 hover:text-white"
                                }`}
                            >
                              <Play className="h-3 w-3 fill-current" />
                              Video
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Banner Bottom Title Info */}
                      <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                        <div className="flex items-center gap-1 text-[#EAB308] text-xs font-black mb-1">
                          <Star className="h-3.5 w-3.5 fill-[#EAB308]" />
                          <span>{selectedProject.rating}</span>
                          <span className="text-white/70 font-normal">
                            ({projectExtra?.customerReviews.length || 2} verified client reviews)
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black drop-shadow-md">
                          {selectedProject.name[language]}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-300 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-[#EAB308] shrink-0" />
                          <span>{selectedProject.location[language]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Image Thumbnails Strip */}
                    {gallery.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {gallery.map((thumb, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setModalActiveImage(thumb);
                              setModalMediaMode("photos");
                            }}
                            className={`relative h-14 w-20 sm:h-16 sm:w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${modalMediaMode === "photos" && activeImage === thumb
                                ? "border-[#EAB308] scale-105 shadow-md ring-2 ring-[#EAB308]/40"
                                : "border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-400"
                              }`}
                          >
                            <Image src={thumb} alt={`Photo ${idx + 1}`} fill sizes="100px" className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. MAPBHOOMI LIVE CADASTRAL LINK */}
                  {selectedProject.mapbhoomiUrl && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0A0D12] via-[#111827] to-[#1F2937] text-white border border-[#EAB308]/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-[#EAB308] text-[#0A0D12] flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                          <Compass className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-white">Mapbhoomi Interactive 3D Cadastral Layout</h4>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Live Map
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-300 mt-0.5 max-w-xl leading-relaxed">
                            {language === "ta"
                              ? "ஒவ்வொரு மனையின் எல்லைகள், அளவு மற்றும் விபரங்களை Mapbhoomi நேரடி தளத்தில் பார்க்கவும்."
                              : "Explore verified cadastral plot boundaries, numbering, and dimensions on the official Mapbhoomi interactive layout."}
                          </p>
                        </div>
                      </div>
                      <a
                        href={selectedProject.mapbhoomiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-[#EAB308] hover:bg-[#CA8A04] text-[#0A0D12] font-black text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md hover:scale-105 cursor-pointer"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        <span>Open map ↗</span>
                      </a>
                    </div>
                  )}

                  {/* 4. SINGLE NAVIGATION OPTION */}
                  <div className="flex items-center p-1 bg-neutral-100 rounded-2xl border border-neutral-200/80">
                    <button
                      type="button"
                      onClick={() => {
                        const container = document.getElementById("project-modal-scroll-container");
                        if (container) container.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="py-2 px-4 sm:px-5 rounded-xl text-xs font-black bg-[#0A0D12] text-[#EAB308] shadow-xs cursor-pointer hover:bg-neutral-900 transition-colors"
                    >
                      {language === "ta" ? "கண்ணோட்டம்" : "Overview & Specs"}
                    </button>
                  </div>

                  {/* SECTION 1: OVERVIEW & SPECS */}
                  <div className="space-y-4">
                    {/* Specs Grid */}
                    <div className={`grid gap-2.5 ${selectedProject.specs.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
                      {selectedProject.specs.map((spec, i) => (
                        <div key={i} className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                            {spec.label[language]}
                          </span>
                          <span className="text-xs font-black text-neutral-900 block mt-0.5">
                            {spec.value[language]}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Overview */}
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
                      <h3 className="text-sm font-black text-neutral-900">
                        {language === "ta" ? "திட்டத்தின் முழு விவரம்" : "Project Overview"}
                      </h3>
                      <p className="text-xs text-neutral-700 leading-relaxed">
                        {selectedProject.description[language]}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
                      <h3 className="text-sm font-black text-neutral-900">
                        {language === "ta" ? "முக்கிய சிறப்பம்சங்கள்" : "Key Highlights"}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedProject.highlights[language].map((hl, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-neutral-700">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suitable Commercial Activities */}
                    {selectedProject.suitableActivities && (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-200/80 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-amber-700" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                            {language === "ta" ? "பொருத்தமான வணிக பயன்பாடுகள்" : "Suitable Commercial Activities"}
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.suitableActivities[language].map((act, actIdx) => (
                            <span
                              key={actIdx}
                              className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-bold text-neutral-800 shadow-2xs flex items-center gap-1.5"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-[#CA8A04]" />
                              {act}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 2: LOCALITY & INFRASTRUCTURE */}
                  {projectExtra && (
                    <div className="space-y-4 pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80">
                          {language === "ta" ? "அமைவிடம் & வசதிகள்" : "Locality & Infra"}
                        </span>
                      </div>

                      {/* Transportation */}
                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-[#CA8A04]" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                            {language === "ta" ? "அருகிலுள்ள போக்குவரத்து வசதிகள்" : "Nearby Transportation & Connectivity"}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {projectExtra.transportation.map((item, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-white border border-neutral-200/70 flex items-center justify-between">
                              <span className="text-xs font-bold text-neutral-800">{item.name[language]}</span>
                              <div className="flex items-center gap-1.5 shrink-0 text-right">
                                <span className="text-[11px] font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                                  {item.distance}
                                </span>
                                {item.time && (
                                  <span className="text-[10px] text-neutral-500 font-medium">({item.time})</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Hospitals & Healthcare */}
                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <HeartPulse className="h-4 w-4 text-rose-600" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                            {language === "ta" ? "அருகிலுள்ள மருத்துவமனைகள்" : "Nearby Hospitals & Healthcare"}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {projectExtra.hospitals.map((item, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-white border border-neutral-200/70 flex items-center justify-between">
                              <span className="text-xs font-bold text-neutral-800">{item.name[language]}</span>
                              <span className="text-[11px] font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                                {item.distance} {item.time && `· ${item.time}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Schools & Colleges */}
                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                            {language === "ta" ? "பள்ளிகள் & கல்லூரிகள்" : "Nearby Schools & Colleges"}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {projectExtra.schoolsAndColleges.map((item, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-white border border-neutral-200/70 flex items-center justify-between">
                              <span className="text-xs font-bold text-neutral-800">{item.name[language]}</span>
                              <span className="text-[11px] font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                                {item.distance} {item.time && `· ${item.time}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Groundwater Facility */}
                      <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-100 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-cyan-600" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-cyan-950">
                            {language === "ta" ? "நிலத்தடி நீர் வசதி & தரம்" : "Groundwater Facility & Potable Table"}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="p-2.5 rounded-xl bg-white border border-cyan-200/60">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              {language === "ta" ? "நீர் மட்டம் ஆழம்" : "Water Table Depth"}
                            </span>
                            <span className="text-xs font-black text-neutral-900 block mt-0.5">
                              {projectExtra.groundwater.depth[language]}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-cyan-200/60">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              {language === "ta" ? "குடிநீர் தரம்" : "Tested Quality"}
                            </span>
                            <span className="text-xs font-black text-emerald-700 block mt-0.5">
                              {projectExtra.groundwater.quality[language]}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-cyan-200/60">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              {language === "ta" ? "நீர் ஆதாரம்" : "Water Source"}
                            </span>
                            <span className="text-xs font-black text-neutral-900 block mt-0.5">
                              {projectExtra.groundwater.source[language]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Neighbour Houses & Community */}
                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-neutral-800" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                            {language === "ta" ? "அண்டை வீடுகள் & குடியிருப்பு சூழல்" : "Neighbour Houses & Community Environment"}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              {language === "ta" ? "குடியிருப்பு அடர்த்தி" : "Community Density"}
                            </span>
                            <span className="text-xs font-bold text-neutral-800 block mt-0.5">
                              {projectExtra.neighborhood.density[language]}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              {language === "ta" ? "சூழ்ந்துள்ள வீடுகள்" : "Surrounding Dwellings"}
                            </span>
                            <span className="text-xs font-bold text-neutral-800 block mt-0.5">
                              {projectExtra.neighborhood.surrounding[language]}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              {language === "ta" ? "சூழல் & பாதுகாப்பு" : "Atmosphere & Security"}
                            </span>
                            <span className="text-xs font-bold text-neutral-800 block mt-0.5">
                              {projectExtra.neighborhood.atmosphere[language]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 3: GROUND VALUE & FUTURE ROI PREDICTION */}
                  {projectExtra && (
                    <div className="space-y-4 pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80">
                          {language === "ta" ? "விலை & எதிர்கால மதிப்பு" : "Ground Value & ROI"}
                        </span>
                      </div>

                      {/* Current Ground Value Card */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-amber-700" />
                            <h4 className="text-sm font-black text-neutral-900">
                              {language === "ta" ? "தற்போதைய மனை / நில மதிப்பு" : "Current Ground Value & Prevailing Rate"}
                            </h4>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#0A0D12] text-[#EAB308]">
                            Verified Market Price
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              {language === "ta" ? "தற்போதைய சந்தை விலை" : "Current Market Rate"}
                            </span>
                            <span className="text-base sm:text-lg font-black text-[#0A0D12] block mt-1">
                              {projectExtra.groundValue.currentRate[language]}
                            </span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              {language === "ta" ? "அரசு வழிகாட்டி மதிப்பு" : "Government Guideline Value"}
                            </span>
                            <span className="text-base sm:text-lg font-black text-neutral-700 block mt-1">
                              {projectExtra.groundValue.guidelineValue[language]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Future Ground Value Predicted Card */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-300/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                            <h4 className="text-sm font-black text-neutral-900">
                              {language === "ta" ? "எதிர்கால மதிப்பு முன்கணிப்பு (ROI)" : "Future Ground Value Predicted (ROI)"}
                            </h4>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
                            High Growth Potential
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              {language === "ta" ? "3 வருட உத்தேச வளர்ச்சி" : "3-Year Projected Growth"}
                            </span>
                            <span className="text-base sm:text-lg font-black text-emerald-600 block mt-1">
                              {projectExtra.futurePrediction.threeYearROI}
                            </span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              {language === "ta" ? "5 வருட மூலதன மதிப்பு" : "5-Year Projected Growth"}
                            </span>
                            <span className="text-base sm:text-lg font-black text-emerald-700 block mt-1">
                              {projectExtra.futurePrediction.fiveYearROI}
                            </span>
                          </div>
                        </div>

                        {/* Growth Drivers */}
                        <div className="p-3 rounded-xl bg-white/80 border border-emerald-200/60 space-y-1.5 mt-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950 block">
                            {language === "ta" ? "மதிப்பு உயர்வதற்கான முக்கிய காரணங்கள்:" : "Key Drivers of Future Appreciation:"}
                          </span>
                          <ul className="space-y-1 text-xs text-neutral-700">
                            {projectExtra.futurePrediction.drivers[language].map((driver, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-1.5">
                                <TrendingUp className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{driver}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 4: CUSTOMER REVIEWS */}
                  {projectExtra && (
                    <div className="space-y-4 pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80">
                          {language === "ta" ? "வாடிக்கையாளர் கருத்து" : "Customer Reviews"}
                        </span>
                      </div>

                      {/* Overall Rating Banner */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0D12] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-[#EAB308] text-[#0A0D12] flex flex-col items-center justify-center font-black shrink-0">
                            <span className="text-base leading-none">5.0</span>
                            <div className="flex text-[8px] mt-0.5">★★★★★</div>
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white">
                              {language === "ta" ? "உறுதிப்படுத்தப்பட்ட வாடிக்கையாளர் மதிப்புரை" : "Verified Customer Satisfaction"}
                            </h4>
                            <p className="text-xs text-neutral-300 mt-0.5">
                              98.6% Client Approval Rating · 500+ Happy Families · 16+ Years IAF Veteran Trust
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Reviews Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {projectExtra.customerReviews.map((rev, rIdx) => (
                          <div key={rIdx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-[#EAB308]">
                                  {Array.from({ length: rev.rating }).map((_, s) => (
                                    <Star key={s} className="h-3.5 w-3.5 fill-[#EAB308]" />
                                  ))}
                                </div>
                                <span className="text-[10px] text-neutral-400 font-medium">{rev.date}</span>
                              </div>
                              <p className="text-xs text-neutral-700 leading-relaxed italic">
                                &ldquo;{rev.comment[language]}&rdquo;
                              </p>
                            </div>
                            <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between mt-2">
                              <div>
                                <span className="text-xs font-black text-neutral-900 block">{rev.name}</span>
                                <span className="text-[10px] text-neutral-500 block">{rev.role[language]}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                Verified Buyer ✓
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Marketing Text / Bottom Banner */}
                  {selectedProject.marketingBanner && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0A0D12] via-neutral-900 to-[#0A0D12] border border-[#EAB308]/40 text-center space-y-1.5 shadow-md">
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#EAB308] block">
                        HIGH VISIBILITY · HIGH FOOTFALL · HIGH GROWTH
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        {selectedProject.marketingBanner[language]}
                      </p>
                    </div>
                  )}

                  {/* 5. VISUAL GOOGLE MAP SECTION */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80">
                          {language === "ta" ? "நேரடி வரைபடம்" : "Visual Location Map"}
                        </span>
                        <span className="text-xs font-bold text-neutral-600 hidden sm:inline">
                          {selectedProject.location[language]}
                        </span>
                      </div>
                      <a
                        href={selectedProject.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#B45309] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Navigation className="h-3 w-3" />
                        <span>{language === "ta" ? "கூகிள் மேப்ஸ்-ல் திற ↗" : "Open in Google Maps ↗"}</span>
                      </a>
                    </div>

                    {/* Interactive Visual Map Embed */}
                    <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-100">
                      <iframe
                        src={
                          selectedProject.id === "flat-projects"
                            ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15719.82490209489!2d78.1536383!3d9.9729346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c6624adb8135%3A0x59a6af4880f95d73!2sMeenakshi%20Amman%20Nagar%2C%20Madurai!5e0!3m2!1sen!2sin!4v1700000000000"
                            : selectedProject.id === "vaigai-elite"
                              ? "https://maps.google.com/maps?q=9.859703,78.221955&hl=en&z=15&output=embed"
                              : selectedProject.id === "vaigai-river"
                              ? "https://maps.google.com/maps?q=Vandiyur,+Madurai,+Tamil+Nadu&hl=en&z=15&output=embed"
                              : selectedProject.id === "pandi-kovil"
                              ? "https://maps.google.com/maps?q=Pandi+Kovil,+Madurai,+Tamil+Nadu&hl=en&z=15&output=embed"
                            : selectedProject.id === "madurai-farms"
                              ? "https://maps.google.com/maps?q=9.669621,78.209693&hl=en&z=15&output=embed"
                              : `https://maps.google.com/maps?q=${encodeURIComponent(
                                selectedProject.location.en + ", Madurai"
                              )}&t=&z=14&ie=UTF8&iwloc=&output=embed`
                        }
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${selectedProject.name.en} Visual Location Map`}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Location Pin Verification Info */}
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-neutral-800">
                        <MapPin className="h-4 w-4 text-[#CA8A04] shrink-0" />
                        <span className="font-semibold">
                          {selectedProject.id === "flat-projects"
                            ? language === "ta"
                              ? "சூர்யா நகர் (மீனாட்சி அம்மன் நகர்), மதுரை - 625014"
                              : "Surya Nagar (Meenakshi Amman Nagar), Madurai – 625014"
                            : selectedProject.id === "vaigai-elite"
                              ? language === "ta"
                                ? "மதுரை – ராமேஸ்வரம் தேசிய நெடுஞ்சாலை, மணலூர் (விரகனூர் ரவுண்டானாவிலிருந்து 6 கி.மீ)"
                                : "Madurai – Rameshwaram NH, Manalur (6 km from Viraganur Roundana)"
                            : selectedProject.id === "vaigai-river"
                              ? language === "ta"
                                ? "வண்டியூர், மதுரை – வைகை நதிக்கரை & பை பாஸ் சாலை (அண்ணா நகரிலிருந்து 2 நிமிடம்)"
                                : "Vandiyur, Madurai – Vaigai Riverfront & Bye Pass Road (2 Mins from Anna Nagar)"
                            : selectedProject.id === "pandi-kovil"
                              ? language === "ta"
                                ? "பாண்டி கோவில், மதுரை – மதுரை விமான நிலைய சாலை (மாட்டுத்தாவணியிலிருந்து 2 கி.மீ)"
                                : "Pandi Kovil, Madurai – On Madurai Airport Road (2 KM from Mattuthavani)"
                            : selectedProject.id === "madurai-farms"
                              ? language === "ta"
                                ? "மதுரை வேளாண் பசுமை மண்டலம் – முடுக்கங்குளம் மெயின் ரோடு (நேரடி GPS அமைவிடம்)"
                                : "Madurai Agro Green Belt – Mudukangulam Main Road (Verified GPS Location)"
                              : selectedProject.location[language]}
                        </span>
                      </div>
                      <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white shrink-0">
                        Verified Pinpoint Location ✓
                      </span>
                    </div>
                  </div>

                  {/* 6. MASTER LAYOUT PLAN SECTION (Directly below Google Map) */}
                  {selectedProject.blueprint && (() => {
                    const activeBlueprintSrc = selectedProject.blueprints && selectedProject.blueprints[modalActiveBlueprintIndex]
                      ? selectedProject.blueprints[modalActiveBlueprintIndex].image
                      : selectedProject.blueprint!;
                    const activeBlueprintTitle = selectedProject.blueprints && selectedProject.blueprints[modalActiveBlueprintIndex]
                      ? selectedProject.blueprints[modalActiveBlueprintIndex].title[language]
                      : (language === "ta" ? "மனைப்பிரிவு வரைபடம்" : "Master Layout Plan");
                    const allBlueprintImages = selectedProject.blueprints && selectedProject.blueprints.length > 0
                      ? selectedProject.blueprints.map(b => b.image)
                      : [selectedProject.blueprint!];

                    return (
                      <div className="space-y-3 pt-4 border-t border-neutral-100">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider text-[#92400e] bg-amber-100/70 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                              <FileCheck className="h-3.5 w-3.5 text-[#B45309]" />
                              {language === "ta" ? "அங்கீகரிக்கப்பட்ட மனைப்பிரிவு வரைபடம்" : "Master Layout Plan & Subdivisions"}
                            </span>
                            <span className="text-xs font-bold text-neutral-600 hidden sm:inline">
                              {selectedProject.id === "vaigai-elite"
                                ? (language === "ta" ? "5.23 ஏக்கர் (523 சென்ட்) · 40 அடி சாலை" : "5.23 Acres (523 Cents) · 40 Ft Road")
                                : selectedProject.id === "vaigai-river"
                                ? (language === "ta" ? "27.4 சென்ட் · அண்ணா நகர் ரிவர் பெல்ட் & 70 அடி ரோடு" : "27.4 Cents · Anna Nagar River Belt & 70 Ft Road")
                                : selectedProject.id === "pandi-kovil"
                                ? (language === "ta" ? "60 சென்ட் (52.4 சென்ட் சர்வே) · 130 அடி முகப்பு · S.No 2-1B3" : "60 Cents (52.4 Cts Surveyed) · 130 Ft Frontage · S.No 2-1B3")
                                : selectedProject.id === "madurai-farms"
                                ? (language === "ta" ? "15 பண்ணை மனைகள் · மீன் குளங்கள் & வசதிகள் (2 வரைபடங்கள்)" : "15 Farm Plots · Fish Ponds & Facilities (2 Layout Plans)")
                                : (language === "ta" ? "கள வரைபடம்" : "Cadastral Layout Blueprint")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFolderImages({
                                  title: `${selectedProject.name[language]} – ${activeBlueprintTitle}`,
                                  images: allBlueprintImages,
                                });
                              }}
                              className="text-xs font-bold text-[#B45309] hover:text-[#92400e] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>{language === "ta" ? "பெரிதாக்கு ↗" : "Zoom / Full Screen ↗"}</span>
                            </button>
                            <a
                              href={activeBlueprintSrc}
                              download
                              className="text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
                            >
                              <Download className="h-3 w-3" />
                              <span>{language === "ta" ? "பதிவிறக்கு" : "Download"}</span>
                            </a>
                          </div>
                        </div>

                        {/* Interactive Layout Plan Container */}
                        <div
                          onClick={() => {
                            setSelectedFolderImages({
                              title: `${selectedProject.name[language]} – ${activeBlueprintTitle}`,
                              images: allBlueprintImages,
                            });
                          }}
                          className="relative w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-md bg-white group cursor-zoom-in p-2 transition-all hover:border-[#EAB308]/60"
                        >
                          <div className="relative w-full h-72 sm:h-96 md:h-[440px] bg-white rounded-xl overflow-hidden flex items-center justify-center">
                            <Image
                              src={activeBlueprintSrc}
                              alt={`${selectedProject.name.en} ${activeBlueprintTitle}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 900px"
                              className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                              priority
                            />
                          </div>
                          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/75 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs opacity-90 group-hover:opacity-100 shadow-lg">
                            <ExternalLink className="h-3.5 w-3.5 text-[#EAB308]" />
                            <span>{language === "ta" ? "முழுத்திரை பார்க்க கிளிக் செய்க" : "Click to view High-Res"}</span>
                          </div>
                        </div>

                        {/* Thumbnails strip for multiple blueprints */}
                        {selectedProject.blueprints && selectedProject.blueprints.length > 1 && (
                          <div className="grid grid-cols-2 gap-2">
                            {selectedProject.blueprints.map((bp, bpIdx) => (
                              <button
                                key={bpIdx}
                                type="button"
                                onClick={() => setModalActiveBlueprintIndex(bpIdx)}
                                className={`p-2 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 text-left ${
                                  modalActiveBlueprintIndex === bpIdx
                                    ? "border-[#EAB308] bg-amber-500/10 shadow-xs"
                                    : "border-neutral-200 hover:border-neutral-300 bg-white"
                                }`}
                              >
                                <div className="relative h-12 w-16 rounded-lg overflow-hidden shrink-0 border border-neutral-200 bg-neutral-100">
                                  <Image src={bp.image} alt={bp.title.en} fill className="object-contain" sizes="80px" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-[10px] font-black uppercase text-amber-700 block">
                                    {language === "ta" ? `வரைபடம் 0${bpIdx + 1}` : `Plan 0${bpIdx + 1}`}
                                  </span>
                                  <span className="text-xs font-bold text-neutral-900 truncate block">
                                    {bp.title[language]}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                      {/* Extra layout details specifically for vaigai-elite */}
                      {selectedProject.id === "vaigai-elite" && (
                        <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                            <span>{language === "ta" ? "அளவீடுகள் & உட்பிரிவுகள் (Subdivisions)" : "Parcels & Subdivisions"}</span>
                            <span className="text-emerald-700 font-extrabold">{language === "ta" ? "கிடைக்கும் பரப்பு: 523 சென்ட் (5.23 ஏக்கர்)" : "Available Extent: 523 Cents (5.23 Acres)"}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "பிரிவு 1" : "Parcel 1"}</span>
                              <span className="text-xs font-black text-neutral-800">96 Cents</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "பிரிவு 2" : "Parcel 2"}</span>
                              <span className="text-xs font-black text-neutral-800">97 Cents</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "பிரிவு 3" : "Parcel 3"}</span>
                              <span className="text-xs font-black text-neutral-800">159 Cents</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "பிரிவு 4" : "Parcel 4"}</span>
                              <span className="text-xs font-black text-neutral-800">139 Cents</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "பிரிவு 5" : "Parcel 5"}</span>
                              <span className="text-xs font-black text-neutral-800">32 Cents</span>
                            </div>
                            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-rose-500 block">{language === "ta" ? "பிரிவு" : "Parcel"}</span>
                              <span className="text-xs font-black text-rose-700">93 Cts (Sold)</span>
                            </div>
                          </div>
                          <div className="text-[11px] text-neutral-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-neutral-200">
                            <span>🛣️ <strong>{language === "ta" ? "சாலை வசதி:" : "Road Access:"}</strong> {language === "ta" ? "40 அடி அகல சாலை + வைகை கால்வாய் பாலம் வழியாக 4-வழி தேசிய நெடுஞ்சாலை நேரடி இணைப்பு" : "40 Ft Wide Road + Bridge over canal connecting directly to 4-Lane Madurai–Rameshwaram NH"}</span>
                            <span className="text-neutral-500">📍 {language === "ta" ? "மணலூர் கிராமம், திருப்புவனம் தாலுகா" : "Manaloor Village, Thirupuvanam Taluk"}</span>
                          </div>
                        </div>
                      )}

                      {/* Extra layout details specifically for vaigai-river */}
                      {selectedProject.id === "vaigai-river" && (
                        <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                            <span>{language === "ta" ? "கள வரைபட அளவீடுகள் (Site Layout Specs)" : "Site Layout Dimensions & Road Specs"}</span>
                            <span className="text-emerald-700 font-extrabold">{language === "ta" ? "மொத்த பரப்பு: 27.4 சென்ட் (Commercial Land)" : "Total Extent: 27.4 Cents (Commercial Land)"}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "தெற்கு எல்லை (நதி)" : "South Boundary (River)"}</span>
                              <span className="text-xs font-black text-neutral-800">150' 2"</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "சாலை முகப்பு (Top)" : "Road Frontage (Top)"}</span>
                              <span className="text-xs font-black text-neutral-800">63'6" + 116'1"</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "மேற்கு எல்லை" : "West Boundary"}</span>
                              <span className="text-xs font-black text-neutral-800">52' 4"</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "கிழக்கு எல்லை" : "East Boundary"}</span>
                              <span className="text-xs font-black text-neutral-800">61'6" + 25'</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center gap-1.5">
                              <span>🌊</span>
                              <span>{language === "ta" ? "வைகை நதி பார்வை: சுமார் 100 மீ" : "Vaigai River View: Approx. 100 m"}</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-semibold flex items-center gap-1.5">
                              <span>🛣️</span>
                              <span>{language === "ta" ? "70 அடி ரோடு & அண்ணா நகர் ரிவர் பெல்ட் சாலை" : "70 Ft Road & Anna Nagar River Belt Road"}</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold flex items-center gap-1.5">
                              <span>🏢</span>
                              <span>{language === "ta" ? "அருகில் கார் ஷோரூம் & மருத்துவமனை" : "Adjacent Car Showroom & Hospital"}</span>
                            </div>
                          </div>
                          <div className="text-[11px] text-neutral-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-neutral-200">
                            <span>📋 <strong>{language === "ta" ? "சர்வே எண்கள்:" : "Survey Nos:"}</strong> 85/1A2, 1A3, 1B, 4A</span>
                            <span className="text-neutral-500">📍 {language === "ta" ? "வண்டியூர் பிட்-2 கிராமம், மதுரை கிழக்கு தாலுகா" : "Vandiyur Bit-2 Village, Madurai East Taluk"}</span>
                          </div>
                        </div>
                      )}

                      {/* Extra layout details specifically for pandi-kovil */}
                      {selectedProject.id === "pandi-kovil" && (
                        <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                            <span>{language === "ta" ? "கள வரைபட அளவீடுகள் & சாலை முகப்பு" : "Site Dimensions & Road Frontage"}</span>
                            <span className="text-emerald-700 font-extrabold">{language === "ta" ? "மொத்த பரப்பு: 60 சென்ட் / 52.4 சென்ட் (130 அடி முகப்பு)" : "Total Extent: 60 Cents / 52.4 Cents (130 Ft Frontage)"}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "நில அளவு" : "Total Area"}</span>
                              <span className="text-xs font-black text-neutral-800">60 Cent (52.4 Cts)</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "சாலை முகப்பு (24 அடி சாலை)" : "Road Frontage (24ft)"}</span>
                              <span className="text-xs font-black text-neutral-800">130 Ft Wide</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "பக்கவாட்டு நீளம்" : "Side Boundaries"}</span>
                              <span className="text-xs font-black text-neutral-800">160' (W) & 187' (E)</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "பின்புற அகலம்" : "Rear Width"}</span>
                              <span className="text-xs font-black text-neutral-800">130 Ft (South)</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-semibold flex items-center gap-1.5">
                              <span>🛣️</span>
                              <span>{language === "ta" ? "24 அடி சாலை முகப்பு (பாண்டி கோவில் மெயின் ரோடு நேரடி இணைப்பு)" : "24 Ft Road Frontage (Direct access to Pandi Kovil Main Road)"}</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center gap-1.5">
                              <span>🏢</span>
                              <span>{language === "ta" ? "HCL Tech, குரு, ரியோ & விக்ரம் மருத்துவமனைகள்" : "HCL Tech, Guru, Rio, Vikram & Meenakshi Mission"}</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold flex items-center gap-1.5">
                              <span>🏛️</span>
                              <span>{language === "ta" ? "திருமண மண்டபம், குடோன் & வணிக வளாகத்திற்கு உகந்தது" : "Ideal for Marriage Hall, Warehouse, Hostel & Retail"}</span>
                            </div>
                          </div>
                          <div className="text-[11px] text-neutral-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-neutral-200">
                            <span>📋 <strong>{language === "ta" ? "சர்வே எண்:" : "Survey No:"}</strong> S.NO: 2-1B3 · {language === "ta" ? "மேலமடை பிட் 2 கிராமம், மதுரை கிழக்கு தாலுகா" : "Melamadai Bit 2 Village, Madurai East Taluk"}</span>
                            <span className="text-neutral-500">📍 {language === "ta" ? "பாண்டி கோவில், மதுரை" : "Pandi Kovil, Madurai"}</span>
                          </div>
                        </div>
                      )}

                      {/* Extra layout details specifically for madurai-farms */}
                      {selectedProject.id === "madurai-farms" && (
                        <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                            <span>{language === "ta" ? "பண்ணை மனை வரைபட அளவீடுகள் (15 Plots Layout)" : "15-Plot Farm Layout Dimensions & Amenities"}</span>
                            <span className="text-emerald-700 font-extrabold">{language === "ta" ? "15 அங்கீகரிக்கப்பட்ட பண்ணை மனைகள் (8 முதல் 10.9 சென்ட்)" : "15 Demarcated Plots (8.0 to 10.9 Cents)"}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "மனைப்பிரிவுகள்" : "Farm Plots"}</span>
                              <span className="text-xs font-black text-neutral-800">15 Plots (8–10.9 Cts)</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "தண்ணீர் வசதி" : "Water Features"}</span>
                              <span className="text-xs font-black text-neutral-800">Fish Pond + Bore Well</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "அணுகு சாலை" : "Approach Road"}</span>
                              <span className="text-xs font-black text-neutral-800">Mudukangulam Main Rd</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center shadow-xs">
                              <span className="text-[10px] font-bold text-neutral-400 block">{language === "ta" ? "வசதிகள்" : "Infrastructure"}</span>
                              <span className="text-xs font-black text-neutral-800">Shed + Pier + Drip</span>
                            </div>
                          </div>
                          <div className="text-[11px] text-neutral-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-neutral-200">
                            <span>📋 <strong>{language === "ta" ? "சர்வே எண்கள்:" : "Survey Nos:"}</strong> 201/3B, 205/4, 207/4, 208/1, 208/2A, 208/2B, 209</span>
                            <span className="text-neutral-500">📍 {language === "ta" ? "முடுக்கங்குளம் கிராமம், காரியாபட்டி தாலுகா, விருதுநகர் மாவட்டம்" : "Mudukangulam Village, Kariyapatti Taluk, Virudunagar Dist"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                </div>

                {/* 5. ACTION FOOTER (Pinned at bottom of popup) */}
                <div className="p-3.5 sm:px-7 sm:py-3.5 border-t border-neutral-100 bg-white/95 backdrop-blur-xs shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2.5 z-20">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <a
                      href={selectedProject.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Navigation className="h-3.5 w-3.5 text-blue-600" />
                      <span>{language === "ta" ? "கூகிள் மேப்ஸ்" : "Google Maps"}</span>
                    </a>

                    {selectedProject.mapbhoomiUrl && (
                      <a
                        href={selectedProject.mapbhoomiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-[#0A0D12] hover:bg-neutral-800 text-[#EAB308] border border-[#EAB308]/50 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Compass className="h-3.5 w-3.5 text-[#EAB308]" />
                        <span>Mapbhoomi (Open map ↗)</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`tel:${phone}`}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#0A0D12] text-white hover:bg-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#EAB308]" />
                      <span>{language === "ta" ? "நேரடி அழைப்பு" : "Call Advisor"}</span>
                    </a>

                    <a
                      href={`https://wa.me/${rawWhatsapp}?text=Hello%20Surya%20Promoters,%20I%20am%20interested%20in%20${encodeURIComponent(
                        selectedProject.name.en
                      )}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="h-3.5 w-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ------------------------------------------------------------------------- */}
      {/* 4. LIGHTBOX & VIDEO MODALS                                                */}
      {/* ------------------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedFolderImages && (
          <div
            data-lenis-prevent
            onClick={() => setSelectedFolderImages(null)}
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="relative w-full max-w-5xl bg-white rounded-3xl p-5 sm:p-7 max-h-[88vh] overflow-y-auto overscroll-contain"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                <h3 className="text-base font-black text-neutral-900">{selectedFolderImages.title}</h3>
                <button onClick={() => setSelectedFolderImages(null)} className="p-1 text-neutral-500 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedFolderImages.images.map((img, idx) => (
                  <div key={idx} className="relative h-48 rounded-xl overflow-hidden bg-neutral-900 group">
                    <Image src={img} alt="Photo" fill sizes="300px" className="object-cover" />
                    <a
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedVideo && (
          <div
            data-lenis-prevent
            onClick={() => setSelectedVideo(null)}
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="relative w-full max-w-2xl bg-[#0A0D12] text-white rounded-3xl p-6 border border-neutral-800 max-h-[88vh] overflow-y-auto overscroll-contain"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
                <h3 className="text-base font-black text-white">{selectedVideo.title}</h3>
                <button onClick={() => setSelectedVideo(null)} className="p-1 text-neutral-400 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="h-64 sm:h-80 w-full rounded-2xl bg-neutral-950 flex flex-col items-center justify-center p-6 text-center border border-neutral-800">
                <div className="h-14 w-14 rounded-full bg-[#EAB308] text-[#0A0D12] flex items-center justify-center mb-3">
                  <Play className="h-6 w-6 fill-[#0A0D12] ml-0.5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{selectedVideo.title}</h4>
                <p className="text-xs text-neutral-400 mb-4">4K drone footage stream available on request</p>
                <a
                  href={`https://wa.me/${rawWhatsapp}?text=Hello%20Surya%20Promoters,%20please%20send%20full%20project%20video.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>Request Full Video on WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------------- */}
      {/* 5. QUICK ENQUIRY MODAL                                                    */}
      {/* ------------------------------------------------------------------------- */}
      <AnimatePresence>
        {isEnquiryModalOpen && (
          <div
            data-lenis-prevent
            onClick={() => setIsEnquiryModalOpen(false)}
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 max-h-[88vh] overflow-y-auto overscroll-contain"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                <h3 className="text-base font-black text-neutral-900">Direct Enquiry</h3>
                <button onClick={() => setIsEnquiryModalOpen(false)} className="p-1 text-neutral-400 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(language === "ta" ? "நன்றி! உங்கள் தகவல் பெறப்பட்டது." : "Thank you! Your enquiry has been received.");
                  setIsEnquiryModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Select Project</label>
                  <select className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-hidden bg-white">
                    {ALL_PROJECTS.map((p) => (
                      <option key={p.id} value={p.name.en}>
                        {p.name.en}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0A0D12] hover:bg-neutral-800 text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer mt-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#EAB308]" />
                  <span>Submit Quick Enquiry</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
