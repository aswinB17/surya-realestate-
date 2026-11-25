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

export interface LocalityPoint {
  name: LocalizedText;
  distance: string;
  time?: string;
}

export interface ProjectReview {
  id?: string;
  name: string;
  role: LocalizedText;
  rating: number;
  date: string;
  comment: LocalizedText;
  isVerifiedBuyer?: boolean;
}

export interface GroundwaterFacility {
  depth?: LocalizedText;
  quality?: LocalizedText;
  tdsValue?: string;
  waterHardness?: string;
  source?: LocalizedText;
}

export interface CommunityEnvironment {
  density?: LocalizedText;
  surrounding?: LocalizedText;
  atmosphere?: LocalizedText;
  roadConditions?: LocalizedText;
  drainage?: LocalizedText;
}

export interface GroundValueROI {
  currentRate?: LocalizedText;
  pricePerSqFt?: string;
  guidelineValue?: LocalizedText;
  landExtent?: string;
  verifiedPriceStatus?: LocalizedText;
  threeYearROI?: string;
  fiveYearROI?: string;
  growthDrivers?: LocalizedList;
}

export interface ProjectMapLocation {
  googleMapsUrl?: string;
  latitude?: string;
  longitude?: string;
  fullAddress?: LocalizedText;
  pinLocation?: LocalizedText;
  isVerifiedPinpoint?: boolean;
}

export interface ProjectContactInfo {
  advisorPhone?: string;
  enquiryPhone?: string;
  googleMapsLink?: string;
  customCallAction?: LocalizedText;
  customEnquiryAction?: LocalizedText;
}

export interface ProjectOverviewSpecs {
  configuration?: LocalizedText;
  builtUpArea?: string;
  landArea?: string;
  facing?: LocalizedText;
  features?: LocalizedList;
  price?: string;
  isPriceNegotiable?: boolean;
}

export interface DetailedHighlight {
  title: LocalizedText;
  description?: LocalizedText;
  icon?: string;
}

export interface ProjectExtendedDetailsData {
  transportation?: LocalityPoint[];
  hospitals?: LocalityPoint[];
  schoolsAndColleges?: LocalityPoint[];
  groundwater?: GroundwaterFacility;
  neighborhood?: CommunityEnvironment;
  groundValue?: GroundValueROI;
  customerReviews?: ProjectReview[];
  overallRating?: string;
  clientApprovalRate?: string;
  happyFamiliesCount?: string;
  yearsOfTrust?: string;
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
  fullAddress?: LocalizedText;
  image: string;
  galleryImages?: string[];
  interiorImages?: string[];
  exteriorImages?: string[];
  layoutImages?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  blueprint?: string;
  blueprints?: CmsBlueprintItem[];
  mapbhoomiUrl?: string;
  brochureUrl?: string;
  statusBadge: LocalizedText;
  rating: string;
  verifiedReviewCount?: string;
  status: "running" | "completed" | "upcoming" | "available" | "sold" | "draft";
  isPublished?: boolean;
  isDraft?: boolean;
  description: LocalizedText;
  fullOverview?: LocalizedText;
  highlights: LocalizedList;
  detailedHighlights?: DetailedHighlight[];
  suitableActivities?: LocalizedList;
  marketingBanner?: LocalizedText;
  mapsUrl: string;
  specs: CmsProjectSpec[];
  overviewSpecs?: ProjectOverviewSpecs;
  extendedDetails?: ProjectExtendedDetailsData;
  locationMap?: ProjectMapLocation;
  contactInfo?: ProjectContactInfo;
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
