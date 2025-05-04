"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ContentLoaderProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  viewBox?: string;
  preserveAspectRatio?: string;
  speed?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  animate?: boolean;
  children?: React.ReactNode;
}

export const ContentLoader = React.forwardRef<
  SVGSVGElement,
  ContentLoaderProps
>(
  (
    {
      className,
      width = 400,
      height = 130,
      viewBox = "0 0 400 130",
      preserveAspectRatio = "none",
      speed = 1.2,
      backgroundColor = "currentColor",
      foregroundColor = "currentColor",
      animate = true,
      children,
      ...props
    },
    ref,
  ) => {
    const idClip = React.useId();
    const idGradient = React.useId();

    return (
      <svg
        ref={ref}
        className={cn("opacity-20", className)}
        width={width}
        height={height}
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        {...props}
      >
        <rect
          style={{ fill: `url(#${idGradient})` }}
          clipPath={`url(#${idClip})`}
          x="0"
          y="0"
          width="100%"
          height="100%"
        />

        <defs>
          <clipPath id={idClip}>{children}</clipPath>

          <linearGradient id={idGradient}>
            <stop offset="0%" stopColor={backgroundColor} stopOpacity={0.3} />
            <stop offset="50%" stopColor={foregroundColor} stopOpacity={0.5} />
            <stop offset="100%" stopColor={backgroundColor} stopOpacity={0.3} />
            {animate && (
              <motion.animate
                attributeName="x1"
                values="-100%; 100%"
                dur={`${speed}s`}
                repeatCount="indefinite"
              />
            )}
            {animate && (
              <motion.animate
                attributeName="x2"
                values="0%; 200%"
                dur={`${speed}s`}
                repeatCount="indefinite"
              />
            )}
          </linearGradient>
        </defs>
      </svg>
    );
  },
);

ContentLoader.displayName = "ContentLoader";

// Predefined content loaders
export const CardLoader = React.forwardRef<
  SVGSVGElement,
  Omit<ContentLoaderProps, "children">
>((props, ref) => (
  <ContentLoader ref={ref} height={180} {...props}>
    <rect x="0" y="0" rx="6" ry="6" width="100%" height="180" />
  </ContentLoader>
));
CardLoader.displayName = "CardLoader";

export const AvatarLoader = React.forwardRef<
  SVGSVGElement,
  Omit<ContentLoaderProps, "children">
>((props, ref) => (
  <ContentLoader
    ref={ref}
    height={40}
    width={40}
    viewBox="0 0 40 40"
    {...props}
  >
    <circle cx="20" cy="20" r="20" />
  </ContentLoader>
));
AvatarLoader.displayName = "AvatarLoader";

export const TextLoader = React.forwardRef<
  SVGSVGElement,
  Omit<ContentLoaderProps, "children">
>((props, ref) => (
  <ContentLoader ref={ref} height={80} {...props}>
    <rect x="0" y="0" rx="4" ry="4" width="100%" height="16" />
    <rect x="0" y="30" rx="3" ry="3" width="100%" height="10" />
    <rect x="0" y="50" rx="3" ry="3" width="80%" height="10" />
    <rect x="0" y="70" rx="3" ry="3" width="60%" height="10" />
  </ContentLoader>
));
TextLoader.displayName = "TextLoader";

export const TableLoader = React.forwardRef<
  SVGSVGElement,
  Omit<ContentLoaderProps, "children">
>((props, ref) => (
  <ContentLoader ref={ref} height={200} {...props}>
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="20" />
    <rect x="0" y="40" rx="3" ry="3" width="100%" height="15" />
    <rect x="0" y="70" rx="3" ry="3" width="100%" height="15" />
    <rect x="0" y="100" rx="3" ry="3" width="100%" height="15" />
    <rect x="0" y="130" rx="3" ry="3" width="100%" height="15" />
    <rect x="0" y="160" rx="3" ry="3" width="100%" height="15" />
    <rect x="0" y="190" rx="3" ry="3" width="100%" height="15" />
  </ContentLoader>
));
TableLoader.displayName = "TableLoader";
