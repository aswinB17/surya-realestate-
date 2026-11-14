import { NextResponse } from "next/server";
import { getCmsVersion } from "@/lib/cms/store";

export async function GET(request: Request) {
  try {
    const version = getCmsVersion();
    return NextResponse.json(
      { success: true, version },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
