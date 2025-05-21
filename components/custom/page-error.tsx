"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  AlertTriangle,
  WifiOff,
  FileQuestion,
  ShieldAlert,
  Lock,
  RefreshCw,
  Home,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

// Define variants for the page error component
const pageErrorVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      variant: {
        "404": "text-primary",
        "500": "text-destructive",
        "403": "text-warning",
        offline: "text-muted-foreground",
        generic: "text-primary",
        maintenance: "text-info",
        "coming-soon": "text-secondary",
      },
      size: {
        sm: "p-4 gap-3",
        md: "p-6 gap-4",
        lg: "p-8 gap-6",
        xl: "p-12 gap-8",
      },
    },
    defaultVariants: {
      variant: "generic",
      size: "md",
    },
  },
);

// Define the action type
export interface ErrorAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  icon?: React.ReactNode;
}

// Define the props interface
export interface PageErrorProps extends VariantProps<typeof pageErrorVariants> {
  title?: string;
  code?: string | number;
  message?: string;
  description?: string;
  actions?: ErrorAction[];
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  messageClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
  illustrationClassName?: string;
  children?: React.ReactNode;
  animate?: boolean;
  fullPage?: boolean;
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  strokeWidth?: number;
}

const variantIcons: Record<string, React.ReactElement<IconProps>> = {
  "404": <FileQuestion strokeWidth={1.5} />,
  "500": <AlertCircle strokeWidth={1.5} />,
  "403": <ShieldAlert strokeWidth={1.5} />,
  offline: <WifiOff strokeWidth={1.5} />,
  generic: <AlertTriangle strokeWidth={1.5} />,
  maintenance: <RefreshCw strokeWidth={1.5} />,
  "coming-soon": <Lock strokeWidth={1.5} />,
};

// Map variants to default titles
const variantTitles: Record<string, string> = {
  "404": "Page Not Found",
  "500": "Server Error",
  "403": "Access Denied",
  offline: "You're Offline",
  generic: "Something Went Wrong",
  maintenance: "Under Maintenance",
  "coming-soon": "Coming Soon",
};

// Map variants to default messages
const variantMessages: Record<string, string> = {
  "404": "The page you're looking for doesn't exist or has been moved.",
  "500": "We're experiencing an internal server error. Please try again later.",
  "403": "You don't have permission to access this resource.",
  offline: "Please check your internet connection and try again.",
  generic: "An unexpected error occurred. Please try again.",
  maintenance:
    "We're currently performing maintenance. Please check back soon.",
  "coming-soon": "This page is under construction and will be available soon.",
};

// Map variants to default actions
const variantActions: Record<string, ErrorAction[]> = {
  "404": [
    {
      label: "Go Home",
      href: "/",
      icon: <Home className="mr-2 h-4 w-4" />,
      variant: "default",
    },
    {
      label: "Go Back",
      onClick: () => window.history.back(),
      icon: <ArrowLeft className="mr-2 h-4 w-4" />,
      variant: "ghost",
    },
  ],
  "500": [
    {
      label: "Try Again",
      onClick: () => window.location.reload(),
      icon: <RefreshCw className="mr-2 h-4 w-4" />,
      variant: "default",
    },
    {
      label: "Go Home",
      href: "/",
      icon: <Home className="mr-2 h-4 w-4" />,
      variant: "outline",
    },
  ],
  "403": [
    {
      label: "Go Home",
      href: "/",
      icon: <Home className="mr-2 h-4 w-4" />,
      variant: "default",
    },
    {
      label: "Contact Support",
      href: "/support",
      icon: <HelpCircle className="mr-2 h-4 w-4" />,
      variant: "outline",
    },
  ],
  offline: [
    {
      label: "Try Again",
      onClick: () => window.location.reload(),
      icon: <RefreshCw className="mr-2 h-4 w-4" />,
      variant: "default",
    },
  ],
  generic: [
    {
      label: "Try Again",
      onClick: () => window.location.reload(),
      icon: <RefreshCw className="mr-2 h-4 w-4" />,
      variant: "default",
    },
    {
      label: "Go Home",
      href: "/",
      icon: <Home className="mr-2 h-4 w-4" />,
      variant: "outline",
    },
  ],
  maintenance: [
    {
      label: "Try Again Later",
      onClick: () => window.location.reload(),
      icon: <RefreshCw className="mr-2 h-4 w-4" />,
      variant: "default",
    },
  ],
  "coming-soon": [
    {
      label: "Go Home",
      href: "/",
      icon: <Home className="mr-2 h-4 w-4" />,
      variant: "default",
    },
  ],
};

// Default illustrations for each variant
const DefaultIllustration = ({
  variant,
  className,
}: {
  variant: string;
  className?: string;
}) => {
  let Icon = <AlertTriangle className={cn("h-24 w-24", className)} />;
  if (variantIcons[variant]) {
    Icon = React.cloneElement(variantIcons[variant], {
      className: cn("h-24 w-24", className),
    });
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "flex h-32 w-32 items-center justify-center rounded-full",
          variant === "404"
            ? "bg-primary/10"
            : variant === "500"
              ? "bg-destructive/10"
              : variant === "403"
                ? "bg-warning/10"
                : variant === "offline"
                  ? "bg-muted/20"
                  : variant === "maintenance"
                    ? "bg-info/10"
                    : variant === "coming-soon"
                      ? "bg-secondary/10"
                      : "bg-primary/10",
        )}
      >
        {Icon}
      </div>
    </div>
  );
};

