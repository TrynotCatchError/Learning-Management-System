import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = String(session.user.id);

    const courseOwner = await db.course.findFirst({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Parse the request body to get `url`
    const { url } = await req.json();

    if (!url) {
      return new NextResponse("URL is required", { status: 400 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split('/').pop() || "Attachment",
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error: any) {
    console.error("Course_id Error:", error?.message || error); // Safely logging error
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
