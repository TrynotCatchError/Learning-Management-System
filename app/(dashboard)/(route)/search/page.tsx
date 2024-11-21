

import { db } from '@/lib/db';
import React from 'react';
import Categories from './_components/categories';
import SearchInput from 'app/components/search-input';
import { getCourses } from 'actions/get-courses';
import { getSession } from 'next-auth/react';  // Assuming you're using NextAuth
import { useSession, signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import CoursesList from '@/components/course-list';
import { CourseCard } from '@/components/course-card';



const  session = getServerSession(authOptions)
interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return <div>Please log in to see courses.</div>;
  }
  const userId = String(session.user)


  const categories = await db.category.findMany({
    orderBy: { name: 'asc' },
  });

  const courses = await getCourses({
    userId: userId,
    title: searchParams.title,
    categoryId: searchParams.categoryId,
  });

  return (
    <>
       <div className="pt-6">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};


export default SearchPage;


{/* <div className="px-6 pt-6 mb:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories} />
        
        <div>
          {courses.map(course => (
            <div key={course.id}>{course.title}</div> 
          ))}
        </div>
      </div> */}