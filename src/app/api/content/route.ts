import { NextResponse } from "next/server";
import { getCmsData, getCmsVersion } from "@/lib/cms/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  try {
    const data = await getCmsData();
    const version = getCmsVersion();

    if (section && section in data) {
      return NextResponse.json(
        { success: true, version, [section]: data[section as keyof typeof data] },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    return NextResponse.json(
      { success: true, version, data },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    console.error("API GET /api/content failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load content" },
      { status: 500 }
    );
  }
}
