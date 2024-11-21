import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import * as z from "zod";
import { authOptions } from "../auth/[...nextauth]/route";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

// POST: Create a Course
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const parsedData = courseSchema.safeParse(json);

    if (!parsedData.success) {
      return new NextResponse(parsedData.error.errors[0].message, { status: 400 });
    }

    const { title } = parsedData.data;

    const course = await db.course.create({
      data: {
        userId: String(session.user.id), // Convert userId to string
        title,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("[COURSE_ERROR]", String(error));
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// GET: Retrieve Courses by User
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = String(session.user.id);

    // Retrieve all courses for the logged-in user
    const courses = await db.course.findMany({
      where: {
        userId,
      },
      orderBy: {
        createAt: "desc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("[COURSE_ERROR]", String(error));
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
