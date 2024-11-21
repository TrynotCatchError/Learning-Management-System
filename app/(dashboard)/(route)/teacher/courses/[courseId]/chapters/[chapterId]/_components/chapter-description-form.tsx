import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import * as z from "zod";

const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

const metadataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { metadata } = metadataSchema.parse(await req.json());

    const id = uuidv4();
    const corsOrigin = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.com";

    const upload = await Video.Uploads.create({
      cors_origin: corsOrigin,
      new_asset_settings: {
        passthrough: id,
        playback_policy: ["public"],
        video_quality: "basic",
      },
    });

    await db.upload.create({
      data: {
        id,
        uploadId: upload.id,
        url: upload.url,
        metadata,
        status: "waiting_for_upload",
        userId: session.user.id,
      },
    });

    return NextResponse.json({ id, url: upload.url }, { status: 201 });
  } catch (error: any) {
    console.error("[UPLOAD_VIDEO_ERROR]", error);

    const message = process.env.NODE_ENV === "development"
      ? error.message
      : "Internal Server Error";

    return new NextResponse(message, { status: 500 });
  }
}
