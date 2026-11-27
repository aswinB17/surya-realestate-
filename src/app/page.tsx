"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useCmsData } from "@/hooks/useCmsData";
import { CmsCategory, CmsDownloadItem } from "@/types/cms";
import {
  Building2,
  MapPin,
  Map,
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
  ChevronDown,
  Users,
  Menu,
  X,
  Star,
  Play,
  Folder,
  Layers,
  FileText,
  Search,
  Sparkles,
  Maximize2,
  ZoomIn,
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
  TrendingUp,
  ThumbsUp,
  Building,
  Factory,
  Warehouse,
  Landmark,
  TreePine,
  Clock,
} from "lucide-react";
import { PROJECT_DETAILS_MAP } from "@/data/projectDetailsExtra";
import BottomLandscape from "@/components/layout/BottomLandscape";

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
  const email = companyInfo?.email || "suryapromotersmdu@gmail.com";
  const address = companyInfo?.address || "120 Feet Road, Near Mattuthavani Bus Stand, K.K. Nagar Corridor, Madurai, Tamil Nadu 625020";
  const mapsLink = companyInfo?.mapsLink || "https://www.google.com/maps?q=9.9253208,78.1702385&z=17&hl=en";
  const instagramUrl = (companyInfo as any)?.instagramUrl || "https://www.instagram.com/surya_promoters_madurai";
  const facebookUrl = (companyInfo as any)?.facebookUrl || "https://www.facebook.com/share/1GoBJ8tdMS/";
  const companyWhatsapp = companyInfo?.whatsapp || "+91 78457 16453";
  const rawWhatsapp = companyWhatsapp.replace(/[^0-9]/g, "") || "917845716453";
  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
    language === "ta"
      ? "வணக்கம் சூர்யா புரமோட்டர்ஸ், உங்கள் மனை திட்டங்கள் குறித்த விவரங்களை அறிய விரும்புகிறேன்."
      : "Hello Surya Promoters, I am interested in your Madurai projects. Please share details."
  )}`;

  // Navigation State: Which of the 5 Main Icons / Sections is Active
  // 'home' | 'projects' | 'location' | 'gallery' | 'about' | 'download'
  const [activeTab, setActiveTab] = useState<"home" | "projects" | "location" | "gallery" | "about" | "download" | "contact">("home");

  // In "Our Projects": Which Category is Active
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Tab History tracking for seamless Back Arrow navigation
  // Mobile Collapsible Navigation Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [tabHistory, setTabHistory] = useState<Array<"home" | "projects" | "location" | "gallery" | "about" | "download" | "contact">>(["home"]);

  useEffect(() => {
    setTabHistory((prev) => {
      if (prev.length > 0 && prev[prev.length - 1] === activeTab) {
        return prev;
      }
      return [...prev, activeTab];
    });
  }, [activeTab]);

  const handleGoBack = () => {
    if (activeTab === "projects" && searchQuery.trim() !== "") {
      setSearchQuery("");
      setActiveCategory(null);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (activeTab === "projects" && activeCategory !== null) {
      setActiveCategory(null);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (tabHistory.length > 1) {
      const updatedHistory = tabHistory.slice(0, -1);
      const prevTab = updatedHistory[updatedHistory.length - 1];
      setTabHistory(updatedHistory);
      setActiveTab(prevTab || "home");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (typeof window !== "undefined" && window.history.length > 1 && document.referrer) {
      window.history.back();
    } else {
      setActiveTab("home");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

  // Search input & autocomplete state
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click/touch outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Modals & Popups
  const [selectedProject, setSelectedProject] = useState<AppProject | null>(null);
  const [selectedFolderImages, setSelectedFolderImages] = useState<{ title: string; images: string[] } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; duration: string; url?: string } | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedDownloadPreview, setSelectedDownloadPreview] = useState<{
    item: CmsDownloadItem;
    activeTab: "layout" | "brochure";
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lock body & background scrolling whenever any modal popup is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      selectedProject ||
      selectedFolderImages ||
      selectedVideo ||
      isEnquiryModalOpen ||
      selectedDownloadPreview
    );
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
  }, [selectedProject, selectedFolderImages, selectedVideo, isEnquiryModalOpen, selectedDownloadPreview]);


  // Handler to download both layout and brochure of a card
  const handleDownloadCard = (item: CmsDownloadItem) => {
    // 1. Download Layout
    const layoutLink = document.createElement("a");
    layoutLink.href = item.downloadUrl;
    layoutLink.setAttribute("download", "");
    document.body.appendChild(layoutLink);
    layoutLink.click();
    document.body.removeChild(layoutLink);

    // 2. Download Brochure if present
    if (item.brochureUrl) {
      setTimeout(() => {
        const brochureLink = document.createElement("a");
        brochureLink.href = item.brochureUrl!;
        brochureLink.setAttribute("download", "");
        document.body.appendChild(brochureLink);
        brochureLink.click();
        document.body.removeChild(brochureLink);
      }, 400);

      triggerToast(
        language === "ta"
          ? `${item.title[language]}: வரைபடம் மற்றும் கையேடு இரண்டும் பதிவிறக்கப்படுகின்றன...`
          : `Downloading Layout & Brochure for ${item.title[language]}...`
      );
    } else {
      triggerToast(
        language === "ta"
          ? `${item.title[language]} பதிவிறக்கப்படுகிறது...`
          : `Downloading ${item.title[language]}...`
      );
    }
  };

  // Project Details Modal interactive media & tab states
  const [modalActiveImage, setModalActiveImage] = useState<string | null>(null);
  const [modalMediaMode, setModalMediaMode] = useState<"photos" | "video">("photos");
  const [modalSectionTab, setModalSectionTab] = useState<"overview" | "locality" | "valuation" | "reviews">("overview");
  const [modalActiveBlueprintIndex, setModalActiveBlueprintIndex] = useState<number>(0);
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});
  const [activeFolderImageIndex, setActiveFolderImageIndex] = useState<number | null>(null);

  // Keyboard navigation for gallery folder images popup
  useEffect(() => {
    if (!selectedFolderImages || activeFolderImageIndex === null) return;
    const handleFolderKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveFolderImageIndex(null);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveFolderImageIndex((prev) =>
          prev !== null ? (prev - 1 + selectedFolderImages.images.length) % selectedFolderImages.images.length : 0
        );
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveFolderImageIndex((prev) =>
          prev !== null ? (prev + 1) % selectedFolderImages.images.length : 0
        );
      }
    };
    window.addEventListener("keydown", handleFolderKeyDown);
    return () => window.removeEventListener("keydown", handleFolderKeyDown);
  }, [selectedFolderImages, activeFolderImageIndex]);

  // Keyboard navigation for project modal images
  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
        return;
      }
      const projectExtra = PROJECT_DETAILS_MAP[selectedProject.id];
      const gallery = projectExtra?.galleryImages && projectExtra.galleryImages.length > 0
        ? projectExtra.galleryImages
        : [selectedProject.image];
      if (gallery.length <= 1) return;
      const activeImg = modalActiveImage || selectedProject.image;
      const curIdx = gallery.indexOf(activeImg) !== -1 ? gallery.indexOf(activeImg) : 0;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIdx = (curIdx - 1 + gallery.length) % gallery.length;
        setModalActiveImage(gallery[prevIdx]);
        setModalMediaMode("photos");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextIdx = (curIdx + 1) % gallery.length;
        setModalActiveImage(gallery[nextIdx]);
        setModalMediaMode("photos");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, modalActiveImage]);

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
        p.location.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.ta.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    : [];

  // Matching projects for search across ALL categories
  const searchMatchingProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_PROJECTS.filter((p) => {
      const nameEn = (p.name?.en || "").toLowerCase();
      const nameTa = (p.name?.ta || "").toLowerCase();
      const locEn = (p.location?.en || "").toLowerCase();
      const locTa = (p.location?.ta || "").toLowerCase();
      return (
        nameEn.includes(q) ||
        nameTa.includes(q) ||
        locEn.includes(q) ||
        locTa.includes(q)
      );
    });
  }, [ALL_PROJECTS, searchQuery]);

  // Autocomplete suggestions: computed dynamically when query length is at least 5
  const autocompleteSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 5) return [];
    return ALL_PROJECTS.filter((p) => {
      const nameEn = (p.name?.en || "").toLowerCase();
      const nameTa = (p.name?.ta || "").toLowerCase();
      const locEn = (p.location?.en || "").toLowerCase();
      const locTa = (p.location?.ta || "").toLowerCase();
      return (
        nameEn.includes(q) ||
        nameTa.includes(q) ||
        locEn.includes(q) ||
        locTa.includes(q)
      );
    });
  }, [ALL_PROJECTS, searchQuery]);

  const handleSelectSuggestion = (project: AppProject) => {
    setSelectedProject(project);
    setActiveTab("projects");
    setActiveCategory(null);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const highlightMatch = (text: string, query: string) => {
    const q = query.trim();
    if (!q || !text) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, idx) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark
          key={idx}
          className="bg-[#FEF08A] text-[#06351F] font-black rounded-xs px-0.5"
        >
          {part}
        </mark>
      ) : (
        <React.Fragment key={idx}>{part}</React.Fragment>
      )
    );
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
      setActiveTab("projects");
      setActiveCategory(null);
    }
  };

  const renderProjectCard = (project: AppProject) => {
    const projectExtra = PROJECT_DETAILS_MAP[project.id];
    const cardGallery = projectExtra?.galleryImages && projectExtra.galleryImages.length > 0
      ? projectExtra.galleryImages
      : [project.image];
    const cardImgIndex = cardImageIndices[project.id] ?? 0;
    const currentCardImage = cardGallery[cardImgIndex % cardGallery.length] || project.image;

    return (
      <div
        key={project.id}
        onClick={() => setSelectedProject(project)}
        className="bg-white rounded-[22px] overflow-hidden border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-[#D9A52E]/70 transition-all duration-300 flex flex-col group cursor-pointer"
      >
        {/* Card Thumbnail */}
        <div className="relative h-60 w-full overflow-hidden bg-neutral-900 group/cardimg">
          <Image
            src={currentCardImage}
            alt={project.name.en}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Next / Previous Arrows on Card */}
          {cardGallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardImageIndices((prev) => ({
                    ...prev,
                    [project.id]: (cardImgIndex - 1 + cardGallery.length) % cardGallery.length,
                  }));
                }}
                aria-label="Previous image"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/65 hover:bg-[#D9A52E] text-white hover:text-[#06351F] border border-white/20 hover:border-[#D9A52E] flex items-center justify-center backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto opacity-80 sm:opacity-0 sm:group-hover/cardimg:opacity-100"
                title="Previous image"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardImageIndices((prev) => ({
                    ...prev,
                    [project.id]: (cardImgIndex + 1) % cardGallery.length,
                  }));
                }}
                aria-label="Next image"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/65 hover:bg-[#D9A52E] text-white hover:text-[#06351F] border border-white/20 hover:border-[#D9A52E] flex items-center justify-center backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto opacity-80 sm:opacity-0 sm:group-hover/cardimg:opacity-100"
                title="Next image"
              >
                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
              </button>
              <div className="absolute bottom-2 right-2 z-20 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white/90 border border-white/10 pointer-events-none">
                {(cardImgIndex % cardGallery.length) + 1} / {cardGallery.length}
              </div>
            </>
          )}

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

            <div className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#06351F]/90 text-[#D9A52E] border border-[#D9A52E]/40 backdrop-blur-md">
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
                className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-[#06351F]/95 hover:bg-[#D9A52E] text-[#D9A52E] hover:text-[#06351F] border border-[#D9A52E]/60 flex items-center gap-1 shadow-md transition-all hover:scale-105 cursor-pointer pointer-events-auto"
                title="2D/3D views"
              >
                <Compass className="h-3 w-3" />
                <span>2D/3D views ↗</span>
              </a>
            )}
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/95 text-[#06351F] pointer-events-none">
              {project.subcategoryLabel[language]}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
            <h3 className="text-base font-black leading-tight drop-shadow-md group-hover:text-[#D9A52E] transition-colors">
              {project.name[language]}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-neutral-300 mt-0.5">
              <MapPin className="h-3 w-3 text-[#D9A52E] shrink-0" />
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
                className="w-full py-2 px-3 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
              >
                {language === "ta" ? "முழு விவரம்" : "Project Details"}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject(project);
                  setIsEnquiryModalOpen(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#0E5934] hover:bg-[#06351F] text-white text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs border border-[#0E5934]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#D9A52E]" />
                <span>{language === "ta" ? "விசாரிக்க" : "Enquire"}</span>
              </button>
            </div>

            {/* Direct Mapbhoomi Layout Button */}
            {project.mapbhoomiUrl && (
              <a
                href={project.mapbhoomiUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full py-2 px-3 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm group/mb cursor-pointer"
              >
                <Compass className="h-3.5 w-3.5 text-[#E5A922] group-hover/mb:rotate-45 transition-transform shrink-0" />
                <span>{language === "ta" ? "2D/3D views (வரைபடம் ↗)" : "2D/3D views ↗"}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const residentialCount = ALL_PROJECTS.filter((p) => p.category === "residential").length;
  const commercialCount = ALL_PROJECTS.filter((p) => p.category === "commercial").length;
  const farmCount = ALL_PROJECTS.filter((p) => p.category === "farm").length;

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#0A0D12] font-sans antialiased flex flex-col md:flex-row selection:bg-[#EAB308] selection:text-[#0A0D12] overflow-x-hidden">

      {/* ------------------------------------------------------------------------- */}
      {/* LEFT VERTICAL APP STORE NAVIGATION BAR (Fixed at top: 0, left: 0)         */}
      {/* ------------------------------------------------------------------------- */}
      <aside
        style={{ position: "fixed", top: 0, left: 0, height: "100vh" }}
        className="hidden md:flex fixed top-0 left-0 z-30 md:w-56 lg:w-64 shrink-0 bg-gradient-to-b from-[#052617] via-[#083822] to-[#041D12] text-white flex-col justify-between py-3.5 lg:py-4.5 px-3.5 select-none shadow-2xl border-r border-[#0A3D25] h-screen h-[100vh] max-h-screen overflow-y-auto"
      >

        {/* Top Section: Logo & Nav Links */}
        <div className="space-y-3.5 lg:space-y-4">
          {/* Brand Identity: Ornate S Logo + SURYA PROMOTERS 2-Line Stack (Fixed, No Hover Reaction) */}
          <button
            onClick={() => {
              setActiveTab("home");
              if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex flex-col items-center justify-center text-center pt-2 pb-1 lg:pt-3 lg:pb-1.5 px-2 select-none w-full outline-none focus:outline-none cursor-default"
            title="Surya Promoters Estd. 2010"
          >
            <div className="flex flex-col items-center">
              {/* Line 1: Golden S Logo and URYA on the same horizontal line */}
              <div className="flex items-center justify-center whitespace-nowrap">
                <span className="relative inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 xl:w-9.5 xl:h-9.5 shrink-0 -mr-1">
                  <Image
                    src="/images/surya-gold-logo.png"
                    alt="S"
                    fill
                    priority
                    sizes="40px"
                    className="object-contain"
                  />
                </span>
                <span className="font-display text-xl sm:text-2xl lg:text-[25px] xl:text-[27px] font-black tracking-[0.12em] text-[#D9A52E] uppercase leading-none drop-shadow-sm">
                  URYA
                </span>
              </div>

              {/* Line 2: PROMOTERS directly below SURYA */}
              <span className="font-display text-[11px] sm:text-xs lg:text-[13px] xl:text-[14px] font-extrabold tracking-[0.32em] text-[#F1E4C3] uppercase leading-none mt-1.5 text-center pl-1">
                PROMOTERS
              </span>

              {/* Line 3: ESTD. 2010 centered underneath */}
              <div className="flex items-center gap-2 w-full justify-center mt-2 lg:mt-2.5">
                <span className="h-[1px] w-5 sm:w-6 bg-[#D9A52E]/40" />
                <span className="font-mono text-[9px] lg:text-[10px] xl:text-[11px] font-bold tracking-[0.25em] uppercase text-[#F1E4C3]/80 whitespace-nowrap">
                  ESTD. 2010
                </span>
                <span className="h-[1px] w-5 sm:w-6 bg-[#D9A52E]/40" />
              </div>
            </div>
          </button>

          {/* Navigation Links (Match Reference Image exactly) */}
          <div className="space-y-1.5 pt-1">
            {/* Nav Item: Store Home */}
            <button
              onClick={() => setActiveTab("home")}
              className={`group w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all duration-300 ease-out hover:translate-x-1 active:scale-[0.98] cursor-pointer font-bold text-sm ${activeTab === "home"
                ? "bg-gradient-to-r from-[#F5B731] via-[#EAB308] to-[#D98E14] text-[#0A1C12] shadow-[0_4px_16px_rgba(234,179,8,0.4)]"
                : "text-[#E1ECE6] hover:bg-white/10 hover:text-white"
                }`}
            >
              <Home className={`h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-200 ease-out ${activeTab === "home" ? "text-[#0A1C12]" : "text-white/80"}`} />
              <span className="truncate">{language === "ta" ? "முகப்பு" : "Store Home"}</span>
            </button>

            {/* Nav Item: Our Projects */}
            <button
              onClick={() => {
                setActiveTab(activeTab === "projects" ? "home" : "projects");
                setActiveCategory(null);
              }}
              className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-300 ease-out hover:translate-x-1 active:scale-[0.98] cursor-pointer font-semibold text-xs sm:text-sm ${activeTab === "projects"
                ? "bg-gradient-to-r from-[#F5B731] via-[#EAB308] to-[#D98E14] text-[#0A1C12] font-bold shadow-[0_4px_16px_rgba(234,179,8,0.4)]"
                : "text-[#D8E6DE] hover:bg-white/10 hover:text-white"
                }`}
            >
              <Building2 className={`h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-200 ease-out ${activeTab === "projects" ? "text-[#0A1C12]" : "text-white/70"}`} />
              <span className="truncate">{language === "ta" ? "திட்டங்கள்" : "Our Projects"}</span>
            </button>

            {/* Nav Item: Site Location */}
            <button
              onClick={() => setActiveTab(activeTab === "location" ? "home" : "location")}
              className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-300 ease-out hover:translate-x-1 active:scale-[0.98] cursor-pointer font-semibold text-xs sm:text-sm ${activeTab === "location"
                ? "bg-gradient-to-r from-[#F5B731] via-[#EAB308] to-[#D98E14] text-[#0A1C12] font-bold shadow-[0_4px_16px_rgba(234,179,8,0.4)]"
                : "text-[#D8E6DE] hover:bg-white/10 hover:text-white"
                }`}
            >
              <MapPin className={`h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-200 ease-out ${activeTab === "location" ? "text-[#0A1C12]" : "text-white/70"}`} />
              <span className="truncate">{language === "ta" ? "தள அமைவிடம்" : "Site Location"}</span>
            </button>

            {/* Nav Item: Gallery Folders */}
            <button
              onClick={() => setActiveTab(activeTab === "gallery" ? "home" : "gallery")}
              className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-300 ease-out hover:translate-x-1 active:scale-[0.98] cursor-pointer font-semibold text-xs sm:text-sm ${activeTab === "gallery"
                ? "bg-gradient-to-r from-[#F5B731] via-[#EAB308] to-[#D98E14] text-[#0A1C12] font-bold shadow-[0_4px_16px_rgba(234,179,8,0.4)]"
                : "text-[#D8E6DE] hover:bg-white/10 hover:text-white"
                }`}
            >
              <Camera className={`h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-200 ease-out ${activeTab === "gallery" ? "text-[#0A1C12]" : "text-white/70"}`} />
              <span className="truncate">{language === "ta" ? "புகைப்படங்கள் & வீடியோ" : "Gallery Folders"}</span>
            </button>

            {/* Nav Item: Download Layout */}
            <button
              onClick={() => setActiveTab("download")}
              className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-300 ease-out hover:translate-x-1 active:scale-[0.98] cursor-pointer font-semibold text-xs sm:text-sm ${activeTab === "download"
                ? "bg-gradient-to-r from-[#F5B731] via-[#EAB308] to-[#D98E14] text-[#0A1C12] font-bold shadow-[0_4px_16px_rgba(234,179,8,0.4)]"
                : "text-[#D8E6DE] hover:bg-white/10 hover:text-white"
                }`}
            >
              <Download className={`h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-200 ease-out ${activeTab === "download" ? "text-[#0A1C12]" : "text-white/70"}`} />
              <span className="truncate">{language === "ta" ? "வரைபடம் பதிவிறக்கம்" : "Download Layout"}</span>
            </button>

            {/* Nav Item: About Company */}
            <button
              onClick={() => setActiveTab("about")}
              className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-300 ease-out hover:translate-x-1 active:scale-[0.98] cursor-pointer font-semibold text-xs sm:text-sm ${activeTab === "about"
                ? "bg-gradient-to-r from-[#F5B731] via-[#EAB308] to-[#D98E14] text-[#0A1C12] font-bold shadow-[0_4px_16px_rgba(234,179,8,0.4)]"
                : "text-[#D8E6DE] hover:bg-white/10 hover:text-white"
                }`}
            >
              <ShieldCheck className={`h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-200 ease-out ${activeTab === "about" ? "text-[#0A1C12]" : "text-white/70"}`} />
              <span className="truncate">{language === "ta" ? "நிறுவனம் பற்றி" : "About Company"}</span>
            </button>

            {/* Nav Item: Contact Us */}
            <button
              onClick={() => setActiveTab("contact")}
              className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-300 ease-out hover:translate-x-1 active:scale-[0.98] cursor-pointer font-semibold text-xs sm:text-sm ${activeTab === "contact"
                ? "bg-gradient-to-r from-[#F5B731] via-[#EAB308] to-[#D98E14] text-[#0A1C12] font-bold shadow-[0_4px_16px_rgba(234,179,8,0.4)]"
                : "text-[#D8E6DE] hover:bg-white/10 hover:text-white"
                }`}
            >
              <PhoneCall className={`h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-200 ease-out ${activeTab === "contact" ? "text-[#0A1C12]" : "text-white/70"}`} />
              <span className="truncate">{language === "ta" ? "நேரடி தொடர்பு" : "Contact Us"}</span>
            </button>
          </div>
        </div>

        {/* Bottom Section: Golden Skyline Illustration & Direct Contact Card */}
        <div className="mt-auto pt-1 space-y-2 flex flex-col items-center">
          {/* Golden Architectural Skyline Line-art - Enlarged (88-92% width, 92-105px height) */}
          <div className="relative w-[90%] h-[92px] lg:h-[105px] overflow-hidden opacity-95 pointer-events-none mx-auto">
            <Image
              src="/images/reference/sidebar-skyline-v2.png"
              alt="Golden Madurai Skyline"
              fill
              sizes="(max-width: 1024px) 210px, 240px"
              className="object-contain object-bottom"
            />
          </div>

          {/* Direct Contact Pill Card (Arrow button removed globally) */}
          <div className="p-2.5 rounded-2xl bg-[#092D1B]/95 border border-[#E2B755]/40 flex items-center shadow-lg w-full">
            <a href={`tel:${phone}`} className="flex items-center gap-2.5 min-w-0 w-full group/call" title={`Call ${phone}`}>
              <div className="w-8 h-8 rounded-full bg-[#051F12] border border-[#E2B755]/50 flex items-center justify-center shrink-0 text-[#E5A922] group-hover/call:scale-105 transition-transform">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#A3C2B0] font-medium leading-tight">Direct Contact</p>
                <p className="text-xs font-bold text-white truncate leading-tight">{phone}</p>
              </div>
            </a>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------------- */}
      {/* RIGHT MAIN WINDOW CANVAS (Header + Dynamic Content Canvas)                */}
      {/* ------------------------------------------------------------------------- */}
      <div className={`flex-1 flex flex-col min-w-0 md:ml-56 lg:ml-64 ${activeTab === "home" ? "bg-[#FAF8F3]" : "bg-white"} relative min-h-screen`}>

        {/* TOP APP STORE WINDOW HEADER (Search & Quick Controls) */}
        <header className={`${activeTab === "home" ? "absolute top-0 left-0 right-0 z-40 bg-transparent px-2.5 sm:px-5 lg:px-7 pt-2.5 sm:pt-3 pb-1" : "sticky top-0 z-40 bg-gradient-to-r from-[#052617] via-[#083822] to-[#041D12] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 border-b border-[#0A3D25] shadow-lg backdrop-blur-md"} w-full flex items-center justify-between gap-1.5 sm:gap-3 lg:gap-4 select-none`}>
          {/* Far Left Header: Mobile Hamburger Menu Toggle OR Desktop Madurai Real Estate Location Badge */}
          <div className="flex items-center shrink-0">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`md:hidden p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer shadow-2xs flex items-center justify-center hover:scale-105 active:scale-95 ${activeTab === "home"
                ? "bg-[#06351F]/85 text-[#D9A52E] border-[#D9A52E]/40 hover:bg-[#06351F]"
                : "bg-[#092D1B] text-[#D9A52E] border-[#E2B755]/40 hover:bg-[#0E4228]"
                }`}
              aria-label="Open Navigation Menu"
              title="Menu"
            >
              <Menu className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </button>

            {/* Desktop Madurai Real Estate Badge - Relocated to Far Left immediately to the RIGHT of the sidebar */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-2 h-9 sm:h-9.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E5A922]/50 text-xs font-bold text-[#0A2617] shadow-xs hover:border-[#E5A922] transition-colors shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#E5A922] shrink-0 shadow-[0_0_6px_rgba(229,169,34,0.6)] animate-pulse" />
              <span className="whitespace-nowrap tracking-wide">{language === "ta" ? "மதுரை ரியல் எஸ்டேட்" : "Madurai Real Estate"}</span>
            </div>
          </div>

          {/* Center Search Pill & Autocomplete Suggestions */}
          <div ref={searchContainerRef} className="flex-1 min-w-[90px] max-w-xl relative flex items-center">
            {/* Relocated Search Icon/Button on the LEFT side */}
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="absolute left-1 sm:left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#E5A922]/40 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 z-10 hover:scale-105 active:scale-95"
              title={language === "ta" ? "தேடுக" : "Search"}
              aria-label={language === "ta" ? "தேடுக" : "Search"}
            >
              <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onFocus={() => {
                if (searchQuery.trim().length >= 5) {
                  setIsDropdownOpen(true);
                }
              }}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim().length >= 5) {
                  setIsDropdownOpen(true);
                } else {
                  setIsDropdownOpen(false);
                }
                setHighlightedIndex(-1);
              }}
              onKeyDown={(e) => {
                if (isDropdownOpen && searchQuery.trim().length >= 5) {
                  if (autocompleteSuggestions.length > 0) {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setHighlightedIndex((prev) =>
                        prev < autocompleteSuggestions.length - 1 ? prev + 1 : 0
                      );
                      return;
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlightedIndex((prev) =>
                        prev > 0 ? prev - 1 : autocompleteSuggestions.length - 1
                      );
                      return;
                    }
                    if (e.key === "Enter") {
                      if (highlightedIndex >= 0 && highlightedIndex < autocompleteSuggestions.length) {
                        e.preventDefault();
                        handleSelectSuggestion(autocompleteSuggestions[highlightedIndex]);
                        return;
                      }
                    }
                  }
                  if (e.key === "Escape") {
                    e.preventDefault();
                    setIsDropdownOpen(false);
                    setHighlightedIndex(-1);
                    return;
                  }
                }

                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
              placeholder={
                language === "ta"
                  ? "திட்டங்கள், இடங்கள் தேடுங்கள்..."
                  : "Search projects, locations..."
              }
              className={`w-full h-8 sm:h-9 pl-8 sm:pl-10 ${searchQuery ? "pr-8 sm:pr-9" : "pr-3.5 sm:pr-4"} bg-white/95 backdrop-blur-md text-[11px] sm:text-xs md:text-sm font-medium text-neutral-800 placeholder-neutral-400 rounded-full border border-neutral-200/90 shadow-xs focus:outline-none focus:border-[#E5A922] focus:ring-1 focus:ring-[#E5A922]/20 transition-all leading-normal`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setIsDropdownOpen(false);
                  setHighlightedIndex(-1);
                }}
                className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 flex items-center justify-center transition-all cursor-pointer text-xs font-bold z-10 hover:scale-105 active:scale-95"
                title={language === "ta" ? "தேடலை அழி" : "Clear search"}
                aria-label={language === "ta" ? "தேடலை அழி" : "Clear search"}
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {/* Autocomplete Suggestions Dropdown (Directly below search bar, only when >= 5 characters) */}
            {isDropdownOpen && searchQuery.trim().length >= 5 && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[calc(100vw-24px)] sm:w-full sm:left-0 sm:translate-x-0 bg-white rounded-2xl border border-neutral-200/95 shadow-2xl overflow-hidden z-50 animate-fadeIn max-h-[380px] flex flex-col">
                {autocompleteSuggestions.length > 0 ? (
                  <>
                    <div className="px-3.5 py-2 bg-[#FAF8F3] border-b border-neutral-100 flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase tracking-wider shrink-0 select-none">
                      <span>{language === "ta" ? "பரிந்துரைகள்" : "Suggestions"} ({autocompleteSuggestions.length})</span>
                      <span className="hidden sm:inline text-neutral-400 font-normal">↑↓ to navigate · ↵ to select</span>
                    </div>

                    <div className="overflow-y-auto divide-y divide-neutral-100 py-1 max-h-[280px]">
                      {autocompleteSuggestions.map((project, idx) => {
                        const isHighlighted = highlightedIndex === idx;
                        return (
                          <div
                            key={project.id}
                            onClick={() => handleSelectSuggestion(project)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`px-3.5 py-2.5 flex items-center gap-3 cursor-pointer transition-colors ${isHighlighted
                              ? "bg-[#F3F8F5] text-[#06351F] border-l-3 border-[#06351F]"
                              : "hover:bg-neutral-50 text-neutral-800"
                              }`}
                          >
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/70">
                              <Image
                                src={project.image}
                                alt={project.name.en}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs sm:text-sm font-black truncate">
                                  {highlightMatch(project.name[language] || project.name.en, searchQuery)}
                                </h5>
                                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FAF5E8] text-[#705820] border border-[#D9A52E]/30 shrink-0">
                                  {project.categoryLabel?.[language] || project.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5 truncate">
                                <MapPin className="h-3 w-3 text-[#D9A52E] shrink-0" />
                                <span className="truncate">
                                  {highlightMatch(project.location[language] || project.location.en, searchQuery)}
                                </span>
                              </div>
                            </div>
                            <div className="text-neutral-400 shrink-0">
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full px-3.5 py-2 bg-[#F8FAF9] hover:bg-[#EBF3EF] border-t border-neutral-100 text-left flex items-center justify-between text-xs font-bold text-[#06351F] transition-colors cursor-pointer shrink-0"
                    >
                      <span>
                        {language === "ta"
                          ? `"${searchQuery}" க்கான அனைத்து முடிவுகளையும் காண்க (${autocompleteSuggestions.length})`
                          : `View all results for "${searchQuery}" (${autocompleteSuggestions.length})`}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#06351F]" />
                    </button>
                  </>
                ) : (
                  <div className="p-5 text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1">
                      <Search className="h-4.5 w-4.5" />
                    </div>
                    <p className="text-xs sm:text-sm font-black text-[#06351F]">
                      {language === "ta" ? "பொருந்தும் திட்டங்கள் எதுவும் இல்லை" : "No matching properties found"}
                    </p>
                    <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                      {language === "ta"
                        ? `"${searchQuery}" என்ற தேடலுக்கு பொருத்தமான திட்டங்கள் கிடைக்கவில்லை.`
                        : `No properties matching "${searchQuery}". Try searching for another name or location.`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Quick Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 justify-end">
            {/* IAF Veteran Trust Seal */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF5E8]/95 backdrop-blur-md border border-[#D9A52E]/50 text-[#705820] text-xs font-bold shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#B8860B]" />
              <span>16+ Yrs IAF Vet</span>
            </div>

            {/* Language Toggle Dropdown Pill */}
            <button
              onClick={toggleLanguage}
              className="h-8 sm:h-9 flex items-center gap-1 px-2.5 sm:px-3 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200 hover:border-[#E5A922]/50 text-[#0A1C12] text-[11px] sm:text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <span>{language === "en" ? "தமிழ்" : "English"}</span>
              <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-neutral-500" />
            </button>

            {/* Phone Direct */}
            <a
              href={`tel:${phone}`}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#051F12] border border-[#E5A922]/60 hover:border-[#E5A922] hover:bg-[#08301D] text-[#E5A922] flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0 hover:scale-105 active:scale-95"
              title={`Call ${phone}`}
              aria-label={`Call ${phone}`}
            >
              <Phone className="h-3.5 w-3.5 text-[#E5A922]" />
            </a>
          </div>
        </header>

        {/* MAIN STORE CONTENT CANVAS */}
        <main className={`flex-1 min-w-0 ${activeTab === "home" ? "flex flex-col p-0 justify-between" : "p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pb-8 md:pb-6 bg-white"}`}>

          {/* =================================================================== */}
          {/* 1. STORE HOME SCREEN (Visible ONLY when activeTab === "home")        */}
          {/* =================================================================== */}
          {activeTab === "home" && (
            <div className="flex-1 flex flex-col animate-fadeIn">

              {/* ------------------------------------------------------------------- */}
              {/* UNIFIED HERO BANNER (Premium Real-Estate Landscape Section)          */}
              {/* ------------------------------------------------------------------- */}
              <section className="relative w-full overflow-hidden shrink-0 flex items-center justify-center pt-14 sm:pt-16 md:pt-20 lg:pt-22 pb-10 sm:pb-12 md:pb-14 lg:pb-16 px-4 sm:px-6 lg:px-10 min-h-[320px] sm:min-h-[350px] md:min-h-[380px] lg:min-h-[410px]">
                {/* Farmland Sunset Image - Edge-to-Edge Full Screen Width, Cover & Center */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden -z-10 [transform:translateZ(0)]">
                  <Image
                    src="/images/hero/farmland-sunset-header.jpg"
                    alt="Surya Promoters Farmland and Real Estate Development"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center animate-heroSlowZoom"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />

                  {/* Subtle top edge fade strictly behind top header controls (so buttons remain readable without darkening the image) */}
                  <div
                    className="absolute inset-x-0 top-0 h-16 sm:h-20 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, rgba(4, 29, 18, 0.25) 0%, transparent 100%)",
                    }}
                  />

                  {/* Smooth visual transition fade at the bottom blending the hero section into the canvas */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-10 sm:h-14 md:h-18 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 0%, rgba(250, 248, 243, 0.35) 40%, rgba(250, 248, 243, 0.85) 85%, #FAF8F3 100%)",
                    }}
                  />
                </div>

                {/* Centered Hero Content - Symmetrical, Balanced & Trustworthy */}
                <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center z-10 px-3 sm:px-6">
                  {/* Cinematic Dark Forest-Green Radial Gradient behind text only (Feathered seamlessly into bright sunset) */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[114%] sm:w-[104%] md:w-[94%] max-w-3xl h-[130%] sm:h-[138%] pointer-events-none -z-10 rounded-full"
                    style={{
                      background:
                        "radial-gradient(ellipse 62% 52% at 50% 48%, rgba(2, 20, 12, 0.78) 0%, rgba(3, 25, 16, 0.65) 28%, rgba(4, 29, 18, 0.42) 52%, rgba(4, 29, 18, 0.14) 75%, transparent 100%)",
                      filter: "blur(18px)",
                    }}
                  />

                  {/* Tagline Badge: Transparent Dark Green Background + Thin Gold Border */}
                  <div className="flex justify-center items-center mb-3.5 sm:mb-4 lg:mb-5 animate-heroBadgeFadeUp">
                    <div className="inline-flex items-center gap-2 px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full bg-[#052617]/80 backdrop-blur-md border border-[#E5A922]/60 shadow-lg">
                      <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#E5A922] shrink-0 animate-pulse" />
                      <span className="text-[11px] sm:text-xs md:text-[13px] font-bold text-[#F1E4C3] tracking-wide">
                        {language === "ta" ? "சிறந்த நாளைய விடியலுக்கான கட்டுமானம்" : "Building a Better Tomorrow"}
                      </span>
                    </div>
                  </div>

                  {/* Logo as First Letter "S" + "URYA PROMOTERS" Baseline Heading Lockup (5-8% Refined Scale) */}
                  <div className="relative flex items-center justify-center animate-heroFadeUp">
                    {/* Concentrated soft dark green backing right behind the heading text & logo */}
                    <div
                      className="absolute -inset-x-8 -inset-y-4 sm:-inset-x-12 sm:-inset-y-6 pointer-events-none -z-10 rounded-full"
                      style={{
                        background:
                          "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(2, 18, 11, 0.48) 0%, rgba(3, 24, 15, 0.22) 60%, transparent 100%)",
                        filter: "blur(12px)",
                      }}
                    />

                    {language === "ta" ? (
                      <h1
                        className="flex items-center justify-center gap-2 sm:gap-3 text-[#D9A52E] uppercase leading-none whitespace-nowrap"
                        style={{
                          textShadow:
                            "0 2px 10px rgba(2, 18, 11, 0.90), 0 4px 20px rgba(1, 14, 8, 0.65)",
                        }}
                      >
                        <span className="relative inline-flex items-center justify-center w-[25px] h-[25px] xs:w-[28px] xs:h-[28px] sm:w-[37px] sm:h-[37px] md:w-[44px] md:h-[44px] lg:w-[53px] lg:h-[53px] xl:w-[57px] xl:h-[57px] 2xl:w-[62px] 2xl:h-[62px] shrink-0 align-middle">
                          <Image
                            src="/images/surya-gold-logo.png"
                            alt="Surya Promoters"
                            fill
                            priority
                            sizes="(max-width: 640px) 36px, (max-width: 1024px) 52px, 60px"
                            className="object-contain"
                            style={{
                              filter:
                                "drop-shadow(0 2px 8px rgba(2, 18, 11, 0.85)) drop-shadow(0 4px 16px rgba(1, 14, 8, 0.55))",
                            }}
                          />
                        </span>
                        <span className="text-[19.5px] xs:text-[22.5px] sm:text-[28px] md:text-[33.5px] lg:text-[41px] xl:text-[45px] 2xl:text-[48.5px] font-black tracking-wide">
                          சூர்யா புரமோட்டர்ஸ்
                        </span>
                      </h1>
                    ) : (
                      <h1
                        className="inline-flex items-center justify-center font-display font-black text-[#D9A52E] uppercase leading-none whitespace-nowrap select-none"
                        style={{
                          textShadow:
                            "0 2px 10px rgba(2, 18, 11, 0.90), 0 4px 20px rgba(1, 14, 8, 0.65)",
                        }}
                      >
                        <span className="relative inline-flex items-center justify-center w-[24px] h-[24px] xs:w-[26px] xs:h-[26px] sm:w-[37px] sm:h-[37px] md:w-[44px] md:h-[44px] lg:w-[53px] lg:h-[53px] xl:w-[57px] xl:h-[57px] 2xl:w-[62px] 2xl:h-[62px] shrink-0 mr-1.5 sm:-mr-1.5 align-middle hero-logo-emblem">
                          <Image
                            src="/images/surya-gold-logo.png"
                            alt="S"
                            fill
                            priority
                            sizes="(max-width: 640px) 38px, (max-width: 1024px) 54px, 64px"
                            className="object-contain"
                            style={{
                              filter:
                                "drop-shadow(0 2px 8px rgba(2, 18, 11, 0.85)) drop-shadow(0 4px 16px rgba(1, 14, 8, 0.55))",
                            }}
                          />
                        </span>
                        <span className="text-[19px] xs:text-[21.5px] sm:text-[30px] md:text-[35.5px] lg:text-[43px] xl:text-[46.5px] 2xl:text-[50px] tracking-[0.06em] xs:tracking-[0.08em] sm:tracking-[0.10em] hero-heading-text">
                          URYA&nbsp;PROMOTERS
                        </span>
                      </h1>
                    )}
                  </div>

                  {/* Subtitle in Warm Champagne Ivory (#FFF0C2) with Subtle Dark Green Contrast Shadow */}
                  <p
                    className="-mt-1 sm:-mt-1.5 md:-mt-2 lg:-mt-2.5 text-[13px] sm:text-[15px] md:text-[17px] lg:text-[18px] font-medium text-[#FFF0C2] tracking-wide max-w-2xl mx-auto leading-normal animate-heroSubtitleFadeUp"
                    style={{
                      textShadow:
                        "0 1px 4px rgba(3, 24, 15, 0.90), 0 2px 10px rgba(4, 29, 18, 0.65)",
                    }}
                  >
                    {language === "ta" ? "2010 முதல் உங்களின் நம்பிக்கைக்குரிய ரியல் எஸ்டேட் பங்குதாரர்" : "Your Trusted Real Estate Partner Since 2010"}
                  </p>
                </div>
              </section>

              {/* Elegant Green and Gold Separation Line between Hero Header and Six Cards */}
              <div className="relative z-20 px-3.5 sm:px-6 lg:px-8 pt-1.5 sm:pt-2 pointer-events-none">
                <div className="flex flex-col items-center gap-[2px] w-full">
                  {/* Deep Forest Green Gradient Stroke */}
                  <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#0E5934] to-transparent rounded-full opacity-85" />
                  {/* Surya Royal Gold Line */}
                  <div className="w-[85%] sm:w-[75%] h-[1.5px] bg-gradient-to-r from-transparent via-[#E5A922] to-transparent rounded-full shadow-[0_0_8px_rgba(229,169,34,0.4)]" />
                </div>
              </div>

              {/* Middle Section: Navigation Cards Container + Trust Badges Bar */}
              <div className="relative z-20 px-3.5 sm:px-6 lg:px-8 pt-1.5 sm:pt-2 pb-4 sm:pb-6">
                {/* Navigation Cards Container */}
                <div className="relative z-20 min-h-0">
                  <section className="bg-white/92 backdrop-blur-sm rounded-[18px] lg:rounded-[22px] border border-[#EBE4D5] shadow-[0_8px_30px_rgba(10,40,20,0.05)] p-2 sm:p-2.5 lg:p-3 flex flex-col justify-between">

                    {/* Section Header with Green Accent Bar + Cursive Golden Motto */}
                    <div className="flex items-center justify-between pb-1 sm:pb-1.5 px-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 sm:h-4.5 rounded-full bg-[#0E5934]" />
                        <h2 className="text-xs sm:text-sm lg:text-[15px] font-black text-[#0A2617] tracking-tight">
                          {language === "ta" ? "பிரதான சேவைகள் & அம்சங்கள் (6 முக்கிய பிரிவுகள்)" : "Explore Surya Promoters (6 Main Icons)"}
                        </h2>
                      </div>
                      <div className="font-script text-xs sm:text-sm lg:text-[15px] text-[#BD8D1C] font-bold tracking-wide select-none">
                        Dream • Plan • Own
                      </div>
                    </div>

                    {/* The 6 Wide Landscape Cards (2 Columns x 3 Rows) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2 lg:gap-2.5 xl:gap-3">

                      {/* Card 1: Our Projects (Champagne gold fading into warm cream) */}
                      <button
                        onClick={() => {
                          setActiveTab("projects");
                          setActiveCategory(null);
                        }}
                        className="clean-interactive-card animate-card-1 group relative overflow-hidden rounded-[18px] lg:rounded-[20px] h-[92px] sm:h-[100px] md:h-[86px] lg:h-[94px] xl:h-[102px] 2xl:h-[112px] px-3 sm:px-4 lg:px-4.5 py-2 sm:py-2.5 lg:py-2.5 text-left border border-[#E8CCA0] bg-gradient-to-r from-[#FBF4E6] via-[#F7EBD0] to-[#F0DEC0] shadow-[0_3px_14px_rgba(205,140,25,0.08)] hover:shadow-[0_12px_30px_rgba(205,140,25,0.22)] hover:border-[#DDA843] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 ease-out flex items-center justify-between cursor-pointer outline-none focus:outline-none focus-visible:outline-none active:outline-none hover:outline-none focus:ring-0 focus-visible:ring-0 select-none no-underline [backface-visibility:hidden] [transform:translateZ(0)]"
                      >
                        {/* Background Photographic Image on Right with Natural Gradient Blend */}
                        <div className="absolute right-0 top-0 bottom-0 w-[34%] sm:w-[36%] md:w-[36%] lg:w-[38%] xl:w-[40%] overflow-hidden rounded-r-[17px] lg:rounded-r-[19px] pointer-events-none [transform:translateZ(0)]">
                          <Image
                            src="/images/cards/card-projects-luxury.jpg"
                            alt="Our Projects"
                            fill
                            sizes="(max-width: 768px) 40vw, 320px"
                            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                          />
                          {/* Soft Natural Gradient Transition towards text */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background: "linear-gradient(to right, #F7EBD0 0%, rgba(247, 235, 208, 0.90) 12%, rgba(247, 235, 208, 0.20) 40%, transparent 70%)"
                            }}
                          />
                        </div>

                        {/* Left: Prominent Circular Gradient Icon, Title & Description */}
                        <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 z-10 min-w-0 max-w-[62%] sm:max-w-[60%] lg:max-w-[58%]">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-9.5 md:h-9.5 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full bg-gradient-to-br from-[#F5B731] via-[#E5A922] to-[#BD7B0C] text-white flex items-center justify-center shrink-0 border-2 border-white/80 shadow-[0_3px_10px_rgba(205,140,25,0.25)] group-hover:scale-110 transition-transform duration-300 ease-out">
                            <Building2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5 xl:w-6 xl:h-6 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-[12.5px] sm:text-[13.5px] md:text-[12.5px] lg:text-[14px] xl:text-[15px] text-[#0D2317] group-hover:text-[#9A6206] transition-colors leading-tight line-clamp-1">
                              {language === "ta" ? "எங்கள் திட்டங்கள்" : "Our Projects"}
                            </h3>
                            <p className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-[11px] xl:text-[12px] text-[#4A5750] font-semibold mt-0.5 leading-snug line-clamp-1">
                              {language === "ta" ? "வீடு, வணிகம் & பண்ணை மனைகள்" : "Residential, Commercial & Farm"}
                            </p>
                          </div>
                        </div>

                        {/* Right: Elegant Circular Arrow Button */}
                        <div className="relative z-10 shrink-0">
                          <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 lg:w-7.5 lg:h-7.5 xl:w-8 xl:h-8 rounded-full bg-[#0E5934] text-white flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300 shadow-[0_2px_8px_rgba(14,89,52,0.35)]">
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.6]" />
                          </div>
                        </div>
                      </button>

                      {/* Card 2: Site Location (Fresh mint green fading into pale green) */}
                      <button
                        onClick={() => setActiveTab("location")}
                        className="clean-interactive-card animate-card-2 group relative overflow-hidden rounded-[18px] lg:rounded-[20px] h-[92px] sm:h-[100px] md:h-[86px] lg:h-[94px] xl:h-[102px] 2xl:h-[112px] px-3 sm:px-4 lg:px-4.5 py-2 sm:py-2.5 lg:py-2.5 text-left border border-[#A8DCB7] bg-gradient-to-r from-[#EAF7EE] via-[#DCF2E4] to-[#CEEBD7] shadow-[0_3px_14px_rgba(16,140,60,0.08)] hover:shadow-[0_12px_30px_rgba(16,140,60,0.22)] hover:border-[#22C55E] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 ease-out flex items-center justify-between cursor-pointer outline-none focus:outline-none focus-visible:outline-none active:outline-none hover:outline-none focus:ring-0 focus-visible:ring-0 select-none no-underline [backface-visibility:hidden] [transform:translateZ(0)]"
                      >
                        {/* Background Photographic Image on Right with Natural Gradient Blend */}
                        <div className="absolute right-0 top-0 bottom-0 w-[34%] sm:w-[36%] md:w-[36%] lg:w-[38%] xl:w-[40%] overflow-hidden rounded-r-[17px] lg:rounded-r-[19px] pointer-events-none [transform:translateZ(0)]">
                          <Image
                            src="/images/cards/card-location-cadastral.jpg"
                            alt="Site Location"
                            fill
                            sizes="(max-width: 768px) 40vw, 320px"
                            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                          />
                          {/* Soft Natural Gradient Transition towards text */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background: "linear-gradient(to right, #DCF2E4 0%, rgba(220, 242, 228, 0.90) 12%, rgba(220, 242, 228, 0.20) 40%, transparent 70%)"
                            }}
                          />
                        </div>

                        {/* Left: Prominent Circular Gradient Icon, Title & Description */}
                        <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 z-10 min-w-0 max-w-[62%] sm:max-w-[60%] lg:max-w-[58%]">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-9.5 md:h-9.5 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full shrink-0 border-2 border-white/80 shadow-[0_3px_10px_rgba(173,18,26,0.30)] group-hover:scale-110 transition-transform duration-300 ease-out overflow-hidden relative">
                            <Image
                              src="/images/site-location-icon.png"
                              alt="Site Location"
                              fill
                              sizes="(max-width: 640px) 40px, (max-width: 1024px) 44px, 48px"
                              className="object-cover"
                              priority
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-[12.5px] sm:text-[13.5px] md:text-[12.5px] lg:text-[14px] xl:text-[15px] text-[#0D2317] group-hover:text-[#15803D] transition-colors leading-tight line-clamp-1">
                              {language === "ta" ? "தள அமைவிடம்" : "Site Location"}
                            </h3>
                            <p className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-[11px] xl:text-[12px] text-[#4A5750] font-semibold mt-0.5 leading-snug line-clamp-1">
                              {language === "ta" ? "3D & GPS நேரலை வரைபடங்கள்" : "3D Cadastral & GPS Maps"}
                            </p>
                          </div>
                        </div>

                        {/* Right: Elegant Circular Arrow Button */}
                        <div className="relative z-10 shrink-0">
                          <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 lg:w-7.5 lg:h-7.5 xl:w-8 xl:h-8 rounded-full bg-[#15803D] text-white flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300 shadow-[0_2px_8px_rgba(21,128,61,0.35)]">
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.6]" />
                          </div>
                        </div>
                      </button>

                      {/* Card 3: Gallery (Lavender fading into soft purple) */}
                      <button
                        onClick={() => setActiveTab("gallery")}
                        className="clean-interactive-card animate-card-3 group relative overflow-hidden rounded-[18px] lg:rounded-[20px] h-[92px] sm:h-[100px] md:h-[86px] lg:h-[94px] xl:h-[102px] 2xl:h-[112px] px-3 sm:px-4 lg:px-4.5 py-2 sm:py-2.5 lg:py-2.5 text-left border border-[#CFB8ED] bg-gradient-to-r from-[#F5EFFB] via-[#EBE0F7] to-[#DFCFF2] shadow-[0_3px_14px_rgba(147,51,234,0.08)] hover:shadow-[0_12px_30px_rgba(147,51,234,0.22)] hover:border-[#A855F7] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 ease-out flex items-center justify-between cursor-pointer outline-none focus:outline-none focus-visible:outline-none active:outline-none hover:outline-none focus:ring-0 focus-visible:ring-0 select-none no-underline [backface-visibility:hidden] [transform:translateZ(0)]"
                      >
                        {/* Background Photographic Image on Right with Natural Gradient Blend */}
                        <div className="absolute right-0 top-0 bottom-0 w-[34%] sm:w-[36%] md:w-[36%] lg:w-[38%] xl:w-[40%] overflow-hidden rounded-r-[17px] lg:rounded-r-[19px] pointer-events-none [transform:translateZ(0)]">
                          <Image
                            src="/images/cards/card-gallery-photos.jpg"
                            alt="Gallery"
                            fill
                            sizes="(max-width: 768px) 40vw, 320px"
                            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                          />
                          {/* Soft Natural Gradient Transition towards text */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background: "linear-gradient(to right, #EBE0F7 0%, rgba(235, 224, 247, 0.90) 12%, rgba(235, 224, 247, 0.20) 40%, transparent 70%)"
                            }}
                          />
                        </div>

                        {/* Left: Prominent Circular Gradient Icon, Title & Description */}
                        <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 z-10 min-w-0 max-w-[62%] sm:max-w-[60%] lg:max-w-[58%]">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-9.5 md:h-9.5 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full bg-gradient-to-br from-[#A855F7] via-[#9333EA] to-[#6B21A8] text-white flex items-center justify-center shrink-0 border-2 border-white/80 shadow-[0_3px_10px_rgba(147,51,234,0.25)] group-hover:scale-110 transition-transform duration-300 ease-out">
                            <Camera className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5 xl:w-6 xl:h-6 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-[12.5px] sm:text-[13.5px] md:text-[12.5px] lg:text-[14px] xl:text-[15px] text-[#0D2317] group-hover:text-[#7E22CE] transition-colors leading-tight line-clamp-1">
                              {language === "ta" ? "புகைப்படங்கள் & வீடியோ" : "Gallery"}
                            </h3>
                            <p className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-[11px] xl:text-[12px] text-[#4A5750] font-semibold mt-0.5 leading-snug line-clamp-1">
                              {language === "ta" ? "வீடியோ & புகைப்பட ஆல்பங்கள்" : "Videos & Photos Folders"}
                            </p>
                          </div>
                        </div>

                        {/* Right: Elegant Circular Arrow Button */}
                        <div className="relative z-10 shrink-0">
                          <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 lg:w-7.5 lg:h-7.5 xl:w-8 xl:h-8 rounded-full bg-[#0E5934] text-white flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300 shadow-[0_2px_8px_rgba(14,89,52,0.35)]">
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.6]" />
                          </div>
                        </div>
                      </button>

                      {/* Card 4: About Company (Light sage green fading into forest green tones) */}
                      <button
                        onClick={() => setActiveTab("about")}
                        className="clean-interactive-card animate-card-4 group relative overflow-hidden rounded-[18px] lg:rounded-[20px] h-[92px] sm:h-[100px] md:h-[86px] lg:h-[94px] xl:h-[102px] 2xl:h-[112px] px-3 sm:px-4 lg:px-4.5 py-2 sm:py-2.5 lg:py-2.5 text-left border border-[#AFD1B9] bg-gradient-to-r from-[#EEF5F0] via-[#E0ECE3] to-[#CFE2D4] shadow-[0_3px_14px_rgba(14,89,52,0.08)] hover:shadow-[0_12px_30px_rgba(14,89,52,0.22)] hover:border-[#16A34A] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 ease-out flex items-center justify-between cursor-pointer outline-none focus:outline-none focus-visible:outline-none active:outline-none hover:outline-none focus:ring-0 focus-visible:ring-0 select-none no-underline [backface-visibility:hidden] [transform:translateZ(0)]"
                      >
                        {/* Background Photographic Image on Right with Natural Gradient Blend */}
                        <div className="absolute right-0 top-0 bottom-0 w-[34%] sm:w-[36%] md:w-[36%] lg:w-[38%] xl:w-[40%] overflow-hidden rounded-r-[17px] lg:rounded-r-[19px] pointer-events-none [transform:translateZ(0)]">
                          <Image
                            src="/images/cards/card-about-handshake.jpg"
                            alt="About Company"
                            fill
                            sizes="(max-width: 768px) 40vw, 320px"
                            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                          />
                          {/* Soft Natural Gradient Transition towards text */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background: "linear-gradient(to right, #E0ECE3 0%, rgba(224, 236, 227, 0.90) 12%, rgba(224, 236, 227, 0.20) 40%, transparent 70%)"
                            }}
                          />
                        </div>

                        {/* Left: Prominent Circular Gradient Icon, Title & Description */}
                        <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 z-10 min-w-0 max-w-[62%] sm:max-w-[60%] lg:max-w-[58%]">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-9.5 md:h-9.5 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full bg-gradient-to-br from-[#16A34A] via-[#0E5934] to-[#083D22] text-white flex items-center justify-center shrink-0 border-2 border-white/80 shadow-[0_3px_10px_rgba(14,89,52,0.25)] group-hover:scale-110 transition-transform duration-300 ease-out">
                            <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5 xl:w-6 xl:h-6 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-[12.5px] sm:text-[13.5px] md:text-[12.5px] lg:text-[14px] xl:text-[15px] text-[#0D2317] group-hover:text-[#0E5934] transition-colors leading-tight line-clamp-1">
                              {language === "ta" ? "நிறுவனம் பற்றி" : "About Company"}
                            </h3>
                            <p className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-[11px] xl:text-[12px] text-[#4A5750] font-semibold mt-0.5 leading-snug line-clamp-1">
                              {language === "ta" ? "நிறுவனர் & 16+ வருட பாரம்பரியம்" : "Founder & 16+ Yrs Legacy"}
                            </p>
                          </div>
                        </div>

                        {/* Right: Elegant Circular Arrow Button */}
                        <div className="relative z-10 shrink-0">
                          <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 lg:w-7.5 lg:h-7.5 xl:w-8 xl:h-8 rounded-full bg-[#0E5934] text-white flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300 shadow-[0_2px_8px_rgba(14,89,52,0.35)]">
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.6]" />
                          </div>
                        </div>
                      </button>

                      {/* Card 5: Download Layout (Warm peach fading into champagne cream) */}
                      <button
                        onClick={() => setActiveTab("download")}
                        className="clean-interactive-card animate-card-5 group relative overflow-hidden rounded-[18px] lg:rounded-[20px] h-[92px] sm:h-[100px] md:h-[86px] lg:h-[94px] xl:h-[102px] 2xl:h-[112px] px-3 sm:px-4 lg:px-4.5 py-2 sm:py-2.5 lg:py-2.5 text-left border border-[#F5BE9B] bg-gradient-to-r from-[#FDF2E8] via-[#FCE4D4] to-[#F7D4BE] shadow-[0_3px_14px_rgba(234,88,12,0.08)] hover:shadow-[0_12px_30px_rgba(234,88,12,0.22)] hover:border-[#EA580C] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 ease-out flex items-center justify-between cursor-pointer outline-none focus:outline-none focus-visible:outline-none active:outline-none hover:outline-none focus:ring-0 focus-visible:ring-0 select-none no-underline [backface-visibility:hidden] [transform:translateZ(0)]"
                      >
                        {/* Background Photographic Image on Right with Natural Gradient Blend */}
                        <div className="absolute right-0 top-0 bottom-0 w-[34%] sm:w-[36%] md:w-[36%] lg:w-[38%] xl:w-[40%] overflow-hidden rounded-r-[17px] lg:rounded-r-[19px] pointer-events-none [transform:translateZ(0)]">
                          <Image
                            src="/images/cards/card-download-blueprint.jpg"
                            alt="Download Layout"
                            fill
                            sizes="(max-width: 768px) 40vw, 320px"
                            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                          />
                          {/* Soft Natural Gradient Transition towards text */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background: "linear-gradient(to right, #FCE4D4 0%, rgba(252, 228, 212, 0.90) 12%, rgba(252, 228, 212, 0.20) 40%, transparent 70%)"
                            }}
                          />
                        </div>

                        {/* Left: Prominent Circular Gradient Icon, Title & Description */}
                        <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 z-10 min-w-0 max-w-[62%] sm:max-w-[60%] lg:max-w-[58%]">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-9.5 md:h-9.5 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full bg-gradient-to-br from-[#FB923C] via-[#EA580C] to-[#C2410C] text-white flex items-center justify-center shrink-0 border-2 border-white/80 shadow-[0_3px_10px_rgba(234,88,12,0.25)] group-hover:scale-110 transition-transform duration-300 ease-out">
                            <Download className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5 xl:w-6 xl:h-6 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-[12.5px] sm:text-[13.5px] md:text-[12.5px] lg:text-[14px] xl:text-[15px] text-[#0D2317] group-hover:text-[#C2410C] transition-colors leading-tight line-clamp-1">
                              {language === "ta" ? "வரைபடம் பதிவிறக்கம்" : "Download Layout"}
                            </h3>
                            <p className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-[11px] xl:text-[12px] text-[#4A5750] font-semibold mt-0.5 leading-snug line-clamp-1">
                              {language === "ta" ? "புளூபிரிண்ட், வரைபடம், PDF கையேடுகள்" : "Blueprints, Layouts & PDFs"}
                            </p>
                          </div>
                        </div>

                        {/* Right: Elegant Circular Arrow Button */}
                        <div className="relative z-10 shrink-0">
                          <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 lg:w-7.5 lg:h-7.5 xl:w-8 xl:h-8 rounded-full bg-[#0E5934] text-white flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300 shadow-[0_2px_8px_rgba(14,89,52,0.35)]">
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.6]" />
                          </div>
                        </div>
                      </button>

                      {/* Card 6: Contact Us (Soft aqua fading into teal) */}
                      <button
                        onClick={() => setActiveTab("contact")}
                        className="clean-interactive-card animate-card-6 group relative overflow-hidden rounded-[18px] lg:rounded-[20px] h-[92px] sm:h-[100px] md:h-[86px] lg:h-[94px] xl:h-[102px] 2xl:h-[112px] px-3 sm:px-4 lg:px-4.5 py-2 sm:py-2.5 lg:py-2.5 text-left border border-[#9FD4D3] bg-gradient-to-r from-[#ECF7F7] via-[#DAEFEF] to-[#C5E5E5] shadow-[0_3px_14px_rgba(13,148,136,0.08)] hover:shadow-[0_12px_30px_rgba(13,148,136,0.22)] hover:border-[#0D9488] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 ease-out flex items-center justify-between cursor-pointer outline-none focus:outline-none focus-visible:outline-none active:outline-none hover:outline-none focus:ring-0 focus-visible:ring-0 select-none no-underline [backface-visibility:hidden] [transform:translateZ(0)]"
                      >
                        {/* Background Photographic Image on Right with Natural Gradient Blend */}
                        <div className="absolute right-0 top-0 bottom-0 w-[34%] sm:w-[36%] md:w-[36%] lg:w-[38%] xl:w-[40%] overflow-hidden rounded-r-[17px] lg:rounded-r-[19px] pointer-events-none [transform:translateZ(0)]">
                          <Image
                            src="/images/cards/card-contact-support.jpg"
                            alt="Contact Us"
                            fill
                            sizes="(max-width: 768px) 40vw, 320px"
                            className="object-cover object-[center_20%] transition-transform duration-500 ease-out group-hover:scale-108"
                          />
                          {/* Soft Natural Gradient Transition towards text */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background: "linear-gradient(to right, #DAEFEF 0%, rgba(218, 239, 239, 0.90) 12%, rgba(218, 239, 239, 0.20) 40%, transparent 70%)"
                            }}
                          />
                        </div>

                        {/* Left: Prominent Circular Gradient Icon, Title & Description */}
                        <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5 z-10 min-w-0 max-w-[62%] sm:max-w-[60%] lg:max-w-[58%]">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-9.5 md:h-9.5 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full bg-gradient-to-br from-[#14B8A6] via-[#0D9488] to-[#0F766E] text-white flex items-center justify-center shrink-0 border-2 border-white/80 shadow-[0_3px_10px_rgba(13,148,136,0.25)] group-hover:scale-110 transition-transform duration-300 ease-out">
                            <PhoneCall className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-5.5 lg:h-5.5 xl:w-6 xl:h-6 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-[12.5px] sm:text-[13.5px] md:text-[12.5px] lg:text-[14px] xl:text-[15px] text-[#0D2317] group-hover:text-[#0F766E] transition-colors leading-tight line-clamp-1">
                              {language === "ta" ? "நேரடி தொடர்பு" : "Contact Us"}
                            </h3>
                            <p className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-[11px] xl:text-[12px] text-[#4A5750] font-semibold mt-0.5 leading-snug line-clamp-1">
                              {language === "ta" ? "அழைப்பு & தலைமை அலுவலகம்" : "Direct Helpline & Madurai HQ"}
                            </p>
                          </div>
                        </div>

                        {/* Right: Elegant Circular Arrow Button */}
                        <div className="relative z-10 shrink-0">
                          <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 lg:w-7.5 lg:h-7.5 xl:w-8 xl:h-8 rounded-full bg-[#0E5934] text-white flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300 shadow-[0_2px_8px_rgba(14,89,52,0.35)]">
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.6]" />
                          </div>
                        </div>
                      </button>
                    </div>
                  </section>
                </div>

                {/* Trust Badges Bar immediately below the six-card container with balanced spacing */}
                <div className="shrink-0 pt-2 sm:pt-2.5 lg:pt-3 pb-0.5 select-none z-20">
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 lg:gap-8 text-[10.5px] sm:text-xs lg:text-[12px] font-bold text-[#294233]">
                    <div className="flex items-center gap-1.5">
                      <Home className="h-3.5 w-3.5 text-[#BD8D1C]" />
                      <span>{language === "ta" ? "நம்பகமான கட்டுநர்" : "Trusted Builder"}</span>
                    </div>
                    <span className="hidden sm:inline text-neutral-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#0E5934]" />
                      <span>{language === "ta" ? "தர உத்தரவாதம்" : "Quality Assurance"}</span>
                    </div>
                    <span className="hidden sm:inline text-neutral-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#BD8D1C]" />
                      <span>{language === "ta" ? "வாடிக்கையாளர் முதன்மை" : "Customer First"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* =================================================================== */}
          {/* 2. TAB 1: OUR PROJECTS (Screen Changes Completely: Categories vs Cards) */}
          {/* =================================================================== */}
          {activeTab === "projects" && (
            <section className="space-y-6 animate-fadeIn pt-1">
              {searchQuery.trim() !== "" ? (
                /* ----------------------------------------------------------------- */
                /* SEARCH RESULTS VIEW (When search is active)                      */
                /* ----------------------------------------------------------------- */
                <div className="space-y-6">
                  {/* Top-Left Back Arrow & Reset Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory(null);
                      }}
                      className="group self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                      aria-label={language === "ta" ? "அனைத்து பிரிவுகளுக்கும் திரும்புக" : "Back to All Categories"}
                      title={language === "ta" ? "அனைத்து பிரிவுகளுக்கும் திரும்புக" : "Back to All Categories"}
                    >
                      <ArrowLeft className="h-4 w-4 text-[#D9A52E] group-hover:-translate-x-1 transition-transform" />
                      <span>{language === "ta" ? "அனைத்து பிரிவுகள்" : "All Categories"}</span>
                    </button>

                    <button
                      onClick={() => setSearchQuery("")}
                      className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-neutral-700 hover:text-red-700 hover:bg-red-50 border border-neutral-200/90 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                    >
                      <X className="h-3.5 w-3.5 text-neutral-500 hover:text-red-600" />
                      <span>{language === "ta" ? "தேடலை அழி" : "Clear Search"}</span>
                    </button>
                  </div>

                  {/* Search Results Banner */}
                  <div className="bg-gradient-to-r from-[#06351F] via-[#092B1C] to-[#03210E] text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-[#D9A52E]/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A52E]/20 text-[#D9A52E] border border-[#D9A52E]/30 text-xs font-bold mb-2">
                          <Search className="h-3.5 w-3.5" />
                          <span>
                            {language === "ta" ? "தேடல் முடிவுகள்" : "Search Results"}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          {language === "ta" ? "தேடல்:" : "Results for:"}{" "}
                          <span className="text-[#E5A922]">"{searchQuery}"</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                          {language === "ta"
                            ? `${searchMatchingProjects.length} மனைத்திட்டங்கள் கண்டறியப்பட்டன.`
                            : `Found ${searchMatchingProjects.length} ${searchMatchingProjects.length === 1 ? "property" : "properties"} matching your search.`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Empty State vs Matching Projects Grid */}
                  {searchMatchingProjects.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-neutral-200/90 shadow-sm space-y-4 max-w-xl mx-auto">
                      <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700 shadow-inner">
                        <Search className="h-8 w-8 text-amber-600" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-lg sm:text-xl font-black text-[#06351F]">
                          No properties found
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                          {language === "ta"
                            ? `"${searchQuery}" என்ற பெயரிலோ அல்லது இடத்திலோ எந்தவொரு மனைத்திட்டமும் கிடைக்கவில்லை. வேறு திட்டம் அல்லது இடத்தை தேட முயற்சிக்கவும்.`
                            : `We couldn't find any properties matching "${searchQuery}". Please check the spelling or search by location like Alagar Kovil, Othakadai, or Madurai.`}
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setActiveCategory(null);
                          }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <X className="h-3.5 w-3.5 text-[#E5A922]" />
                          <span>{language === "ta" ? "தேடலை அழித்து அனைத்து திட்டங்களையும் காண்க" : "Clear Search & View All Projects"}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {searchMatchingProjects.map((project) => renderProjectCard(project))}
                      </div>

                      {/* Bottom Back Button */}
                      <div className="flex items-center justify-center pt-4 pb-2">
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setActiveCategory(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] shadow-sm hover:shadow-md text-xs sm:text-sm font-black transition-all cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <ArrowLeft className="h-4 w-4 text-[#E5A922]" />
                          <span>{language === "ta" ? "அனைத்து பிரிவுகளுக்கும் திரும்புக" : "Back to All Categories"}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : activeCategory === null ? (
                /* ----------------------------------------------------------------- */
                /* SCREEN A: 3 CATEGORY SELECTION CARDS ONLY (No project cards below) */
                /* ----------------------------------------------------------------- */
                <div className="space-y-6">
                  {/* Top-Left Back Arrow Navigation */}
                  <div className="flex items-center">
                    <button
                      onClick={handleGoBack}
                      className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                      aria-label={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                      title={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                    >
                      <ArrowLeft className="h-4 w-4 text-[#D9A52E] group-hover:-translate-x-1 transition-transform" />
                      <span>{language === "ta" ? "பின்செல்" : "Back"}</span>
                    </button>
                  </div>

                  {/* 3 Categories Main Hub Box */}
                  <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200/90 shadow-xs space-y-6">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-[#06351F] via-[#092B1C] to-[#03210E] text-white rounded-2xl p-5 sm:p-6 border border-[#D9A52E]/30 shadow-md">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          {language === "ta" ? "எங்கள் திட்டப் பிரிவுகள்" : "Our Property Categories"}
                        </h3>
                        <p className="text-xs text-neutral-300 mt-1 max-w-xl">
                          {language === "ta"
                            ? "மதுரையின் சிறந்த வளர்ச்சி மண்டலங்களில் DTCP & RERA அங்கீகரிக்கப்பட்ட மனைப்பிரிவுகள் மற்றும் பண்ணை நிலங்கள்."
                            : "Explore certified DTCP & RERA approved villa plots, commercial highway frontage, and managed agro acreage across Madurai."}
                        </p>
                      </div>
                    </div>

                    {/* 3 Luxury Category Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                      {categoriesList.map((cat, idx) => {
                        const count = ALL_PROJECTS.filter((p) => p.category === cat.id).length;
                        const IconComp = getPageCategoryIcon(cat.icon);
                        const catNum = String(idx + 1).padStart(2, "0");
                        const catImage =
                          cat.id === "residential"
                            ? "/images/categories/residential.jpg"
                            : cat.id === "commercial"
                            ? "/images/categories/commercial.jpg"
                            : "/images/categories/farmland.jpg";

                        return (
                          <div
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className="bg-white rounded-[22px] border border-neutral-200/90 hover:border-[#D9A52E] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer h-full"
                          >
                            <div className="flex flex-col flex-1">
                              {/* Top Solid Dark Green Header with 50% Opacity Background Image */}
                              <div className="relative h-48 sm:h-56 md:h-[260px] lg:h-[270px] w-full overflow-hidden bg-[#06351F] border-b border-[#D9A52E]/20 p-4 sm:p-5 flex flex-col justify-between">
                                {/* Category Photographic Image at ~50% Opacity */}
                                {catImage && (
                                  <Image
                                    src={catImage}
                                    alt={cat.name[language] || cat.name.en}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover opacity-50 pointer-events-none transition-transform duration-700 group-hover:scale-105"
                                  />
                                )}
                                <div className="absolute inset-0 bg-[#06351F]/30 pointer-events-none" />

                                {/* Top Badges */}
                                <div className="flex items-center justify-between z-10 relative">
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-xs text-[#D9A52E] border border-[#D9A52E]/40">
                                    Category {catNum}
                                  </span>
                                  <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#D9A52E] text-[#06351F] shadow-md">
                                    {count} {count === 1 ? "Project" : "Projects"}
                                  </span>
                                </div>

                                {/* Category Icon */}
                                <div className="z-10 relative">
                                  <div className="h-11 w-11 rounded-xl bg-white text-[#06351F] border border-[#D9A52E]/40 flex items-center justify-center shadow-lg group-hover:bg-[#D9A52E] group-hover:text-[#06351F] transition-colors">
                                    <IconComp className="h-5 w-5 stroke-[2.2]" />
                                  </div>
                                </div>
                              </div>

                              {/* Card Content - Category Name */}
                              <div className="p-5 pb-3">
                                <h4 className="text-lg sm:text-xl font-black text-[#06351F] group-hover:text-[#BD8D1C] transition-colors">
                                  {cat.name[language] || cat.name.en}
                                </h4>
                              </div>
                            </div>

                            {/* Bottom Action Button */}
                            <div className="p-5 pt-0">
                              <div className="w-full py-2.5 px-4 rounded-xl bg-[#06351F] group-hover:bg-[#0E5934] text-white font-black text-xs flex items-center justify-between transition-all duration-300 shadow-xs">
                                <span>{language === "ta" ? "திட்டங்களை காண்க" : "Explore Category"}</span>
                                <div className="h-6 w-6 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* ----------------------------------------------------------------- */
                /* SCREEN B: DEDICATED CATEGORY PROJECTS VIEW (Cards ONLY, no hub)   */
                /* ----------------------------------------------------------------- */
                <div className="space-y-6">
                  {/* Top-Left Back Arrow Navigation & Category Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      onClick={handleGoBack}
                      className="group self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                      aria-label={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                      title={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                    >
                      <ArrowLeft className="h-4 w-4 text-[#D9A52E] group-hover:-translate-x-1 transition-transform" />
                      <span>{language === "ta" ? "பின்செல்" : "Back"}</span>
                    </button>

                    {/* Category Switcher Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {categoriesList.map((cat, idx) => {
                        const isCatActive = activeCategory === cat.id;
                        const pCount = ALL_PROJECTS.filter((p) => p.category === cat.id).length;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isCatActive
                              ? "bg-[#06351F] text-white shadow-xs font-black ring-2 ring-[#0E5934]"
                              : "bg-white text-[#06351F] hover:bg-emerald-50 border border-neutral-200/90 shadow-2xs"
                              }`}
                          >
                            {idx + 1}. {cat.name[language] || cat.name.en} ({pCount})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Page Title Banner */}
                  <div className="bg-gradient-to-r from-[#06351F] via-[#092B1C] to-[#03210E] text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-[#D9A52E]/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A52E]/20 text-[#D9A52E] border border-[#D9A52E]/30 text-xs font-bold mb-2">
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
                    </div>
                  </div>

                  {/* Cards Grid for activeCategory */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 ${activeCategoryProjects.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-5`}>
                    {activeCategoryProjects.map((project) => renderProjectCard(project))}
                  </div>

                  {/* Bottom Back Button */}
                  <div className="flex items-center justify-center pt-4 pb-2">
                    <button
                      onClick={() => {
                        setActiveCategory(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] shadow-sm hover:shadow-md text-xs sm:text-sm font-black transition-all cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4 text-[#E5A922]" />
                      <span>{language === "ta" ? "அனைத்து பிரிவுகளுக்கும் திரும்புக" : "Back to All Categories"}</span>
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
            <section className="space-y-6 animate-fadeIn pt-1">
              {/* Top-Left Back Arrow Navigation */}
              <div className="flex items-center">
                <button
                  onClick={handleGoBack}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  aria-label={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                  title={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                >
                  <ArrowLeft className="h-4 w-4 text-[#D9A52E] group-hover:-translate-x-1 transition-transform" />
                  <span>{language === "ta" ? "பின்செல்" : "Back"}</span>
                </button>
              </div>

              {/* Geolocation Hub Banner */}
              <div className="bg-gradient-to-r from-[#06351F] via-[#092B1C] to-[#03210E] text-white rounded-3xl p-6 sm:p-7 border border-[#D9A52E]/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A52E]/20 text-[#D9A52E] border border-[#D9A52E]/30 text-[10px] font-black uppercase tracking-wider mb-2">
                    <Compass className="h-3 w-3" />
                    Geolocation & 2D/3D Hub
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">
                    {language === "ta" ? "அனைத்து திட்டங்களின் அமைவிடம் & 2D/3D வரைபடங்கள்" : "All Project Map Locations & 2D/3D Views"}
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {language === "ta"
                      ? "மதுரையின் முக்கிய தேசிய நெடுஞ்சாலைகள் (NH-44), ரிங் ரோடு மற்றும் நேரடி 2D/3D மனை வரைபடங்களை உடனடியாக பார்வையிடவும்."
                      : "Directly navigate to each development along Madurai's NH-44, Ring Road, and interactive 2D/3D layout plans with live Google Maps routing."}
                  </p>
                </div>
                <a
                  href="https://mapbhoomi.com/l/surya-promoters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white text-xs font-black transition-all border border-[#0E5934] shadow-lg shrink-0 w-fit hover:scale-105"
                >
                  <Compass className="h-4 w-4 text-[#E5A922]" />
                  <span>{language === "ta" ? "2D/3D நேரடி தளம் ↗" : "Surya Promoters 2D/3D Views ↗"}</span>
                </a>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ALL_PROJECTS.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-white rounded-[22px] p-5 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-[#D9A52E]/70 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      {/* Top Header with Thumbnail & Titles */}
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="relative h-16 w-16 sm:h-18 sm:w-18 rounded-2xl overflow-hidden shrink-0 border border-[#D9A52E]/30 bg-neutral-900 shadow-sm">
                          <Image
                            src={project.image}
                            alt={project.name.en}
                            fill
                            sizes="72px"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#06351F]/10 text-[#06351F] border border-[#D9A52E]/30 inline-block mb-1">
                            {project.categoryLabel[language]}
                          </span>
                          <h4 className="font-black text-[#06351F] group-hover:text-[#BD8D1C] text-base leading-snug transition-colors truncate">
                            {project.name[language]}
                          </h4>
                          <span className="text-[11px] text-neutral-500 font-semibold block truncate">
                            {project.subcategoryLabel[language]}
                          </span>
                        </div>
                      </div>

                      {/* Distance & Landmark Box */}
                      <div className="bg-[#FAF8F3] rounded-2xl p-3.5 mb-4 border border-amber-200/50 space-y-2 text-xs">
                        <div className="flex items-start gap-2 text-[#06351F]">
                          <MapPin className="h-4 w-4 text-[#D9A52E] shrink-0 mt-0.5" />
                          <span className="font-bold leading-tight">{project.location[language]}</span>
                        </div>
                        <div className="flex items-start gap-2 text-neutral-600 text-[11px]">
                          <Navigation className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{project.distanceInfo[language]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2 border-t border-neutral-100">
                      {project.mapbhoomiUrl && (
                        <a
                          href={project.mapbhoomiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-2 px-3 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] text-xs font-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Compass className="h-3.5 w-3.5 text-[#E5A922]" />
                          <span>{language === "ta" ? "2D/3D நேரடி வரைபடம் ↗" : "2D/3D views ↗"}</span>
                        </a>
                      )}

                      <a
                        href={project.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white text-xs font-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md border border-[#0E5934]"
                      >
                        <Navigation className="h-3.5 w-3.5 text-[#E5A922]" />
                        <span>{language === "ta" ? "கூகிள் மேப்ஸில் திறக்க" : "Open in Google Maps"}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#0E5934] hover:bg-[#06351F] text-white text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-center cursor-pointer shadow-xs"
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
              {/* Top-Left Back Arrow Navigation */}
              <div className="flex items-center">
                <button
                  onClick={handleGoBack}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  aria-label={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                  title={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                >
                  <ArrowLeft className="h-4 w-4 text-[#D9A52E] group-hover:-translate-x-1 transition-transform" />
                  <span>{language === "ta" ? "பின்செல்" : "Back"}</span>
                </button>
              </div>

              {/* Multimedia Banner */}
              <div className="bg-gradient-to-r from-[#06351F] via-[#092B1C] to-[#03210E] text-white rounded-3xl p-6 sm:p-7 border border-[#D9A52E]/30 shadow-md">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A52E]/20 text-[#D9A52E] border border-[#D9A52E]/30 text-[10px] font-black uppercase tracking-wider mb-2">
                  <Play className="h-3 w-3 fill-[#D9A52E]" />
                  4K Drone & Site Media Center
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">
                  {language === "ta" ? "கோப்பு முறை புகைப்பட & வீடியோ மையம்" : "Folder-Style Media Gallery"}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                  {language === "ta"
                    ? "ஆரஞ்ச் கார்டன், வைகை எலைட் மற்றும் மதுரை பார்ம்ஸ் உள்ளிட்ட திட்டங்களின் 4K ட்ரோன் வீடியோக்கள் மற்றும் தள புகைப்படங்கள்."
                    : "Experience 4K cinematic drone walkthroughs, ground level construction updates, and high-resolution layout photography organized cleanly into project folders."}
                </p>
              </div>

              {/* Videos Folders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-[#06351F] text-[#D9A52E] border border-[#D9A52E]/40 flex items-center justify-center shadow-xs">
                      <Play className="h-4 w-4 fill-[#D9A52E]" />
                    </div>
                    <h4 className="text-base font-black text-[#06351F]">
                      {language === "ta" ? "1. வீடியோ கோப்புகள் (4K ரீல்ஸ்)" : "1. Video Folders (4K Drone Reels)"}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-neutral-500">
                    {GALLERY_VIDEO_FOLDERS.length} Collections
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {GALLERY_VIDEO_FOLDERS.map((folder) => (
                    <div
                      key={folder.id}
                      className="bg-white rounded-[22px] p-5 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-[#D9A52E]/70 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-full bg-[#06351F]/10 text-[#06351F] border border-[#D9A52E]/30 text-[10px] font-black uppercase flex items-center gap-1.5">
                            <Folder className="h-3 w-3 fill-[#06351F]" />
                            {folder.count}
                          </span>
                          <span className="text-[10px] font-black uppercase text-[#D9A52E] bg-[#06351F] px-2.5 py-0.5 rounded-full border border-[#D9A52E]/30">
                            4K Reel
                          </span>
                        </div>

                        {/* Video Thumbnail with Centered Play Button */}
                        <div
                          onClick={() => setSelectedVideo({ title: folder.videos[0].title[language], duration: folder.videos[0].duration, url: folder.videos[0].url })}
                          className="relative h-44 w-full rounded-2xl overflow-hidden mb-3 bg-neutral-900 group/vid cursor-pointer shadow-inner"
                        >
                          <Image
                            src={folder.thumbnail}
                            alt={folder.title.en}
                            fill
                            sizes="340px"
                            className="object-cover opacity-90 group-hover/vid:scale-108 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                            <div className="h-13 w-13 rounded-full bg-[#0E5934] text-white flex items-center justify-center shadow-xl group-hover/vid:scale-115 transition-transform duration-300 border border-[#D9A52E]/40">
                              <Play className="h-5 w-5 fill-white ml-0.5" />
                            </div>
                          </div>
                        </div>

                        <h5 className="font-black text-[#06351F] text-base mb-2 group-hover:text-[#BD8D1C] transition-colors">
                          {folder.title[language]}
                        </h5>

                        <div className="space-y-1 mb-4 bg-[#FAF8F3] p-2.5 rounded-xl border border-neutral-100">
                          {folder.videos.map((vid, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedVideo({ title: vid.title[language], duration: vid.duration, url: vid.url })}
                              className="w-full text-left flex items-center justify-between p-1.5 rounded-lg hover:bg-white text-[11px] text-neutral-700 cursor-pointer transition-colors active:scale-[0.98]"
                            >
                              <span className="font-bold text-[#06351F] truncate">▶ {vid.title[language]}</span>
                              <span className="text-[10px] text-neutral-400 font-mono ml-2 shrink-0">{vid.duration}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedVideo({ title: folder.videos[0].title[language], duration: folder.videos[0].duration, url: folder.videos[0].url })}
                        className="w-full py-2.5 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white font-black text-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-[#0E5934]"
                      >
                        <Play className="h-3.5 w-3.5 fill-[#D9A52E]" />
                        <span>{language === "ta" ? "வீடியோ பார்க்க" : "Play Reel"}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Folders */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-[#06351F] text-[#D9A52E] border border-[#D9A52E]/40 flex items-center justify-center shadow-xs">
                      <Camera className="h-4 w-4" />
                    </div>
                    <h4 className="text-base font-black text-[#06351F]">
                      {language === "ta" ? "2. புகைப்பட கோப்புகள் (தளப் படங்கள்)" : "2. Image Folders (Site Photography)"}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-neutral-500">
                    {GALLERY_IMAGE_FOLDERS.length} Folders
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {GALLERY_IMAGE_FOLDERS.map((folder) => (
                    <div
                      key={folder.id}
                      className="bg-white rounded-[22px] p-5 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-[#D9A52E]/70 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-full bg-[#06351F]/10 text-[#06351F] border border-[#D9A52E]/30 text-[10px] font-black uppercase flex items-center gap-1.5">
                            <Folder className="h-3 w-3 fill-[#06351F]" />
                            {folder.count}
                          </span>
                          <span className="text-[10px] font-black uppercase text-[#06351F] bg-[#D9A52E] px-2.5 py-0.5 rounded-full shadow-xs">
                            HD Photos
                          </span>
                        </div>

                        <div
                          onClick={() => {
                            setSelectedFolderImages({ title: folder.title[language], images: folder.images });
                            setActiveFolderImageIndex(null);
                          }}
                          className="relative h-44 w-full rounded-2xl overflow-hidden mb-3 bg-neutral-900 cursor-pointer group/img shadow-inner"
                        >
                          <Image
                            src={folder.thumbnail}
                            alt={folder.title.en}
                            fill
                            sizes="340px"
                            className="object-cover group-hover/img:scale-108 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover/img:opacity-80 transition-opacity" />
                        </div>

                        <h5 className="font-black text-[#06351F] text-base mb-1 group-hover:text-[#BD8D1C] transition-colors">
                          {folder.title[language]}
                        </h5>
                        <p className="text-xs text-neutral-500 mb-4">High-resolution architectural & site photography</p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedFolderImages({ title: folder.title[language], images: folder.images });
                          setActiveFolderImageIndex(null);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white font-black text-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-[#0E5934]"
                      >
                        <Camera className="h-3.5 w-3.5 text-[#D9A52E]" />
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
              {/* Top-Left Back Arrow Navigation */}
              <div className="flex items-center">
                <button
                  onClick={handleGoBack}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  aria-label={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                  title={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                >
                  <ArrowLeft className="h-4 w-4 text-[#D9A52E] group-hover:-translate-x-1 transition-transform" />
                  <span>{language === "ta" ? "பின்செல்" : "Back"}</span>
                </button>
              </div>

              {/* Founder Profile Banner */}
              <div className="bg-gradient-to-r from-[#06351F] via-[#092B1C] to-[#03210E] text-white rounded-3xl p-6 sm:p-9 border border-[#D9A52E]/30 shadow-xl flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                {/* Founder Photo */}
                <div className="relative h-48 w-48 sm:h-56 sm:w-56 rounded-2xl overflow-hidden shrink-0 border-2 border-[#D9A52E] bg-white/10 shadow-2xl group">
                  <Image
                    src="/images/founder/founder.png"
                    alt="Mr. Manickam Natarajan - Founder & Managing Director"
                    fill
                    sizes="(max-width: 768px) 192px, 224px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 left-2 right-2 py-1 rounded-lg bg-[#06351F]/95 text-[10px] font-black text-center text-[#D9A52E] border border-[#D9A52E]/40 backdrop-blur-md shadow-md uppercase tracking-wider">
                    16+ Yrs IAF Veteran
                  </div>
                </div>

                {/* Founder Details */}
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A52E]/20 text-[#D9A52E] border border-[#D9A52E]/30 text-[10px] font-black uppercase tracking-wider mb-2.5">
                    <Sparkles className="h-3 w-3" />
                    Founder & Managing Director
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-1.5">
                    {language === "ta" ? "திரு. மாணிக்கம் நடராஜன்" : "Mr. Manickam Natarajan"}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#D9A52E] mb-3">
                    Indian Air Force Veteran · Established Surya Promoters in 2010
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
                    {language === "ta"
                      ? "இந்திய விமானப்படை ஒழுங்குமுறை, நேர்மை மற்றும் வெளிப்படைத்தன்மையுடன் 2010 ஆம் ஆண்டு தொடங்கப்பட்டது. ஒவ்வொரு மனைக்கும் 30 ஆண்டுகால மூல ஆவணங்கள் சரிபார்க்கப்பட்டு 100% தெளிவான கணினி ஆவணம் உறுதி செய்யப்படுகிறது."
                      : "Founded in 2010 on principles of military precision, unyielding honesty, and zero-compromise legal due diligence. Every single plot carries verified 30-year parent documentation, immediate computer document, and guaranteed road connectivity across Madurai."}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-neutral-300">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#D9A52E]" />
                      <span className="font-semibold">{language === "ta" ? "100% சட்டப்பூர்வ ஆவணம்" : "100% Verified Document"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="font-semibold">{language === "ta" ? "DTCP & RERA அங்கீகாரம்" : "DTCP & RERA Approved"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-[22px] p-5 border border-neutral-200/90 shadow-sm hover:shadow-md hover:border-[#D9A52E]/60 text-center transition-all">
                  <span className="text-3xl sm:text-4xl font-black text-[#D9A52E] block">16+</span>
                  <p className="text-xs font-black text-[#06351F] mt-1">Years Experience</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Established Since 2010</p>
                </div>
                <div className="bg-white rounded-[22px] p-5 border border-neutral-200/90 shadow-sm hover:shadow-md hover:border-[#D9A52E]/60 text-center transition-all">
                  <span className="text-3xl sm:text-4xl font-black text-[#06351F] block">500+</span>
                  <p className="text-xs font-black text-[#06351F] mt-1">Happy Families</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Settled in Tamil Nadu</p>
                </div>
                <div className="bg-white rounded-[22px] p-5 border border-neutral-200/90 shadow-sm hover:shadow-md hover:border-[#D9A52E]/60 text-center transition-all">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-700 block">100%</span>
                  <p className="text-xs font-black text-[#06351F] mt-1">Clear Document</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Zero Legal Disputes</p>
                </div>
                <div className="bg-white rounded-[22px] p-5 border border-neutral-200/90 shadow-sm hover:shadow-md hover:border-[#D9A52E]/60 text-center transition-all">
                  <span className="text-3xl sm:text-4xl font-black text-[#D9A52E] block">4.9 ★</span>
                  <p className="text-xs font-black text-[#06351F] mt-1">Client Rating</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Verified Customer Trust</p>
                </div>
              </div>

              {/* 4 Core Pillars / Trust Guarantees */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <ShieldCheck className="h-5 w-5 text-[#D9A52E]" />
                  <h4 className="text-base font-black text-[#06351F]">
                    {language === "ta" ? "சூர்யா புரமோட்டர்ஸ் — நம்பகத்தன்மையின் நான்கு தூண்கள்" : "Surya Promoters — Four Pillars of Trust"}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#FAF8F3] p-4 rounded-2xl border border-neutral-200/80 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-[#D9A52E] tracking-wider block">Pillar 01</span>
                    <h5 className="font-black text-[#06351F] text-sm">Military Precision</h5>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Guided by IAF discipline with rigorous paperwork vetting and total accountability.
                    </p>
                  </div>
                  <div className="bg-[#FAF8F3] p-4 rounded-2xl border border-neutral-200/80 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-[#D9A52E] tracking-wider block">Pillar 02</span>
                    <h5 className="font-black text-[#06351F] text-sm">100% Clear Computer Document</h5>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      30-year parent title deed verification, DTCP/RERA approvals, and zero boundary disputes.
                    </p>
                  </div>
                  <div className="bg-[#FAF8F3] p-4 rounded-2xl border border-neutral-200/80 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-[#D9A52E] tracking-wider block">Pillar 03</span>
                    <h5 className="font-black text-[#06351F] text-sm">Prime Growth Corridors</h5>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Plots situated exclusively along Madurai's NH-44, Ring Road, and upcoming infrastructure.
                    </p>
                  </div>
                  <div className="bg-[#FAF8F3] p-4 rounded-2xl border border-neutral-200/80 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-[#D9A52E] tracking-wider block">Pillar 04</span>
                    <h5 className="font-black text-[#06351F] text-sm">Transparent Registration</h5>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Honest pricing, zero hidden brokerage, and end-to-end registration assistance.
                    </p>
                  </div>
                </div>
              </div>

            </section>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 5: DOWNLOAD MAP (Blueprints, Layout Maps, Brochures)            */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === "download" && (
            <section className="space-y-6 animate-fadeIn pt-1">
              {/* Top-Left Back Arrow Navigation */}
              <div className="flex items-center">
                <button
                  onClick={handleGoBack}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  aria-label={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                  title={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                >
                  <ArrowLeft className="h-4 w-4 text-[#D9A52E] group-hover:-translate-x-1 transition-transform" />
                  <span>{language === "ta" ? "பின்செல்" : "Back"}</span>
                </button>
              </div>

              {/* Downloads Hub Banner */}
              <div className="bg-gradient-to-r from-[#06351F] via-[#092B1C] to-[#03210E] text-white rounded-3xl p-6 sm:p-7 border border-[#D9A52E]/30 shadow-md">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A52E]/20 text-[#D9A52E] border border-[#D9A52E]/30 text-[10px] font-black uppercase tracking-wider mb-2">
                  <Download className="h-3 w-3" />
                  Official CAD & Blueprint Repository
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">
                  {language === "ta" ? "வரைபடம், புளூபிரிண்ட் & கையேடுகள் பதிவிறக்கம்" : "Download Project Maps & Resources"}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                  {language === "ta"
                    ? "ஆரஞ்ச் கார்டன், வைகை எலைட் உள்ளிட்ட அனைத்து திட்டங்களின் கள வரைபடம், சட்ட ஆவண சுருக்கம் மற்றும் கையேடுகளை பதிவிறக்குங்கள்."
                    : "Direct one-click access to high-resolution CAD layout maps, plot dimension blueprints, DTCP approvals, and verified brochures directly on your device."}
                </p>
              </div>

              {toastMessage && (
                <div className="p-4 rounded-2xl bg-[#06351F] text-[#D9A52E] border border-[#D9A52E]/40 shadow-lg flex items-center justify-between text-xs font-bold">
                  <span>✓ {toastMessage}</span>
                  <button onClick={() => setToastMessage(null)} className="text-white hover:text-[#D9A52E] cursor-pointer">✕</button>
                </div>
              )}

              {/* Downloads Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {DOWNLOAD_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-[22px] p-5 sm:p-6 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-[#D9A52E]/70 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#06351F]/10 text-[#06351F] border border-[#D9A52E]/30">
                            {item.category[language]}
                          </span>
                          {item.brochureUrl && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {language === "ta" ? "வரைபடம் + கையேடு" : "Layout + Brochure"}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-bold text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full">{item.fileSize}</span>
                      </div>
                      <h4 className="font-black text-[#06351F] text-base mb-1.5 group-hover:text-[#BD8D1C] transition-colors">
                        {item.title[language]}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-5">
                        <FileText className="h-4 w-4 text-[#D9A52E]" />
                        <span>{item.fileType}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-bold">{item.badge}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-neutral-100">
                      <button
                        onClick={() => handleDownloadCard(item)}
                        className="py-2.5 px-3 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-[#0E5934]"
                        title={language === "ta" ? "வரைபடம் மற்றும் கையேடு இரண்டையும் பதிவிறக்கவும்" : "Download both Layout Map and Brochure"}
                      >
                        <Download className="h-4 w-4 text-[#D9A52E]" />
                        <span>{language === "ta" ? "பதிவிறக்க" : "Download Both"}</span>
                      </button>

                      <button
                        onClick={() => setSelectedDownloadPreview({ item, activeTab: "layout" })}
                        className="py-2.5 px-3 rounded-xl bg-[#0E5934] hover:bg-[#06351F] text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-[#0E5934]"
                        title={language === "ta" ? "வரைபடம் மற்றும் கையேட்டை முன்னோட்டம் பார்க்க" : "Preview Layout & Brochure"}
                      >
                        <ExternalLink className="h-4 w-4 text-[#D9A52E]" />
                        <span>{language === "ta" ? "முன்னோட்டம்" : "Preview"}</span>
                      </button>
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
              {/* Top-Left Back Arrow Navigation */}
              <div className="flex items-center">
                <button
                  onClick={handleGoBack}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  aria-label={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                  title={language === "ta" ? "முந்தைய பக்கத்திற்கு திரும்புக" : "Back"}
                >
                  <ArrowLeft className="h-4 w-4 text-[#D9A52E] group-hover:-translate-x-1 transition-transform" />
                  <span>{language === "ta" ? "பின்செல்" : "Back"}</span>
                </button>
              </div>

              {/* Contact Top Banner */}
              <div className="bg-gradient-to-r from-[#06351F] via-[#092B1C] to-[#03210E] text-white rounded-3xl p-6 sm:p-8 border border-[#D9A52E]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A52E]/20 text-[#D9A52E] border border-[#D9A52E]/30 text-[10px] font-black uppercase tracking-wider mb-2">
                    <Sparkles className="h-3 w-3" />
                    Direct Owner & Advisory Access
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black mb-2">
                    {language === "ta" ? "எங்களை நேரடியாக தொடர்பு கொள்ளவும்" : "Direct Communication Channels"}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {language === "ta"
                      ? "மதுரையின் சிறந்த குடியிருப்பு, வணிகம் மற்றும் பண்ணை நிலங்களுக்கான நேரடி ஆலோசனை, 30 ஆண்டுகால பட்டா சரிபார்ப்பு மற்றும் இலவச களப் பார்வை ஏற்பாடு."
                      : "Connect directly with our veteran land advisory team for certified computer document verification, complimentary site inspection cabs, and transparent pricing."}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-center sm:items-end gap-2 text-center sm:text-right bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-xs text-neutral-300 font-semibold">{language === "ta" ? "அலுவலக நேரம்:" : "Office Hours:"}</span>
                  <span className="text-sm font-black text-[#D9A52E]">8:30 AM – 8:30 PM (7 Days a Week)</span>
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Site Visits Available Every Day
                  </span>
                </div>
              </div>

              {/* 4 Interactive Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* 1. Phone Call */}
                <div className="bg-white rounded-[22px] p-5 border border-neutral-200/90 shadow-sm hover:border-[#D9A52E] hover:shadow-xl transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-[#06351F] text-[#D9A52E] border border-[#D9A52E]/40 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                      <Phone className="h-5 w-5 text-[#D9A52E]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#06351F] block mb-0.5">
                      {language === "ta" ? "தொலைபேசி அழைப்பு" : "Direct Helpline"}
                    </span>
                    <h4 className="text-base font-black text-[#06351F] mb-1">{phone}</h4>
                    <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                      {language === "ta" ? "நில ஆலோசகருடன் உடனே பேச நேரடி அழைப்பு." : "Speak directly with our senior land acquisition specialist."}
                    </p>
                  </div>
                  <a
                    href={`tel:${phone}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs border border-[#0E5934]"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-[#D9A52E]" />
                    <span>{language === "ta" ? "அழைக்க" : "Call Now"}</span>
                  </a>
                </div>

                {/* 2. Document & Legal Title Advisory */}
                <div className="bg-white rounded-[22px] p-5 border border-neutral-200/90 shadow-sm hover:border-[#D9A52E] hover:shadow-xl transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-[#06351F] text-[#D9A52E] border border-[#D9A52E]/40 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                      <ShieldCheck className="h-5 w-5 text-[#D9A52E]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#06351F] block mb-0.5">
                      {language === "ta" ? "பட்டா ஆவண சரிபார்ப்பு" : "Document & Legal Advisory"}
                    </span>
                    <h4 className="text-base font-black text-[#06351F] mb-1">
                      {language === "ta" ? "சட்ட ஆவண சரிபார்ப்பு" : "Legal Title Desk"}
                    </h4>
                    <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                      {language === "ta" ? "30 ஆண்டுகால வில்லங்க சான்றிதழ் மற்றும் கணினி பட்டா ஆலோசனை." : "30-year encumbrance search, DTCP approval & computer document verification."}
                    </p>
                  </div>
                  <a
                    href={`tel:${phone}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs border border-[#0E5934]"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-[#D9A52E]" />
                    <span>{language === "ta" ? "ஆலோசனைக்கு அழைக்க" : "Call Legal Desk"}</span>
                  </a>
                </div>

                {/* 3. Corporate Email */}
                <div className="bg-white rounded-[22px] p-5 border border-neutral-200/90 shadow-sm hover:border-blue-500 hover:shadow-xl transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block mb-0.5">
                      {language === "ta" ? "மின்னஞ்சல்" : "Official Email"}
                    </span>
                    <h4 className="text-base font-black text-neutral-900 mb-1 truncate">{email}</h4>
                    <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                      {language === "ta" ? "கார்ப்பரேட் கோரிக்கைகள் மற்றும் கூட்டாண்மை விசாரணை." : "Send corporate inquiries, deeds verification, or proposals."}
                    </p>
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#0E5934] shadow-xs"
                  >
                    <Mail className="h-3.5 w-3.5 text-[#D9A52E]" />
                    <span>{language === "ta" ? "மின்னஞ்சல் அனுப்ப" : "Send Email"}</span>
                  </a>
                </div>

                {/* 4. Book Free Site Inspection Cab */}
                <div className="bg-white rounded-[22px] p-5 border border-neutral-200/90 shadow-sm hover:border-[#D9A52E] hover:shadow-xl transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-amber-50 text-[#854D0E] border border-amber-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                      <Sparkles className="h-5 w-5 text-[#D9A52E]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#854D0E] block mb-0.5">
                      {language === "ta" ? "களப் பார்வை முன்பதிவு" : "Free Site Visit"}
                    </span>
                    <h4 className="text-base font-black text-neutral-900 mb-1">{language === "ta" ? "இலவச வாகன வசதி" : "Inspection Cab"}</h4>
                    <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                      {language === "ta" ? "குடும்பத்துடன் இடத்தை நேரில் பார்வையிட இலவச வாகன ஏற்பாடு." : "Complimentary pick-up & drop cab across Madurai."}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEnquiryModalOpen(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer border border-[#0E5934]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#D9A52E]" />
                    <span>{language === "ta" ? "முன்பதிவு படிவம்" : "Book Site Inspection"}</span>
                  </button>
                </div>

              </div>

              {/* Head Office Information & Map Link */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-[#D9A52E]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#06351F]">
                      {language === "ta" ? "தலைமை அலுவலகம்" : "Corporate Headquarters"}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#06351F] mb-2">
                    SURYA PROMOTERS · MADURAI CORPORATE HQ
                  </h3>
                  <div className="space-y-2 text-xs text-neutral-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#D9A52E] shrink-0 mt-0.5" />
                      <span className="font-medium">{address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700 font-semibold">
                      <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Mon – Sun: 8:30 AM to 8:30 PM (Direct Site Visits Every Day)</span>
                    </div>
                  </div>
                </div>

                {/* Right Aligned Action Buttons: Official Facebook + Official Instagram + Google Maps */}
                <div className="shrink-0 flex flex-wrap sm:flex-nowrap items-center md:justify-end gap-3">
                  {/* Official Facebook Social Button */}
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={language === "ta" ? "எங்கள் பேஸ்புக் பக்கத்தை பார்வையிடவும்" : "Visit our Facebook page"}
                    title={language === "ta" ? "எங்கள் பேஸ்புக் பக்கத்தை பார்வையிடவும்" : "Visit our Facebook page"}
                    className="px-5 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] hover:opacity-95 text-white font-black text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-105 border border-white/20 group"
                  >
                    <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                      <Image
                        src="/images/facebook-logo.png"
                        alt="Facebook"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span>{language === "ta" ? "பேஸ்புக்" : "Facebook"}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-white/90" />
                  </a>

                  {/* Official Instagram Link */}
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white font-black text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-105 border border-white/20 group"
                    title="Follow Surya Promoters on Instagram"
                  >
                    <svg className="h-4 w-4 fill-white shrink-0 group-hover:rotate-6 transition-transform" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>{language === "ta" ? "இன்ஸ்டாகிராம்" : "Instagram"}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-white/90" />
                  </a>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] font-black text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-105"
                  >
                    <Navigation className="h-4 w-4 text-[#D9A52E]" />
                    <span>{language === "ta" ? "கூகிள் மேப்ஸ் வழித்தடம்" : "Open in Google Maps"}</span>
                  </a>
                </div>
              </div>

            </section>
          )}

        </main>

        {/* Persistent Bottom Landscape Border Across ALL Pages & Tabs */}
        <BottomLandscape className="mb-14 md:mb-0" />
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* MOBILE BOTTOM APP NAVIGATION DOCK (Play Store / Mobile App Style)         */}
      {/* ------------------------------------------------------------------------- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-xl border-t border-neutral-200/90 shadow-2xl px-1.5 py-1.5">
        <div className="grid grid-cols-5 items-center w-full max-w-md mx-auto">
          {/* Home */}
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer select-none ${activeTab === "home" ? "text-[#06351F] font-black" : "text-neutral-500 font-medium hover:text-[#06351F]"
              }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${activeTab === "home" ? "bg-[#06351F] text-[#D9A52E] shadow-xs" : "text-neutral-500"
              }`}>
              <Home className="h-4.5 w-4.5 shrink-0" />
            </div>
            <span className="text-[10px] font-semibold mt-1 leading-none text-center truncate w-full block">
              {language === "ta" ? "முகப்பு" : "Home"}
            </span>
          </button>

          {/* Our Projects */}
          <button
            onClick={() => {
              setActiveTab("projects");
              setActiveCategory(null);
            }}
            className={`w-full flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer select-none ${activeTab === "projects" ? "text-[#06351F] font-black" : "text-neutral-500 font-medium hover:text-[#06351F]"
              }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${activeTab === "projects" ? "bg-[#06351F] text-[#D9A52E] shadow-xs" : "text-neutral-500"
              }`}>
              <Building2 className="h-4.5 w-4.5 shrink-0" />
            </div>
            <span className="text-[10px] font-semibold mt-1 leading-none text-center truncate w-full block">
              {language === "ta" ? "திட்டங்கள்" : "Projects"}
            </span>
          </button>

          {/* Site Location */}
          <button
            onClick={() => setActiveTab("location")}
            className={`w-full flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer select-none ${activeTab === "location" ? "text-[#06351F] font-black" : "text-neutral-500 font-medium hover:text-[#06351F]"
              }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${activeTab === "location" ? "bg-[#06351F] text-[#D9A52E] shadow-xs" : "text-neutral-500"
              }`}>
              <MapPin className="h-4.5 w-4.5 shrink-0" />
            </div>
            <span className="text-[10px] font-semibold mt-1 leading-none text-center truncate w-full block">
              {language === "ta" ? "அமைவிடம்" : "Location"}
            </span>
          </button>

          {/* Download Layout */}
          <button
            onClick={() => setActiveTab("download")}
            className={`w-full flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer select-none ${activeTab === "download" ? "text-[#06351F] font-black" : "text-neutral-500 font-medium hover:text-[#06351F]"
              }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${activeTab === "download" ? "bg-[#06351F] text-[#D9A52E] shadow-xs" : "text-neutral-500"
              }`}>
              <Download className="h-4.5 w-4.5 shrink-0" />
            </div>
            <span className="text-[10px] font-semibold mt-1 leading-none text-center truncate w-full block">
              {language === "ta" ? "வரைபடம்" : "Layout"}
            </span>
          </button>

          {/* Contact */}
          <button
            onClick={() => setActiveTab("contact")}
            className={`w-full flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer select-none ${activeTab === "contact" ? "text-[#06351F] font-black" : "text-neutral-500 font-medium hover:text-[#06351F]"
              }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${activeTab === "contact" ? "bg-[#06351F] text-[#D9A52E] shadow-xs" : "text-neutral-500"
              }`}>
              <PhoneCall className="h-4.5 w-4.5 shrink-0" />
            </div>
            <span className="text-[10px] font-semibold mt-1 leading-none text-center truncate w-full block">
              {language === "ta" ? "தொடர்பு" : "Contact"}
            </span>
          </button>
        </div>
      </nav>


      {/* ------------------------------------------------------------------------- */}
      {/* MOBILE COLLAPSIBLE NAVIGATION DRAWER (Sidebar collapsed for mobile/tablet) */}
      {/* ------------------------------------------------------------------------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs md:hidden"
            />

            {/* Slide-out Drawer Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-gradient-to-b from-[#052617] via-[#083822] to-[#041D12] text-white flex flex-col justify-between py-4 px-4 select-none shadow-2xl md:hidden overflow-y-auto"
            >
              {/* Drawer Header: Clean Brand Identity & Close Button */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <div className="flex flex-col items-start">
                  <div className="flex items-center whitespace-nowrap">
                    <span className="relative inline-flex items-center justify-center w-7 h-7 shrink-0 -mr-1">
                      <Image
                        src="/images/surya-gold-logo.png"
                        alt="S"
                        fill
                        priority
                        sizes="32px"
                        className="object-contain"
                      />
                    </span>
                    <span className="font-display text-lg font-black tracking-[0.12em] text-[#D9A52E] uppercase leading-none drop-shadow-sm">
                      URYA
                    </span>
                  </div>
                  <span className="font-display text-[10px] font-extrabold tracking-[0.32em] text-[#F1E4C3] uppercase leading-none mt-1 text-center pl-1">
                    PROMOTERS
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5 w-full justify-center">
                    <span className="h-[1px] w-4 bg-[#D9A52E]/40" />
                    <span className="font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-[#F1E4C3]/80 whitespace-nowrap">
                      ESTD. 2010
                    </span>
                    <span className="h-[1px] w-4 bg-[#D9A52E]/40" />
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#D9A52E] flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close menu"
                  title="Close menu"
                >
                  <X className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="space-y-1.5 py-4 flex-1">
                {[
                  { id: "home", label: language === "ta" ? "முகப்பு" : "Store Home", icon: Home },
                  { id: "projects", label: language === "ta" ? "எங்கள் திட்டங்கள்" : "Our Projects", icon: Building2 },
                  { id: "location", label: language === "ta" ? "தள அமைவிடம்" : "Site Location", icon: MapPin },
                  { id: "gallery", label: language === "ta" ? "புகைப்படங்கள் & வீடியோ" : "Gallery Folders", icon: Camera },
                  { id: "download", label: language === "ta" ? "வரைபடம் பதிவிறக்கம்" : "Download Layout", icon: Download },
                  { id: "about", label: language === "ta" ? "எங்களைப் பற்றி" : "About Company", icon: Info },
                  { id: "contact", label: language === "ta" ? "நேரடி தொடர்பு" : "Contact Us", icon: PhoneCall },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        if (item.id === "projects") setActiveCategory(null);
                        setIsMobileMenuOpen(false);
                        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer font-bold text-xs ${isActive
                        ? "bg-gradient-to-r from-[#F5B731] via-[#EAB308] to-[#D98E14] text-[#0A1C12] shadow-sm font-black"
                        : "text-[#E1ECE6] hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-[#0A1C12]" : "text-[#D9A52E]"}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Drawer Bottom Direct Contact Pill Card (No arrow button!) */}
              <div className="pt-3 border-t border-white/10">
                <div className="p-2.5 rounded-2xl bg-[#092D1B]/95 border border-[#E2B755]/40 flex items-center shadow-lg w-full">
                  <a href={`tel:${phone}`} className="flex items-center gap-2.5 min-w-0 w-full group/call" title={`Call ${phone}`}>
                    <div className="w-8 h-8 rounded-full bg-[#051F12] border border-[#E2B755]/50 flex items-center justify-center shrink-0 text-[#E5A922] group-hover/call:scale-105 transition-transform">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-[#A3C2B0] font-medium leading-tight">Direct Contact</p>
                      <p className="text-xs font-bold text-white truncate leading-tight">{phone}</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

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
          const currentImgIndex = gallery.indexOf(activeImage) !== -1 ? gallery.indexOf(activeImage) : 0;
          const videoUrl = projectExtra?.videoUrl;

          const handlePrevImage = (e: React.MouseEvent) => {
            e.stopPropagation();
            const prevIdx = (currentImgIndex - 1 + gallery.length) % gallery.length;
            setModalActiveImage(gallery[prevIdx]);
            setModalMediaMode("photos");
          };

          const handleNextImage = (e: React.MouseEvent) => {
            e.stopPropagation();
            const nextIdx = (currentImgIndex + 1) % gallery.length;
            setModalActiveImage(gallery[nextIdx]);
            setModalMediaMode("photos");
          };

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
                {/* Close Button - Highly Visible Red X */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-40 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-600 hover:bg-red-700 text-white border-2 border-white shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-red-600/30 pointer-events-auto"
                  title="Close (Esc)"
                  aria-label="Close"
                >
                  <X className="h-6 w-6 sm:h-7 sm:w-7 stroke-[3]" />
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
                    <div className="relative h-60 sm:h-80 w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-inner group/hero">
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

                      {/* Previous / Next Arrow Buttons for Modal Hero */}
                      {gallery.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={handlePrevImage}
                            aria-label="Previous image"
                            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/65 hover:bg-[#06351F] text-white hover:text-[#D9A52E] border border-white/30 hover:border-[#0E5934] flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
                            title="Previous image (←)"
                          >
                            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
                          </button>

                          <button
                            type="button"
                            onClick={handleNextImage}
                            aria-label="Next image"
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/65 hover:bg-[#06351F] text-white hover:text-[#D9A52E] border border-white/30 hover:border-[#0E5934] flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
                            title="Next image (→)"
                          >
                            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
                          </button>
                        </>
                      )}

                      {/* Top Badges & Media Switcher */}
                      <div className="absolute top-3 left-3 right-14 flex items-center justify-between gap-2 z-10 pointer-events-auto">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#06351F] text-white border border-[#0E5934]">
                            {selectedProject.categoryLabel[language]}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/70 text-white backdrop-blur-md">
                            {selectedProject.subcategoryLabel[language]}
                          </span>
                        </div>

                        {videoUrl ? (
                          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/20">
                            <button
                              onClick={() => setModalMediaMode("photos")}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${modalMediaMode === "photos"
                                ? "bg-[#06351F] text-white border border-[#0E5934]"
                                : "text-white/80 hover:text-white"
                                }`}
                            >
                              Photos ({currentImgIndex + 1}/{gallery.length})
                            </button>
                            <button
                              onClick={() => setModalMediaMode("video")}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${modalMediaMode === "video"
                                ? "bg-[#06351F] text-white border border-[#0E5934]"
                                : "text-white/80 hover:text-white"
                                }`}
                            >
                              <Play className="h-3 w-3 fill-current" />
                              Video
                            </button>
                          </div>
                        ) : gallery.length > 1 ? (
                          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-white text-[10px] font-mono font-bold tracking-wider">
                            <span>Photos ({currentImgIndex + 1}/{gallery.length})</span>
                          </div>
                        ) : null}
                      </div>

                      {/* Banner Bottom Title Info */}
                      <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                        <div className="flex items-center gap-1 text-[#EAB308] text-xs font-black mb-1">
                          <Star className="h-3.5 w-3.5 fill-[#EAB308]" />
                          <span>{selectedProject.rating}</span>
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
                              ? "border-[#0E5934] scale-105 shadow-md ring-2 ring-[#0E5934]/40"
                              : "border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-400"
                              }`}
                          >
                            <Image src={thumb} alt={`Photo ${idx + 1}`} fill sizes="100px" className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. LIVE 2D/3D LAYOUT LINK */}
                  {selectedProject.mapbhoomiUrl && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#06351F] via-[#092B1C] to-[#041D12] text-white border border-[#0E5934]/50 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-[#0E5934] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md border border-[#D9A52E]/30">
                          <Compass className="h-6 w-6 text-[#D9A52E]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-white">{language === "ta" ? "நேரடி 2D/3D மனை வரைபடம்" : "Interactive 2D/3D Layout"}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Live Map
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-300 mt-0.5 max-w-xl leading-relaxed">
                            {language === "ta"
                              ? "ஒவ்வொரு மனையின் எல்லைகள், அளவு மற்றும் விபரங்களை 2D/3D நேரடி தளத்தில் பார்க்கவும்."
                              : "Explore verified plot boundaries, numbering, and dimensions on the official 2D/3D interactive layout."}
                          </p>
                        </div>
                      </div>
                      <a
                        href={selectedProject.mapbhoomiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] font-black text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md hover:scale-105 cursor-pointer"
                      >
                        <Navigation className="h-3.5 w-3.5 text-[#D9A52E]" />
                        <span>2D/3D views ↗</span>
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
                      className="py-2 px-4 sm:px-5 rounded-xl text-xs font-black bg-[#06351F] text-white border border-[#0E5934] shadow-xs cursor-pointer hover:bg-[#0E5934] transition-colors"
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
                        {language === "ta" ? "முக்கிய சிறப்பம்சங்கள்" : (selectedProject.id === "madurai-farms" ? "Key Insights" : "Key Highlights")}
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

                  {/* SECTION 2: LOCALITY & CONNECTIVITY */}
                  {projectExtra && projectExtra.transportation && projectExtra.transportation.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80">
                          {language === "ta" ? "அமைவிடம் & போக்குவரத்து" : "Locality & Connectivity"}
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
                          {projectExtra.transportation.map((item, idx) => {
                            const isLong = item.distance && item.distance.length > 30;
                            return (
                              <div
                                key={idx}
                                className={`p-2.5 rounded-xl bg-white border border-neutral-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 ${
                                  isLong ? "sm:col-span-2" : ""
                                }`}
                              >
                                <span className="text-xs font-bold text-neutral-800 shrink-0">
                                  {item.name[language]}
                                </span>
                                <div className="flex items-center gap-1.5 text-left sm:text-right flex-wrap sm:flex-nowrap">
                                  <span className="text-[11px] font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md break-words max-w-full">
                                    {item.distance}
                                  </span>
                                  {item.time && (
                                    <span className="text-[10px] text-neutral-500 font-medium shrink-0">
                                      ({item.time})
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
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
                                ? "https://maps.google.com/maps?q=9.905039,78.165845&hl=en&z=16&output=embed"
                                : selectedProject.id === "pandi-kovil"
                                  ? "https://maps.google.com/maps?q=9.934271,78.166845&hl=en&z=16&output=embed"
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
                                      : (language === "ta" ? "கள வரைபடம்" : "Layout Blueprint")}
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
                              className="text-xs font-bold text-white flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-lg bg-[#06351F] hover:bg-[#0E5934] transition-colors border border-[#0E5934]"
                            >
                              <Download className="h-3 w-3 text-[#D9A52E]" />
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
                                className={`p-2 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 text-left ${modalActiveBlueprintIndex === bpIdx
                                  ? "border-[#0E5934] bg-emerald-50 shadow-xs"
                                  : "border-neutral-200 hover:border-neutral-300 bg-white"
                                  }`}
                              >
                                <div className="relative h-12 w-16 rounded-lg overflow-hidden shrink-0 border border-neutral-200 bg-neutral-100">
                                  <Image src={bp.image} alt={bp.title.en} fill className="object-contain" sizes="80px" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-[10px] font-black uppercase text-[#06351F] block">
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
                      className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Navigation className="h-3.5 w-3.5 text-[#D9A52E]" />
                      <span>{language === "ta" ? "கூகிள் மேப்ஸ்" : "Google Maps"}</span>
                    </a>

                    {selectedProject.mapbhoomiUrl && (
                      <a
                        href={selectedProject.mapbhoomiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Compass className="h-3.5 w-3.5 text-[#D9A52E]" />
                        <span>2D/3D views ↗</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`tel:${phone}`}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#06351F] text-white hover:bg-[#0E5934] border border-[#0E5934] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#D9A52E]" />
                      <span>{language === "ta" ? "நேரடி அழைப்பு" : "Call Advisor"}</span>
                    </a>

                    <button
                      onClick={() => {
                        setIsEnquiryModalOpen(true);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#D9A52E]" />
                      <span>{language === "ta" ? "விசாரணை படிவம்" : "Enquire for Price"}</span>
                    </button>
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
            onClick={() => {
              setSelectedFolderImages(null);
              setActiveFolderImageIndex(null);
            }}
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
              className="relative w-full max-w-5xl bg-white rounded-3xl p-5 sm:p-7 max-h-[88vh] overflow-y-auto overscroll-contain shadow-2xl border border-neutral-200"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-[#B45309] flex items-center justify-center">
                    <Folder className="h-4 w-4 fill-[#B45309]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-neutral-900">{selectedFolderImages.title}</h3>
                    <p className="text-[11px] text-neutral-500">
                      {selectedFolderImages.images.length} {language === "ta" ? "புகைப்படங்கள் உள்ளன • பெரிதாக்கி பார்க்க கிளிக் செய்க" : "Photos • Click any image to view in popup"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFolderImages(null);
                    setActiveFolderImageIndex(null);
                  }}
                  className="h-10 w-10 rounded-full bg-red-600 hover:bg-red-700 text-white border-2 border-white shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 ring-2 ring-red-600/30"
                  title="Close"
                  aria-label="Close folder"
                >
                  <X className="h-5 w-5 stroke-[3]" />
                </button>
              </div>

              {/* Grid of Images with popup trigger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {selectedFolderImages.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveFolderImageIndex(idx)}
                    className="relative h-48 rounded-2xl overflow-hidden bg-neutral-900 group cursor-pointer border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-[#EAB308] transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Image
                      src={img}
                      alt={`${selectedFolderImages.title} ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 bg-black/75 backdrop-blur-md text-[#EAB308] px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-[#EAB308]/40">
                        <ZoomIn className="h-3.5 w-3.5" />
                        <span>{language === "ta" ? "காண்க (Popup)" : "View Image"}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-mono text-white/90 backdrop-blur-xs pointer-events-none">
                      {idx + 1} / {selectedFolderImages.images.length}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------------- */}
      {/* 4B. FULLSCREEN IMAGE LIGHTBOX POPUP WITH NEXT/PREV NAVIGATION             */}
      {/* ------------------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedFolderImages && activeFolderImageIndex !== null && (
          <div
            data-lenis-prevent
            onClick={() => setActiveFolderImageIndex(null)}
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-lg overflow-hidden animate-fadeIn"
          >
            {/* Top Bar: Title, Counter & Close */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 left-4 right-4 flex items-center justify-between z-70 pointer-events-auto"
            >
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                <Folder className="h-3.5 w-3.5 text-[#EAB308] fill-[#EAB308]" />
                <span className="font-bold">{selectedFolderImages.title}</span>
                <span className="text-[#EAB308]">•</span>
                <span className="font-mono text-[11px] text-neutral-300">
                  {activeFolderImageIndex + 1} / {selectedFolderImages.images.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveFolderImageIndex(null)}
                className="h-11 w-11 rounded-full bg-red-600 hover:bg-red-700 text-white border-2 border-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-red-600/30"
                title="Close (Esc)"
                aria-label="Close"
              >
                <X className="h-6 w-6 stroke-[3]" />
              </button>
            </div>

            {/* Left / Previous Arrow Button */}
            {selectedFolderImages.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFolderImageIndex(
                    (activeFolderImageIndex - 1 + selectedFolderImages.images.length) %
                    selectedFolderImages.images.length
                  );
                }}
                aria-label="Previous image"
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-70 h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-black/70 hover:bg-[#06351F] text-white hover:text-[#D9A52E] border border-white/20 hover:border-[#0E5934] flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                title="Previous image (←)"
              >
                <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.5]" />
              </button>
            )}

            {/* Right / Next Arrow Button */}
            {selectedFolderImages.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFolderImageIndex(
                    (activeFolderImageIndex + 1) % selectedFolderImages.images.length
                  );
                }}
                aria-label="Next image"
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-70 h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-black/70 hover:bg-[#06351F] text-white hover:text-[#D9A52E] border border-white/20 hover:border-[#0E5934] flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                title="Next image (→)"
              >
                <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.5]" />
              </button>
            )}

            {/* Active Image Container */}
            <motion.div
              key={activeFolderImageIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl h-[70vh] sm:h-[80vh] flex items-center justify-center p-2"
            >
              <Image
                src={selectedFolderImages.images[activeFolderImageIndex]}
                alt={`${selectedFolderImages.title} view ${activeFolderImageIndex + 1}`}
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </motion.div>

            {/* Bottom thumbnail selector strip */}
            {selectedFolderImages.images.length > 1 && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-70 max-w-[90vw] overflow-x-auto flex items-center gap-2 p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 scrollbar-none"
              >
                {selectedFolderImages.images.map((tImg, tIdx) => (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => setActiveFolderImageIndex(tIdx)}
                    className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${activeFolderImageIndex === tIdx
                      ? "border-[#0E5934] scale-105 shadow-md ring-2 ring-[#0E5934]/40"
                      : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
                      }`}
                  >
                    <Image src={tImg} alt={`Thumbnail ${tIdx + 1}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
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
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="h-9 w-9 rounded-full bg-red-600 hover:bg-red-700 text-white border border-white/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md"
                  title="Close"
                  aria-label="Close video"
                >
                  <X className="h-5 w-5 stroke-[3]" />
                </button>
              </div>

              {selectedVideo.url ? (
                <div className="space-y-3">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl">
                    <video
                      src={selectedVideo.url}
                      controls
                      autoPlay
                      playsInline
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-mono">Duration: {selectedVideo.duration}</span>
                    <a
                      href={`tel:${phone}`}
                      className="px-3.5 py-1.5 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white font-bold text-xs flex items-center gap-1.5 border border-[#0E5934] transition"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#D9A52E]" />
                      <span>{language === "ta" ? "அழைக்க" : "Call Advisor"}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-64 sm:h-80 w-full rounded-2xl bg-neutral-950 flex flex-col items-center justify-center p-6 text-center border border-neutral-800">
                  <div className="h-14 w-14 rounded-full bg-[#0E5934] text-white flex items-center justify-center mb-3 border border-[#D9A52E]/40 shadow-lg">
                    <Play className="h-6 w-6 fill-white ml-0.5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{selectedVideo.title}</h4>
                  <p className="text-xs text-neutral-400 mb-4">4K drone footage stream available on request</p>
                  <a
                    href={`tel:${phone}`}
                    className="px-4 py-2 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white font-bold text-xs flex items-center gap-1.5 border border-[#0E5934]"
                  >
                    <Phone className="h-4 w-4 text-[#D9A52E]" />
                    <span>{language === "ta" ? "வீடியோ கோர அழைக்க" : "Call for Full 4K Video"}</span>
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------------- */}
      {/* 4.5. DOWNLOAD ASSET PREVIEW MODAL (Layout Map & Project Brochure)        */}
      {/* ------------------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedDownloadPreview && (
          <div
            data-lenis-prevent
            onClick={() => setSelectedDownloadPreview(null)}
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
              className="relative w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto overscroll-contain flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-50 text-[#854D0E]">
                        {selectedDownloadPreview.item.category[language]}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">
                        {selectedDownloadPreview.item.fileSize}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-neutral-900">
                      {selectedDownloadPreview.item.title[language]}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedDownloadPreview(null)}
                    className="h-9 w-9 rounded-full bg-red-600 hover:bg-red-700 text-white border border-white/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md"
                    title="Close"
                    aria-label="Close preview"
                  >
                    <X className="h-5 w-5 stroke-[3]" />
                  </button>
                </div>

                {/* Tabs: Layout Map vs Brochure */}
                {selectedDownloadPreview.item.brochureUrl ? (
                  <div className="flex items-center gap-2 mt-4 mb-4 p-1 rounded-2xl bg-neutral-100">
                    <button
                      onClick={() =>
                        setSelectedDownloadPreview({
                          ...selectedDownloadPreview,
                          activeTab: "layout",
                        })
                      }
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${selectedDownloadPreview.activeTab === "layout"
                        ? "bg-[#06351F] text-white shadow-xs"
                        : "text-neutral-600 hover:text-neutral-900"
                        }`}
                    >
                      <Map className="h-4 w-4 text-[#D9A52E]" />
                      <span>{language === "ta" ? "மனை வரைபடம் (Layout Map)" : "Layout Map / Blueprint"}</span>
                    </button>
                    <button
                      onClick={() =>
                        setSelectedDownloadPreview({
                          ...selectedDownloadPreview,
                          activeTab: "brochure",
                        })
                      }
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${selectedDownloadPreview.activeTab === "brochure"
                        ? "bg-[#06351F] text-white shadow-xs"
                        : "text-neutral-600 hover:text-neutral-900"
                        }`}
                    >
                      <FileText className="h-4 w-4 text-[#D9A52E]" />
                      <span>{language === "ta" ? "திட்ட கையேடு (Project Brochure)" : "Official Project Brochure"}</span>
                    </button>
                  </div>
                ) : null}

                {/* Preview Image Container */}
                <div className="relative w-full h-[52vh] min-h-[300px] rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-neutral-200">
                  <Image
                    src={
                      selectedDownloadPreview.activeTab === "brochure" && selectedDownloadPreview.item.brochureUrl
                        ? selectedDownloadPreview.item.brochureUrl
                        : selectedDownloadPreview.item.downloadUrl
                    }
                    alt={selectedDownloadPreview.item.title.en}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 mt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-neutral-500 font-medium text-center sm:text-left">
                  {language === "ta"
                    ? "பதிவிறக்க பட்டனை அழுத்தி வரைபடம் & கையேடு இரண்டையும் ஒரே கிளிக்கில் பெறுங்கள்."
                    : "Download includes both the high-resolution layout map and the official brochure flyer."}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleDownloadCard(selectedDownloadPreview.item)}
                    className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white border border-[#0E5934] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Download className="h-4 w-4 text-[#D9A52E]" />
                    <span>
                      {selectedDownloadPreview.item.brochureUrl
                        ? language === "ta"
                          ? "இரண்டையும் பதிவிறக்கு (வரைபடம் + கையேடு)"
                          : "Download Both (Layout + Brochure)"
                        : language === "ta"
                          ? "பதிவிறக்க"
                          : "Download File"}
                    </span>
                  </button>

                  <a
                    href={
                      selectedDownloadPreview.activeTab === "brochure" && selectedDownloadPreview.item.brochureUrl
                        ? selectedDownloadPreview.item.brochureUrl
                        : selectedDownloadPreview.item.downloadUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#0E5934] hover:bg-[#06351F] text-white border border-[#0E5934] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    title={language === "ta" ? "புதிய தாவலில் திறக்கவும்" : "Open Original in New Tab"}
                  >
                    <ExternalLink className="h-4 w-4 text-[#D9A52E]" />
                    <span className="hidden sm:inline">{language === "ta" ? "முழுத்திரை" : "Full Screen"}</span>
                  </a>
                </div>
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
                <button
                  onClick={() => setIsEnquiryModalOpen(false)}
                  className="h-9 w-9 rounded-full bg-red-600 hover:bg-red-700 text-white border border-white/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md"
                  title="Close"
                  aria-label="Close enquiry"
                >
                  <X className="h-5 w-5 stroke-[3]" />
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
                  className="w-full py-2.5 rounded-xl bg-[#06351F] hover:bg-[#0E5934] text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer mt-3 border border-[#0E5934]"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#D9A52E]" />
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