export const PageError = React.forwardRef<HTMLDivElement, PageErrorProps>(
  (
    {
      variant = "generic",
      size = "md",
      title,
      code,
      message,
      description,
      actions,
      className,
      iconClassName,
      titleClassName,
      messageClassName,
      descriptionClassName,
      actionsClassName,
      //   icon,
      illustration,
      illustrationClassName,
      children,
      animate = true,
      fullPage = false,
    },
    ref,
  ) => {
    // Use the provided values or fall back to defaults based on variant
    const displayVariant = variant || "generic";
    const displayTitle = title || variantTitles[displayVariant];
    const displayMessage = message || variantMessages[displayVariant];
    const displayActions = actions || variantActions[displayVariant];
    const displayCode =
      code ||
      (displayVariant !== "generic" &&
      displayVariant !== "offline" &&
      displayVariant !== "maintenance" &&
      displayVariant !== "coming-soon"
        ? displayVariant
        : undefined);

    // Animation variants
    const containerAnimation = animate
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
        }
      : {};

    const illustrationAnimation = animate
      ? {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5, delay: 0.2 },
        }
      : {};

    const contentAnimation = animate
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5, delay: 0.4 },
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={cn(
          pageErrorVariants({ variant: displayVariant, size }),
          fullPage && "min-h-[80vh]",
          className,
        )}
        {...containerAnimation}
      >
        {/* Error Code */}
        {displayCode && (
          <motion.div
            className="text-7xl font-bold opacity-15"
            {...(animate
              ? {
                  initial: { opacity: 0, scale: 1.2 },
                  animate: { opacity: 0.15, scale: 1 },
                  transition: { duration: 0.7 },
                }
              : {})}
          >
            {displayCode}
          </motion.div>
        )}

        {/* Illustration */}
        <motion.div
          className={cn("mb-4", illustrationClassName)}
          {...illustrationAnimation}
        >
          {illustration || (
            <DefaultIllustration
              variant={displayVariant}
              className={iconClassName}
            />
          )}
        </motion.div>

        {/* Content */}
        <motion.div className="flex flex-col gap-2" {...contentAnimation}>
          {/* Title */}
          <h1
            className={cn("text-2xl font-bold tracking-tight", titleClassName)}
          >
            {displayTitle}
          </h1>

          {/* Message */}
          <p className={cn("text-muted-foreground", messageClassName)}>
            {displayMessage}
          </p>

          {/* Description */}
          {description && (
            <p
              className={cn(
                "text-sm text-muted-foreground",
                descriptionClassName,
              )}
            >
              {description}
            </p>
          )}

          {/* Custom Content */}
          {children}

          {/* Actions */}
          {displayActions && displayActions.length > 0 && (
            <div
              className={cn(
                "mt-6 flex flex-wrap items-center justify-center gap-3",
                actionsClassName,
              )}
            >
              {displayActions.map((action, index) =>
                action.href ? (
                  <Link key={index} href={action.href}>
                    <Button variant={action.variant || "default"} size="sm" className="rounded-full">
                      {action.icon}
                      {action.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    size="sm"
                    onClick={action.onClick}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ),
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  },
);

PageError.displayName = "PageError";

// Export specialized error components for convenience
export const NotFound = React.forwardRef<
  HTMLDivElement,
  Omit<PageErrorProps, "variant">
>((props, ref) => <PageError ref={ref} variant="404" {...props} />);
NotFound.displayName = "NotFound";

export const ServerError = React.forwardRef<
  HTMLDivElement,
  Omit<PageErrorProps, "variant">
>((props, ref) => <PageError ref={ref} variant="500" {...props} />);
ServerError.displayName = "ServerError";

export const Forbidden = React.forwardRef<
  HTMLDivElement,
  Omit<PageErrorProps, "variant">
>((props, ref) => <PageError ref={ref} variant="403" {...props} />);
Forbidden.displayName = "Forbidden";

export const Offline = React.forwardRef<
  HTMLDivElement,
  Omit<PageErrorProps, "variant">
>((props, ref) => <PageError ref={ref} variant="offline" {...props} />);
Offline.displayName = "Offline";

export const Maintenance = React.forwardRef<
  HTMLDivElement,
  Omit<PageErrorProps, "variant">
>((props, ref) => <PageError ref={ref} variant="maintenance" {...props} />);
Maintenance.displayName = "Maintenance";

export const ComingSoon = React.forwardRef<
  HTMLDivElement,
  Omit<PageErrorProps, "variant">
>((props, ref) => <PageError ref={ref} variant="coming-soon" {...props} />);
ComingSoon.displayName = "ComingSoon";
