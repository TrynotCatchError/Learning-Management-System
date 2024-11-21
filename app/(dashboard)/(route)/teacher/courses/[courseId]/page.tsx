import TitleForm from "./_components/title-form";
import React from "react";
import { db } from "../../../../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { IconBadge } from "../../../../../components/icon-badge";
import { CircleDollarSign, File, LayoutDashboard, ListCheck } from "lucide-react";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChaptersForm from "./_components/chapter-form";
import Actions from "./_components/actions";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  try {
    const session = await getServerSession(authOptions);
    const userId = String(session?.user?.id); // No need to use `await` with String()
    const { courseId } = await params;// No need to use `await` with params

    if (!userId) {
      redirect("/");
      return null;
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: { orderBy: { position: "asc" } },
        attachments: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!course) {
      redirect("/");
      return null;
    }

    const categories = await db.category.findMany({ orderBy: { name: "asc" } });

    const requiredFields = [
      course.title,
      course.description,
      course.imageUrl,
      course.price,
      course.categoryId,
      course.chapters.some(chapter => chapter.isPublished),
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields} / ${totalFields})`;
 

    const isComplete = requiredFields.every(Boolean);
    return (
       <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
        </div>
         <Actions 
          disabled={!isComplete}
          courseId={params.courseId}
          isPublished={course.isPublished}
         />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge size="sm" variant="success" icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <ChaptersForm initialData={course} courseId={course.id} />
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListCheck} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <div>TODO: Chapters</div>
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
      </> );
  } catch (error) {
    console.error("COURSE_ERROR:", error);
    return null;
  
  
  }
};

export default CourseIdPage;
