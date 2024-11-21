import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { db } from "../../../../../../lib/db";
import * as z from 'zod';
import { authOptions } from "../../../../auth/[...nextauth]/route";

// Update listSchema to ensure `list` is an array of objects with `id` and `position`
const listSchema = z.object({
  list: z.array(
    z.object({
      id: z.string().nonempty("Chapter ID is required"),
      position: z.number().int().nonnegative("Position must be a non-negative integer"),
    })
  ).min(1, "List cannot be empty"),
});

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;
    const values = await req.json();
    const userId = String(session.user.id);

    // Validate the request body against the updated schema
    const result = listSchema.safeParse(values);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors }, { status: 400 });
    }

    const { list } = result.data;

    // Check if the user owns the course
    const courseOwner = await db.course.findFirst({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update chapter positions using a transaction
    await db.$transaction(
      list.map((item) =>
        db.chapter.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    );

    return NextResponse.json({ success: true, list });
  } catch (error) {
    console.error("[COURSE_REORDER_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
