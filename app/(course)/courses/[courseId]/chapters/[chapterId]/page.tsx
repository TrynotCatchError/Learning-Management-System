'use server'
import Banner from "@/components/banner";
import { db } from "@/lib/db";
import { getChapter } from "actions/get-chapter";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import VideoPlayer from "./_components/video-player";
import { CourseEndrollButton } from "./_components/course-enroll-button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import axios from "axios";
// import { Preview } from "@/components/preview";




const ChapterIdPage = async ({ params }: { params: { courseId: string; chapterId: string } }) => {
  const { courseId, chapterId } = await params; // Properly unwrap the params object
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const userId = String(session.user);

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
   
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
         <div className="p-4">
           <VideoPlayer
              chapterId={params.chapterId}
              title={params.title}
              courseId={courseId}
              nextChapter={nextChapter?.id}
              playbackId={muxData?.playbackId!}
              isLocked={isLocked}
              completeOnEnd={completeOnEnd}
           />
         </div>
           <div className="p-4 flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-2xl font-semibold md-2">
                 {chapter.title}
              </h2>
               {/* {purchase ? (
                <div className="">

                </div>
               ) : (
                 <CourseEndrollButton
                  courseId={params.courseId}
                  price={courseId.price!}
                 />
               )} */}
                
          
            {/* <FetchDataBtn /> */}
           </div>
           <Separator />
           <div className="">
             {/* <Preview value={chapter.description}/> */}  {chapter.description}
           </div>
           {!!attachments.length &&(
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment)=> (
                  <a
                    href={attachment.id}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover: underline"
                  >
                    {attachment.name}
                  </a>
                ))}
              </div>
            </>
           )}
      </div>
      
    
    </div>
   
);
};

export default ChapterIdPage;
// import React from 'react'
// import { CourseEndrollButton } from './_components/course-enroll-button'
// const ChapterIdPage = () => {
//   return (
//     <div>ChapterIdPage
//       <CourseEndrollButton />
//     </div>
//   )
// }

// export default ChapterIdPage