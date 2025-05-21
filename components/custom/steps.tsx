"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";
import React from "react";

interface StepProps {
  title: string;
  description?: string;
}

interface StepsProps {
  currentStep: number;
  className?: string;
  children: React.ReactElement<StepProps>[] | React.ReactElement<StepProps>;
}

// Create a proper compound component pattern
const StepComponent = ({ title, description }: StepProps): null => {
  console.log({ title, description });
  return null;
};

StepComponent.displayName = "Step";

export const Step = StepComponent;

export const Steps: React.FC<StepsProps> = ({
  currentStep,
  className,
  children,
}) => {
  // Convert single child to array if needed
  const childrenArray = React.Children.toArray(children);

  // Filter and ensure we only process Step components
  const steps = childrenArray.filter(
    (child) =>
      React.isValidElement(child) &&
      (child.type as React.ComponentType<StepProps>).displayName === "Step",
  ) as React.ReactElement<StepProps>[];

  return (
    <div className={cn("w-full", className)}>
      <div className="flex w-full items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                    isCompleted
                      ? "border-primary bg-primary text-white"
                      : isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted-foreground/30 text-muted-foreground/50",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Circle
                      className={cn("h-5 w-5")}
                      style={
                        isCurrent
                          ? { fill: "rgba(var(--primary), 0.1)" }
                          : undefined
                      }
                    />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCompleted || isCurrent
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.props.title}
                  </p>
                  {step.props.description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {step.props.description}
                    </p>
                  )}
                </div>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-all duration-200",
                    index < currentStep
                      ? "bg-primary"
                      : "bg-muted-foreground/30",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
