import { NextResponse } from "next/server";
import { getCmsData } from "@/lib/cms/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    const cms = await getCmsData();
    let projects = cms.projects || [];

    // Filter published only for public access unless includeDrafts is true
    if (!includeDrafts) {
      projects = projects.filter((p) => p.isPublished !== false && p.status !== "draft");
    }

    if (category && category !== "all") {
      projects = projects.filter((p) => p.category === category);
    }

    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      projects = projects.filter(
        (p) =>
          p.name.en.toLowerCase().includes(q) ||
          p.name.ta.toLowerCase().includes(q) ||
          p.location.en.toLowerCase().includes(q) ||
          p.location.ta.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error: any) {
    if (error?.digest?.includes("NEXT_PRERENDER")) {
      throw error;
    }
    console.error("API GET /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
