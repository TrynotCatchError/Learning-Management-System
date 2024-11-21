import CourseSidebar from './_components/course-sidebar';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from 'app/api/auth/[...nextauth]/route';

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const session = await getServerSession(authOptions);

  // Ensure user is authenticated
  if (!session?.user) {
    return <div>You must be logged in to view this course.</div>;
  }

  const userId = String(session.user);

  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        include: {
          userProgress: true,
        },
      },
    },
  });

  // Handle case where course is not found
  if (!course) {
    return <div>Course not found.</div>;
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: params.courseId,
      },
    },
  });
  
  const progressCount =
    course.chapters?.filter((chapter) => chapter.userProgress?.[0]?.isCompleted).length || 0;

  return (
    <CourseSidebar
      course={course}
      progressCount={progressCount}
      userId={userId}
      purchasee={!!purchase}
    />
  );
};

export default CoursePage;
