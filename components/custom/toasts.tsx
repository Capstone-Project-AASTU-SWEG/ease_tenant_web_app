import { toast } from "sonner";
import { Check, X, AlertTriangle, Info } from "lucide-react";
import { cva } from "class-variance-authority";

// Define toast types and their corresponding styles
type ToastType = "success" | "error" | "warning" | "info";

type ToastConfig = {
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  iconClassName: string;
};

const TOAST_CONFIG: Record<ToastType, ToastConfig> = {
  success: {
    icon: Check,
    className: "bg-green-50 border-green-500",
    iconClassName: "text-green-500",
  },
  error: {
    icon: X,
    className: "bg-red-50 border-red-500",
    iconClassName: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-yellow-50 border-yellow-500",
    iconClassName: "text-yellow-500",
  },
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-500",
    iconClassName: "text-blue-500",
  },
};

// Toast variant styles using `cva` for better theming
const toastVariants = cva("!border-none !border-l-4 !rounded-none", {
  variants: {
    type: {
      success: "!bg-white !border-l-green-500",
      error: "!bg-white !border-l-red-500",
      warning: "!bg-white !border-l-yellow-500",
      info: "!bg-white !border-l-blue-500",
    },
  },
  defaultVariants: {
    type: "info",
  },
});

// Helper function to create styled toasts with icons
const createToast = (type: ToastType) => {
  const { icon: Icon, iconClassName } = TOAST_CONFIG[type];

  return (
    message?: string,
    options?: { title?: string; description?: string; duration?: number },
  ) => {
    toast(
      <div
        className={
          "flex transform items-center gap-3 p-1.5 transition-all duration-300 ease-in-out hover:scale-105"
        }
      >
        <Icon className={`h-5 w-5 ${iconClassName}`} />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {message || options?.title}
          </span>
          {options?.description && (
            <span className="text-xs text-gray-600">{options.description}</span>
          )}
        </div>
      </div>,
      {
        duration: options?.duration || 20_000,
        // closeButton: true,
        classNames: {
          toast: toastVariants({ type }),
          content: "rounded-none z-[999999]",
        },
      },
    );
  };
};

// Define individual toast functions
export const successToast = createToast("success");
export const errorToast = createToast("error");
export const warningToast = createToast("warning");
export const infoToast = createToast("info");

export { createToast };

export default createToast;
