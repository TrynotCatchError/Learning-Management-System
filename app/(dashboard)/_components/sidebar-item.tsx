import React from 'react';
import { LucideIcon } from 'lucide-react'; // Adjust import based on your setup
import {cn} from '../../../lib/utils'
interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href }) => {
  return (
    <a href={href} className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
      <div className={cn(
        "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all"
      )}></div>
    </a>
  );
};

export default SidebarItem;
