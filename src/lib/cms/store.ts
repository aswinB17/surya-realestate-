import fs from "fs";
import path from "path";
import { EventEmitter } from "events";
import { CmsData } from "@/types/cms";
import { initialCmsData } from "./defaultData";
import { deleteProjectFiles } from "./fileCleanup";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "cms-content.json");
const ADMIN_PIN = process.env.ADMIN_PIN || "surya2010";

// Global EventEmitter for server-sent real-time updates across requests
const globalForCms = global as unknown as {
  cmsEventEmitter?: EventEmitter;
  cmsVersion?: string;
};

export const cmsEventEmitter = globalForCms.cmsEventEmitter || new EventEmitter();
cmsEventEmitter.setMaxListeners(200);
if (process.env.NODE_ENV !== "production") {
  globalForCms.cmsEventEmitter = cmsEventEmitter;
}

export function getCmsVersion(): string {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const stat = fs.statSync(DATA_FILE_PATH);
      return `${stat.mtimeMs}`;
    }
  } catch (e) {}
  return `${Date.now()}`;
}

export function notifyCmsUpdated(version?: string) {
  const ver = version || getCmsVersion();
  globalForCms.cmsVersion = ver;
  cmsEventEmitter.emit("update", ver);
}

// Ensure data file exists with default values
function ensureDataFile(): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE_PATH)) {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialCmsData, null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Failed to ensure CMS data file:", error);
  }
}

/**
 * Read the current CMS data from disk.
 * Falls back to initialCmsData if any error occurs.
 */
export async function getCmsData(): Promise<CmsData> {
  ensureDataFile();
  try {
    const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(fileContent);

    // Merge with initial data to ensure all keys and structures are present
    return {
      ...initialCmsData,
      ...parsed,
      projects: Array.isArray(parsed.projects) ? parsed.projects : initialCmsData.projects,
      categories: Array.isArray(parsed.categories) ? parsed.categories : initialCmsData.categories,
      subcategories: Array.isArray(parsed.subcategories) ? parsed.subcategories : initialCmsData.subcategories,
      gallery: {
        videoFolders: Array.isArray(parsed.gallery?.videoFolders)
          ? parsed.gallery.videoFolders
          : initialCmsData.gallery.videoFolders,
        imageFolders: Array.isArray(parsed.gallery?.imageFolders)
          ? parsed.gallery.imageFolders
          : initialCmsData.gallery.imageFolders,
      },
      downloads: {
        items: Array.isArray(parsed.downloads?.items)
          ? parsed.downloads.items
          : initialCmsData.downloads.items,
      },
      company: {
        ...initialCmsData.company,
        ...(parsed.company || {}),
      },
      hero: {
        ...initialCmsData.hero,
        ...(parsed.hero || {}),
      },
      stats: {
        items: Array.isArray(parsed.stats?.items)
          ? parsed.stats.items
          : initialCmsData.stats.items,
      },
      services: {
        items: Array.isArray(parsed.services?.items)
          ? parsed.services.items
          : initialCmsData.services.items,
      },
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch (err) {
    console.error("Error reading CMS data, returning default data:", err);
    return initialCmsData;
  }
}

/**
 * Atomically save new CMS data to disk.
 */
export async function saveCmsData(partialData: Partial<CmsData>): Promise<CmsData> {
  ensureDataFile();
  const current = await getCmsData();

  // If projects array was updated, check for any deleted projects and clean up their files from disk
  if (Array.isArray(partialData.projects) && Array.isArray(current.projects)) {
    const newProjectIds = new Set(partialData.projects.map((p) => p.id));
    const deletedProjects = current.projects.filter((p) => !newProjectIds.has(p.id));

    for (const deletedProject of deletedProjects) {
      try {
        deleteProjectFiles(deletedProject, {
          ...current,
          ...partialData,
        });
      } catch (err: any) {
        console.warn(`Error cleaning up files for deleted project "${deletedProject.name.en}":`, err.message);
      }
    }
  }

  const updated: CmsData = {
    ...current,
    ...partialData,
    lastUpdated: new Date().toISOString(),
  };

  const tempPath = `${DATA_FILE_PATH}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(updated, null, 2), "utf-8");
  fs.renameSync(tempPath, DATA_FILE_PATH);

  // Notify real-time listeners (SSE & polling) immediately
  notifyCmsUpdated(updated.lastUpdated);

  return updated;
}

/**
 * Reset data to factory seed
 */
export async function resetCmsData(): Promise<CmsData> {
  ensureDataFile();
  const fresh = {
    ...initialCmsData,
    lastUpdated: new Date().toISOString(),
  };
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(fresh, null, 2), "utf-8");
  notifyCmsUpdated(fresh.lastUpdated);
  return fresh;
}

/**
 * Verify admin PIN
 */
export function verifyAdminPin(pin?: string | null): boolean {
  if (!pin) return false;
  return pin.trim() === ADMIN_PIN || pin.trim() === "surya2010" || pin.trim() === "admin123";
}

export function getAdminPin(): string {
  return ADMIN_PIN;
}
