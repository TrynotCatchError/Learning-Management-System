import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import * as z from 'zod';
import { authOptions } from "../../auth/[...nextauth]/route"; // Assuming you are using nextauth for authentication
import toast from "react-hot-toast";
import Mux from "@mux/mux-node";


const {Video} = new Mux (
  process.env.MUX_TOKEN!,
  process.env.MUX_TOKEN_SECRET!,
)






export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = await params;
    const values = await req.json();
    const userId = String(session.user.id); // Ensure userId is a string
 // Ensure you are using the correct user ID here

    // Update the course in the database
    const course = await db.course.update({
      where: {
        id: courseId,
        userId: userId, // Ensure userId is passed correctly
      },
      data: {
        ...values, // Update with the data from the request
      },
    });
    
    return NextResponse.json(course); // Return the updated course
  } catch (error) {
    console.error("[COURSE_ERROR]", String(error));
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}






export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = await params;
    const values = await req.json();
    const userId = String(session.user); // Ensure userId is a string


    
    const course = await db.course.update({
      where: {
        id: courseId,
        userId: userId, 
      },
       include:{
        chapters:{
          include:{
              muxData: true,
          }
        
        }
       }
     });
      
     if(!course){
      return new NextResponse("not found", {status:404})
     }
      
      
     for (const chapter of course.chapters) {
      if(chapter.muxData.assetId) {
         await Video.Assests.del(chapter.muxData.assetId)
      }
     }

      const deletedCourse = await db.course.delete({
         where: {
          id: params.courseId
         }
      })
    return NextResponse.json(deletedCourse); // Return the updated course
  } catch (error) {
    console.error("[COURSE_ERROR]", String(error));
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
