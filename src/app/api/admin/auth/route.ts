import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminPin } from "@/lib/cms/store";

const AUTH_COOKIE = "surya_admin_session";
const SESSION_TOKEN = "surya_auth_ok_2010";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pin = body.pin;

    if (!verifyAdminPin(pin)) {
      return NextResponse.json(
        { success: false, error: "Invalid Admin PIN. Please check your credentials." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, SESSION_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Authenticated successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Authentication error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE)?.value;

    if (session === SESSION_TOKEN) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
