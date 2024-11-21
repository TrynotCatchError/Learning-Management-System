"use client"
import { Button } from '@/components/ui/button';
import { ConfirmModal } from 'app/components/modals/confirm-modal';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';





interface ChapterActionsProps {
      disabled: boolean;
      courseId: string;
      chapterId: string;
      isPublished: boolean;
}


const ChapterActions  = ({
      disabled,
      courseId,
      chapterId,
      isPublished,
}: ChapterActionsProps) => {
 
  const [isLoading, setIsUploading ] = useState(false)
  const router = useRouter
   
  const onDelete = async () => {
      try {
            setIsUploading(true)
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);

            toast.success("Chapter deleted");
           
            router.push(`/teacher/courses/${courseId}`)
      } catch (error) {
           toast.error("Something went wrong!")
      }finally{
            setIsUploading(false)
      }
  
   }
 
    const onClick = async () => {
       try {
        
      setIsUploading(true);

      if(isPublished){
        await axios.patch(`api/courses/${courseId}/chapters/${chapterId}/unpublish`)
        toast.success("Chapter upublush")
      }else{
        await axios.patch(`api/courses/${courseId}/chapters/${chapterId}/unpublish`)
        toast.success("Chapter publush")
      }
              
       } catch (error) {
        
       }
    }
 
 
 return (
    <div className='flex items-center gapp-x-2'>
       <Button
         onClick={onClick}
         disabled={disabled || isLoading}
         variant='outline'
         size='sm'
       >
         {isPublished ? "Unapublish" :
         "Publish"}
       </Button>
        <ConfirmModal onCofirm={onDelete}>
          <Button className='sm' disabled={isLoading}>
                 <Trash className='h-4 w-4'/>
          </Button>
         </ConfirmModal>
    </div>
  )
}

export default ChapterActions 

