import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getCmsData, saveCmsData, verifyAdminPin } from "@/lib/cms/store";
import { deleteProjectFiles } from "@/lib/cms/fileCleanup";

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

    const body = await request.json().catch(() => ({}));
    const { searchParams } = new URL(request.url);
    const targetId = body.id || body.projectId || searchParams.get("id");

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "Missing project id to delete." },
        { status: 400 }
      );
    }

    const currentData = await getCmsData();
    const projectToDelete = currentData.projects.find(
      (p) => p.id === targetId || p.slug === targetId
    );

    if (!projectToDelete) {
      return NextResponse.json(
        { success: false, error: `Project "${targetId}" not found in catalog.` },
        { status: 404 }
      );
    }

    // 1. Delete all media, blueprints, and files regarding this project from server disk
    const cleanupResult = deleteProjectFiles(projectToDelete, currentData);

    // 2. Remove the project from the persistent data store
    const updatedProjects = currentData.projects.filter(
      (p) => p.id !== projectToDelete.id
    );

    await saveCmsData({ projects: updatedProjects });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted "${projectToDelete.name.en}" and cleaned up ${cleanupResult.deletedFiles.length} file(s) from server.`,
      projectName: projectToDelete.name.en,
      deletedFiles: cleanupResult.deletedFiles,
      deletedFolders: cleanupResult.deletedFolders,
      skippedFiles: cleanupResult.skippedFiles,
    });
  } catch (err: any) {
    console.error("API POST /api/admin/projects/delete error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete project and files." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  return POST(request);
}
