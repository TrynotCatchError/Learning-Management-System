


import Image from 'next/image';
import Link from 'next/link'
import React from 'react'


interface CourseCardProps {
      id: string;
      title: string;
      imageUrl:string;
      chaptersLength: number;
      price: number;
      progress: number | null;
      category: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
      id,
      title,
      imageUrl,
      chaptersLength,
      price,
      progress,
      category,
    }) => {
      return (
        <Link href={`/courses/${id}`}>
          <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
              <Image
                fill
                className="object-cover"
                alt={title}
                src={imageUrl || '/karindev-nobg.png'}
                
              />
            </div>
            <div className="mt-2">
              
              <h3 className="text-sm font-medium">{title}</h3>
              <p className="text-xs text-gray-500">{category}</p>
              <p className="text-xs text-gray-500">{chaptersLength} Chapter</p>
              <p className="text-xs text-gray-500">{price} $</p>
              {/* <p className="text-sm font-semibold">${price.toFixed(2)}</p> */}
              {progress !== null && (
                <p className="text-xs text-green-500">Progress: {progress}%</p>
              )}
            </div>
          </div>
        </Link>
      );
    };
    