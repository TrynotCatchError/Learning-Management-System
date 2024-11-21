import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import * as z from 'zod';
import { authOptions } from "../../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
import { v4 as uuidv4 } from "uuid"; // Use v4 for unique IDs




const chapterSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = await params;
    const values = await req.json();
    const userId = String(session.user.id);

    // Validate input using zod schema
    const result = chapterSchema.safeParse(values);
    if (!result.success) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    const { title } = result.data;

    // Check if the user is the course owner
    const courseOwner = await db.course.findFirst({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the last chapter and set the new chapter's position
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // Create the new chapter
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: courseId,
        position: newPosition,
      },
    });
 
    
    return NextResponse.json({ chapter });
  } catch (error) {
    console.error("[COURSE_ERROR]", String(error));
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}









// const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

// export async function POST(req: Request) {
//   try {
//     // Validate the user session
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Parse the request body (e.g., metadata about the video)
//     const { metadata } = await req.json();

//     if (!metadata) {
//       return new NextResponse("Metadata is required", { status: 400 });
//     }

//     // Generate a unique ID for tracking the upload
//     const id = uuidv4();

//     // Create a new upload URL with Mux
//     const upload = await Video.Assets.create({
//       cors_origin: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://your-app.com"
//  , // Replace with your app's origin
//       new_asset_settings: {
//             input: id, // Optional metadata passthrough
//         playback_policy: ["public"], // Public playback
//         video_quality: "basic", // Adjust quality settings as needed
//       },
//     });
       
//     await db.muxData.create({
//       data: {
//         id,
//         uploadId: upload.id,
//         url: upload.url,
//         metadata, // Optional metadata passed from the client
//         status: "waiting_for_upload",
//         userId: session.user.id, // Associate with the logged-in user
//       },
//     });
    
    
//       await db.muxData.create({
//         data: {
//           chapterId,
//           assetId: asset.id,
//           playbackId: asset.playback_ids?.[0].id,
//         },
//       });
//     }
   




//     // Save the upload info in your database for tracking
   
//     // Return the upload ID and URL to the client
//     return NextResponse.json({ id, url: upload.url }, { status: 201 });
//   } catch (error: any) {
//     console.error("[UPLOAD_VIDEO_ERROR]", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }
