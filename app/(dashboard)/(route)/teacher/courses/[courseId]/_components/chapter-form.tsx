'use client';
import React, { useState } from 'react';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { redirect, useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../../../../../../../components/ui/form';

import { Button } from '../../../../../../../components/ui/button';
import { PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../../../../../../lib/utils';
import { Chapter, Course } from '@prisma/client';
import { Input } from '../../../../../../../components/ui/input';
import ChaptersList from './chapters-list';

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const toggleCreating = () => setIsCreating((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter created!");
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleReorder = async (updatedChapters: { id: string; position: number }[]) => {
    try {
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, { list: updatedChapters });
      toast.success("Chapters reordered!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to reorder chapters");
    }
    console.log("Updated chapter positions:", updatedChapters);
  };

  const handleEdit =  (chapterId: string) => {
     redirect(`/teacher/courses/${courseId}/chapters/${chapterId}`)

  };





  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? <>Cancel</> : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      
      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}

      <div className={cn("text-sm mt-2", !initialData.chapters?.length && "text-slate-500 italic")}>
        {initialData.chapters?.length ? (
          <ChaptersList
            onEdit={handleEdit}
            onReorder={handleReorder}
            items={initialData.chapters}
          />
        ) : (
          "No chapters available"
        )}
      </div>
      
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
}

export default ChaptersForm;
