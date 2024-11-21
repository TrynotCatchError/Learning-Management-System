"use client"

import { cn } from "@/lib/utils";
import MuxPlayer from '@mux/mux-player-react';
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";

interface VideoPlayerProps {
      playbackId: string;
      courseId:string;
      chapterId:string;
      nextChapterId?: string;
      isLocked:string;
      comPleteOnEnd: string;
      title: string;
};

const VideoPlayer = ({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    comPleteOnEnd,
    title,
}):VideoPlayerProps => {


   const [ isReady, setIsReady ] = useState(false);


   




      return(
            <div className="relative aspect-video">
                  {/* {!isLocked && (
                        <div className="absolute inset-0 items-center justify-center bg-slate-800">
                              <Loader2 className="h-8 w-8 animate-spin text-secondary"/>
                        </div>
                  )}
                  {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                          <Lock className="h-8 w-8"/>      
                           <p className="text-sm">
                              This Chapter is Locked
                           </p>
                        
                        
                        </div>
                          
                  )}
                  {!isLocked && (
                        <MuxPlayer 
                          title={title}
                          className={cn(
                              !isReady && "hidden"
                          )}
                           onCanPlay={() => setIsReady(true)}
                           onEnded={()=> {}}
                           autoPlay                  
                        />
                  )} */}
           
           {/* <MuxPlayer 
                          title={title}
                          className={cn(
                              !isReady && "hidden"
                          )}
                           onCanPlay={() => setIsReady(true)}
                           onEnded={()=> {}}
                           autoPlay                  
                        /> */}
            
            <MuxPlayer
                    streamType="on-demand"
                    playbackId={playbackId}
                    metadataVideoTitle="Placeholder (optional)"
                    metadataViewerUserId="Placeholder (optional)"
                    primaryColor="#FFFFFF"
                    secondaryColor="#000000"
                  title={title}
                 
                   onCanPlay={() => setIsReady(true)}
                   onEnded={()=> {}}
                   autoPlay                  
            />
            
            
            </div>
      )
} 


export default VideoPlayer;