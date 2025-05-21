"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Maximize2,
  Pause,
  Play,
  Share2,
} from "lucide-react";
import ENV from "@/config/env";

// Fallback assets
const ASSETS = {
  IMAGES: {
    BUILDING_IMAGE: "/placeholder.svg?height=600&width=800",
  },
};

type ExtendedBuilding = {
  id: string;
  name: string;
  formattedAddress: string;
  imageUrls?: string[];
  // Add other properties as needed
};

type ImageGalleryProps = {
  building: ExtendedBuilding;
  currentMediaIndex: number;
  setCurrentMediaIndex: (index: number) => void;
  handleNextMedia: () => void;
  handlePrevMedia: () => void;
  autoplayEnabled: boolean;
  setAutoplayEnabled: (enabled: boolean) => void;
};

export const ImageGallery = ({
  building,
  currentMediaIndex,
  setCurrentMediaIndex,
  handleNextMedia,
  handlePrevMedia,
  autoplayEnabled,
  setAutoplayEnabled,
}: ImageGalleryProps) => {
  const mediaControls = useAnimation();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log({isFullscreen})

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

  // Reset animation when media changes
  useEffect(() => {
    mediaControls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    });
  }, [currentMediaIndex, mediaControls]);

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
      {/* Image Gallery */}
      <div className="relative flex-1 bg-black/95">
        {loadingProgress < 100 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="mb-4 text-white/90">Loading image...</div>
            <div className="w-64">
              <Progress value={loadingProgress} className="h-1.5" />
            </div>
          </div>
        )}

        <motion.div
          animate={mediaControls}
          initial={{ opacity: 0, scale: 0.95 }}
          className="relative h-full w-full"
        >
          <Image
            src={
              `${ENV.NEXT_PUBLIC_BACKEND_BASE_URL_WITHOUT_PREFIX}/${building.imageUrls?.[currentMediaIndex]}` ||
              ASSETS.IMAGES.BUILDING_IMAGE ||
              "/placeholder.svg"
            }
            alt={`${building.name} - Image ${currentMediaIndex + 1}`}
            className="h-full w-full object-contain"
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
            onLoadingComplete={() => setLoadingProgress(100)}
          />
        </motion.div>

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-10"
            >
              {/* Image counter */}
              <motion.div
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {currentMediaIndex + 1} / {building.imageUrls?.length || 0}
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
                  size="sm"
                  className="rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-black/50"
                  onClick={() => setAutoplayEnabled(!autoplayEnabled)}
                >
                  {autoplayEnabled ? (
                    <>
                      <Pause className="mr-1.5 h-3.5 w-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="mr-1.5 h-3.5 w-3.5" />
                      <span>Slideshow</span>
                    </>
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

      {/* Thumbnails */}
      <div className="border-t bg-background/95 p-4 backdrop-blur-md">
        <ScrollArea className="h-20 w-full whitespace-nowrap">
          <div className="flex gap-2">
            {building.imageUrls?.map((url, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative h-16 w-24 cursor-pointer overflow-hidden rounded-md border-2 transition-all ${
                  idx === currentMediaIndex
                    ? "border-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                    : "border-transparent"
                }`}
                onClick={() => setCurrentMediaIndex(idx)}
              >
                <Image
                  src={
                    `${ENV.NEXT_PUBLIC_BACKEND_BASE_URL_WITHOUT_PREFIX}/${url}` ||
                    "/placeholder.svg"
                  }
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  fill
                  sizes="96px"
                />
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
