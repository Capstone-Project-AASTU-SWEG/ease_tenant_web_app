"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader, type LoaderProps } from "@/components/custom/loader";

// Define variants for the page loader component
const pageLoaderVariants = cva("", {
  variants: {
    variant: {
      default:
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      minimal: "fixed inset-0 z-50 flex items-center justify-center",
      top: "fixed top-0 left-0 right-0 z-50",
      bottom: "fixed bottom-0 left-0 right-0 z-50",
      card: "absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-lg",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Define the props interface
export interface PageLoaderProps
  extends VariantProps<typeof pageLoaderVariants> {
  isLoading: boolean;
  className?: string;
  loaderVariant?: LoaderProps["variant"];
  loaderSize?: LoaderProps["size"];
  loaderColor?: string;
  text?: string;
  textClassName?: string;
  children?: React.ReactNode;
  exitAnimation?: boolean;
  customLoader?: React.ReactNode;
  delayMs?: number;
}

export const PageLoader = React.forwardRef<HTMLDivElement, PageLoaderProps>(
  (
    {
      isLoading,
      className,
      variant = "default",
      loaderVariant = "spinner",
      loaderSize = "md",
      loaderColor,
      text,
      textClassName,
      children,
      exitAnimation = true,
      customLoader,
      delayMs = 0,
    },
    ref,
  ) => {
    const [shouldRender, setShouldRender] = React.useState(false);

    React.useEffect(() => {
      let timeout: NodeJS.Timeout;

      if (isLoading) {
        timeout = setTimeout(() => {
          setShouldRender(true);
        }, delayMs);
      } else {
        setShouldRender(false);
      }

      return () => clearTimeout(timeout);
    }, [isLoading, delayMs]);

    // Define animation variants
    const containerAnimations = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: exitAnimation ? { opacity: 0 } : {},
      transition: { duration: 0.2 },
    };

    // Progress bar animation for top/bottom variants
    const progressAnimations = {
      initial: { width: "0%" },
      animate: { width: "100%" },
      exit: exitAnimation ? { width: "100%" } : {},
      transition: { duration: 2, ease: "easeInOut" },
    };

    // Render the appropriate loader based on variant
    const renderLoader = () => {
      if (customLoader) {
        return customLoader;
      }

      if (variant === "top" || variant === "bottom") {
        return (
          <motion.div
            className={cn(
              "h-1 bg-primary",
              loaderColor ? `bg-${loaderColor}` : "",
            )}
            style={{
              backgroundColor: loaderColor || undefined,
            }}
            {...progressAnimations}
          />
        );
      }

      return (
        <Loader
          variant={loaderVariant}
          size={loaderSize}
          color={loaderColor}
          text={text}
          textClassName={textClassName}
        />
      );
    };

    return (
      <>
        <AnimatePresence>
          {shouldRender && (
            <motion.div
              ref={ref}
              className={cn(pageLoaderVariants({ variant }), className)}
              {...containerAnimations}
            >
              {renderLoader()}
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </>
    );
  },
);

PageLoader.displayName = "PageLoader";
