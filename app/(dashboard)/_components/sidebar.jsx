import React from 'react';
import Logo from './logo';
import SidebarRoutes from './sidebar_routes';
import SideBarFull from '../../dashboard/page'
const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-black shadow-sm">
      <div className="p-6">
        <Logo />
           <div className="border border-red-800">
             <SideBarFull />
             </div>
        {/* <SidebarRoutes /> */}
      </div>
      <div className="flex flex-col w-full"></div>
    </div>
  );
};

export default Sidebar;
