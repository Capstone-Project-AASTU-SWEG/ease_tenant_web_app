import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  InfoIcon,
  DoorClosedIcon as CloseIcon,
} from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define toast types and their corresponding styles
type ToastType = "success" | "error" | "warning" | "info";

type ToastConfig = {
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  bgGradient: string;
  ringColor: string;
  textColor: string;
};

const TOAST_CONFIG: Record<ToastType, ToastConfig> = {
  success: {
    icon: CheckCircle,
    iconClassName: "text-emerald-500 dark:text-emerald-400",
    bgGradient:
      "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/30",
    ringColor: "ring-emerald-500/30 dark:ring-emerald-400/20",
    textColor: "text-emerald-800 dark:text-emerald-300",
  },
  error: {
    icon: XCircle,
    iconClassName: "text-rose-500 dark:text-rose-400",
    bgGradient:
      "bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950/40 dark:to-red-950/30",
    ringColor: "ring-rose-500/30 dark:ring-rose-400/20",
    textColor: "text-rose-800 dark:text-rose-300",
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: "text-amber-500 dark:text-amber-400",
    bgGradient:
      "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/30",
    ringColor: "ring-amber-500/30 dark:ring-amber-400/20",
    textColor: "text-amber-800 dark:text-amber-300",
  },
  info: {
    icon: InfoIcon,
    iconClassName: "text-sky-500 dark:text-sky-400",
    bgGradient:
      "bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/40 dark:to-blue-950/30",
    ringColor: "ring-sky-500/30 dark:ring-sky-400/20",
    textColor: "text-sky-800 dark:text-sky-300",
  },
};

// Toast variant styles using `cva` for better theming
const toastVariants = cva(
  "!p-0 !bg-transparent !border-none !shadow-none backdrop-blur-sm",
  {
    variants: {
      type: {
        success: "",
        error: "",
        warning: "",
        info: "",
      },
    },
    defaultVariants: {
      type: "info",
    },
  },
);

// Helper function to create styled toasts with icons
const createToast = (type: ToastType) => {
  const {
    icon: Icon,
    iconClassName,
    bgGradient,
    ringColor,
    textColor,
  } = TOAST_CONFIG[type];

  return (
    message?: string,
    options?: {
      title?: string;
      description?: string;
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    },
  ) => {
    toast(
      <div className="relative overflow-hidden">
        {/* Background with gradient and blur effect */}
        <div className={cn("absolute inset-0 opacity-80", bgGradient)} />

        {/* Content container */}
        <div
          className={cn(
            "relative flex items-start gap-3 p-4 pr-10",
            "ring-1 ring-inset",
            ringColor,
            "rounded-xl backdrop-blur-sm",
            "transition-all duration-300 ease-out",
          )}
        >
          {/* Icon with animated background */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                "absolute inset-0 animate-pulse rounded-full opacity-20",
                bgGradient,
              )}
            />
            <Icon
              className={cn("relative h-5 w-5", iconClassName)}
              // strokeWidth={2}
            />
          </div>

          {/* Text content */}
          <div className="flex flex-col">
            <span
              className={cn("text-sm font-semibold tracking-tight", textColor)}
            >
              {message || options?.title}
            </span>
            {options?.description && (
              <span className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {options.description}
              </span>
            )}

            {/* Action button */}
            {options?.action && (
              <button
                onClick={options.action.onClick}
                className={cn(
                  "mt-2 self-start text-xs font-medium",
                  "rounded-md px-2.5 py-1",
                  "transition-colors duration-200",
                  "bg-white/50 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20",
                  textColor,
                )}
              >
                {options.action.label}
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => toast.dismiss()}
            className="absolute right-2 top-2 rounded-full p-1 text-slate-400 opacity-70 transition-opacity hover:bg-slate-200/50 hover:opacity-100 dark:text-slate-500 dark:hover:bg-slate-700/50"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>,
      {
        duration: options?.duration || 4000,
        classNames: {
          toast: toastVariants({ type }),
          title: "hidden",
          description: "hidden",
          actionButton: "hidden",
          cancelButton: "hidden",
          closeButton: "hidden",
        },
        position: "top-right",
      },
    );
  };
};

// Define individual toast functions
export const successToast = createToast("success");
export const errorToast = createToast("error");
export const warningToast = createToast("warning");
export const infoToast = createToast("info");

// Toast provider component for app layout
export const Toaster = () => {
  return (
    <div>
      {/* This is just a placeholder - the actual Toaster component is imported from sonner in your _app or layout file */}
    </div>
  );
};

export { createToast };
export default createToast;
