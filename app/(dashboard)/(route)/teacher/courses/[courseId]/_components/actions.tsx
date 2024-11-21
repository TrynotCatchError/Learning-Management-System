"use client";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "app/components/modals/confirm-modal";
import axios from "axios";
import { useConfettiStore } from "hooks/use-confetti-store";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const [isLoading, setIsUploading] = useState(false);
  const router = useRouter;
  const confetti = useConfettiStore();
  const onClick = async () => {
    try {
      setIsUploading(true);
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpulish`);
        toast.success("Course unpulished");
      } else {
        await axios.patch(`/api/courses/${courseId}/pulish`);
        toast.success("Course pulished");
        confetti.onOpen();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsUploading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsUploading(true);
     
        await axios.delete(`/api/courses/${courseId}`);
        toast.success("Course Deleted!");
     
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gapp-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unapublish" : "Publish"}
      </Button>
      <ConfirmModal onCofirm={onDelete}>
        <Button className="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Actions;
