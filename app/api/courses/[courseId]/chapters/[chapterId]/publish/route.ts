export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, chapterId } = params; // Destructure params here
    const userId = String(session.user.id);

    // Get request data
    const values = await req.json();
    const validationResult = updateSchema.safeParse(values);

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 });
    }

    const courseOwner = await db.course.findFirst({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingChapter = await db.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!existingChapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // Proceed with updating the chapter
    const updatedData = validationResult.data;
    const updatedChapter = await db.chapter.update({
      where: { id: chapterId },
      data: updatedData,
    });

    // If the video URL has changed, handle Mux asset
    if (values.videoUrl && values.videoUrl !== existingChapter.videoUrl) {
      try {
        // Delete the existing Mux asset if the URL changed
        const existingMuxData = await db.muxData.findFirst({
          where: {
            chapterId: chapterId,
          },
        });

        if (existingMuxData) {
          await Video.Assets.del(existingMuxData.assetId);
          await db.muxData.delete({
            where: { id: existingMuxData.id },
          });
        }

        // Create new Mux asset for the new video URL
        const asset = await Video.Assets.create({
          input: values.videoUrl,
          playback_policy: "public",
          test: false,
        });

        // Store new Mux data in the database
        await db.muxData.create({
          data: {
            chapterId,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0].id,
          },
        });
      } catch (muxError) {
        console.error("[MUX_ERROR]", muxError);
        return new NextResponse("Failed to process video", { status: 500 });
      }
    }

    return NextResponse.json({ success: true, data: updatedChapter }, { status: 200 });
  } catch (error) {
    console.error("[COURSE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
