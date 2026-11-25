"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Save,
  Upload,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
  Car,
  HeartPulse,
  GraduationCap,
  Droplets,
  TrendingUp,
  Star,
  Phone,
  ExternalLink,
  ShieldCheck,
  Layers,
  Film,
  FileText,
  Home,
  Check,
  ChevronRight,
  Info,
  DollarSign,
  Building2,
  Award,
  Trees,
  ArrowUp,
  ArrowDown,
  Compass,
} from "lucide-react";
import { CmsProject, CmsCategory, CmsSubcategory } from "@/types/cms";

interface ProjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CmsProject | null;
  categories: CmsCategory[];
  subcategories: CmsSubcategory[];
  onSave: (project: CmsProject, isPublish: boolean) => Promise<void>;
  onDelete?: (projectId: string) => Promise<void>;
}

type TabSection =
  | "basic"
  | "media"
  | "overview"
  | "highlights"
  | "locality"
  | "groundwater"
  | "community"
  | "valuation"
  | "reviews"
  | "map_contact";

const AVAILABLE_ICONS = [
  { id: "CheckCircle2", label: "Checkmark" },
  { id: "ShieldCheck", label: "Shield / Trust" },
  { id: "Sparkles", label: "Sparkles / Luxury" },
  { id: "Building2", label: "Building" },
  { id: "Home", label: "House" },
  { id: "Trees", label: "Nature / Trees" },
  { id: "MapPin", label: "Location" },
  { id: "Award", label: "Award" },
];

