'use client';
import { db } from '@/lib/db';
import { Chapter, Course, userProgress } from '@prisma/client';
import React from 'react';
import CourseSidebarItem from './course-sidebar-item';
import { getServerSession } from 'next-auth';
import { authOptions } from 'app/api/auth/[...nextauth]/route';

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: userProgress[] | null;
    })[];
  };
  progressCount: number;
  userId: string | null; // Pass userId as a prop for better SSR handling
  purchasee: boolean; // Pass purchase status as a prop
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  progressCount,
  userId,
  purchasee,
}) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        <p>{progressCount} chapters completed</p>
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchasee}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
