import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as z from 'zod';
import { authOptions } from "app/api/auth/[...nextauth]/route";
import Mux from '@mux/mux-node';
import MuxUploader from '@mux/mux-uploader-react';
const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

const updateSchema = z.object({
  title: z.string().optional(),
  videoUrl: z.string().url().optional(), // Ensure it's a valid URL if provided
});





export async function PUT(
      req: Request,
      { params }: { params: { courseId: string; chapterId: string } }
    ) {
     
      try {
        
            
        const session = await getServerSession(authOptions);
    
        if (!session || !session.user) {
          return new NextResponse("Unauthorized", { status: 401 });
        }
    
        const { courseId, chapterId } = await params;
        const userId = String(session.user.id);
        const { isPublished, ...values } = await req.json();
    
        // Validate the request payload
        const validationResult = updateSchema.safeParse(values);
        if (!validationResult.success) {
          return NextResponse.json({ error: validationResult.error.errors }, { status: 400 });
        }
    
     
    
       
         const UnpublishedChapters = await db.chapter.update({
            where: {
                  id: params.courseId,
                  courseId: params.courseId,
            },
            data: {
                 isPublished: false
            }
         });
        
          if(!UnpublishedChapters.length) {
            await db.course.update({
              where: {
                id: params.courseId
              },
              data: {
                isPublished: false,
              }
            })
          }
     
         return NextResponse.json(UnpublishedChapters )
     
     
      }catch(error){
          return new NextResponse("Errror to Delete chapter try again later!", {status: 500})
      }
    }


















export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
   
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, chapterId } = params;
    const userId = String(session.user.id);
    const { isPublished, ...values } = await req.json();

   
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
      where: {
            id: params.chapterId,
            courseId: params.courseId
      }
      
    });

     
   const muxData = await db.muxData.findUnique({
      where: {
            chapterId: params.chapterId
      }
   })
    

    if (!existingChapter || !muxData || !existingChapter.title || !existingChapter.description || !existingChapter.videoUrl) {
      return new NextResponse("No requied fields", { status: 404 });
    }

    
    const publishedChapter = await db.chapter.update({
      where: {
            id:params.chapterId,
            courseId: params.courseId,
      },
      data: {
            isPublished: true,
      }
    })
    

    return NextResponse.json({ publishedChapter }, { status: 200 });
  } catch (error) {
    console.error("[COURSE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
