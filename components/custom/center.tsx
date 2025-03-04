import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

// Define variants using cva
const centerVariants = cva("flex", {
  variants: {
    axis: {
      both: "items-center justify-center", // Center both horizontally and vertically
      horizontal: "justify-center", // Center only horizontally
      vertical: "items-center", // Center only vertically
    },
    inline: {
      true: "inline-flex", // Use inline-flex for inline centering
      false: "flex", // Use flex for block-level centering
    },
  },
  defaultVariants: {
    axis: "both",
    inline: false,
  },
});

// Define props interface
interface CenterProps extends VariantProps<typeof centerVariants> {
  children?: ReactNode;
  className?: string;
}

// Center component
export const Center = ({ children, axis, inline, className }: CenterProps) => {
  return (
    <div className={centerVariants({ axis, inline, className })}>
      {children}
    </div>
  );
};
