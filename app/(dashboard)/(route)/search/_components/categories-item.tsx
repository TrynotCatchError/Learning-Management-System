"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

interface CategoriesItemProps {
  label: string;
  value: string; // Ensured it's required to avoid undefined issues
  icon?: IconType;
  price: number;
}

const CategoriesItem = ({
  label,
  value,
  icon: Icon,
}: CategoriesItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const updatedQuery = new URLSearchParams(searchParams.toString());

    if (isSelected) {
      updatedQuery.delete("categoryId");
    } else {
      updatedQuery.set("categoryId", value);
    }

    const url = `${pathname}?${updatedQuery.toString()}`;
    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
      )}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
      
    </button>
  );
};

export default CategoriesItem;
