import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: ClassValue;
};

const PageWrapper = ({ children, className }: Props) => {
  return <div className={cn("p-6", className)}>{children}</div>;
};

export default PageWrapper;
