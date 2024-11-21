'use client';

import React from 'react';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import CourseSidebar from './course-sidebar';
import { Chapter, Course, userProgress } from '@prisma/client';

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: userProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseMobileSidebar: React.FC<CourseMobileSidebarProps> = ({
  course,
  progressCount,
}) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
