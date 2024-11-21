// "use client";

// import { UploadDropzone } from "../lib/uploadthing";
// import { ourFileRouter } from "../app/api/uploadthing/core";
// import toast from "react-hot-toast";

// interface FileUploadProps {
//   onChange: (url?: string) => void;
//   endpoint: keyof typeof ourFileRouter;
// }

// export const FileUpload = ({
//   onChange,
//   endpoint,
// }: FileUploadProps) => {
//   return (
//     <UploadDropzone
//       endpoint={endpoint}
//       onClientUploadComplete={(res) => {
//         onChange(res?.[0].url);
//         toast.success("File uploaded successfully!");
//       }}
//       onUploadError={(error: Error) => {
//         toast.error(`Upload error: ${error.message}`);
//       }}
//     />
//   );
// };



"use client";

import { UploadDropzone } from "../lib/uploadthing";
import { ourFileRouter } from "../app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  metadata?: Record<string, string>; // Pass metadata, like chapterId
}

export const FileUpload = ({
  onChange,
  endpoint,
  metadata,
}: FileUploadProps) => {
  return (
    <UploadDropzone
  endpoint={endpoint}
  metadata={metadata}
  onClientUploadComplete={(res) => {
    onChange(res?.[0].url);
    console.log(`url: ${res}`)
    toast.success("File uploaded successfully!");
  }}
  onUploadError={(error: Error) => {
    toast.error(`Upload error: ${error.message}`);
  }}
  onProgress={({ progress }) => {
    // Update UI with progress percentage
    console.log(`Upload progress: ${progress}%`);
  }}
/>

  );
};
