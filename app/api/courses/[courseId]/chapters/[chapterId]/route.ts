import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";




export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, chapterId } = params;
    const userId = String(session.user);

    const values = await req.json();

    const courseOwner = await db.course.findFirst({
      where: { id: courseId, userId },
    });

    if (!courseOwner) {
      return new NextResponse("You do not own this course", { status: 403 });
    }

    const existingChapter = await db.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!existingChapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    const updatedData = {
      ...values,
    };

    const updatedChapter = await db.chapter.update({
      where: { id: chapterId },
      data: updatedData,
    });

   
    return NextResponse.json({ success: true, data: updatedChapter }, { status: 200 });
  } catch (error: any) {
    console.error("[COURSE_ERROR]", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
