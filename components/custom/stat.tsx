import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { motion } from "framer-motion";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

type StatProps = {
  title: string;
  value: string | number;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  moreInfo?: string;
  iconColor?: string;
  iconBg?: string;
  className?: string;
  layout?: "horizontal" | "vertical";
  showProgress?: boolean;
  progressValue?: number;
  progressLabel?: string;
  progressSuffix?: string;
  animationDelay?: number;
  children?: React.ReactNode;
};

const Stat = ({
  title,
  value,
  icon: Icon,
  moreInfo,
  iconColor = "text-muted-foreground",
  iconBg,
  className,
  layout = "vertical",
  showProgress = false,
  progressValue = 0,
  progressLabel,
  progressSuffix,
  animationDelay = 0.2,
  children,
}: StatProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      className={cn(
        "rounded-lg border bg-primary/5 p-4 shadow-sm backdrop-blur-sm",
        layout === "horizontal" && "flex items-center justify-between",
        // iconBg,
        className,
      )}
    >
      <div className={cn(layout === "horizontal" && "flex-1")}>
        <div
          className={cn(
            "flex items-center justify-between",
            layout === "horizontal" && "mb-0",
          )}
        >
          <p className="text-sm text-muted-foreground">{title}</p>
          {Icon && (
            <div className={cn(iconBg && "rounded-full p-2", iconBg)}>
              <Icon
                className={cn(
                  "h-4 w-4",
                  iconColor,
                  layout === "horizontal" && "h-5 w-5",
                )}
              />
            </div>
          )}
        </div>

        <div className={cn("mt-2", layout === "horizontal" && "mt-1")}>
          <h3
            className={cn(
              "text-2xl font-bold",
              layout === "horizontal" && "text-3xl",
            )}
          >
            {value}
          </h3>
        </div>

        {moreInfo && (
          <p
            className={cn(
              "mt-1 text-xs text-muted-foreground",
              layout === "horizontal" && "text-sm",
            )}
          >
            {moreInfo}
          </p>
        )}

        {showProgress && (
          <div className="mt-3">
            {progressLabel && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{progressLabel}</span>
                <span className="font-medium">
                  {Math.round(progressValue)}
                  {progressSuffix}
                </span>
              </div>
            )}
            <div className="relative mt-1 h-1 w-full rounded-full bg-neutral-200/50">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full bg-current"
                style={{ width: `${progressValue}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 0.6, delay: animationDelay + 0.1 }}
              />
            </div>
          </div>
        )}
      </div>

      {children}
    </motion.div>
  );
};

export default Stat;
