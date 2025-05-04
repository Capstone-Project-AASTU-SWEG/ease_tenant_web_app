"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Define variants for the loader component
const loaderVariants = cva("", {
  variants: {
    variant: {
      spinner: "relative",
      dots: "flex items-center justify-center gap-1",
      pulse: "flex items-center justify-center",
      progress: "relative overflow-hidden",
      skeleton: "animate-pulse rounded-md bg-muted/60",
    },
    size: {
      xs: "h-4 w-4",
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
      full: "w-full",
    },
  },
  defaultVariants: {
    variant: "spinner",
    size: "md",
  },
});

// Define the props interface
export interface LoaderProps extends VariantProps<typeof loaderVariants> {
  className?: string;
  text?: string;
  textPosition?: "top" | "bottom" | "left" | "right";
  textClassName?: string;
  color?: string;
  secondaryColor?: string;
  speed?: "slow" | "normal" | "fast";
  overlay?: boolean;
  overlayClassName?: string;
  customIndicator?: React.ReactNode;
  progress?: number;
  animate?: boolean;
}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      className,
      variant = "spinner",
      size = "md",
      text,
      textPosition = "bottom",
      textClassName,
      color,
      secondaryColor,
      speed = "normal",
      overlay = false,
      overlayClassName,
      customIndicator,
      progress = 0,
      animate = true,
    },
    ref,
  ) => {
    // Define animation speeds
    const speedValues = {
      slow: 1.5,
      normal: 1,
      fast: 0.6,
    };

    // Define animation duration based on speed
    const duration = speedValues[speed];

    // Spinner animation
    const spinnerAnimation = {
      animate: animate ? { rotate: 360 } : {},
      transition: { duration: duration, ease: "linear", repeat: Infinity },
    };

    // Dots animation
    const dotsAnimation = {
      initial: { scale: 0.5, opacity: 0.3 },
      animate: animate ? { scale: 1, opacity: 1 } : {},
      transition: {
        duration: duration / 3,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    };

    // Pulse animation
    const pulseAnimation = {
      initial: { scale: 0.8, opacity: 0.5 },
      animate: animate ? { scale: 1, opacity: 1 } : {},
      transition: {
        duration: duration / 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    };

    // Progress animation
    const progressAnimation = {
      initial: { width: "0%" },
      animate: animate ? { width: `${progress}%` } : {},
      transition: { duration: duration / 2, ease: "easeInOut" },
    };

    // Determine text container classes based on position
    const textContainerClasses = {
      top: "flex flex-col items-center gap-2",
      bottom: "flex flex-col items-center gap-2",
      left: "flex flex-row-reverse items-center gap-3",
      right: "flex flex-row items-center gap-3",
    };

    // Determine text position classes
    const textPositionClasses = {
      top: "order-first",
      bottom: "order-last",
      left: "order-first",
      right: "order-last",
    };

    // Render the appropriate loader based on variant
    const renderLoader = () => {
      // If custom indicator is provided, use it
      if (customIndicator) {
        return customIndicator;
      }

      // Otherwise render based on variant
      switch (variant) {
        case "spinner":
          return (
            <motion.div
              className={cn(
                "rounded-full border-2 border-t-transparent",
                color ? `border-${color}` : "border-primary",
                loaderVariants({ variant, size }),
                className,
              )}
              style={{
                borderColor: color || undefined,
                borderTopColor: "transparent",
              }}
              {...spinnerAnimation}
            />
          );

        case "dots":
          return (
            <div className={cn(loaderVariants({ variant, size }), className)}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "rounded-full",
                    color ? `bg-${color}` : "bg-primary",
                    size === "xs"
                      ? "h-1 w-1"
                      : size === "sm"
                        ? "h-1.5 w-1.5"
                        : "h-2 w-2",
                  )}
                  style={{
                    backgroundColor: color || undefined,
                  }}
                  {...dotsAnimation}
                  transition={{
                    ...dotsAnimation.transition,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          );

        case "pulse":
          return (
            <motion.div
              className={cn(
                "rounded-full",
                color ? `bg-${color}` : "bg-primary",
                loaderVariants({ variant, size }),
                className,
              )}
              style={{
                backgroundColor: color || undefined,
              }}
              {...pulseAnimation}
            />
          );

        case "progress":
          return (
            <div
              className={cn(
                "h-1.5 w-full rounded-full bg-muted",
                loaderVariants({ variant, size: "full" }),
                className,
              )}
              style={{
                backgroundColor: secondaryColor || undefined,
              }}
            >
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  color ? `bg-${color}` : "bg-primary",
                )}
                style={{
                  backgroundColor: color || undefined,
                }}
                {...progressAnimation}
              />
            </div>
          );

        case "skeleton":
          return (
            <div
              className={cn(loaderVariants({ variant, size }), className)}
              style={{
                backgroundColor: secondaryColor || undefined,
              }}
            />
          );

        default:
          return null;
      }
    };

    // Wrap the loader with text if provided
    const loaderWithText = text ? (
      <div className={cn(textContainerClasses[textPosition])}>
        {renderLoader()}
        <span
          className={cn(
            "text-sm text-muted-foreground",
            textPositionClasses[textPosition],
            textClassName,
          )}
        >
          {text}
        </span>
      </div>
    ) : (
      renderLoader()
    );

    // If overlay is true, wrap with a full-screen overlay
    if (overlay) {
      return (
        <div
          ref={ref}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
            overlayClassName,
          )}
        >
          {loaderWithText}
        </div>
      );
    }

    // Otherwise, just return the loader
    return <div ref={ref}>{loaderWithText}</div>;
  },
);

Loader.displayName = "Loader";

// Export specialized loaders for convenience
export const Spinner = React.forwardRef<
  HTMLDivElement,
  Omit<LoaderProps, "variant">
>((props, ref) => <Loader ref={ref} variant="spinner" {...props} />);
Spinner.displayName = "Spinner";

export const Dots = React.forwardRef<
  HTMLDivElement,
  Omit<LoaderProps, "variant">
>((props, ref) => <Loader ref={ref} variant="dots" {...props} />);
Dots.displayName = "Dots";

export const Pulse = React.forwardRef<
  HTMLDivElement,
  Omit<LoaderProps, "variant">
>((props, ref) => <Loader ref={ref} variant="pulse" {...props} />);
Pulse.displayName = "Pulse";

export const Progress = React.forwardRef<
  HTMLDivElement,
  Omit<LoaderProps, "variant">
>((props, ref) => <Loader ref={ref} variant="progress" {...props} />);
Progress.displayName = "Progress";

export const Skeleton = React.forwardRef<
  HTMLDivElement,
  Omit<LoaderProps, "variant">
>((props, ref) => <Loader ref={ref} variant="skeleton" {...props} />);
Skeleton.displayName = "Skeleton";
