import fs from "fs";
import path from "path";
import { CmsData, CmsProject } from "@/types/cms";

// System branding, logos, and global templates that must NEVER be deleted
const PROTECTED_SYSTEM_PATHS = [
  "/images/surya-logo.png",
  "/images/surya-gold-logo.png",
  "/images/logo.png",
  "/images/Glossy_Gold_House_Logo.png",
  "/images/hero-poster.jpg",
  "/images/hero/",
  "/images/founder/",
  "/favicon.ico",
  "/next.svg",
  "/vercel.svg",
  "/file.svg",
  "/globe.svg",
  "/window.svg",
];

/**
 * Check if a given URL points to a protected system file
 */
export function isProtectedSystemFile(fileUrl?: string): boolean {
  if (!fileUrl) return true;
  const normalized = fileUrl.trim().toLowerCase();

  // Skip external URLs (http://, https://, data:, blob:)
  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:")
  ) {
    return true;
  }

  // Check against protected system paths
  for (const protectedPath of PROTECTED_SYSTEM_PATHS) {
    if (normalized === protectedPath.toLowerCase() || normalized.startsWith(protectedPath.toLowerCase())) {
      return true;
    }
  }

  return false;
}

/**
 * Extract all file URLs directly referenced by a project
 */
export function extractProjectFileUrls(project: CmsProject): string[] {
  const urls: string[] = [];

  const add = (u?: string | null) => {
    if (u && typeof u === "string" && u.trim() && !u.startsWith("http://") && !u.startsWith("https://")) {
      // Strip query params or hash
      const clean = u.split("?")[0].split("#")[0].trim();
      if (clean) urls.push(clean);
    }
  };

  add(project.image);
  (project.galleryImages || []).forEach(add);
  add(project.blueprint);
  (project.blueprints || []).forEach((bp) => add(bp?.image));
  add(project.brochureUrl);
  add(project.videoUrl);
  (project.videoUrls || []).forEach(add);

  return Array.from(new Set(urls));
}

/**
 * Collect all active file URLs currently used across the ENTIRE CMS,
 * optionally excluding one specific project (the one being deleted).
 */
export function collectAllReferencedFileUrls(cmsData: CmsData, excludeProjectId?: string): Set<string> {
  const referenced = new Set<string>();

  const add = (u?: string | null) => {
    if (u && typeof u === "string" && u.trim()) {
      const clean = u.split("?")[0].split("#")[0].trim().toLowerCase();
      if (clean) referenced.add(clean);
    }
  };

  // 1. Projects (excluding the one being deleted)
  (cmsData.projects || []).forEach((p) => {
    if (p.id !== excludeProjectId) {
      add(p.image);
      (p.galleryImages || []).forEach(add);
      add(p.blueprint);
      (p.blueprints || []).forEach((bp) => add(bp?.image));
      add(p.brochureUrl);
      add(p.videoUrl);
      (p.videoUrls || []).forEach(add);
    }
  });

  // 2. Gallery folders
  if (cmsData.gallery) {
    (cmsData.gallery.imageFolders || []).forEach((f) => {
      add(f.thumbnail);
      (f.images || []).forEach(add);
    });
    (cmsData.gallery.videoFolders || []).forEach((vf) => {
      (vf.videos || []).forEach((v) => add(v.url));
    });
  }

  // 3. Downloads
  if (cmsData.downloads?.items) {
    cmsData.downloads.items.forEach((d) => add(d.downloadUrl));
  }

  // 4. Hero
  if (cmsData.hero?.videoPosterImage) {
    add(cmsData.hero.videoPosterImage);
  }

  // 5. Company
  if ((cmsData.company as any)?.founderImage) {
    add((cmsData.company as any).founderImage);
  }

  // 6. Services
  if (cmsData.services?.items) {
    cmsData.services.items.forEach((s) => add(s.image));
  }

  return referenced;
}

/**
 * Delete all files and dedicated folders associated with a project.
 * Protects system files and any file that is still referenced by other projects or sections.
 */
