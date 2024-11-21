import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route"
import { string } from "zod";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function PATCH(
      req: Request,
      {params}: {params: {courseId: string} }
){
      try {
            const session = getServerSession(authOptions)
            const userId = await String(session.user)

            if(!userId) {
                  return new NextResponse("Unauthorize user from serverside api",{status:401})
            }

            const course = await db.course.findUnique({
                  where:{
                        id: params.courseId,
                        userId
                  },
                  include:{
                        chapters:{
                              include:{
                                    muxData: true,
                              }
                        }
                  }
            })


            if(!course) {
                  return new NextResponse("not found ",{status: 404})
            }
            
            const hasPublishedChapter = course.chapters.some((chapter) => ChapterAccessForm.isPublished);

            if(!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter){
                  return new NextResponse("Missing requied fields", {status:401})
            }
    
            const publishedCourse = await db.course.update ({
                  where:{
                        id: params.courseId,
                        userId,
                  },
                  data:{
                        isPublished: true,
                  }
            })
    
    
    
            return  NextResponse.json({publishedCourse})
    
    
    
    
    
    
      } catch(error) 
      {
            console.log("Server Error",error)
      }         
      
}