"use client";

import React, { useState } from "react";
import * as UpChunk from "@mux/upchunk";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import * as z from "zod";
import MuxPlayer from "@mux/mux-player-react";
import { PlusCircle, Pencil, VideoIcon } from "lucide-react";
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoFormProps {
  initialData: {
    videoUrl?: string;
    muxData?: { playbackId?: string } | null;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm: React.FC<ChapterVideoFormProps> = ({
  initialData,
  courseId,
  chapterId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData?.videoUrl || undefined, // Safe access
    },
  });

  const { setValue, watch } = form;
  const videoUrl = watch("videoUrl");

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setStatusMessage("Preparing upload...");
      const response = await fetch(`/api/courses/${courseId}/mux`, {
        method: "POST",
      });
      const { url } = await response.json();

      const upload = UpChunk.createUpload({
        endpoint: url,
        file,
        chunkSize: 5120, // ~5MB chunks
      });

      upload.on("progress", (event) => {
        setProgress(Math.round(event.detail));
        setStatusMessage(`Uploading... ${Math.round(event.detail)}%`);
      });

      upload.on("success", () => {
        setStatusMessage("Upload successful!");
        toast.success("Video uploaded successfully!");
        router.refresh();
      });

      upload.on("error", (err) => {
        setStatusMessage("Upload failed.");
        toast.error(err.detail);
      });
    } catch (error) {
      toast.error("Something went wrong during the upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsUploading(true);
      await fetch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: data.videoUrl }),
      });
      toast.success("Video URL updated!");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update the video URL.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video
        <Button
          variant="ghost"
          onClick={toggleEdit}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : isEditing ? "Cancel" : "Edit Video"}
        </Button>
      </div>

      {!isEditing ? (
        initialData.courseId?(
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            metadata={{ courseId, chapterId }}
            onChange={(file) => {
              if (file) {
                handleUpload(file);
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter video.
          </div>
        </div>
      )}

      {progress > 0 && isUploading && (
        <div className="text-xs text-muted-foreground mt-2">
          Upload Progress: {progress}%
        </div>
      )}

      {statusMessage && (
        <div className="text-xs text-muted-foreground mt-2">{statusMessage}</div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos may take a few minutes to process. Refresh the page if the video is not visible.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
