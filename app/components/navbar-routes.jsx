'use client'

import React from 'react'

import { usePathname } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import SearchInput from './search-input'
import { useSession, signOut } from 'next-auth/react';

const NavbarRoutes = () => {
 
  const pathname = usePathname();
  
  
  const { data: session, status } = useSession();
  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCoursePage = pathname?.startsWith('/courses')
  const isSearchPage = pathname === '/search'
 
    return (
      <> 
       {/* {isSearchPage && (
        <div className="hidden md:block justify-between ">
          <SearchInput />
        </div>
       )} */}
        
       <div className='felx gap-x-2 ml-auto'>
              {isTeacherPage || isCoursePage  ?(
             <Link href='/'>
              <Button size='sm' variant='ghost'>
                 <LogOut className='h-4 w-4 mr-2'/>
                 Exit
               </Button>
               </Link>  
               ) : (
                  <Link href='/teacher/courses'>
                     <Button size='sm' variant='ghost'>
                      Teacher Mode
                     </Button>
                  </Link>
               )}
       
         </div>
      </>
  
  )
}

export default NavbarRoutes