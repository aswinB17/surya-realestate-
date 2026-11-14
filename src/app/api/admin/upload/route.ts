import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { verifyAdminPin } from "@/lib/cms/store";
import fs from "fs";
import path from "path";

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
        { success: false, error: "Unauthorized: Please log in." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided in form data." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Clean filename
    const originalName = file.name || "upload";
    const ext = path.extname(originalName) || ".jpg";
    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 40);

    const uniqueName = `${baseName}-${Date.now()}${ext.toLowerCase()}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
      size: file.size,
    });
  } catch (error: any) {
    console.error("API POST /api/admin/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
