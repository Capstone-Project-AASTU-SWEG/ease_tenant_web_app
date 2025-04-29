"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import {
  Upload,
  X,
  FileText,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Film,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileUploaderProps {
  label?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  onFilesChange?: (files: File[]) => void;
  showPreview?: boolean;
  previewTypes?: string[];
  maxFiles?: number;
  className?: string;
}

type FileWithPreview = {
  file: File;
  url: string;
  type: "image" | "video" | "document";
  isPlaying?: boolean;
  isMuted?: boolean;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  );
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  label = "Upload Files",
  maxSizeMB = 50,
  acceptedFormats = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
  ],
  onFilesChange,
  showPreview = true,
  // previewTypes = [
  //   "image/jpeg",
  //   "image/png",
  //   "image/gif",
  //   "video/mp4",
  //   "video/quicktime",
  //   "video/x-msvideo",
  // ],
  maxFiles = 10,
  className,
}) => {
  const [filesWithPreviews, setFilesWithPreviews] = useState<FileWithPreview[]>(
    [],
  );
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Clean up object URLs when component unmounts
    return () => {
      filesWithPreviews.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [filesWithPreviews]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) processFiles(Array.from(selectedFiles));

    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      processFiles(Array.from(event.dataTransfer.files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const triggerFileInput = () => fileInputRef.current?.click();

  const getFileType = (file: File): "image" | "video" | "document" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "document";
  };

  const processFiles = (newFiles: File[]) => {
    setError(null);

    // Check if adding these files would exceed the max files limit
    if (filesWithPreviews.length + newFiles.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files`);
      return;
    }

    // Filter valid files
    const validFiles = newFiles.filter((file) => {
      const isValidType = acceptedFormats.includes(file.type);
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024;

      if (!isValidType) setError(`File type not supported: ${file.type}`);
      if (!isValidSize)
        setError(`File too large: ${file.name} (max ${maxSizeMB}MB)`);

      return isValidType && isValidSize;
    });

    if (validFiles.length > 0) {
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null || prev >= 100) {
            clearInterval(interval);
            return null;
          }
          return Math.min(prev + 5, 100);
        });
      }, 100);

      // Create file previews
      const newFilesWithPreviews = validFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        type: getFileType(file),
        isPlaying: false,
        isMuted: true,
      }));

      setFilesWithPreviews((prev) => [...prev, ...newFilesWithPreviews]);
      onFilesChange?.(validFiles);
    }
  };

  const removeFile = (index: number) => {
    setFilesWithPreviews((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    setFilesWithPreviews((prev) => {
      const newFiles = [...prev];
      const isPlaying = !newFiles[index].isPlaying;

      newFiles[index] = {
        ...newFiles[index],
        isPlaying,
      };

      if (isPlaying) {
        video.play();
      } else {
        video.pause();
      }

      return newFiles;
    });
  };

  const toggleMute = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    setFilesWithPreviews((prev) => {
      const newFiles = [...prev];
      const isMuted = !newFiles[index].isMuted;

      newFiles[index] = {
        ...newFiles[index],
        isMuted,
      };

      video.muted = isMuted;

      return newFiles;
    });
  };

  const openFullscreen = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/"))
      return <ImageIcon className="h-10 w-10 text-primary/70" />;
    if (type.startsWith("video/"))
      return <Film className="h-10 w-10 text-primary/70" />;
    return <FileText className="h-10 w-10 text-primary/70" />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="block font-normal">{label}</Label>
        {maxFiles > 1 && (
          <Badge variant="outline" className="text-xs font-normal">
            {filesWithPreviews.length} / {maxFiles} files
          </Badge>
        )}
      </div>

      <motion.div
        className={cn(
          "relative overflow-hidden rounded-md border-2 border-dashed p-8 text-center transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/5",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={acceptedFormats.join(",")}
          multiple={maxFiles > 1}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
        >
          <Upload className="h-8 w-8 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <p className="text-base font-medium">
            Drag and drop files here or click to browse
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Supports images, videos, and documents up to {maxSizeMB}MB each
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1 text-xs text-muted-foreground">
            {acceptedFormats.map((format) => (
              <Badge key={format} variant="secondary" className="font-normal">
                {format
                  .replace("image/", "")
                  .replace("video/", "")
                  .replace("application/", "")}
              </Badge>
            ))}
          </div>
        </motion.div>

        {uploadProgress !== null && (
          <motion.div
            className="absolute bottom-0 left-0 right-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Progress value={uploadProgress} className="h-1 rounded-none" />
          </motion.div>
        )}
      </motion.div>

      {error && (
        <motion.p
          className="text-sm font-medium text-destructive"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {error}
        </motion.p>
      )}

      <AnimatePresence>
        {showPreview && filesWithPreviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-medium">
                Uploaded Files ({filesWithPreviews.length})
              </h4>
              {filesWithPreviews.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilesWithPreviews([])}
                  className="h-8 text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filesWithPreviews.map((fileWithPreview, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-md border bg-card shadow-sm transition-all hover:shadow-md"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  layout
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted/30">
                    {fileWithPreview.type === "image" && (
                      <Image
                        src={fileWithPreview.url || "/placeholder.svg"}
                        alt={`Uploaded file ${index + 1}`}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}

                    {fileWithPreview.type === "video" && (
                      <>
                        <video
                          ref={(el) => {
                            videoRefs.current[index] = el;
                          }}
                          src={fileWithPreview.url}
                          className="h-full w-full object-cover"
                          loop
                          playsInline
                          muted={fileWithPreview.isMuted}
                          onEnded={() => {
                            setFilesWithPreviews((prev) => {
                              const newFiles = [...prev];
                              newFiles[index].isPlaying = false;
                              return newFiles;
                            });
                          }}
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePlay(index);
                                    }}
                                  >
                                    {fileWithPreview.isPlaying ? (
                                      <Pause className="h-4 w-4" />
                                    ) : (
                                      <Play className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {fileWithPreview.isPlaying ? "Pause" : "Play"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleMute(index);
                                    }}
                                  >
                                    {fileWithPreview.isMuted ? (
                                      <VolumeX className="h-4 w-4" />
                                    ) : (
                                      <Volume2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {fileWithPreview.isMuted ? "Unmute" : "Mute"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openFullscreen(index);
                                    }}
                                  >
                                    <Maximize className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Fullscreen</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </>
                    )}

                    {fileWithPreview.type === "document" && (
                      <div className="flex h-full w-full items-center justify-center">
                        {getFileIcon(fileWithPreview.file.type)}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      {fileWithPreview.type === "image" && (
                        <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      {fileWithPreview.type === "video" && (
                        <Film className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      {fileWithPreview.type === "document" && (
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <p className="truncate text-sm font-medium">
                        {fileWithPreview.file.name.length > 20
                          ? fileWithPreview.file.name.substring(0, 20) + "..."
                          : fileWithPreview.file.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(fileWithPreview.file.size)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
