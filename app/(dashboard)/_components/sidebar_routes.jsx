'use client'

import React from 'react';
import {  Layout ,Compass} from 'lucide-react';
import SidebarItem from './sidebar-item';


const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

// const TeacherRoutes = [
//   {
//     icon: List,
//     label: "Courses",
//     href: "/teacher/courses",
//   },
//   {
//     icon: BarChart,
//     label: "Analytics",
//     href: "/teacher/analytics",
//   },
// ];


const SidebarRoutes = () => {
  // const pathname = usePathname();
  // const isTeacherPage = pathname?.includes('/teacher')
  
  
  
  return (
    <div className="flex flex-col w-full">
      {guestRoutes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
