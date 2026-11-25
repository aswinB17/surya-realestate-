"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCmsData, broadcastCmsUpdate } from "@/hooks/useCmsData";
import ProjectManagementModal from "./ProjectManagementModal";
import {
  CmsProject,
  CmsCategory,
  CmsSubcategory,
  CmsImageFolder,
  CmsVideoFolder,
  CmsDownloadItem,
  CmsCompany,
  CmsHeroAndBanners,
  CmsStatItem,
  CmsServiceItem,
} from "@/types/cms";
import {
  ShieldCheck,
  Building2,
  FolderOpen,
  Download,
  Info,
  MapPin,
  Lock,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  Upload,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  Home,
  Save,
  Check,
  X,
  Sparkles,
  Camera,
  Layers,
  Settings,
  HelpCircle,
  RotateCcw,
  Sliders,
  Factory,
  Warehouse,
  Briefcase,
  Landmark,
  TreePine,
  Tag,
  FolderPlus,
} from "lucide-react";

export default function AdminDashboardClient() {
  const { data: cmsData, refresh, updateOptimistic } = useCmsData();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    "projects" | "categories" | "gallery" | "downloads" | "company" | "hero" | "stats" | "services"
  >("projects");

  // Status & Notification Toasts
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(
    null
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Search & Filter State
  const [projectSearch, setProjectSearch] = useState<string>("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<string>("all");

  // Category & Subcategory Management State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CmsCategory | null>(null);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState<boolean>(false);
  const [editingSubcategory, setEditingSubcategory] = useState<CmsSubcategory | null>(null);
  const [categoryFilterTab, setCategoryFilterTab] = useState<string>("all");
  const [categorySearch, setCategorySearch] = useState<string>("");
  const [subcategorySearch, setSubcategorySearch] = useState<string>("");

  // Project Edit / Add Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<CmsProject | null>(null);
  const [projectModalTab, setProjectModalTab] = useState<"general" | "media" | "highlights" | "specs">("general");

  // Download Add Modal State
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [newDownload, setNewDownload] = useState<Partial<CmsDownloadItem>>({
    title: { en: "", ta: "" },
    category: { en: "Layout Map", ta: "வரைபடம்" },
    fileType: "PDF / Layout",
    fileSize: "1.0 MB",
    downloadUrl: "",
    badge: "Official Plan",
  });

  // Uploading state
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Check initial authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          // Check if previously logged in via localStorage as backup
          const cachedPin = localStorage.getItem("surya_admin_cached_pin");
          if (cachedPin === "surya2010" || cachedPin === "admin123") {
            const loginRes = await fetch("/api/admin/auth", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ pin: cachedPin }),
            });
            if (loginRes.ok) setIsAuthenticated(true);
          }
        }
      } catch (e) {
        console.warn("Auth check error:", e);
      } finally {
        setIsCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // -------------------------------------------------------------------------
  // Authentication Handlers
  // -------------------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: passwordInput }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setIsAuthenticated(true);
        localStorage.setItem("surya_admin_cached_pin", passwordInput);
        showToast("Welcome to Surya Promoters CMS Admin Portal!");
      } else {
        setAuthError(json.error || "Invalid Admin PIN. (Default: surya2010)");
      }
    } catch (err: any) {
      setAuthError("Network error logging in. Please try again.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    localStorage.removeItem("surya_admin_cached_pin");
    setIsAuthenticated(false);
    showToast("Signed out of admin portal.", "info");
  };

  // -------------------------------------------------------------------------
  // Save Section or Full Content to Server
  // -------------------------------------------------------------------------
  const saveSection = async (section: string, data: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": localStorage.getItem("surya_admin_cached_pin") || "surya2010",
        },
        body: JSON.stringify({ section, data }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        updateOptimistic((prev) => ({
          ...prev,
          [section]: data,
          lastUpdated: new Date().toISOString(),
        }));
        showToast(`Saved & Published ${section} to Live Site!`, "success");
        broadcastCmsUpdate();
        await refresh();
      } else {
        showToast(json.error || "Failed to save changes", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to reach server", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // File Upload Helper
  // -------------------------------------------------------------------------
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onComplete: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-admin-pin": localStorage.getItem("surya_admin_cached_pin") || "surya2010",
        },
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success && json.url) {
        onComplete(json.url);
        showToast(`Uploaded file: ${file.name}`);
      } else {
        showToast(json.error || "Upload failed", "error");
      }
    } catch (err: any) {
      showToast("File upload failed: " + err.message, "error");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // -------------------------------------------------------------------------
  // Project Management Actions
  // -------------------------------------------------------------------------
  const handleToggleProjectStatus = async (id: string) => {
    const nextList = cmsData.projects.map((p) => {
      if (p.id === id) {
        const nextStatus =
          p.status === "running"
            ? "upcoming"
            : p.status === "upcoming"
            ? "completed"
            : p.status === "completed"
            ? "sold"
            : "running";
        return { ...p, status: nextStatus as any };
      }
      return p;
    });

    await saveSection("projects", nextList);
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${name}"?\n\nThis will permanently remove the project and delete all associated photos, blueprints, and files from the server disk.`
      )
    ) {
      setIsSaving(true);
      try {
        const res = await fetch("/api/admin/projects/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-pin": localStorage.getItem("surya_admin_cached_pin") || "surya2010",
          },
          body: JSON.stringify({ id }),
        });

        const json = await res.json();
        if (res.ok && json.success) {
          const fileCount = json.deletedFiles?.length || 0;
          showToast(
            `Deleted "${name}" and cleaned up ${fileCount} file(s) from server disk!`,
            "success"
          );
          broadcastCmsUpdate();
          await refresh();
        } else {
          showToast(json.error || "Failed to delete project", "error");
        }
      } catch (err: any) {
        showToast(err.message || "Failed to delete project", "error");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleOpenAddProject = () => {
    const firstCat = cmsData.categories?.[0] || { id: "residential", name: { en: "Residential", ta: "குடியிருப்பு" } };
    const matchingSubs = (cmsData.subcategories || []).filter((s) => s.categoryId === firstCat.id);
    const firstSub = matchingSubs[0] || { id: "plot", name: { en: "Villa Plot", ta: "வீட்டுமனை" } };

    const emptyProj: CmsProject = {
      id: `project-${Date.now()}`,
      slug: `project-${Date.now()}`,
      name: { en: "New Land Project", ta: "புதிய நிலத் திட்டம்" },
      category: firstCat.id,
      categoryLabel: firstCat.name,
      subcategory: firstSub.id,
      subcategoryLabel: firstSub.name,
      location: { en: "Madurai, Tamil Nadu", ta: "மதுரை, தமிழ்நாடு" },
      distanceInfo: { en: "Prime Corridor · Clear Titles", ta: "முதன்மை வழித்தடம் · தெளிவான பட்டா" },
      image: "/images/hero-poster.jpg",
      galleryImages: ["/images/hero-poster.jpg"],
      statusBadge: { en: "Available for Registration", ta: "விற்பனைக்கு உள்ளது" },
      rating: "5.0",
      status: "running",
      description: {
        en: "Prime property opportunity developed with verified legal titles and immediate connectivity.",
        ta: "100% தெளிவான பட்டா மற்றும் உடனடி இணைப்புடன் கூடிய சிறந்த நில வாய்ப்பு.",
      },
      highlights: {
        en: ["100% Computer Patta Guarantee", "Direct road frontage", "High capital appreciation"],
        ta: ["100% கணினி பட்டா உத்தரவாதம்", "நேரடி சாலை முகப்பு", "அதிவேக மூலதன வளர்ச்சி"],
      },
      mapsUrl: "https://maps.google.com/?q=Madurai",
      specs: [
        { label: { en: "Land Size", ta: "நில அளவு" }, value: { en: "As per plan", ta: "வரைபடப்படி" } },
        { label: { en: "Title Status", ta: "உரிமம்" }, value: { en: "Clear Patta", ta: "தெளிவான பட்டா" } },
      ],
    };
    setEditingProject(emptyProj);
    setProjectModalTab("general");
    setIsProjectModalOpen(true);
  };

  const handleSaveProjectFromModal = async (project: CmsProject, isPublish: boolean) => {
    const updatedProj: CmsProject = {
      ...project,
      status: isPublish ? "running" : "draft",
    };

    let updatedProjects: CmsProject[];
    const exists = cmsData.projects.some((p) => p.id === updatedProj.id);

    if (exists) {
      updatedProjects = cmsData.projects.map((p) => (p.id === updatedProj.id ? updatedProj : p));
    } else {
      updatedProjects = [updatedProj, ...cmsData.projects];
    }

    await saveSection("projects", updatedProjects);
    showToast(
      isPublish
        ? `Published "${updatedProj.name.en}" successfully!`
        : `Saved "${updatedProj.name.en}" as draft!`,
      "success"
    );
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProjectFromModal = async (projectId: string) => {
    const proj = cmsData.projects.find((p) => p.id === projectId);
    if (proj) {
      await handleDeleteProject(proj.id, proj.name.en);
      setIsProjectModalOpen(false);
      setEditingProject(null);
    }
  };

  // -------------------------------------------------------------------------
  // Category & Subcategory Actions
  // -------------------------------------------------------------------------
  const handleOpenAddCategory = (cat?: CmsCategory) => {
    if (cat) {
      setEditingCategory({ ...cat });
    } else {
      setEditingCategory({
        id: "",
        name: { en: "", ta: "" },
        description: { en: "", ta: "" },
        icon: "Building2",
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    if (!editingCategory.name?.en?.trim() || !editingCategory.name?.ta?.trim()) {
      showToast("Please provide both English and Tamil names for the category", "error");
      return;
    }

    let catId = (editingCategory.id || "").trim().toLowerCase();
    if (!catId) {
      catId = editingCategory.name.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    const finalCategory: CmsCategory = {
      ...editingCategory,
      id: catId,
      description: editingCategory.description || { en: "", ta: "" },
      icon: editingCategory.icon || "Building2",
    };

    const currentList = cmsData.categories || [];
    const exists = currentList.some((c) => c.id === finalCategory.id);
    let updatedCategories: CmsCategory[];
    if (exists) {
      updatedCategories = currentList.map((c) => (c.id === finalCategory.id ? finalCategory : c));
    } else {
      updatedCategories = [...currentList, finalCategory];
    }

    await saveSection("categories", updatedCategories);

    // If currently editing a project in modal, auto-update its category
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        category: finalCategory.id,
        categoryLabel: finalCategory.name,
      });
    }

    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    showToast(`Category "${finalCategory.name.en}" saved successfully!`);
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    const projectCount = (cmsData.projects || []).filter((p) => p.category === catId).length;
    const subCount = (cmsData.subcategories || []).filter((s) => s.categoryId === catId).length;

    let warning = `Are you sure you want to delete category "${catName}"?`;
    if (projectCount > 0) {
      warning += `\n\nNotice: ${projectCount} project(s) are currently tagged under this category.`;
    }
    if (subCount > 0) {
      warning += `\n${subCount} subcategory(s) belong to this category.`;
    }

    if (confirm(warning)) {
      const nextCategories = (cmsData.categories || []).filter((c) => c.id !== catId);
      await saveSection("categories", nextCategories);
      showToast(`Deleted category "${catName}".`);
    }
  };

  const handleOpenAddSubcategory = (sub?: CmsSubcategory, defaultCatId?: string) => {
    if (sub) {
      setEditingSubcategory({ ...sub });
    } else {
      const parentId = defaultCatId || (cmsData.categories?.[0]?.id || "residential");
      setEditingSubcategory({
        id: "",
        categoryId: parentId,
        name: { en: "", ta: "" },
      });
    }
    setIsSubcategoryModalOpen(true);
  };

  const handleSaveSubcategory = async () => {
    if (!editingSubcategory) return;
    if (!editingSubcategory.name?.en?.trim() || !editingSubcategory.name?.ta?.trim()) {
      showToast("Please provide both English and Tamil names for the subcategory", "error");
      return;
    }
    if (!editingSubcategory.categoryId) {
      showToast("Please select a parent category", "error");
      return;
    }

    let subId = (editingSubcategory.id || "").trim().toLowerCase();
    if (!subId) {
      subId = editingSubcategory.name.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    const finalSub: CmsSubcategory = {
      ...editingSubcategory,
      id: subId,
    };

    const currentList = cmsData.subcategories || [];
    const exists = currentList.some((s) => s.id === finalSub.id);
    let updatedSubs: CmsSubcategory[];
    if (exists) {
      updatedSubs = currentList.map((s) => (s.id === finalSub.id ? finalSub : s));
    } else {
      updatedSubs = [...currentList, finalSub];
    }

    await saveSection("subcategories", updatedSubs);

    // If currently editing a project in modal and parent matches, auto-assign
    if (editingProject && editingProject.category === finalSub.categoryId) {
      setEditingProject({
        ...editingProject,
        subcategory: finalSub.id,
        subcategoryLabel: finalSub.name,
      });
    }

    setIsSubcategoryModalOpen(false);
    setEditingSubcategory(null);
    showToast(`Subcategory "${finalSub.name.en}" saved successfully!`);
  };

  const handleDeleteSubcategory = async (subId: string, subName: string) => {
    const projectCount = (cmsData.projects || []).filter((p) => p.subcategory === subId).length;
    let warning = `Are you sure you want to delete subcategory "${subName}"?`;
    if (projectCount > 0) {
      warning += `\n\nNotice: ${projectCount} project(s) currently use this subcategory.`;
    }

    if (confirm(warning)) {
      const nextSubs = (cmsData.subcategories || []).filter((s) => s.id !== subId);
      await saveSection("subcategories", nextSubs);
      showToast(`Deleted subcategory "${subName}".`);
    }
  };

  const getCategoryIconComponent = (iconName?: string) => {
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
        return TreePine;
      case "factory":
        return Factory;
      case "warehouse":
        return Warehouse;
      case "briefcase":
        return Briefcase;
      case "landmark":
        return Landmark;
      case "sparkles":
        return Sparkles;
      default:
        return FolderOpen;
    }
  };

  // -------------------------------------------------------------------------
  // Download Management Actions
  // -------------------------------------------------------------------------
  const handleSaveNewDownload = async () => {
    if (!newDownload.title?.en || !newDownload.downloadUrl) {
      alert("Please enter a title and file URL or upload a file.");
      return;
    }

    const item: CmsDownloadItem = {
      id: `download-${Date.now()}`,
      title: { en: newDownload.title.en, ta: newDownload.title.ta || newDownload.title.en },
      category: { en: newDownload.category?.en || "General", ta: newDownload.category?.ta || "வரைபடம்" },
      fileType: newDownload.fileType || "PDF / Layout",
      fileSize: newDownload.fileSize || "1.0 MB",
      downloadUrl: newDownload.downloadUrl,
      badge: newDownload.badge || "Verified Asset",
    };

    const nextItems = [item, ...cmsData.downloads.items];
    await saveSection("downloads", { items: nextItems });
    setIsDownloadModalOpen(false);
    setNewDownload({
      title: { en: "", ta: "" },
      category: { en: "Layout Map", ta: "வரைபடம்" },
      fileType: "PDF / Layout",
      fileSize: "1.0 MB",
      downloadUrl: "",
      badge: "Official Plan",
    });
  };

  const handleDeleteDownload = async (id: string) => {
    if (confirm("Remove this download item from the public site?")) {
      const nextItems = cmsData.downloads.items.filter((d) => d.id !== id);
      await saveSection("downloads", { items: nextItems });
    }
  };

  // -------------------------------------------------------------------------
  // Factory Reset Action
  // -------------------------------------------------------------------------
  const handleFactoryReset = async () => {
    const confirmation = prompt(
      "CAUTION: This will reset all projects, media, and site content back to initial seeds. Type 'RESET' to confirm:"
    );
    if (confirmation === "RESET") {
      setIsSaving(true);
      try {
        const res = await fetch("/api/admin/reset", {
          method: "POST",
          headers: {
            "x-admin-pin": localStorage.getItem("surya_admin_cached_pin") || "surya2010",
          },
        });
        if (res.ok) {
          broadcastCmsUpdate();
          await refresh();
          showToast("Reset all site content to default factory values.", "info");
        }
      } catch (err: any) {
        showToast("Reset error: " + err.message, "error");
      } finally {
        setIsSaving(false);
      }
    }
  };

  // -------------------------------------------------------------------------
  // Filtered Projects for Table
  // -------------------------------------------------------------------------
  const filteredProjects = cmsData.projects.filter((p) => {
    const matchesCat = projectCategoryFilter === "all" || p.category === projectCategoryFilter;
    const matchesQuery =
      projectSearch.trim() === "" ||
      p.name.en.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.name.ta.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.location.en.toLowerCase().includes(projectSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // -------------------------------------------------------------------------
  // Unauthenticated Login Screen
  // -------------------------------------------------------------------------
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white shadow-md border border-neutral-200">
          <RefreshCw className="h-5 w-5 animate-spin text-[#B45309]" />
          <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-mono">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center p-6 text-[#F3F4F6]">
        <div className="max-w-md w-full bg-[#171B22] rounded-3xl p-8 shadow-2xl border border-neutral-700 space-y-6">
          <div className="text-center space-y-2">
            <div className="relative h-16 w-16 mx-auto rounded-2xl overflow-hidden border-2 border-[#EAB308] p-1 bg-white">
              <Image src="/images/surya-logo.png" alt="Surya Promoters Logo" fill className="object-contain" />
            </div>
            <h1 className="font-display text-2xl font-black text-white">Surya Promoters Admin CMS</h1>
            <p className="text-xs font-mono text-[#EAB308]">
              Authorized Administrative Control · Defense-Grade Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
                Admin Master PIN
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter PIN (Default: surya2010)"
                className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-black/40 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 rounded-xl bg-[#EAB308] hover:bg-[#CA8A04] text-[#0A0D12] font-mono font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmittingAuth ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition font-mono"
            >
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Authenticated Admin Dashboard Layout
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#0A0D12] flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {statusMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all animate-bounce ${
            statusMessage.type === "error"
              ? "bg-red-900 border-red-700 text-white"
              : statusMessage.type === "info"
              ? "bg-blue-900 border-blue-700 text-white"
              : "bg-emerald-900 border-emerald-700 text-emerald-100"
          }`}
        >
          {statusMessage.type === "error" ? (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0A0D12] text-white border-b border-neutral-800 shadow-md">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-xl bg-white p-1 shrink-0 overflow-hidden">
              <Image src="/images/surya-logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-white uppercase">Surya Promoters</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EAB308] text-[#0A0D12] text-[10px] font-black uppercase">
                  Live CMS
                </span>
              </div>
              <p className="text-[10px] font-mono text-neutral-400">
                Last Synced: {new Date(cmsData.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition"
            >
              <Eye className="h-3.5 w-3.5 text-[#EAB308]" />
              <span className="hidden sm:inline">Preview Live Site</span>
            </Link>

            <button
              onClick={handleFactoryReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-300 text-xs font-mono transition"
              title="Reset to Factory Defaults"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Reset Defaults</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Workspace */}
      <div className="flex-1 max-w-[1760px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0 space-y-1.5">
          <div className="p-3 bg-white rounded-2xl border border-neutral-200 shadow-xs mb-3">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Live Content Modules
            </p>
            <p className="text-xs text-neutral-700">All edits are stored permanently and published immediately.</p>
          </div>

          {[
            {
              id: "projects",
              label: "Projects & Real Estate",
              count: cmsData.projects.length,
              icon: Building2,
              color: "text-[#B45309]",
            },
            {
              id: "categories",
              label: "Categories & Types",
              count: (cmsData.categories?.length || 0) + (cmsData.subcategories?.length || 0),
              icon: FolderOpen,
              color: "text-amber-600",
            },
            {
              id: "gallery",
              label: "Gallery & Video Reels",
              count: cmsData.gallery.imageFolders.length + cmsData.gallery.videoFolders.length,
              icon: Camera,
              color: "text-purple-600",
            },
            {
              id: "downloads",
              label: "Download Blueprints",
              count: cmsData.downloads.items.length,
              icon: Download,
              color: "text-blue-600",
            },
            {
              id: "company",
              label: "Company & Founder",
              icon: ShieldCheck,
              color: "text-emerald-700",
            },
            {
              id: "hero",
              label: "Hero & Announcements",
              icon: Sparkles,
              color: "text-[#EAB308]",
            },
            {
              id: "stats",
              label: "Trust Statistics",
              count: cmsData.stats.items.length,
              icon: Layers,
              color: "text-amber-700",
            },
            {
              id: "services",
              label: "Services Offered",
              count: cmsData.services.items.length,
              icon: Sliders,
              color: "text-indigo-600",
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-xs transition-all cursor-pointer text-left ${
                  isActive
                    ? "bg-[#0A0D12] text-white shadow-md"
                    : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#EAB308]" : tab.color}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Panel */}
        <main className="flex-1 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm min-h-[600px]">
          {/* ================================================================= */}
          {/* TAB 1: PROJECTS & REAL ESTATE                                    */}
          {/* ================================================================= */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {/* Header and Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl font-black text-[#0A0D12] flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#B45309]" />
                    <span>Real Estate Projects ({cmsData.projects.length})</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Add, edit pricing, change images, upload blueprints, or change availability status.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("categories")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition cursor-pointer"
                  >
                    <FolderOpen className="h-4 w-4 text-amber-700" />
                    <span>Categories ({cmsData.categories?.length || 0})</span>
                  </button>
                  <button
                    onClick={handleOpenAddProject}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A0D12] hover:bg-[#B45309] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-[#EAB308]" />
                    <span>Add New Project</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search by title, Tamil title, location..."
                    className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: "all", label: "All" },
                    ...(cmsData.categories || []).map((cat) => ({
                      id: cat.id,
                      label: cat.name.en,
                    })),
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setProjectCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        projectCategoryFilter === cat.id
                          ? "bg-[#EAB308] text-[#0A0D12]"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects Grid / List */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
                  >
                    {/* Project Image */}
                    <div className="relative h-44 w-full bg-neutral-100">
                      <Image src={project.image} alt={project.name.en} fill className="object-cover" />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold uppercase tracking-wider">
                          {project.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            project.status === "running"
                              ? "bg-emerald-600 text-white"
                              : project.status === "upcoming"
                              ? "bg-amber-500 text-white"
                              : "bg-neutral-700 text-neutral-200"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-sm text-[#0A0D12] line-clamp-1">{project.name.en}</h3>
                        <p className="text-xs text-[#B45309] font-medium line-clamp-1 mt-0.5">{project.name.ta}</p>
                        <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{project.location.en}</span>
                        </p>
                        <div className="mt-2 text-xs font-black text-neutral-900 bg-amber-50 px-2 py-1 rounded-md inline-block">
                          {project.statusBadge.en}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                        {/* Status Toggle Button */}
                        <button
                          onClick={() => handleToggleProjectStatus(project.id)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-mono font-bold transition cursor-pointer"
                          title="Click to cycle status: running → upcoming → completed → sold"
                        >
                          Status: {project.status}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingProject({ ...project });
                              setProjectModalTab("general");
                              setIsProjectModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#EAB308] hover:text-[#0A0D12] text-neutral-700 transition cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id, project.name.en)}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-600 hover:text-white text-red-600 transition cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: CATEGORIES & SUBCATEGORIES                                  */}
          {/* ================================================================= */}
          {activeTab === "categories" && (
            <div className="space-y-8">
              {/* Header & Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl font-black text-[#0A0D12] flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-amber-600" />
                    <span>Categories & Subcategories ({cmsData.categories?.length || 0})</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Define primary real estate categories (Residential, Commercial, Farm Land, etc.) and specific property types.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAddCategory()}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0A0D12] hover:bg-[#B45309] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-[#EAB308]" />
                    <span>Add New Category</span>
                  </button>
                  <button
                    onClick={() => handleOpenAddSubcategory()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition cursor-pointer"
                  >
                    <FolderPlus className="h-4 w-4 text-amber-700" />
                    <span>Add Subcategory</span>
                  </button>
                </div>
              </div>

              {/* Statistics Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-700 block">Total Categories</span>
                    <span className="text-xl font-black text-amber-950">{cmsData.categories?.length || 0} Primary Divisions</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-700 block">Subcategories</span>
                    <span className="text-xl font-black text-blue-950">{cmsData.subcategories?.length || 0} Property Types</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 block">Catalog Projects</span>
                    <span className="text-xl font-black text-emerald-950">{cmsData.projects?.length || 0} Total Listings</span>
                  </div>
                </div>
              </div>

              {/* SECTION A: MAIN CATEGORIES */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-800">
                      Primary Categories ({cmsData.categories?.length || 0})
                    </h3>
                    <span className="text-[11px] text-neutral-400">· Click card actions to edit or delete</span>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Search categories..."
                      className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(cmsData.categories || [])
                    .filter((cat) => {
                      if (!categorySearch.trim()) return true;
                      const q = categorySearch.toLowerCase();
                      return (
                        cat.id.toLowerCase().includes(q) ||
                        cat.name.en.toLowerCase().includes(q) ||
                        cat.name.ta.toLowerCase().includes(q)
                      );
                    })
                    .map((cat) => {
                      const IconComp = getCategoryIconComponent(cat.icon);
                      const matchingSubs = (cmsData.subcategories || []).filter((s) => s.categoryId === cat.id);
                      const matchingProjs = (cmsData.projects || []).filter((p) => p.category === cat.id);

                      return (
                        <div
                          key={cat.id}
                          className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="h-11 w-11 rounded-xl bg-amber-50 border border-amber-200 text-[#B45309] flex items-center justify-center shrink-0">
                                  <IconComp className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-display font-black text-sm text-[#0A0D12]">
                                      {cat.name.en}
                                    </h4>
                                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-bold">
                                      id: {cat.id}
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-[#B45309] mt-0.5">{cat.name.ta}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleOpenAddCategory(cat)}
                                  className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
                                  title="Edit Category"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat.id, cat.name.en)}
                                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                                  title="Delete Category"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Descriptions */}
                            {(cat.description?.en || cat.description?.ta) && (
                              <div className="space-y-1 mb-4 p-2.5 rounded-xl bg-neutral-50 text-xs text-neutral-600 border border-neutral-100">
                                {cat.description.en && <p className="font-medium">{cat.description.en}</p>}
                                {cat.description.ta && <p className="text-neutral-500 text-[11px]">{cat.description.ta}</p>}
                              </div>
                            )}

                            {/* Subcategories preview chips */}
                            <div className="space-y-1.5 mb-4">
                              <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 block">
                                Subcategories ({matchingSubs.length}):
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {matchingSubs.map((sub) => (
                                  <span
                                    key={sub.id}
                                    className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-[11px] font-semibold border border-neutral-200"
                                  >
                                    {sub.name.en} · <span className="text-[#B45309]">{sub.name.ta}</span>
                                  </span>
                                ))}
                                <button
                                  onClick={() => handleOpenAddSubcategory(undefined, cat.id)}
                                  className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer border border-amber-200"
                                >
                                  <Plus className="h-2.5 w-2.5" />
                                  <span>Add Subcategory</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                            <span className="font-mono text-neutral-500 text-[11px]">
                              {matchingProjs.length} project(s) assigned
                            </span>
                            <button
                              onClick={() => {
                                setProjectCategoryFilter(cat.id);
                                setActiveTab("projects");
                              }}
                              className="font-bold text-[#B45309] hover:underline inline-flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <span>View Projects</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* SECTION B: SUBCATEGORIES MANAGEMENT */}
              <div className="space-y-4 pt-6 border-t border-neutral-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-800">
                      All Subcategories / Property Types ({cmsData.subcategories?.length || 0})
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Sub-classifications like Villa Plot, Duplex, Warehouse, or Agro Farmland.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={subcategorySearch}
                      onChange={(e) => setSubcategorySearch(e.target.value)}
                      placeholder="Search subcategories..."
                      className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
                    />
                  </div>
                </div>

                {/* Filter Pills by Parent Category */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    onClick={() => setCategoryFilterTab("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      categoryFilterTab === "all"
                        ? "bg-[#0A0D12] text-[#EAB308]"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    All ({cmsData.subcategories?.length || 0})
                  </button>
                  {(cmsData.categories || []).map((cat) => {
                    const count = (cmsData.subcategories || []).filter((s) => s.categoryId === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategoryFilterTab(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                          categoryFilterTab === cat.id
                            ? "bg-[#0A0D12] text-[#EAB308]"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {cat.name.en} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Subcategories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(cmsData.subcategories || [])
                    .filter((sub) => {
                      if (categoryFilterTab !== "all" && sub.categoryId !== categoryFilterTab) return false;
                      if (!subcategorySearch.trim()) return true;
                      const q = subcategorySearch.toLowerCase();
                      return (
                        sub.id.toLowerCase().includes(q) ||
                        sub.name.en.toLowerCase().includes(q) ||
                        sub.name.ta.toLowerCase().includes(q) ||
                        sub.categoryId.toLowerCase().includes(q)
                      );
                    })
                    .map((sub) => {
                      const parentCat = (cmsData.categories || []).find((c) => c.id === sub.categoryId);
                      const projCount = (cmsData.projects || []).filter((p) => p.subcategory === sub.id).length;

                      return (
                        <div
                          key={sub.id}
                          className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs hover:border-[#EAB308] transition flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 uppercase">
                                {parentCat ? parentCat.name.en : sub.categoryId}
                              </span>
                              <span className="font-mono text-[9px] text-neutral-400">id: {sub.id}</span>
                            </div>
                            <h4 className="font-bold text-xs text-neutral-900 truncate">{sub.name.en}</h4>
                            <p className="text-[11px] font-medium text-[#B45309] truncate">{sub.name.ta}</p>
                            <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                              {projCount} active project(s)
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenAddSubcategory(sub)}
                              className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
                              title="Edit Subcategory"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubcategory(sub.id, sub.name.en)}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                              title="Delete Subcategory"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: GALLERY & VIDEO REELS                                     */}
          {/* ================================================================= */}
          {activeTab === "gallery" && (
            <div className="space-y-8">
              <div className="pb-4 border-b border-neutral-100">
                <h2 className="text-xl font-black text-[#0A0D12] flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-600" />
                  <span>Photo Albums & Video Reels</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Organize real estate photography folders, site inspections, and drone video tour reels.
                </p>
              </div>

              {/* Photo Albums */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-neutral-800 uppercase tracking-wider font-mono">
                    Photo Albums ({cmsData.gallery.imageFolders.length})
                  </h3>
                  <button
                    onClick={() => {
                      const newFolder: CmsImageFolder = {
                        id: `album-${Date.now()}`,
                        title: { en: "New Photo Album", ta: "புதிய புகைப்பட தொகுப்பு" },
                        count: "1 Photo",
                        thumbnail: "/images/hero-poster.jpg",
                        images: ["/images/hero-poster.jpg"],
                      };
                      saveSection("gallery", {
                        ...cmsData.gallery,
                        imageFolders: [newFolder, ...cmsData.gallery.imageFolders],
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-800 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create Album</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cmsData.gallery.imageFolders.map((album, idx) => (
                    <div key={album.id} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={album.title.en}
                            onChange={(e) => {
                              const updated = [...cmsData.gallery.imageFolders];
                              updated[idx].title.en = e.target.value;
                              saveSection("gallery", { ...cmsData.gallery, imageFolders: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold"
                            placeholder="Album Title (EN)"
                          />
                          <input
                            type="text"
                            value={album.title.ta}
                            onChange={(e) => {
                              const updated = [...cmsData.gallery.imageFolders];
                              updated[idx].title.ta = e.target.value;
                              saveSection("gallery", { ...cmsData.gallery, imageFolders: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-medium text-[#B45309]"
                            placeholder="Album Title (Tamil)"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Delete album "${album.title.en}"?`)) {
                              const updated = cmsData.gallery.imageFolders.filter((f) => f.id !== album.id);
                              saveSection("gallery", { ...cmsData.gallery, imageFolders: updated });
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Image Thumbnails & Upload */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {album.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="relative h-14 w-14 rounded-lg overflow-hidden border border-neutral-300 group">
                            <Image src={img} alt="Thumb" fill className="object-cover" />
                            <button
                              onClick={() => {
                                const updated = [...cmsData.gallery.imageFolders];
                                updated[idx].images = updated[idx].images.filter((_, i) => i !== imgIdx);
                                updated[idx].count = `${updated[idx].images.length} Photos`;
                                saveSection("gallery", { ...cmsData.gallery, imageFolders: updated });
                              }}
                              className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}

                        <label className="h-14 w-14 rounded-lg border-2 border-dashed border-neutral-300 hover:border-[#EAB308] bg-white flex flex-col items-center justify-center text-neutral-500 hover:text-[#B45309] cursor-pointer transition">
                          <Upload className="h-4 w-4" />
                          <span className="text-[9px] font-bold mt-0.5">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (url) => {
                                const updated = [...cmsData.gallery.imageFolders];
                                updated[idx].images.push(url);
                                updated[idx].thumbnail = url;
                                updated[idx].count = `${updated[idx].images.length} Photos`;
                                saveSection("gallery", { ...cmsData.gallery, imageFolders: updated });
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Folders */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <h3 className="font-bold text-sm text-neutral-800 uppercase tracking-wider font-mono">
                  Video Reels & Tours ({cmsData.gallery.videoFolders.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cmsData.gallery.videoFolders.map((vFolder, vIdx) => (
                    <div key={vFolder.id} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={vFolder.title.en}
                          onChange={(e) => {
                            const updated = [...cmsData.gallery.videoFolders];
                            updated[vIdx].title.en = e.target.value;
                            saveSection("gallery", { ...cmsData.gallery, videoFolders: updated });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold"
                          placeholder="Video Category Title"
                        />
                        <button
                          onClick={() => {
                            const updated = cmsData.gallery.videoFolders.filter((f) => f.id !== vFolder.id);
                            saveSection("gallery", { ...cmsData.gallery, videoFolders: updated });
                          }}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {vFolder.videos.map((vid, vidIdx) => (
                          <div key={vidIdx} className="p-2 rounded-xl bg-white border border-neutral-200 flex items-center justify-between gap-2 text-xs">
                            <span className="font-semibold truncate">{vid.title.en}</span>
                            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                              {vid.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: DOWNLOAD BLUEPRINTS & BROCHURES                            */}
          {/* ================================================================= */}
          {activeTab === "downloads" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl font-black text-[#0A0D12] flex items-center gap-2">
                    <Download className="h-5 w-5 text-blue-600" />
                    <span>Download Centre Assets ({cmsData.downloads.items.length})</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Manage masterplan maps, DTCP layouts, PDF dossiers, and brochures available for download.
                  </p>
                </div>

                <button
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A0D12] hover:bg-[#B45309] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-[#EAB308]" />
                  <span>Add Download Item</span>
                </button>
              </div>

              {/* Downloads List */}
              <div className="space-y-3">
                {cmsData.downloads.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Download className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0A0D12]">{item.title.en}</h4>
                        <p className="text-xs text-[#B45309]">{item.title.ta}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-neutral-500">
                          <span className="font-bold text-neutral-700 uppercase">{item.category.en}</span>
                          <span>•</span>
                          <span>{item.fileType}</span>
                          <span>•</span>
                          <span>{item.fileSize}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">{item.badge}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <a
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                        title="Test Download Link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteDownload(item.id)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition cursor-pointer"
                        title="Delete Download Asset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: COMPANY PROFILE & CONTACT                                 */}
          {/* ================================================================= */}
          {activeTab === "company" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#0A0D12] flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-700" />
                    <span>Company Credentials & Contact Details</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Update phone, WhatsApp, office address, Google Maps link, and IAF leadership bio.
                  </p>
                </div>

                <button
                  onClick={() => saveSection("company", cmsData.company)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0D12] hover:bg-[#B45309] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-[#EAB308]" />}
                  <span>Save Company Info</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Founder Name
                  </label>
                  <input
                    type="text"
                    value={cmsData.company.founderName}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        company: { ...prev.company, founderName: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Military Title & Background
                  </label>
                  <input
                    type="text"
                    value={cmsData.company.militaryTitle}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        company: { ...prev.company, militaryTitle: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Official Telephone / Mobile
                  </label>
                  <input
                    type="text"
                    value={cmsData.company.phone}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        company: { ...prev.company, phone: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    WhatsApp Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    value={cmsData.company.whatsapp}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        company: { ...prev.company, whatsapp: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    value={cmsData.company.email}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        company: { ...prev.company, email: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Google Maps Share / Navigation URL
                  </label>
                  <input
                    type="text"
                    value={cmsData.company.mapsLink}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        company: { ...prev.company, mapsLink: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                  Madurai Office Physical Address
                </label>
                <input
                  type="text"
                  value={cmsData.company.address}
                  onChange={(e) =>
                    updateOptimistic((prev) => ({
                      ...prev,
                      company: { ...prev.company, address: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    About / Bio (English)
                  </label>
                  <textarea
                    rows={4}
                    value={cmsData.company.aboutBio.en}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        company: {
                          ...prev.company,
                          aboutBio: { ...prev.company.aboutBio, en: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    About / Bio (Tamil)
                  </label>
                  <textarea
                    rows={4}
                    value={cmsData.company.aboutBio.ta}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        company: {
                          ...prev.company,
                          aboutBio: { ...prev.company.aboutBio, ta: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-[#B45309]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: HERO, BANNERS & ANNOUNCEMENTS                             */}
          {/* ================================================================= */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#0A0D12] flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#EAB308]" />
                    <span>Hero Section & Live Announcement Ticker</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Control homepage main headlines, taglines, and the top announcement banner.
                  </p>
                </div>

                <button
                  onClick={() => saveSection("hero", cmsData.hero)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0D12] hover:bg-[#B45309] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-[#EAB308]" />}
                  <span>Save Hero & Banners</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Hero Top Badge (English)
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.heroBadge.en}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          heroBadge: { ...prev.hero.heroBadge, en: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Hero Top Badge (Tamil)
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.heroBadge.ta}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          heroBadge: { ...prev.hero.heroBadge, ta: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold text-[#B45309]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Hero Main Headline (English)
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.heroTitle.en}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          heroTitle: { ...prev.hero.heroTitle, en: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Hero Main Headline (Tamil)
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.heroTitle.ta}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          heroTitle: { ...prev.hero.heroTitle, ta: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-bold text-[#B45309]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Hero Subtitle (English)
                  </label>
                  <textarea
                    rows={3}
                    value={cmsData.hero.heroSubtitle.en}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          heroSubtitle: { ...prev.hero.heroSubtitle, en: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Hero Subtitle (Tamil)
                  </label>
                  <textarea
                    rows={3}
                    value={cmsData.hero.heroSubtitle.ta}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          heroSubtitle: { ...prev.hero.heroSubtitle, ta: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-[#B45309]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Announcement Ticker Bar (English)
                  </label>
                  <textarea
                    rows={2}
                    value={cmsData.hero.announcementTicker.en}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          announcementTicker: { ...prev.hero.announcementTicker, en: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 mb-1.5">
                    Announcement Ticker Bar (Tamil)
                  </label>
                  <textarea
                    rows={2}
                    value={cmsData.hero.announcementTicker.ta}
                    onChange={(e) =>
                      updateOptimistic((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          announcementTicker: { ...prev.hero.announcementTicker, ta: e.target.value },
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-[#B45309]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: STATS & TRUST COUNTERS                                    */}
          {/* ================================================================= */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#0A0D12] flex items-center gap-2">
                    <Layers className="h-5 w-5 text-amber-700" />
                    <span>Trust Statistics & Milestones</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Edit the 4 primary defense-grade trust metrics displayed across the site.
                  </p>
                </div>

                <button
                  onClick={() => saveSection("stats", cmsData.stats)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0D12] hover:bg-[#B45309] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-[#EAB308]" />}
                  <span>Save Statistics</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {cmsData.stats.items.map((stat, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-neutral-400">
                        Metric #{idx + 1}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
                        Big Display Value (e.g. 16+ Yrs, 100%, 1,000+)
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...cmsData.stats.items];
                          updated[idx].value = e.target.value;
                          updateOptimistic((prev) => ({ ...prev, stats: { items: updated } }));
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-sm font-black text-[#B45309]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
                          Label (EN)
                        </label>
                        <input
                          type="text"
                          value={stat.label.en}
                          onChange={(e) => {
                            const updated = [...cmsData.stats.items];
                            updated[idx].label.en = e.target.value;
                            updateOptimistic((prev) => ({ ...prev, stats: { items: updated } }));
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
                          Label (Tamil)
                        </label>
                        <input
                          type="text"
                          value={stat.label.ta}
                          onChange={(e) => {
                            const updated = [...cmsData.stats.items];
                            updated[idx].label.ta = e.target.value;
                            updateOptimistic((prev) => ({ ...prev, stats: { items: updated } }));
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-[#B45309]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
                          Sub-caption (EN)
                        </label>
                        <input
                          type="text"
                          value={stat.sub.en}
                          onChange={(e) => {
                            const updated = [...cmsData.stats.items];
                            updated[idx].sub.en = e.target.value;
                            updateOptimistic((prev) => ({ ...prev, stats: { items: updated } }));
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
                          Sub-caption (Tamil)
                        </label>
                        <input
                          type="text"
                          value={stat.sub.ta}
                          onChange={(e) => {
                            const updated = [...cmsData.stats.items];
                            updated[idx].sub.ta = e.target.value;
                            updateOptimistic((prev) => ({ ...prev, stats: { items: updated } }));
                          }}
                          className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-[11px] text-[#B45309]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: SERVICES OFFERED                                          */}
          {/* ================================================================= */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#0A0D12] flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-indigo-600" />
                    <span>Real Estate Services ({cmsData.services.items.length})</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Configure services list, descriptions, and feature bullet points.
                  </p>
                </div>

                <button
                  onClick={() => saveSection("services", cmsData.services)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0D12] hover:bg-[#B45309] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-[#EAB308]" />}
                  <span>Save Services</span>
                </button>
              </div>

              <div className="space-y-4">
                {cmsData.services.items.map((svc, idx) => (
                  <div key={svc.id} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
                          Service Title (EN)
                        </label>
                        <input
                          type="text"
                          value={svc.title.en}
                          onChange={(e) => {
                            const updated = [...cmsData.services.items];
                            updated[idx].title.en = e.target.value;
                            updateOptimistic((prev) => ({ ...prev, services: { items: updated } }));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
                          Service Title (Tamil)
                        </label>
                        <input
                          type="text"
                          value={svc.title.ta}
                          onChange={(e) => {
                            const updated = [...cmsData.services.items];
                            updated[idx].title.ta = e.target.value;
                            updateOptimistic((prev) => ({ ...prev, services: { items: updated } }));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-[#B45309]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
                          Description (EN)
                        </label>
                        <textarea
                          rows={2}
                          value={svc.description.en}
                          onChange={(e) => {
                            const updated = [...cmsData.services.items];
                            updated[idx].description.en = e.target.value;
                            updateOptimistic((prev) => ({ ...prev, services: { items: updated } }));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-neutral-600 mb-1">
                          Description (Tamil)
                        </label>
                        <textarea
                          rows={2}
                          value={svc.description.ta}
                          onChange={(e) => {
                            const updated = [...cmsData.services.items];
                            updated[idx].description.ta = e.target.value;
                            updateOptimistic((prev) => ({ ...prev, services: { items: updated } }));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs text-[#B45309]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =================================================================== */}
      {/* MODAL: COMPREHENSIVE 10-SECTION PROJECT MANAGEMENT DRAWER           */}
      {/* =================================================================== */}
      {isProjectModalOpen && (
        <ProjectManagementModal
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false);
            setEditingProject(null);
          }}
          project={editingProject}
          categories={cmsData.categories}
          subcategories={cmsData.subcategories}
          onSave={handleSaveProjectFromModal}
          onDelete={handleDeleteProjectFromModal}
        />
      )}

      {/* =================================================================== */}
      {/* MODAL: ADD DOWNLOAD ASSET                                          */}
      {/* =================================================================== */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-base text-[#0A0D12]">Add Downloadable Blueprint / Map</h3>
              <button onClick={() => setIsDownloadModalOpen(false)} className="p-1 text-neutral-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={newDownload.title?.en}
                  onChange={(e) =>
                    setNewDownload({
                      ...newDownload,
                      title: { en: e.target.value, ta: newDownload.title?.ta || "" },
                    })
                  }
                  placeholder="e.g. Vaigai Elite Layout Blueprint"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                  Title (Tamil)
                </label>
                <input
                  type="text"
                  value={newDownload.title?.ta}
                  onChange={(e) =>
                    setNewDownload({
                      ...newDownload,
                      title: { en: newDownload.title?.en || "", ta: e.target.value },
                    })
                  }
                  placeholder="e.g. வைகை எலைட் மனை வரைபடம்"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-[#B45309]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                  File Download URL or Upload File
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDownload.downloadUrl}
                    onChange={(e) => setNewDownload({ ...newDownload, downloadUrl: e.target.value })}
                    placeholder="/images/projects/... or https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
                  />
                  <label className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (url) => setNewDownload({ ...newDownload, downloadUrl: url }))
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                    File Type
                  </label>
                  <input
                    type="text"
                    value={newDownload.fileType}
                    onChange={(e) => setNewDownload({ ...newDownload, fileType: e.target.value })}
                    placeholder="PDF / Layout Map"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={newDownload.badge}
                    onChange={(e) => setNewDownload({ ...newDownload, badge: e.target.value })}
                    placeholder="DTCP Approved"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewDownload}
                className="px-5 py-2 rounded-xl bg-[#0A0D12] hover:bg-[#B45309] text-white text-xs font-bold cursor-pointer"
              >
                Add Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: CATEGORY ADD / EDIT                                         */}
      {/* =================================================================== */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-neutral-200 flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-[#0A0D12]">
                    {editingCategory.id ? "Edit Category" : "Add New Category"}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Bilingual configuration and public navigation setup.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                    English Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name.en}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: { ...editingCategory.name, en: e.target.value },
                      })
                    }
                    placeholder="e.g. Industrial"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                    Tamil Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name.ta}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: { ...editingCategory.name, ta: e.target.value },
                      })
                    }
                    placeholder="e.g. தொழில்துறை"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-[#B45309]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                  Category ID / Key (lowercase slug)
                </label>
                <input
                  type="text"
                  value={editingCategory.id}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  placeholder="Auto-generated if blank (e.g. industrial)"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Unique identifier used in URLs and project category tagging.
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                  English Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description?.en || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: {
                        en: e.target.value,
                        ta: editingCategory.description?.ta || "",
                      },
                    })
                  }
                  placeholder="Short tagline for frontend cards and filters..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                  Tamil Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description?.ta || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: {
                        en: editingCategory.description?.en || "",
                        ta: e.target.value,
                      },
                    })
                  }
                  placeholder="தமிழில் சிறு விளக்கம்..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs text-[#B45309]"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-2">
                  Display Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {[
                    { id: "Building2", label: "Building", icon: Building2 },
                    { id: "Home", label: "Home", icon: Home },
                    { id: "TreePine", label: "Trees", icon: TreePine },
                    { id: "Factory", label: "Factory", icon: Factory },
                    { id: "Warehouse", label: "Warehouse", icon: Warehouse },
                    { id: "Briefcase", label: "Briefcase", icon: Briefcase },
                    { id: "Landmark", label: "Landmark", icon: Landmark },
                    { id: "Sparkles", label: "Sparkles", icon: Sparkles },
                  ].map((ico) => {
                    const IcoComp = ico.icon;
                    const isSelected = (editingCategory.icon || "Building2").toLowerCase() === ico.id.toLowerCase();
                    return (
                      <button
                        key={ico.id}
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, icon: ico.id })}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                          isSelected
                            ? "bg-[#0A0D12] text-[#EAB308] border-[#0A0D12] shadow-xs"
                            : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                        }`}
                        title={ico.label}
                      >
                        <IcoComp className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#0A0D12] hover:bg-[#B45309] text-white text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
              >
                {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 text-[#EAB308]" />}
                <span>Save Category</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: SUBCATEGORY ADD / EDIT                                      */}
      {/* =================================================================== */}
      {isSubcategoryModalOpen && editingSubcategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-neutral-200 flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-[#0A0D12]">
                    {editingSubcategory.id ? "Edit Subcategory" : "Add New Subcategory"}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Define specific property classifications under a parent category.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubcategoryModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                  Parent Category *
                </label>
                <select
                  value={editingSubcategory.categoryId}
                  onChange={(e) =>
                    setEditingSubcategory({
                      ...editingSubcategory,
                      categoryId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
                >
                  {(cmsData.categories || []).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name.en} ({cat.name.ta})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                  English Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSubcategory.name.en}
                  onChange={(e) =>
                    setEditingSubcategory({
                      ...editingSubcategory,
                      name: { ...editingSubcategory.name, en: e.target.value },
                    })
                  }
                  placeholder="e.g. Duplex Villa or Warehouse"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                  Tamil Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSubcategory.name.ta}
                  onChange={(e) =>
                    setEditingSubcategory({
                      ...editingSubcategory,
                      name: { ...editingSubcategory.name, ta: e.target.value },
                    })
                  }
                  placeholder="e.g. டூப்ளக்ஸ் வில்லா"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-[#B45309]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-700 mb-1">
                  Subcategory ID / Key (slug)
                </label>
                <input
                  type="text"
                  value={editingSubcategory.id}
                  onChange={(e) =>
                    setEditingSubcategory({
                      ...editingSubcategory,
                      id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  placeholder="Auto-generated if blank (e.g. duplex-villa)"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSubcategoryModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSubcategory}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#0A0D12] hover:bg-[#B45309] text-white text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
              >
                {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 text-[#EAB308]" />}
                <span>Save Subcategory</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
