import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

// Define variants using cva
const titleVariants = cva("font-sans", {
  variants: {
    size: {
      h1: "text-4xl font-bold", // h1 size
      h2: "text-3xl font-bold", // h2 size
      h3: "text-2xl font-bold", // h3 size
      h4: "text-xl font-bold", // h4 size
      h5: "text-lg font-bold", // h5 size
      h6: "text-base font-bold", // h6 size
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
    color: {
      default: "text-gray-900", // Default text color
      primary: "text-blue-600", // Primary color
      secondary: "text-gray-600", // Secondary color
      danger: "text-red-600", // Danger color
      success: "text-green-600", // Success color
    },
  },
  defaultVariants: {
    size: "h1",
    weight: "bold",
    align: "left",
    color: "default",
  },
});

// Define props interface
interface TitleProps extends VariantProps<typeof titleVariants> {
  children?: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; // HTML heading element
}

// Title component
export const Title = ({
  children,
  size,
  weight,
  align,
  color,
  className,
  as: Component = "h1", // Default to h1
}: TitleProps) => {
  return (
    <Component
      className={titleVariants({ size, weight, align, color, className })}
    >
      {children}
    </Component>
  );
};
