export interface LocalizedText {
  en: string;
  ta: string;
}

export interface LocalizedList {
  en: string[];
  ta: string[];
}

export interface CmsProjectSpec {
  label: LocalizedText;
  value: LocalizedText;
}

export interface CmsBlueprintItem {
  title: LocalizedText;
  image: string;
  tag?: LocalizedText;
}

export interface CmsCategory {
  id: string;
  name: LocalizedText;
  description?: LocalizedText;
  icon?: string;
}

export interface CmsSubcategory {
  id: string;
  categoryId: string;
  name: LocalizedText;
}

export interface CmsProject {
  id: string;
  slug: string;
  name: LocalizedText;
  category: string;
  categoryLabel: LocalizedText;
  subcategory: string;
  subcategoryLabel: LocalizedText;
  location: LocalizedText;
  distanceInfo: LocalizedText;
  image: string;
  galleryImages?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  blueprint?: string;
  blueprints?: CmsBlueprintItem[];
  mapbhoomiUrl?: string;
  brochureUrl?: string;
  statusBadge: LocalizedText;
  rating: string;
  status: "running" | "completed" | "upcoming" | "available" | "sold";
  description: LocalizedText;
  fullOverview?: LocalizedText;
  highlights: LocalizedList;
  suitableActivities?: LocalizedList;
  marketingBanner?: LocalizedText;
  mapsUrl: string;
  specs: CmsProjectSpec[];
}

export interface CmsGalleryVideo {
  title: LocalizedText;
  duration: string;
  url?: string;
}

export interface CmsVideoFolder {
  id: string;
  title: LocalizedText;
  count: string;
  thumbnail: string;
  videos: CmsGalleryVideo[];
}

export interface CmsImageFolder {
  id: string;
  title: LocalizedText;
  count: string;
  thumbnail: string;
  images: string[];
}

export interface CmsGallery {
  videoFolders: CmsVideoFolder[];
  imageFolders: CmsImageFolder[];
}

export interface CmsDownloadItem {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  brochureUrl?: string;
  badge: string;
}

export interface CmsCompany {
  founderName: string;
  militaryTitle: string;
  experienceYears: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsLink: string;
  googleMapsEmbedUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  instagramImage?: string;
  instagramHandle?: string;
  aboutBio: LocalizedText;
  missionStatement: LocalizedText;
}

export interface CmsHeroAndBanners {
  heroBadge: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  announcementTicker: LocalizedText;
  videoPosterImage?: string;
}

export interface CmsStatItem {
  value: string;
  label: LocalizedText;
  sub: LocalizedText;
}

export interface CmsServiceItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  image?: string;
  features: LocalizedList;
}

export interface CmsData {
  projects: CmsProject[];
  categories: CmsCategory[];
  subcategories: CmsSubcategory[];
  gallery: CmsGallery;
  downloads: {
    items: CmsDownloadItem[];
  };
  company: CmsCompany;
  hero: CmsHeroAndBanners;
  stats: {
    items: CmsStatItem[];
  };
  services: {
    items: CmsServiceItem[];
  };
  lastUpdated: string;
}
