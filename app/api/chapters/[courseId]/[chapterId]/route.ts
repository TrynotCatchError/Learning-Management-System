import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String(session.user);
      

    console.log("Params:", params);
    console.log("Session User ID:", session.user);
    
    
    
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
    console.log("Course Query Result:", course);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const chapterData = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        isPublished: true,
      },
    });
    console.log("Chapter Query Result:", chapterData);
    if (!chapterData) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId,
        },
      },
    });

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
    });

    const nextChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
        position: { gt: chapterData.position },
        isPublished: true,
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json({
      chapter: chapterData,
      course,
      purchase,
      userProgress,
      nextChapter,
    });
  } catch (error) {
      
    console.error("Error fetching chapter data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