export function deleteProjectFiles(
  project: CmsProject,
  remainingCmsData: CmsData
): {
  deletedFiles: string[];
  deletedFolders: string[];
  skippedFiles: string[];
} {
  const deletedFiles: string[] = [];
  const deletedFolders: string[] = [];
  const skippedFiles: string[] = [];

  const publicDir = path.join(process.cwd(), "public");
  const otherReferencedUrls = collectAllReferencedFileUrls(remainingCmsData, project.id);
  const projectFileUrls = extractProjectFileUrls(project);

  // ---------------------------------------------------------------------------
  // 1. Delete explicitly referenced files
  // ---------------------------------------------------------------------------
  for (const fileUrl of projectFileUrls) {
    if (isProtectedSystemFile(fileUrl)) {
      skippedFiles.push(`${fileUrl} (protected system file)`);
      continue;
    }

    const normalizedUrl = fileUrl.toLowerCase();
    if (otherReferencedUrls.has(normalizedUrl)) {
      skippedFiles.push(`${fileUrl} (shared with another catalog item)`);
      continue;
    }

    // Resolve absolute path in public/
    const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const absolutePath = path.join(publicDir, relativePath);

    // Prevent directory traversal attacks
    if (!absolutePath.startsWith(publicDir)) {
      skippedFiles.push(`${fileUrl} (invalid path outside public directory)`);
      continue;
    }

    try {
      if (fs.existsSync(absolutePath)) {
        const stat = fs.statSync(absolutePath);
        if (stat.isFile()) {
          fs.unlinkSync(absolutePath);
          deletedFiles.push(fileUrl);
        }
      }
    } catch (err: any) {
      console.warn(`Could not delete file ${absolutePath}:`, err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Check and delete project-dedicated folders (e.g., in images/projects/ or uploads/)
  // ---------------------------------------------------------------------------
  const candidateFolderNames = [project.slug, project.id].filter(Boolean);

  const candidateDirs: string[] = [];
  for (const name of candidateFolderNames) {
    candidateDirs.push(path.join(publicDir, "images", "projects", name));
    candidateDirs.push(path.join(publicDir, "uploads", "projects", name));
    candidateDirs.push(path.join(publicDir, "uploads", name));
  }

  for (const dirPath of candidateDirs) {
    if (!fs.existsSync(dirPath)) continue;

    try {
      const stat = fs.statSync(dirPath);
      if (!stat.isDirectory()) continue;

      // Check all files in this directory
      const files = fs.readdirSync(dirPath);
      let canDeleteDirectory = true;

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const relativeUrl = "/" + path.relative(publicDir, filePath).replace(/\\/g, "/");

        if (otherReferencedUrls.has(relativeUrl.toLowerCase()) || isProtectedSystemFile(relativeUrl)) {
          canDeleteDirectory = false;
        } else {
          try {
            if (fs.statSync(filePath).isFile()) {
              fs.unlinkSync(filePath);
              deletedFiles.push(relativeUrl);
            }
          } catch (e) {
            canDeleteDirectory = false;
          }
        }
      }

      if (canDeleteDirectory) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        const relativeDir = "/" + path.relative(publicDir, dirPath).replace(/\\/g, "/");
        deletedFolders.push(relativeDir);
      }
    } catch (err: any) {
      console.warn(`Could not clean directory ${dirPath}:`, err.message);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Check for standalone project files in public/images/projects/
  // (e.g. surya-green-enclave.jpg, surya-green-enclave-blueprint.jpg)
  // ---------------------------------------------------------------------------
  const projectsDir = path.join(publicDir, "images", "projects");
  if (fs.existsSync(projectsDir)) {
    try {
      const allFiles = fs.readdirSync(projectsDir);
      for (const name of candidateFolderNames) {
        for (const file of allFiles) {
          const filePath = path.join(projectsDir, file);
          if (!fs.statSync(filePath).isFile()) continue;

          // Check if file starts with the slug/id
          if (file.toLowerCase().startsWith(name.toLowerCase())) {
            const relativeUrl = `/images/projects/${file}`;
            if (!otherReferencedUrls.has(relativeUrl.toLowerCase()) && !isProtectedSystemFile(relativeUrl)) {
              try {
                fs.unlinkSync(filePath);
                deletedFiles.push(relativeUrl);
              } catch (e) {}
            }
          }
        }
      }
    } catch (e) {}
  }

  return {
    deletedFiles: Array.from(new Set(deletedFiles)),
    deletedFolders: Array.from(new Set(deletedFolders)),
    skippedFiles,
  };
}
