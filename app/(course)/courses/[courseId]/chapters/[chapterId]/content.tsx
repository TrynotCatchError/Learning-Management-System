import Banner from "@/components/banner";
import { db } from "@/lib/db";
import { getChapter } from "actions/get-chapter";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";

const ContensFetching = async ({ params }: { params: { courseId: string; chapterId: string } }) => {
  const { courseId, chapterId } = await params; // Properly unwrap the params object
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const userId = String(session.user.id);

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  if (!chapterId && course.chapters.length > 0) {
    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
  }

  const {
    chapter,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    courseId,
    chapterId,
  });

  if (!chapter) {
    console.log("Error: Chapter or course not found");
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You have already completed this chapter" />
      )}
      {isLocked && (
        <Banner variant="warning" label="You need to purchase this course to view this chapter" />
      )}
    </div>
  );
};

export default ContensFetching;
