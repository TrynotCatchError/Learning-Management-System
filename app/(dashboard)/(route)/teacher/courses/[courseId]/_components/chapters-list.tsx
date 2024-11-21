'use client';

import { Chapter } from '@prisma/client';
import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

import { cn } from '../../../../../../../lib/utils';
import { Grid, Pencil } from 'lucide-react';
import { Badge } from '../../../../../../../@/components/ui/badge';





interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updatedData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

const ChaptersList = ({
  items,
  onReorder,
  onEdit,
}: ChaptersListProps) => {
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedChapters = Array.from(chapters);
    const [movedChapter] = reorderedChapters.splice(result.source.index, 1);
    reorderedChapters.splice(result.destination.index, 0, movedChapter);

    setChapters(reorderedChapters);

    const updatedData = reorderedChapters.map((chapter, index) => ({
      id: chapter.id,
      position: index + 1,
    }));

    onReorder(updatedData);
  };


 


  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => {
              const chapterClasses = cn(
                "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
              );
              const handleClasses = cn(
                "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
              );
              const statusBadgeClasses = cn(
                "bg-slate-500",
                chapter.isPublished && "bg-sky-700"
              );

              return (
                <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                  {(provided) => (
                    <div
                      className={chapterClasses}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className={handleClasses} {...provided.dragHandleProps}>
                        <Grid className="h-5 w-5" />
                      </div>
                      {chapter.title}
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        {chapter.isFree && <Badge>Free</Badge>}
                        <Badge className={statusBadgeClasses}>
                          {chapter.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Pencil 
                          onClick={() => onEdit(chapter.id)}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChaptersList;
