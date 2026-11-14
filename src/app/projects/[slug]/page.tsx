import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SummitFooter from "@/components/layout/SummitFooter";
import ProjectDetails from "@/components/projects/ProjectDetails";
import MobileActionBar from "@/components/layout/MobileActionBar";
import { projectsData } from "@/data/projects";
import { getCmsData } from "@/lib/cms/store";
import { Project } from "@/types/project";
import { CmsProject } from "@/types/cms";

interface Props {
  params: Promise<{ slug: string }>;
}

function mapCmsProjectToProject(p: CmsProject, fallback?: Project): Project {
  return {
    id: p.id,
    slug: p.slug || p.id,
    title: p.name || fallback?.title || { en: p.id, ta: p.id },
    subtitle: p.distanceInfo || fallback?.subtitle || { en: "", ta: "" },
    category: (p.category as any) || fallback?.category || "commercial",
    categoryLabel: p.categoryLabel || fallback?.categoryLabel || { en: p.category, ta: p.category },
    subcategory: p.subcategory || fallback?.subcategory,
    subcategoryLabel: p.subcategoryLabel || fallback?.subcategoryLabel,
    location: p.location || fallback?.location || { en: "Madurai", ta: "மதுரை" },
    googleMapsUrl: (p as any).googleMapsUrl || fallback?.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(p.location?.en || "Madurai")}`,
    photographyReferenceUrl: (p as any).photographyReferenceUrl || fallback?.photographyReferenceUrl,
    mapBhoomiUrl: p.mapbhoomiUrl || fallback?.mapBhoomiUrl,
    brochureUrl: p.brochureUrl || fallback?.brochureUrl,
    heroImage: p.image || fallback?.heroImage || "/images/hero-poster.jpg",
    galleryImages: p.galleryImages && p.galleryImages.length > 0 ? p.galleryImages : fallback?.galleryImages || [p.image || "/images/hero-poster.jpg"],
    videoUrl: p.videoUrl || fallback?.videoUrl,
    videoUrls: p.videoUrls || fallback?.videoUrls,
    description: p.description || fallback?.description || { en: "", ta: "" },
    fullOverview: p.fullOverview || fallback?.fullOverview || p.description || { en: "", ta: "" },
    suitableFor: (p.suitableActivities as any) || fallback?.suitableFor || { en: [], ta: [] },
    highlights: (p.highlights as any) || fallback?.highlights || { en: [], ta: [] },
    layoutPlanImage: p.blueprint || fallback?.layoutPlanImage,
    status: p.status as any,
    projectType: (p as any).projectType || (p.status === "running" ? "running" : p.status === "completed" || p.status === "sold" ? "completed" : "upcoming"),
  };
}

export async function generateStaticParams() {
  const cms = await getCmsData();
  const cmsSlugs = (cms.projects || []).map((p) => ({ slug: p.slug }));
  const staticSlugs = projectsData.map((project) => ({ slug: project.slug }));
  return [...cmsSlugs, ...staticSlugs];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getCmsData();
  const cmsProject = (cms.projects || []).find((p) => p.slug === slug || p.id === slug);
  const fallback = projectsData.find((p) => p.slug === slug || p.id === slug);
  const project = cmsProject ? mapCmsProjectToProject(cmsProject, fallback) : fallback;

  if (!project) {
    return {
      title: "Project Not Found | Surya Promoters",
    };
  }

  return {
    title: `${project.title.en} | Surya Promoters Madurai`,
    description: project.description.en,
    openGraph: {
      title: `${project.title.en} - Surya Promoters`,
      description: project.description.en,
      images: [project.heroImage],
    },
  };
}

async function ProjectContent({ params }: Props) {
  const { slug } = await params;
  const cms = await getCmsData();
  const cmsProject = (cms.projects || []).find((p) => p.slug === slug || p.id === slug);
  const fallback = projectsData.find((p) => p.slug === slug || p.id === slug);

  if (!cmsProject && !fallback) {
    notFound();
  }

  const project = cmsProject ? mapCmsProjectToProject(cmsProject, fallback) : fallback!;

  return <ProjectDetails project={project} />;
}

export default function ProjectPage({ params }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Suspense
        fallback={
          <div className="mx-auto flex min-h-[60vh] max-w-[1760px] items-center justify-center px-6">
            <div className="flex flex-col items-center gap-3">
              <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#C6A15B] border-t-transparent" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#77766F]">
                Loading Project...
              </span>
            </div>
          </div>
        }
      >
        <ProjectContent params={params} />
      </Suspense>
      <SummitFooter />
      <MobileActionBar />
    </div>
  );
}
