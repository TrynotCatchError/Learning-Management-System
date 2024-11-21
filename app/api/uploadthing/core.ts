import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { metadata } from "app/layout";
import Mux from "@mux/mux-node";
import MuxPlayer from "@mux/mux-player-react/.";




const f = createUploadthing();

const handleAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");
  return { userId: String(session.user.id) };
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      // Optional: Add any additional functionality after upload
    }),

  courseAttachment: f({ text: {}, video: {}, audio: {}, pdf: {} })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      // Optional: Add any additional functionality after upload
    }),

    chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete( ({}) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;









// try {
//   // Create a new asset in Mux with the uploaded file URL
//   const asset = await mux.Video.Assets.create({
//     input: fileUrl,
//     playback_policy: 'public'
//   });

//   // Save the asset ID and playback ID to the database
//   const muxData = await prisma.muxData.create({
//     data: {
//       assetId: asset.id,
//       playbackId: asset.playback_ids[0].id, // Use the first playback ID
//       chapterId,
//     },
//   });

//   res.status(200).json({ muxData });
















