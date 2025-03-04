import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

// Define variants using cva
const groupVariants = cva("flex", {
  variants: {
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
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: {
    spacing: "md",
    align: "center",
    justify: "start",
    wrap: false,
  },
});

// Define props interface
interface GroupProps extends VariantProps<typeof groupVariants> {
  children: ReactNode;
  className?: string;
}

// Group component
export const Group = ({
  children,
  spacing,
  align,
  justify,
  wrap,
  className,
}: GroupProps) => {
  return (
    <div
      className={groupVariants({ spacing, align, justify, wrap, className })}
    >
      {children}
    </div>
  );
};
