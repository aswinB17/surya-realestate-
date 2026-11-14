import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { saveCmsData, getCmsData, verifyAdminPin } from "@/lib/cms/store";
import { CmsData } from "@/types/cms";

async function isAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("surya_admin_session")?.value;
  if (session === "surya_auth_ok_2010") {
    return true;
  }

  const reqHeaders = await headers();
  const headerPin = reqHeaders.get("x-admin-pin");
  if (verifyAdminPin(headerPin)) {
    return true;
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please log in with your Admin PIN." },
        { status: 401 }
      );
    }

    const body = await request.json();

    let patch: Partial<CmsData> = {};

    // Check if saving a specific section: { section: "projects", data: [...] }
    if (body.section && body.data !== undefined) {
      patch = { [body.section]: body.data };
    } else if (body.data) {
      patch = body.data;
    } else {
      patch = body;
    }

    const updated = await saveCmsData(patch);

    return NextResponse.json({
      success: true,
      message: "Changes saved and published live!",
      data: updated,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/content error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save content" },
      { status: 500 }
    );
  }
}
