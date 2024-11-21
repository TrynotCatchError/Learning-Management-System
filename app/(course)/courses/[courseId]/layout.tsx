import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getProgress } from 'actions/get-progress';
import CourseSidebar from './_components/course-sidebar';
import CourseMobileSidebar from './_components/course-mobile';
import CourseNavbar from './_components/course-navbar';

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const session = await getServerSession(authOptions);

  // Ensure user is authenticated
  if (!session?.user) {
    return redirect('/');
  }

  const userId = String(session.user);

  // Fetch course details with chapters and user progress
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  // Redirect if course is not found
  if (!course) {
    return redirect('/');
  }

  // Calculate progress count
  const progressCount = await getProgress(userId, course.id);

  return (
    <div className="h-full">
      {/* Navbar Section */}
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>

      {/* Mobile Sidebar */}
      <CourseMobileSidebar course={course} progressCount={progressCount} />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>

      {/* Main Content */}
      <main className="md:pl-80 h-full p-[80px]">{children}</main>
    </div>
  );
};

export default CourseLayout;
