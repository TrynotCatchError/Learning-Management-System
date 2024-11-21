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

         
           
            const unpublishedCourse = await db.course.update ({
                  where:{
                        id: params.courseId,
                        userId,
                  },
                  data:{
                        isPublished: true,
                  }
            })
    
    
    
            return  NextResponse.json({unpublishedCourse})
    
    
    
    
    
    
      } catch(error) 
      {
            console.log("Server Error",error)
      }         
      
}