import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { resetCmsData, verifyAdminPin } from "@/lib/cms/store";

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

export async function POST() {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please log in." },
        { status: 401 }
      );
    }

    const resetData = await resetCmsData();

    return NextResponse.json({
      success: true,
      message: "Reset all CMS content back to factory defaults.",
      data: resetData,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/reset error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset data" },
      { status: 500 }
    );
  }
}
