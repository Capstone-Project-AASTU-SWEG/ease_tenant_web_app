"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------- Types --------------------------------- */

export type TabItem = {
  value: string;
  label: string;
  icon?: LucideIcon;
  badge?: number | string;
  disabled?: boolean;
};

/* -------------------------------- Variants -------------------------------- */

const tabsContainerVariants = cva("w-full transition-all", {
  variants: {
    variant: {
      default: "bg-muted/30 rounded-lg p-1",
      outline: "border rounded-lg p-1",
      pills: "space-x-1",
      underline: "border-b",
      minimal: "",
    },
    size: {
      default: "",
      sm: "max-w-md",
      lg: "max-w-3xl",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const tabsListVariants = cva("flex gap-3 transition-all", {
  variants: {
    variant: {
      default: "w-full",
      outline: "w-full",
      pills: "w-full",
      underline: "w-full",
      minimal: "w-full",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    fullWidth: {
      true: " w-full",
      false: "inline-flex",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
    fullWidth: true,
  },
});

const tabTriggerVariants = cva(
  "inline-flex items-center rounded-lg justify-center whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
        subtle:
          "data-[state=active]:bg-primary/10 data-[state=active]:shadow-sm",
        outline:
          "data-[state=active]:bg-background border-[1.6px]  border-transparent data-[state=active]:border-primary data-[state=active]:shadow-sm",
        pills:
          "rounded-full border border-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        underline:
          "border-b-2 border-transparent rounded-none data-[state=active]:border-primary",
        minimal:
          "data-[state=active]:font-semibold data-[state=active]:text-foreground",
      },
      size: {
        default: "px-3 py-2 text-sm",
        sm: "px-2 py-1.5 text-xs",
        lg: "px-4 py-3 text-base",
      },
      orientation: {
        horizontal: "",
        vertical: "justify-start",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      orientation: "horizontal",
    },
  },
);

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "bg-muted/50 text-muted-foreground",
      },
      size: {
        default: "h-5 min-w-5 px-1.5",
        sm: "h-4 min-w-4 px-1",
        lg: "h-6 min-w-6 px-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/* ------------------------------- Components ------------------------------- */

interface CustomTabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsContainerVariants> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
  tabListClassName?: string;
}

const CustomTabs = React.forwardRef<HTMLDivElement, CustomTabsProps>(
  (
    {
      className,
      variant,
      size,
      // orientation = "horizontal",
      fullWidth = true,
      // tabListClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          tabsContainerVariants({ variant, size }),
          {
            "w-full": fullWidth,
          },
          className,
        )}
        {...props}
      />
    );
  },
);
CustomTabs.displayName = "CustomTabs";

interface CustomTabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {
  items: TabItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  badgeVariant?: VariantProps<typeof badgeVariants>["variant"];
  badgeSize?: VariantProps<typeof badgeVariants>["size"];
  tabVariant?: VariantProps<typeof tabTriggerVariants>["variant"];
  tabSize?: VariantProps<typeof tabTriggerVariants>["size"];
  iconPosition?: "left" | "top";
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const CustomTabsList = React.forwardRef<HTMLDivElement, CustomTabsListProps>(
  (
    {
      className,
      variant,
      orientation = "horizontal",
      fullWidth = true,
      items,
      value,
      onValueChange,
      badgeVariant = "ghost",
      badgeSize = "sm",
      tabVariant,
      tabSize = "default",
      iconPosition = "left",
      cols = 6,
      ...props
    },
    ref,
  ) => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12",
    };

    const gridColsClass = fullWidth
      ? `${gridCols[cols]} md:${gridCols[cols]}`
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          tabsListVariants({ variant, orientation, fullWidth }),
          fullWidth && gridColsClass,
          orientation === "vertical" && "flex-col",
          className,
        )}
        role="tablist"
        {...props}
      >
        {items.map((item) => (
          <button
            key={item.value}
            role="tab"
            aria-selected={value === item.value}
            data-state={value === item.value ? "active" : "inactive"}
            disabled={item.disabled}
            onClick={() => onValueChange?.(item.value)}
            className={cn(
              tabTriggerVariants({
                variant: tabVariant || variant,
                size: tabSize,
                orientation,
              }),
              iconPosition === "top" && "flex-col gap-1",
              iconPosition === "left" && "gap-2",
            )}
          >
            {item.icon && (
              <item.icon
                className={cn(
                  "shrink-0",
                  iconPosition === "top" ? "h-5 w-5" : "h-4 w-4",
                )}
              />
            )}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={cn(
                  badgeVariants({ variant: badgeVariant, size: badgeSize }),
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  },
);
CustomTabsList.displayName = "CustomTabsList";

export {
  CustomTabs,
  CustomTabsList,
  type CustomTabsProps,
  type CustomTabsListProps,
};
