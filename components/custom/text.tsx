import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Utility for merging class names
import { ReactNode } from "react";

// Define variants using cva
const textVariants = cva("text-base", {
  variants: {
    variant: {
      default: "text-gray-900", // Default text color
      dimmed: "text-gray-500", // Dimmed text
      link: "text-blue-600 hover:underline cursor-pointer", // Link style
      success: "text-green-600", // Success text
      danger: "text-red-600", // Danger text
      warning: "text-yellow-600", // Warning text
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    italic: {
      true: "italic",
    },
    underline: {
      true: "underline",
    },
    truncate: {
      true: "truncate", // Truncate text with ellipsis
    },
  },
  defaultVariants: {
    variant: "default",
    size: "base",
    weight: "normal",
    align: "left",
    italic: false,
    underline: false,
    truncate: false,
  },
});

// Define props interface
interface TextProps extends VariantProps<typeof textVariants> {
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; // HTML element
  href?: string; // Optional href for link variant
  onClick?: () => void; // Optional click handler
}

// Text component
export const Text = ({
  children,
  variant,
  size,
  weight,
  align,
  italic,
  underline,
  truncate,
  className,
  as: Component = "p", // Default to <p>
  href,
  onClick,
}: TextProps) => {
  // If href is provided, render an <a> tag
  if (href) {
    return (
      <a
        href={href}
        className={cn(
          textVariants({
            variant,
            size,
            weight,
            align,
            italic,
            underline,
            truncate,
            className,
          }),
        )}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  // Otherwise, render the specified component
  return (
    <Component
      className={cn(
        textVariants({
          variant,
          size,
          weight,
          align,
          italic,
          underline,
          truncate,
          className,
        }),
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};
