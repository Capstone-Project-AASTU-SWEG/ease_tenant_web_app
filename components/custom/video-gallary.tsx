"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Film,
  Maximize2,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";

type ExtendedBuilding = {
  id: string;
  name: string;
  formattedAddress: string;
  videoUrls?: string[];
  // Add other properties as needed
};

type VideoPlayerProps = {
  building: ExtendedBuilding;
  currentMediaIndex: number;
  setCurrentMediaIndex: (index: number) => void;
  isPlaying: boolean;
  togglePlayback: () => void;
  handleNextMedia: () => void;
  handlePrevMedia: () => void;
};

export const VideoPlayer = ({
  building,
  currentMediaIndex,
  setCurrentMediaIndex,
  isPlaying,
  togglePlayback,
  handleNextMedia,
  handlePrevMedia,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate loading progress
  useEffect(() => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentMediaIndex]);

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current
          .play()
          .catch((error) => console.error("Video play error:", error));
      } else {
        videoRef.current.pause();
      }

      videoRef.current.muted = isMuted;
    }
  }, [isPlaying, isMuted]);

  // Auto-hide controls
  useEffect(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`,
          );
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
  };

  // Animation variants
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex h-full flex-col" onMouseMove={handleMouseMove}>
      {/* Video Player */}
      <div className="relative flex-1 bg-black">
        {loadingProgress < 100 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="mb-4 text-white/90">Loading video...</div>
            <div className="w-64">
              <Progress value={loadingProgress} className="h-1.5" />
            </div>
          </div>
        )}

        <div className="flex h-full items-center justify-center">
          <video
            ref={videoRef}
            id="building-video"
            src={building.videoUrls?.[currentMediaIndex]}
            className="max-h-full max-w-full"
            controls={false}
            onEnded={() => togglePlayback()}
            onLoadedData={() => setLoadingProgress(100)}
          />

          {/* Video Controls Overlay */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-10"
              >
                {/* Play/Pause Button */}
                <div
                  className="absolute inset-0 flex cursor-pointer items-center justify-center"
                  onClick={togglePlayback}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="rounded-full bg-black/30 p-5 backdrop-blur-md"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-white" />
                    ) : (
                      <Play className="h-8 w-8 text-white" />
                    )}
                  </motion.div>
                </div>

                {/* Video counter */}
                <motion.div
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md"
                >
                  <div className="flex items-center gap-2">
                    <Film className="h-3.5 w-3.5" />
                    <span>
                      {currentMediaIndex + 1} /{" "}
                      {building.videoUrls?.length || 0}
                    </span>
                  </div>
                </motion.div>

                {/* Navigation Controls */}
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-black/50"
                      onClick={handlePrevMedia}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-black/50"
                      onClick={handleNextMedia}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>

                {/* Additional controls */}
                <motion.div
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute bottom-4 right-4 flex items-center gap-2"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-black/50"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-black/50"
                    onClick={toggleFullscreen}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-black/50"
                    onClick={() => {}}
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-black/50"
                    onClick={() => {}}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Video Thumbnails */}
      <div className="border-t bg-background/95 p-4 backdrop-blur-md">
        <ScrollArea className="h-20 w-full whitespace-nowrap">
          <div className="flex gap-2">
            {building.videoUrls?.map((url, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex h-16 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 bg-black/90 transition-all ${
                  idx === currentMediaIndex
                    ? "border-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                    : "border-transparent"
                }`}
                onClick={() => {
                  setCurrentMediaIndex(idx);
                  if (videoRef.current) {
                    videoRef.current.pause();
                  }
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="rounded-full bg-white/20 p-1.5"
                >
                  <Play className="h-5 w-5 text-white" />
                </motion.div>
                <div className="absolute bottom-0 right-0 rounded-tl-md bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  {idx + 1}
                </div>
                {idx === currentMediaIndex && (
                  <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
