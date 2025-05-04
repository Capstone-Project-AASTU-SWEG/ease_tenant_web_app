"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// Define variants for the error component
const errorVariants = cva("transition-all duration-200", {
  variants: {
    variant: {
      error: "border-destructive/30 bg-destructive/10 text-destructive",
      warning: "border-warning/30 bg-warning/10 text-warning",
      info: "border-info/30 bg-info/10 text-info",
      success: "border-success/30 bg-success/10 text-success",
    },
    size: {
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    variant: "error",
    size: "md",
  },
});

// Define the action type
export interface ErrorAction {
  label: string;
  onClick: () => void;
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
export interface ErrorDisplayProps extends VariantProps<typeof errorVariants> {
  title?: string;
  message: string;
  description?: string;
  actions?: ErrorAction[];
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  titleClassName?: string;
  messageClassName?: string;
  actionsClassName?: string;
  footerClassName?: string;
}

// Map variants to default icons
const variantIcons = {
  error: <AlertCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
};

export const ErrorDisplay = React.forwardRef<HTMLDivElement, ErrorDisplayProps>(
  (
    {
      title,
      message,
      description,
      actions = [],
      dismissible = false,
      onDismiss,
      className,
      variant = "error",
      size = "md",
      icon,
      iconClassName,
      titleClassName,
      messageClassName,
      actionsClassName,
      footerClassName,
    },
    ref,
  ) => {
    // Use the provided icon or default to the variant icon
    const displayIcon =
      icon || variantIcons[variant as keyof typeof variantIcons];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card
            ref={ref}
            className={cn(
              "overflow-hidden border shadow-sm",
              errorVariants({ variant, size }),
              className,
            )}
          >
            {(title || dismissible) && (
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-2">
                  {displayIcon && (
                    <span className={cn("shrink-0", iconClassName)}>
                      {displayIcon}
                    </span>
                  )}
                  {title && (
                    <CardTitle
                      className={cn(
                        "text-base font-medium leading-none",
                        titleClassName,
                      )}
                    >
                      {title}
                    </CardTitle>
                  )}
                </div>
                {dismissible && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                    onClick={onDismiss}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                )}
              </CardHeader>
            )}
            <CardContent
              className={cn("pb-4", !title && !dismissible && "pt-4")}
            >
              {!title && displayIcon && (
                <div className={cn("mb-2", iconClassName)}>{displayIcon}</div>
              )}
              <div className={cn("text-sm", messageClassName)}>{message}</div>
              {description && (
                <CardDescription className="mt-1.5 text-xs opacity-80">
                  {description}
                </CardDescription>
              )}
            </CardContent>
            {actions.length > 0 && (
              <CardFooter
                className={cn("flex flex-wrap gap-2", footerClassName)}
              >
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "secondary"}
                    size="sm"
                    onClick={action.onClick}
                    className={cn("text-xs", actionsClassName)}
                  >
                    {action.icon && (
                      <span className="mr-1.5">{action.icon}</span>
                    )}
                    {action.label}
                  </Button>
                ))}
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  },
);

ErrorDisplay.displayName = "ErrorDisplay";
