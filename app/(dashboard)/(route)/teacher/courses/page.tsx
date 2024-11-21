'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from "../courses/_components/data-table";
import { columns } from "../courses/_components/columns";
import toast from 'react-hot-toast';

const CoursesPage = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");
        console.log(response.data)
        toast.success("Data is Loaded!")
        setCourses(response.data);
        
      } catch (error) {
        console.error("Failed to fetch courses", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
     
    fetchCourses();
  }, [router]);
 
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default CoursesPage;
// app/courses/page.tsx (Server Component)

// import { authOptions } from "app/api/auth/[...nextauth]/route";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { db } from "@/lib/db";
// import { columns } from "../courses/_components/columns";
// import { DataTable } from "../courses/_components/data-table";

// const CoursesPage = async () => {
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user) {
//     redirect("/"); // Redirect unauthenticated users
//   }

//   const userId = String(session.user.id);

//   // Fetch courses for the authenticated user
//   const courses = await db.course.findMany({
//     where: { userId },
//     orderBy: { createAt: "asc" },
//   });

//   return (
//     <div className="p-6">
//       <div className="container mx-auto py-10">
//         <DataTable columns={columns} data={courses} />
//       </div>
//     </div>
//   );
// };

// export default CoursesPage;
