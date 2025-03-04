import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

// Define variants using cva
const stackVariants = cva("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    spacing: {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
  },
  defaultVariants: {
    direction: "vertical",
    spacing: "md",
    align: "stretch",
    justify: "start",
  },
});

// Define props interface
interface StackProps extends VariantProps<typeof stackVariants> {
  children?: ReactNode;
  className?: string;
}

// Stack component
export const Stack = ({
  children,
  direction,
  spacing,
  align,
  justify,
  className,
}: StackProps) => {
  return (
    <div
      className={stackVariants({
        direction,
        spacing,
        align,
        justify,
        className,
      })}
    >
      {children}
    </div>
  );
};
