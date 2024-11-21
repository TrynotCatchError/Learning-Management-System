import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "../../../../../../lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string, attachmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = String(session.user.id);

    // Ensure that the course belongs to the user
    const courseOwner = await db.course.findFirst({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Delete the attachment by its unique `attachmentId`
    const attachment = await db.attachment.delete({
      where: {
        id: params.attachmentId, // Use only the `attachmentId` to delete the attachment
      },
    });

    return NextResponse.json(attachment);
  } catch (error: any) {
    console.error("Course_id Error:", error?.message || error); // Safely logging error
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
