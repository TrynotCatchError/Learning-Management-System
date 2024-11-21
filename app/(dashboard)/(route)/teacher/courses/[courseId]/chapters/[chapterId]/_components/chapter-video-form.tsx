'use client';
import React, { useState } from 'react';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../../../../../../components/ui/button';
import { Pencil, PlusCircle, VideoIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Chapter, MuxData } from '@prisma/client';
import { FileUpload } from '../../../../../../../../../components/file-upload';
import MuxPlayer from '@mux/mux-player-react';
import { NextResponse } from 'next/server';
import { UploadDropzone } from '@/lib/uploadthing';



interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData.videoUrl || '',
    },
  });

  const { setValue, watch } = form;
  const videoUrl = watch('videoUrl');

  const onSubmit = async (videoUrl: z.infer<typeof formSchema>) =>  {
    if (!videoUrl.videoUrl || videoUrl.videoUrl.trim() === "") {
      return console.log("Invalid video URL", { status: 400 });
    }
    
    try {
      setIsUploading(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { videoUrl });   
        // { videoUrl },
      toast.success('Chapter updated! form');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong! form');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video
        <Button variant="ghost" onClick={toggleEdit} disabled={isUploading}>
          {isUploading ? (
            'Uploading...'
          ) : isEditing ? (
            'Cancel'
          ) : !initialData.videoUrl ? (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a Video
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Video
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ''} />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpload
                endpoint="chapterVideo"
                metadata='testvideo'
                onChange={(url) => {
                  if (url) {
                    setValue('videoUrl', url); // Update form state
                    onSubmit({ videoUrl: url }); // Directly trigger submission
                  }
                }}
              />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if the video does not appear.
        </div>
      )}
       

    </div>
  );
};

export default ChapterVideoForm;
