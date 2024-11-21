// import React from 'react';
// import { db } from '../../../../../../lib/db';
// import { getServerSession } from "next-auth/next";
// import { authOptions } from '../../../../../api/auth/[...nextauth]/route'; // Import your NextAuth options
// import { redirect } from 'next/navigation';
// import AnalyticsPage from '../../analytics/page'
// const CourseIdPage = async ({
//   params,
// }: {
//   params: { courseId: string };
// }) => {
//   // Retrieve session from NextAuth
//   const session = await getServerSession(authOptions);

//   // Check if user is authenticated
//   if (!session || !session.user) {
//     redirect('/');
//     return null; // Return null to avoid rendering the component
//   }

//   const course = await db.course.findUnique({
//     where: {
//       id: params.courseId,
//     },
//   });

//   if (!course) {
//     redirect('/');
//     return null; // Return null to avoid rendering the component
//   }

//   const requiredFields = [
//     course.title,
//     course.description,
//     course.imageUrl,
//     course.price,
//     course.categoryId,
//   ];

//   const totalFields = requiredFields.length;
//   const completedFields = requiredFields.filter(Boolean).length;

//   const completionText = `(${completedFields} / ${totalFields})`;

//   return (
//     <div className="p-6">
//     <div className="flex items-center justify-between">
//       <div className="flex flex-col gap-y-2">
//         <h1 className="text-2xl font-medium">CourseID: {params.courseId}</h1>
//         <span>Complete all fields {completionText}</span>
//       </div>
//     </div>
//   </div>

//   )
  
// };

// export default CourseIdPage;








import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { redirect } from "next/dist/server/api-utils";


export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const course = await db.course.findUnique({
      where: { id: params.courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newCourse = await db.course.create({
      data,
    });
    console.log(newCourse)
    
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
