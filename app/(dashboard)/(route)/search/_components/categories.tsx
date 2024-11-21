"use client";

import React from "react";
import { IconType } from "react-icons";
import CategoriesItem from "./categories-item";
import {
  FcEngineering,
  FcFilm,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import { Category } from "@prisma/client";








interface CategoriesProps {
  items?: Category[]; // Made optional for fallback handling
}

const iconMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  Fitness: FcSportsMode,
  Accounting: FcSalesPerformance,
  Filming: FcFilm,
  Engineering: FcEngineering,
  "Computer Science": FcMultipleDevices,
};

const Categories = ({ items = [] }: CategoriesProps) => {
  if (items.length === 0) {
    return <div>No categories available.</div>;
  }

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoriesItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
         
        />
      ))}
      <p>Price:</p>
    </div>
  );
};

export default Categories;
