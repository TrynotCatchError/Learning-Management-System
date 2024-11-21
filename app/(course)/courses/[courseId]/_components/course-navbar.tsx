"use client"
import React from 'react';
import { Progress } from "@/components/ui/progress"

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CourseNavbarProps {
  course: {
    id: string;
    title: string;
  };
  progressCount: number;
  totalChapters: number;
}

const CourseNavbar = ({ course, progressCount, totalChapters }: CourseNavbarProps) => {
  const router = useRouter();

  // Navigate back to the previous page
  const goBack = () => {
    router.back();
  };

  // Calculate progress percentage
  const progressPercentage =
    totalChapters > 0 ? Math.round((progressCount / totalChapters) * 100) : 0;

  return (
    <div className="flex items-center justify-between bg-white border-b px-6 py-4 shadow-sm">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Course Title */}
      <div className="flex flex-col items-center">
        <h1 className="text-lg font-semibold text-slate-700">{course.title}</h1>
        {totalChapters > 0 && (
          <p className="text-sm text-slate-500">
            {progressCount}/{totalChapters} chapters completed
          </p>
        )}
      </div>

      {/* Progress Bar */}
      {totalChapters > 0 && (
        <div className="w-[200px]">
          <Progress value={progressPercentage} />
        </div>
      )}
    </div>
  );
};

export default CourseNavbar;