export default function ProjectManagementModal({
  isOpen,
  onClose,
  project: initialProject,
  categories,
  subcategories,
  onSave,
  onDelete,
}: ProjectManagementModalProps) {
  // Ensure deep clone so modifications don't mutate parent state until save
  const [formData, setFormData] = useState<CmsProject>(() => {
    if (initialProject) {
      return JSON.parse(JSON.stringify(initialProject));
    }
    const defaultCat = categories[0] || { id: "residential", name: { en: "Residential", ta: "குடியிருப்பு" } };
    const defaultSub = subcategories.find((s) => s.categoryId === defaultCat.id) || {
      id: "villa",
      categoryId: defaultCat.id,
      name: { en: "Luxury Villa", ta: "சொகுசு வில்லா" },
    };

    return {
      id: `project-${Date.now()}`,
      slug: `project-${Date.now()}`,
      name: { en: "", ta: "" },
      category: defaultCat.id,
      categoryLabel: defaultCat.name,
      subcategory: defaultSub.id,
      subcategoryLabel: defaultSub.name,
      location: { en: "", ta: "" },
      distanceInfo: { en: "", ta: "" },
      fullAddress: { en: "", ta: "" },
      image: "/images/hero-poster.jpg",
      galleryImages: [],
      interiorImages: [],
      exteriorImages: [],
      layoutImages: [],
      videoUrls: [],
      blueprint: "",
      mapbhoomiUrl: "",
      brochureUrl: "",
      statusBadge: { en: "Available for Registration", ta: "விற்பனைக்கு உள்ளது" },
      rating: "5.0",
      verifiedReviewCount: "12 Reviews",
      status: "running",
      isPublished: true,
      description: { en: "", ta: "" },
      fullOverview: { en: "", ta: "" },
      highlights: { en: [], ta: [] },
      detailedHighlights: [],
      suitableActivities: { en: [], ta: [] },
      mapsUrl: "https://maps.google.com/?q=Madurai",
      specs: [],
      overviewSpecs: {
        configuration: { en: "3 BHK Duplex Villa", ta: "3 BHK டூப்ளக்ஸ் வில்லா" },
        builtUpArea: "2,750 Sq.Ft",
        landArea: "4.12 Cents",
        facing: { en: "East Facing", ta: "கிழக்கு பார்த்தது" },
        features: {
          en: ["Hi-Ceiling Living", "Dolby Atmos Home Theatre", "Rain Showers"],
          ta: ["உயர்ந்த கூரை அமைப்பு", "டால்பி அட்மாஸ் ஹோம் தியேட்டர்", "மழை தூறல் குளியலறை"],
        },
        price: "₹1.67 Cr",
        isPriceNegotiable: true,
      },
      extendedDetails: {
        transportation: [
          { name: { en: "K.Pudur Main Road", ta: "கே.புதூர் பிரதான சாலை" }, distance: "800 m", time: "2 mins" },
          { name: { en: "Mattuthavani Bus Terminal", ta: "மாட்டுத்தாவணி பேருந்து நிலையம்" }, distance: "3.5 km", time: "8 mins" },
        ],
        hospitals: [
          { name: { en: "Apollo Speciality Hospital", ta: "அப்பல்லோ ஸ்பெஷாலிட்டி மருத்துவமனை" }, distance: "3.2 km", time: "7 mins" },
        ],
        schoolsAndColleges: [
          { name: { en: "Mahatma Montessori School", ta: "மகாத்மா மாண்டிசோரி பள்ளி" }, distance: "2.0 km", time: "5 mins" },
        ],
        groundwater: {
          depth: { en: "35 – 40 ft Sweet Potable Aquifer", ta: "35 – 40 அடி ஆழத்தில் சுவையான நன்னீர்" },
          quality: { en: "100% Tested Sweet Drinking Water (TDS < 190)", ta: "100% பரிசோதிக்கப்பட்ட நன்னீர் (TDS < 190)" },
          source: { en: "Dedicated High-Yield Borewell", ta: "தனி ஆழ்துளை கிணறு" },
          tdsValue: "TDS < 190",
          waterHardness: "Zero Hardness",
        },
        neighborhood: {
          density: { en: "Elite Residential Enclave", ta: "உயர்தர குடியிருப்பு பகுதி" },
          surrounding: { en: "Independent Luxury Villas", ta: "தனி சொகுசு பங்களாக்கள்" },
          atmosphere: { en: "Peaceful, Secure, 24/7 Gated", ta: "அமைதியான, பாதுகாப்பான சூழல்" },
          roadConditions: { en: "30 & 40 Feet Bitumen Tar Roads", ta: "30 & 40 அடி அகன்ற தார் சாலைகள்" },
          drainage: { en: "Engineered Storm Water Drainage", ta: "மழைநீர் வடிகால் வசதி" },
        },
        groundValue: {
          currentRate: { en: "₹1.67 Cr (₹6,072 / Sq.Ft)", ta: "₹1.67 கோடி (₹6,072 / ச.அடி)" },
          pricePerSqFt: "₹6,072 / Sq.Ft",
          guidelineValue: { en: "4.12 Cents DTCP Approved", ta: "4.12 சென்ட் DTCP அனுமதி" },
          landExtent: "4.12 Cents",
          verifiedPriceStatus: { en: "Verified Fair Market Valuation", ta: "சந்தை மதிப்பு சரிபார்க்கப்பட்டது" },
          threeYearROI: "+35% Appreciation",
          fiveYearROI: "+65% Capital Growth",
          growthDrivers: {
            en: ["Surya Nagar prime residential corridor", "Direct Mattuthavani highway access"],
            ta: ["சூர்யா நகர் முதன்மை குடியிருப்பு பகுதி", "மாட்டுத்தாவணி நேரடி இணைப்பு"],
          },
        },
        customerReviews: [
          {
            name: "Dr. K. Ravichandran, MD",
            role: { en: "Verified Villa Buyer", ta: "சொகுசு வில்லா வாடிக்கையாளர்" },
            rating: 5,
            date: "October 2026",
            comment: {
              en: "Surya Promoters delivered unmatched quality with 100% clear titles.",
              ta: "சூர்யா புரமோட்டர்ஸ் சிறந்த தரத்துடன் 100% தெளிவான பட்டா ஆவணங்களை வழங்கியது.",
            },
            isVerifiedBuyer: true,
          },
        ],
        overallRating: "4.9",
        clientApprovalRate: "98.6%",
        happyFamiliesCount: "1,200+",
        yearsOfTrust: "16+ Yrs",
      },
      locationMap: {
        googleMapsUrl: "https://maps.google.com/?q=Madurai",
        latitude: "9.9512",
        longitude: "78.1489",
        fullAddress: { en: "Surya Nagar, K.Pudur, Madurai, Tamil Nadu 625007", ta: "சூர்யா நகர், கே.புதூர், மதுரை 625007" },
        pinLocation: { en: "Main Entrance Gate, 80 Feet Road", ta: "பிரதான நுழைவாயில், 80 அடி சாலை" },
        isVerifiedPinpoint: true,
      },
      contactInfo: {
        advisorPhone: "+91 78457 16453",
        enquiryPhone: "+91 77089 66452",
        googleMapsLink: "https://maps.google.com/?q=Madurai",
        customCallAction: { en: "Call Direct Advisory", ta: "நேரடி ஆலோசனைக்கு அழைக்க" },
        customEnquiryAction: { en: "Enquire for Best Price", ta: "சிறந்த விலைக்கு விசாரிக்க" },
      },
    };
  });

  const [activeTab, setActiveTab] = useState<TabSection>("basic");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Calculate Progress Percentage across sections
  const progressPercent = useMemo(() => {
    let score = 0;
    const total = 10;
    if (formData.name?.en?.trim() && formData.location?.en?.trim()) score++;
    if (formData.image?.trim() && (formData.galleryImages?.length || 0) > 0) score++;
    if (formData.description?.en?.trim() || formData.overviewSpecs?.price) score++;
    if ((formData.highlights?.en?.length || 0) > 0 || (formData.detailedHighlights?.length || 0) > 0) score++;
    if (
      (formData.extendedDetails?.transportation?.length || 0) > 0 ||
      (formData.extendedDetails?.hospitals?.length || 0) > 0
    ) score++;
    if (formData.extendedDetails?.groundwater?.depth?.en?.trim()) score++;
    if (formData.extendedDetails?.neighborhood?.density?.en?.trim()) score++;
    if (formData.extendedDetails?.groundValue?.currentRate?.en?.trim()) score++;
    if ((formData.extendedDetails?.customerReviews?.length || 0) > 0) score++;
    if (formData.locationMap?.googleMapsUrl?.trim()) score++;

    return Math.round((score / total) * 100);
  }, [formData]);

  if (!isOpen) return null;

  // File Upload Handler
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploaded: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField("uploading");
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Upload failed");
      }

      onUploaded(json.url);
      setStatusMessage({ type: "success", text: "Image uploaded successfully!" });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  // Submit Handler
  const handleSubmit = async (publish: boolean) => {
    if (!formData.name?.en?.trim()) {
      setActiveTab("basic");
      alert("Please enter the Project Name in English.");
      return;
    }

    try {
      setIsSubmitting(true);
      const toSave: CmsProject = {
        ...formData,
        isPublished: publish,
        status: publish ? (formData.status === "draft" ? "running" : formData.status) : "draft",
        // Ensure slug is clean
        slug:
          formData.slug ||
          formData.name.en
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
      };

      await onSave(toSave, publish);
      setStatusMessage({
        type: "success",
        text: publish ? "Project published live to website!" : "Project saved as draft!",
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden my-auto animate-fadeIn">
        {/* MODAL TOP BAR: TITLE, PROGRESS, PREVIEW, CLOSE */}
        <div className="bg-[#052617] text-white px-5 py-4 border-b border-[#0A3D25] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#093822] border border-[#E5A922]/40 flex items-center justify-center text-[#E5A922] shrink-0 shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black truncate">
                  {formData.name.en || "New Property Management"}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    formData.isPublished !== false
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {formData.isPublished !== false ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-[11px] text-[#F1E4C3]/75 font-mono truncate">
                {formData.categoryLabel.en} · {formData.location.en || "Madurai, Tamil Nadu"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Completion Progress Indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-[10px] font-mono font-bold text-[#E5A922]">{progressPercent}% Profile Complete</span>
              <div className="w-16 h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D9A52E] to-[#E5A922] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* In-Modal Preview Toggle */}
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                previewMode
                  ? "bg-[#E5A922] text-[#052617]"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{previewMode ? "Edit Form" : "Preview"}</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMessage && (
          <div
            className={`px-5 py-2 text-xs font-bold flex items-center gap-2 select-none shrink-0 ${
              statusMessage.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* MODAL MAIN CONTENT: LEFT SIDEBAR TABS + TAB CONTENT */}
        {previewMode ? (
          /* PREVIEW MODE SCREEN */
          <div className="flex-1 overflow-y-auto p-6 bg-[#FAF8F3] space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <span>This is a live preview of how this property will appear to buyers.</span>
              <button
                onClick={() => setPreviewMode(false)}
                className="font-bold underline text-amber-950 cursor-pointer"
              >
                Back to Editing
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
              <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-neutral-100">
                <Image
                  src={formData.image || "/images/hero-poster.jpg"}
                  alt={formData.name.en}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E5A922] text-[#052617]">
                    {formData.categoryLabel.en}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black mt-2">{formData.name.en}</h2>
                  <p className="text-xs text-white/80">{formData.location.en} · {formData.distanceInfo.en}</p>
                </div>
              </div>

              {formData.overviewSpecs && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-100">
                  <div className="p-3 rounded-xl bg-[#FAF8F3]">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Configuration</span>
                    <p className="text-sm font-bold text-neutral-900">{formData.overviewSpecs.configuration?.en}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F3]">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Price</span>
                    <p className="text-sm font-bold text-[#B45309]">
                      {formData.overviewSpecs.price}{" "}
                      {formData.overviewSpecs.isPriceNegotiable && "(Neg)"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F3]">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Built-up</span>
                    <p className="text-sm font-bold text-neutral-900">{formData.overviewSpecs.builtUpArea}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F3]">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Land Area</span>
                    <p className="text-sm font-bold text-neutral-900">{formData.overviewSpecs.landArea}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SECTION-BASED EDITING FORM */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* LEFT TAB NAVIGATION SIDEBAR */}
            <nav className="w-full md:w-64 bg-[#F8FAF9] border-r border-neutral-200 overflow-y-auto shrink-0 p-2 md:p-3 space-y-1 select-none">
              {[
                { id: "basic", label: "1. Basic Information", icon: Building2 },
                { id: "media", label: "2. Media Management", icon: Film },
                { id: "overview", label: "3. Specs & Overview", icon: FileText },
                { id: "highlights", label: "4. Key Highlights", icon: Sparkles },
                { id: "locality", label: "5. Locality & Infra", icon: Car },
                { id: "groundwater", label: "6. Groundwater Table", icon: Droplets },
                { id: "community", label: "7. Community & Houses", icon: Home },
                { id: "valuation", label: "8. Ground Value & ROI", icon: TrendingUp },
                { id: "reviews", label: "9. Customer Reviews", icon: Star },
                { id: "map_contact", label: "10. Map & Contacts", icon: MapPin },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as TabSection)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition cursor-pointer ${
                      isActive
                        ? "bg-[#052617] text-[#E5A922] shadow-sm"
                        : "text-neutral-700 hover:bg-neutral-200/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent className={`h-4 w-4 shrink-0 ${isActive ? "text-[#E5A922]" : "text-neutral-400"}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    <ChevronRight className={`h-3 w-3 shrink-0 ${isActive ? "text-[#E5A922]" : "text-neutral-300"}`} />
                  </button>
                );
              })}
            </nav>

            {/* RIGHT FORM CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: BASIC INFORMATION */}
              {activeTab === "basic" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-neutral-100 pb-2">
                    <h4 className="text-sm font-black text-[#052617]">Section 1: Basic Property Information</h4>
                    <p className="text-xs text-neutral-500">Core titles, categories, project status and verified credentials.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Project Name (English) *
                      </label>
                      <input
                        type="text"
                        value={formData.name.en}
                        onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                        placeholder="e.g. 3 BHK Duplex Luxury Villa for Sale"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold focus:border-[#052617] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Project Name (Tamil) *
                      </label>
                      <input
                        type="text"
                        value={formData.name.ta}
                        onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ta: e.target.value } })}
                        placeholder="e.g. 3 BHK டூப்ளக்ஸ் சொகுசு வில்லா"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold focus:border-[#052617] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Property Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const catId = e.target.value;
                          const selected = categories.find((c) => c.id === catId);
                          const matchingSub = subcategories.find((s) => s.categoryId === catId);
                          setFormData({
                            ...formData,
                            category: catId,
                            categoryLabel: selected?.name || { en: catId, ta: catId },
                            subcategory: matchingSub?.id || "",
                            subcategoryLabel: matchingSub?.name || { en: "", ta: "" },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold bg-white outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name.en} ({c.name.ta})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Subcategory / Property Type
                      </label>
                      <select
                        value={formData.subcategory}
                        onChange={(e) => {
                          const subId = e.target.value;
                          const selected = subcategories.find((s) => s.id === subId);
                          setFormData({
                            ...formData,
                            subcategory: subId,
                            subcategoryLabel: selected?.name || { en: subId, ta: subId },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold bg-white outline-none"
                      >
                        {subcategories
                          .filter((s) => s.categoryId === formData.category)
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name.en} ({s.name.ta})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Location / City Corridor (English)
                      </label>
                      <input
                        type="text"
                        value={formData.location.en}
                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, en: e.target.value } })}
                        placeholder="e.g. Surya Nagar, Madurai"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Location / City Corridor (Tamil)
                      </label>
                      <input
                        type="text"
                        value={formData.location.ta}
                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, ta: e.target.value } })}
                        placeholder="e.g. சூர்யா நகர், மதுரை"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                      Full Official Address
                    </label>
                    <input
                      type="text"
                      value={formData.fullAddress?.en || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullAddress: { en: e.target.value, ta: formData.fullAddress?.ta || e.target.value },
                        })
                      }
                      placeholder="e.g. Plot No. 14, 80 Feet Main Road, Surya Nagar, Madurai 625007"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Project Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold bg-white outline-none"
                      >
                        <option value="running">Running / Ongoing</option>
                        <option value="completed">Completed / Handed Over</option>
                        <option value="upcoming">Upcoming Development</option>
                        <option value="available">Available for Registration</option>
                        <option value="sold">Sold Out</option>
                        <option value="draft">Draft (Unpublished)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Rating (1.0 to 5.0)
                      </label>
                      <input
                        type="text"
                        value={formData.rating || "5.0"}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        placeholder="5.0"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Verified Review Count
                      </label>
                      <input
                        type="text"
                        value={formData.verifiedReviewCount || "12 Reviews"}
                        onChange={(e) => setFormData({ ...formData, verifiedReviewCount: e.target.value })}
                        placeholder="12 Verified Reviews"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                      Brief Project Description (English)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description.en}
                      onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                      placeholder="High-value residential or commercial property in Madurai..."
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA MANAGEMENT */}
              {activeTab === "media" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-neutral-100 pb-2">
                    <h4 className="text-sm font-black text-[#052617]">Section 2: Project Media Management</h4>
                    <p className="text-xs text-neutral-500">
                      Upload, reorder, preview and organize cover, interior, exterior and blueprint images.
                    </p>
                  </div>

                  {/* Main Cover Image */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                    <label className="block text-xs font-bold text-neutral-800">
                      Main Cover / Hero Image *
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-36 h-24 rounded-xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-300 shadow-xs">
                        <Image
                          src={formData.image || "/images/hero-poster.jpg"}
                          alt="Cover Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="/images/projects/flat-projects/1-exterior.jpg"
                          className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono"
                        />
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#052617] text-white text-xs font-bold hover:bg-[#0E4228] transition cursor-pointer shadow-xs">
                          <Upload className="h-3.5 w-3.5 text-[#E5A922]" />
                          <span>Upload New Cover Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (url) => setFormData({ ...formData, image: url }))}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Property Gallery Images */}
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-neutral-900">Property Photo Gallery</h5>
                        <p className="text-[11px] text-neutral-500">Add multiple high-resolution photos for the lightbox gallery.</p>
                      </div>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition cursor-pointer shadow-xs">
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, (url) =>
                              setFormData({
                                ...formData,
                                galleryImages: [...(formData.galleryImages || []), url],
                              })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(formData.galleryImages || []).map((img, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 group">
                          <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                galleryImages: formData.galleryImages?.filter((_, i) => i !== idx),
                              })
                            }
                            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition shadow-md cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Blueprint & Layout Plan */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                    <label className="block text-xs font-bold text-neutral-800">
                      Site Layout / Survey Blueprint Map Image
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {formData.blueprint && (
                        <div className="relative w-36 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-neutral-300">
                          <Image src={formData.blueprint} alt="Blueprint" fill className="object-contain" />
                        </div>
                      )}
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          value={formData.blueprint || ""}
                          onChange={(e) => setFormData({ ...formData, blueprint: e.target.value })}
                          placeholder="/images/projects/flat-projects/surya-nagar-villa-plan.png"
                          className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono"
                        />
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-bold hover:bg-black transition cursor-pointer shadow-xs">
                          <Upload className="h-3.5 w-3.5 text-[#E5A922]" />
                          <span>Upload Layout Blueprint</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (url) => setFormData({ ...formData, blueprint: url }))}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Project Videos */}
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-neutral-900">Project Drone & Site Videos (URLs)</h5>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            videoUrls: [...(formData.videoUrls || []), ""],
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Video URL</span>
                      </button>
                    </div>

                    {(formData.videoUrls || []).map((v, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Film className="h-4 w-4 text-neutral-400 shrink-0" />
                        <input
                          type="text"
                          value={v}
                          onChange={(e) => {
                            const updated = [...(formData.videoUrls || [])];
                            updated[idx] = e.target.value;
                            setFormData({ ...formData, videoUrls: updated });
                          }}
                          placeholder="https://www.youtube.com/watch?v=... or /videos/project.mp4"
                          className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.videoUrls?.filter((_, i) => i !== idx);
                            setFormData({ ...formData, videoUrls: updated });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: OVERVIEW & SPECIFICATIONS */}
              {activeTab === "overview" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-neutral-100 pb-2">
                    <h4 className="text-sm font-black text-[#052617]">Section 3: Overview & Specifications</h4>
                    <p className="text-xs text-neutral-500">Configuration, built-up area, facing, property price and full overview.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Configuration
                      </label>
                      <input
                        type="text"
                        value={formData.overviewSpecs?.configuration?.en || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            overviewSpecs: {
                              ...formData.overviewSpecs,
                              configuration: { en: e.target.value, ta: formData.overviewSpecs?.configuration?.ta || e.target.value },
                            },
                          })
                        }
                        placeholder="e.g. 3 BHK Duplex / Plots"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Built-up Area
                      </label>
                      <input
                        type="text"
                        value={formData.overviewSpecs?.builtUpArea || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            overviewSpecs: { ...formData.overviewSpecs, builtUpArea: e.target.value },
                          })
                        }
                        placeholder="e.g. 2,750 Sq.Ft"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Land Area
                      </label>
                      <input
                        type="text"
                        value={formData.overviewSpecs?.landArea || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            overviewSpecs: { ...formData.overviewSpecs, landArea: e.target.value },
                          })
                        }
                        placeholder="e.g. 4.12 Cents"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Facing Direction
                      </label>
                      <input
                        type="text"
                        value={formData.overviewSpecs?.facing?.en || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            overviewSpecs: {
                              ...formData.overviewSpecs,
                              facing: { en: e.target.value, ta: formData.overviewSpecs?.facing?.ta || e.target.value },
                            },
                          })
                        }
                        placeholder="e.g. East Facing"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Property Price
                      </label>
                      <input
                        type="text"
                        value={formData.overviewSpecs?.price || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            overviewSpecs: { ...formData.overviewSpecs, price: e.target.value },
                          })
                        }
                        placeholder="e.g. ₹1.67 Cr"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-[#B45309]"
                      />
                    </div>

                    <div className="flex items-center pt-6">
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.overviewSpecs?.isPriceNegotiable ?? true}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              overviewSpecs: { ...formData.overviewSpecs, isPriceNegotiable: e.target.checked },
                            })
                          }
                          className="h-4 w-4 rounded text-[#052617] border-neutral-300"
                        />
                        <span className="text-xs font-bold text-neutral-800">Price Negotiable Badge</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                      Full Project Overview Narrative (English)
                    </label>
                    <textarea
                      rows={5}
                      value={formData.fullOverview?.en || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullOverview: { en: e.target.value, ta: formData.fullOverview?.ta || e.target.value },
                        })
                      }
                      placeholder="Comprehensive overview detailing architectural highlights, room dimensions, security, and tenure..."
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: KEY HIGHLIGHTS */}
              {activeTab === "highlights" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div>
                      <h4 className="text-sm font-black text-[#052617]">Section 4: Key Highlights</h4>
                      <p className="text-xs text-neutral-500">Dynamic bullet points with optional titles, descriptions and icons.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const current = formData.highlights?.en || [];
                        setFormData({
                          ...formData,
                          highlights: {
                            en: [...current, ""],
                            ta: [...(formData.highlights?.ta || []), ""],
                          },
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#052617] text-white text-xs font-bold cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Highlight</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.highlights?.en || []).map((h, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-start gap-3">
                        <span className="font-mono text-xs font-bold text-[#E5A922] bg-[#052617] w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-1">
                          0{idx + 1}
                        </span>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={h}
                            onChange={(e) => {
                              const updatedEn = [...(formData.highlights?.en || [])];
                              updatedEn[idx] = e.target.value;
                              setFormData({
                                ...formData,
                                highlights: { ...formData.highlights, en: updatedEn },
                              });
                            }}
                            placeholder="Highlight in English"
                            className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium bg-white"
                          />
                          <input
                            type="text"
                            value={formData.highlights?.ta?.[idx] || ""}
                            onChange={(e) => {
                              const updatedTa = [...(formData.highlights?.ta || [])];
                              updatedTa[idx] = e.target.value;
                              setFormData({
                                ...formData,
                                highlights: { ...formData.highlights, ta: updatedTa },
                              });
                            }}
                            placeholder="சிறப்பம்சம் (தமிழ்)"
                            className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedEn = formData.highlights?.en?.filter((_, i) => i !== idx) || [];
                            const updatedTa = formData.highlights?.ta?.filter((_, i) => i !== idx) || [];
                            setFormData({
                              ...formData,
                              highlights: { en: updatedEn, ta: updatedTa },
                            });
                          }}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: LOCALITY & INFRASTRUCTURE */}
              {activeTab === "locality" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-neutral-100 pb-2">
                    <h4 className="text-sm font-black text-[#052617]">Section 5: Locality & Infrastructure</h4>
                    <p className="text-xs text-neutral-500">
                      Nearby transportation, hospitals, and educational institutions with distances and travel times.
                    </p>
                  </div>

                  {/* A. Transportation */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-[#B45309]" />
                        <h5 className="text-xs font-bold text-neutral-900 uppercase">A. Transportation & Connectivity</h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const list = formData.extendedDetails?.transportation || [];
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              transportation: [...list, { name: { en: "", ta: "" }, distance: "1.0 km", time: "3 mins" }],
                            },
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-xs font-bold cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Transit</span>
                      </button>
                    </div>

                    {(formData.extendedDetails?.transportation || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-neutral-200">
                        <input
                          type="text"
                          value={item.name.en}
                          onChange={(e) => {
                            const list = [...(formData.extendedDetails?.transportation || [])];
                            list[idx].name.en = e.target.value;
                            list[idx].name.ta = list[idx].name.ta || e.target.value;
                            setFormData({
                              ...formData,
                              extendedDetails: { ...formData.extendedDetails, transportation: list },
                            });
                          }}
                          placeholder="Station or Road Name"
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs"
                        />
                        <input
                          type="text"
                          value={item.distance}
                          onChange={(e) => {
                            const list = [...(formData.extendedDetails?.transportation || [])];
                            list[idx].distance = e.target.value;
                            setFormData({
                              ...formData,
                              extendedDetails: { ...formData.extendedDetails, transportation: list },
                            });
                          }}
                          placeholder="Distance (e.g. 2.5 km)"
                          className="w-24 px-2 py-1.5 rounded-lg border border-neutral-300 text-xs"
                        />
                        <input
                          type="text"
                          value={item.time || ""}
                          onChange={(e) => {
                            const list = [...(formData.extendedDetails?.transportation || [])];
                            list[idx].time = e.target.value;
                            setFormData({
                              ...formData,
                              extendedDetails: { ...formData.extendedDetails, transportation: list },
                            });
                          }}
                          placeholder="Time (e.g. 5 mins)"
                          className="w-24 px-2 py-1.5 rounded-lg border border-neutral-300 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const list = formData.extendedDetails?.transportation?.filter((_, i) => i !== idx);
                            setFormData({
                              ...formData,
                              extendedDetails: { ...formData.extendedDetails, transportation: list },
                            });
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* B. Hospitals */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HeartPulse className="h-4 w-4 text-rose-600" />
                        <h5 className="text-xs font-bold text-neutral-900 uppercase">B. Hospitals & Healthcare</h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const list = formData.extendedDetails?.hospitals || [];
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              hospitals: [...list, { name: { en: "", ta: "" }, distance: "3.0 km" }],
                            },
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-xs font-bold cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Hospital</span>
                      </button>
                    </div>

                    {(formData.extendedDetails?.hospitals || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-neutral-200">
                        <input
                          type="text"
                          value={item.name.en}
                          onChange={(e) => {
                            const list = [...(formData.extendedDetails?.hospitals || [])];
                            list[idx].name.en = e.target.value;
                            list[idx].name.ta = list[idx].name.ta || e.target.value;
                            setFormData({
                              ...formData,
                              extendedDetails: { ...formData.extendedDetails, hospitals: list },
                            });
                          }}
                          placeholder="Hospital Name"
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs"
                        />
                        <input
                          type="text"
                          value={item.distance}
                          onChange={(e) => {
                            const list = [...(formData.extendedDetails?.hospitals || [])];
                            list[idx].distance = e.target.value;
                            setFormData({
                              ...formData,
                              extendedDetails: { ...formData.extendedDetails, hospitals: list },
                            });
                          }}
                          placeholder="Distance (e.g. 3.2 km)"
                          className="w-28 px-2 py-1.5 rounded-lg border border-neutral-300 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const list = formData.extendedDetails?.hospitals?.filter((_, i) => i !== idx);
                            setFormData({
                              ...formData,
                              extendedDetails: { ...formData.extendedDetails, hospitals: list },
                            });
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* C. Schools & Colleges */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <h5 className="text-xs font-bold text-neutral-900 uppercase">C. Schools & Colleges</h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const list = formData.extendedDetails?.schoolsAndColleges || [];
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              schoolsAndColleges: [...list, { name: { en: "", ta: "" }, distance: "2.0 km" }],
                            },
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-xs font-bold cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add School/College</span>
                      </button>
                    </div>

                    {(formData.extendedDetails?.schoolsAndColleges || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-neutral-200">
                        <input
                          type="text"
                          value={item.name.en}
                          onChange={(e) => {
                            const list = [...(formData.extendedDetails?.schoolsAndColleges || [])];
                            list[idx].name.en = e.target.value;
                            list[idx].name.ta = list[idx].name.ta || e.target.value;
                            setFormData({
                              ...formData,
                              extendedDetails: { ...formData.extendedDetails, schoolsAndColleges: list },
                            });
                          }}
                          placeholder="Institution Name"
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs"
                        />
                        <input
                          type="text"
                          value={item.distance}
                          onChange={(e) => {
                            const list = [...(formData.extendedDetails?.schoolsAndColleges || [])];
                            list[idx].distance = e.target.value;
                            setFormData({
                              ...formData,
                              extendedDetails: { ...formData.extendedDetails, schoolsAndColleges: list },
                            });
                          }}
                          placeholder="Distance (e.g. 2.0 km)"
                          className="w-28 px-2 py-1.5 rounded-lg border border-neutral-300 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const list = formData.extendedDetails?.schoolsAndColleges?.filter((_, i) => i !== idx);
                            setFormData({
                              ...formData,
                              extendedDetails: { ...formData.extendedDetails, schoolsAndColleges: list },
                            });
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: GROUNDWATER FACILITY */}
              {activeTab === "groundwater" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-neutral-100 pb-2">
                    <h4 className="text-sm font-black text-[#052617]">Section 6: Groundwater Facility & Potable Table</h4>
                    <p className="text-xs text-neutral-500">Water depth, tested potable quality, TDS and source details.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                      Water Table Depth
                    </label>
                    <input
                      type="text"
                      value={formData.extendedDetails?.groundwater?.depth?.en || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          extendedDetails: {
                            ...formData.extendedDetails,
                            groundwater: {
                              ...formData.extendedDetails?.groundwater,
                              depth: { en: e.target.value, ta: formData.extendedDetails?.groundwater?.depth?.ta || e.target.value },
                            },
                          },
                        })
                      }
                      placeholder="e.g. 35 – 40 ft Sweet Potable Aquifer"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                      Tested Water Quality
                    </label>
                    <input
                      type="text"
                      value={formData.extendedDetails?.groundwater?.quality?.en || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          extendedDetails: {
                            ...formData.extendedDetails,
                            groundwater: {
                              ...formData.extendedDetails?.groundwater,
                              quality: { en: e.target.value, ta: formData.extendedDetails?.groundwater?.quality?.ta || e.target.value },
                            },
                          },
                        })
                      }
                      placeholder="e.g. 100% Tested Sweet Drinking Water (TDS < 190, Zero Hardness)"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-emerald-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        TDS Value
                      </label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.groundwater?.tdsValue || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              groundwater: {
                                ...formData.extendedDetails?.groundwater,
                                tdsValue: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="e.g. TDS < 190 ppm"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Water Hardness
                      </label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.groundwater?.waterHardness || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              groundwater: {
                                ...formData.extendedDetails?.groundwater,
                                waterHardness: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="e.g. Zero Hardness / Natural Potable"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                      Water Source
                    </label>
                    <input
                      type="text"
                      value={formData.extendedDetails?.groundwater?.source?.en || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          extendedDetails: {
                            ...formData.extendedDetails,
                            groundwater: {
                              ...formData.extendedDetails?.groundwater,
                              source: { en: e.target.value, ta: formData.extendedDetails?.groundwater?.source?.ta || e.target.value },
                            },
                          },
                        })
                      }
                      placeholder="e.g. Dedicated High-Yield Deep Borewell + Underground Sump"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium"
                    />
                  </div>
                </div>
              )}

              {/* TAB 7: COMMUNITY ENVIRONMENT */}
              {activeTab === "community" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-neutral-100 pb-2">
                    <h4 className="text-sm font-black text-[#052617]">Section 7: Neighbour Houses & Community Environment</h4>
                    <p className="text-xs text-neutral-500">Density, surrounding dwellings, road conditions, and security.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Community Density
                      </label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.neighborhood?.density?.en || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              neighborhood: {
                                ...formData.extendedDetails?.neighborhood,
                                density: { en: e.target.value, ta: formData.extendedDetails?.neighborhood?.density?.ta || e.target.value },
                              },
                            },
                          })
                        }
                        placeholder="e.g. Elite Residential Enclave"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Surrounding Dwellings
                      </label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.neighborhood?.surrounding?.en || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              neighborhood: {
                                ...formData.extendedDetails?.neighborhood,
                                surrounding: { en: e.target.value, ta: formData.extendedDetails?.neighborhood?.surrounding?.ta || e.target.value },
                              },
                            },
                          })
                        }
                        placeholder="e.g. Independent Luxury Villas"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Atmosphere & Security
                      </label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.neighborhood?.atmosphere?.en || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              neighborhood: {
                                ...formData.extendedDetails?.neighborhood,
                                atmosphere: { en: e.target.value, ta: formData.extendedDetails?.neighborhood?.atmosphere?.ta || e.target.value },
                              },
                            },
                          })
                        }
                        placeholder="e.g. Peaceful, Gated, 24/7 Security"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Road Conditions
                      </label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.neighborhood?.roadConditions?.en || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              neighborhood: {
                                ...formData.extendedDetails?.neighborhood,
                                roadConditions: { en: e.target.value, ta: formData.extendedDetails?.neighborhood?.roadConditions?.ta || e.target.value },
                              },
                            },
                          })
                        }
                        placeholder="e.g. 30 & 40 Ft Bitumen Roads"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Drainage Information
                      </label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.neighborhood?.drainage?.en || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              neighborhood: {
                                ...formData.extendedDetails?.neighborhood,
                                drainage: { en: e.target.value, ta: formData.extendedDetails?.neighborhood?.drainage?.ta || e.target.value },
                              },
                            },
                          })
                        }
                        placeholder="e.g. Storm Water Drainage Network"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: GROUND VALUE & ROI */}
              {activeTab === "valuation" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-neutral-100 pb-2">
                    <h4 className="text-sm font-black text-[#052617]">Section 8: Ground Value & Future Predicted ROI</h4>
                    <p className="text-xs text-neutral-500">Market rates, guideline values, and predicted capital appreciation.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Current Market Rate
                      </label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.groundValue?.currentRate?.en || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              groundValue: {
                                ...formData.extendedDetails?.groundValue,
                                currentRate: { en: e.target.value, ta: formData.extendedDetails?.groundValue?.currentRate?.ta || e.target.value },
                              },
                            },
                          })
                        }
                        placeholder="e.g. ₹1.67 Cr (₹6,072 / Sq.Ft)"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-black text-[#052617]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Government Guideline Value
                      </label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.groundValue?.guidelineValue?.en || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              groundValue: {
                                ...formData.extendedDetails?.groundValue,
                                guidelineValue: { en: e.target.value, ta: formData.extendedDetails?.groundValue?.guidelineValue?.ta || e.target.value },
                              },
                            },
                          })
                        }
                        placeholder="e.g. 4.12 Cents DTCP Approved Land Extent"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        3-Year Projected ROI
                      </label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.groundValue?.threeYearROI || "+35% Projected Appreciation"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              groundValue: {
                                ...formData.extendedDetails?.groundValue,
                                threeYearROI: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        5-Year Projected ROI
                      </label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.groundValue?.fiveYearROI || "+65% Capital Growth"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: {
                              ...formData.extendedDetails,
                              groundValue: {
                                ...formData.extendedDetails?.groundValue,
                                fiveYearROI: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-emerald-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: CUSTOMER REVIEWS */}
              {activeTab === "reviews" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div>
                      <h4 className="text-sm font-black text-[#052617]">Section 9: Customer Reviews & Satisfaction</h4>
                      <p className="text-xs text-neutral-500">Verified buyer testimonials, ratings, and satisfaction stats.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const list = formData.extendedDetails?.customerReviews || [];
                        setFormData({
                          ...formData,
                          extendedDetails: {
                            ...formData.extendedDetails,
                            customerReviews: [
                              ...list,
                              {
                                name: "Anand Kumar",
                                role: { en: "Verified Villa Buyer", ta: "வாடிக்கையாளர்" },
                                rating: 5,
                                date: "November 2026",
                                comment: { en: "Excellent transparency and clean documentation.", ta: "சிறந்த தரம் மற்றும் தெளிவான பட்டா ஆவணங்கள்." },
                                isVerifiedBuyer: true,
                              },
                            ],
                          },
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#052617] text-white text-xs font-bold cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Review</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase">Overall Rating</label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.overallRating || "4.9"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: { ...formData.extendedDetails, overallRating: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase">Client Approval</label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.clientApprovalRate || "98.6%"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: { ...formData.extendedDetails, clientApprovalRate: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase">Happy Families</label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.happyFamiliesCount || "1,200+"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: { ...formData.extendedDetails, happyFamiliesCount: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-neutral-600 uppercase">Years of Trust</label>
                      <input
                        type="text"
                        value={formData.extendedDetails?.yearsOfTrust || "16+ Yrs"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            extendedDetails: { ...formData.extendedDetails, yearsOfTrust: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {(formData.extendedDetails?.customerReviews || []).map((rev, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                            <input
                              type="text"
                              value={rev.name}
                              onChange={(e) => {
                                const list = [...(formData.extendedDetails?.customerReviews || [])];
                                list[idx].name = e.target.value;
                                setFormData({
                                  ...formData,
                                  extendedDetails: { ...formData.extendedDetails, customerReviews: list },
                                });
                              }}
                              placeholder="Reviewer Name"
                              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={rev.role?.en || ""}
                              onChange={(e) => {
                                const list = [...(formData.extendedDetails?.customerReviews || [])];
                                list[idx].role = { en: e.target.value, ta: list[idx].role?.ta || e.target.value };
                                setFormData({
                                  ...formData,
                                  extendedDetails: { ...formData.extendedDetails, customerReviews: list },
                                });
                              }}
                              placeholder="Designation / Role"
                              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const list = formData.extendedDetails?.customerReviews?.filter((_, i) => i !== idx);
                              setFormData({
                                ...formData,
                                extendedDetails: { ...formData.extendedDetails, customerReviews: list },
                              });
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={rev.comment?.en || ""}
                          onChange={(e) => {
                            const list = [...(formData.extendedDetails?.customerReviews || [])];
                            list[idx].comment = { en: e.target.value, ta: list[idx].comment?.ta || e.target.value };
                            setFormData({
                              ...formData,
                              extendedDetails: { ...formData.extendedDetails, customerReviews: list },
                            });
                          }}
                          placeholder="Review text..."
                          className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 10: LOCATION MAP & CONTACT */}
              {activeTab === "map_contact" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-neutral-100 pb-2">
                    <h4 className="text-sm font-black text-[#052617]">Section 10: Location Map & Contact Coordinates</h4>
                    <p className="text-xs text-neutral-500">Google Maps link, coordinates, pinpoint verification and direct advisors.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                      Google Maps URL
                    </label>
                    <input
                      type="text"
                      value={formData.locationMap?.googleMapsUrl || formData.mapsUrl || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mapsUrl: e.target.value,
                          locationMap: { ...formData.locationMap, googleMapsUrl: e.target.value },
                        })
                      }
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="text"
                        value={formData.locationMap?.latitude || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            locationMap: { ...formData.locationMap, latitude: e.target.value },
                          })
                        }
                        placeholder="e.g. 9.9512"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="text"
                        value={formData.locationMap?.longitude || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            locationMap: { ...formData.locationMap, longitude: e.target.value },
                          })
                        }
                        placeholder="e.g. 78.1489"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        Advisor Contact Phone
                      </label>
                      <input
                        type="text"
                        value={formData.contactInfo?.advisorPhone || "+91 78457 16453"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, advisorPhone: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-[#052617]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                        General Enquiry Phone
                      </label>
                      <input
                        type="text"
                        value={formData.contactInfo?.enquiryPhone || "+91 77089 66452"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, enquiryPhone: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.locationMap?.isVerifiedPinpoint ?? true}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            locationMap: { ...formData.locationMap, isVerifiedPinpoint: e.target.checked },
                          })
                        }
                        className="h-4 w-4 rounded text-[#052617] border-neutral-300"
                      />
                      <span className="text-xs font-bold text-neutral-800">
                        Display &ldquo;100% Verified Pinpoint Location&rdquo; Badge on Public Page
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL FOOTER BAR: DELETE, CANCEL, DRAFT, PUBLISH */}
        <div className="bg-neutral-50 px-5 py-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            {onDelete && initialProject && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-red-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Project</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-200/50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#052617] hover:bg-[#0E5934] text-[#E5A922] text-xs font-black transition cursor-pointer shadow-md flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>{isSubmitting ? "Publishing..." : "Publish Project"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h4 className="text-base font-black">Confirm Permanent Deletion</h4>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>{formData.name.en}</strong>? All associated media files and records will be cleaned up from the server.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (onDelete && initialProject) {
                    await onDelete(initialProject.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
