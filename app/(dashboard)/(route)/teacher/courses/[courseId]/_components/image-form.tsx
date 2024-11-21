'use client'
import React, { useState } from 'react';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../../../../components/ui/button';
import { ImageIcon, Pencil, PlusCircle ,Loader} from 'lucide-react';
import toast from 'react-hot-toast';
import { Course } from '@prisma/client';
import { FileUpload } from '../../../../../../../components/file-upload';
import Image from 'next/image';

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

const ImageForm = ({
  initialData,
  courseId,
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData.imageUrl || "",
    },
  });

  const { setValue, watch } = form;
  const imageUrl = watch("imageUrl");

  const onSubmit = async () => {
    if (!imageUrl) {
      toast.error("Please select an image.");
      return;
    }
    try {
      setIsUploading(true);
      await axios.patch(`/api/courses/${courseId}`, { imageUrl });
      toast.success("Course image updated!");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsUploading(false);
    }
  };
  const { isSubmitting, isValid } = form.formState;
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button variant="ghost" onClick={toggleEdit} disabled={isUploading}>
          {isUploading ? "Uploading..." : (
            isEditing ? "Cancel" : !initialData.imageUrl ? (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add an Image
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Image
              </>
            )
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                setValue("imageUrl", url); // Set image URL in form state
                onSubmit(); // Trigger the submission with the updated URL
              }
            }}
          />
          {isSubmitting ? <Loader className="animate-spin h-4 w-4 mr-2" /> : null}
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        
        
         
        
        
        </div>
      )}
    </div>
  );
}

export default ImageForm;
