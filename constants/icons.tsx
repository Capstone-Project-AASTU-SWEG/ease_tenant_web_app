import { UNIT_STATUS, UNIT_TYPE } from "@/types";
import {
  Bell,
  Briefcase,
  Clock,
  Coffee,
  FileSignature,
  FileText,
  MessageSquare,
  Settings,
  ShoppingBag,
  Store,
  Utensils,
  Wrench,
} from "lucide-react";

export const UnitTypeIcons = {
  [UNIT_TYPE.RETAIL]: <Store className="h-5 w-5" />,
  [UNIT_TYPE.CAFE]: <Coffee className="h-5 w-5" />,
  [UNIT_TYPE.CONVENIENCE]: <ShoppingBag className="h-5 w-5" />,
  [UNIT_TYPE.RESTAURANT]: <Utensils className="h-5 w-5" />,
  [UNIT_TYPE.OFFICE]: <Briefcase className="h-5 w-5" />,
  [UNIT_TYPE.BANK]: <FileText className="h-5 w-5" />,
  [UNIT_TYPE.PHARMACY]: <Clock className="h-5 w-5" />,
  [UNIT_TYPE.WAREHOUSE]: <Settings className="h-5 w-5" />,
  [UNIT_TYPE.MEDICAL]: <Bell className="h-5 w-5" />,
  [UNIT_TYPE.FITNESS]: <Wrench className="h-5 w-5" />,
  [UNIT_TYPE.SALON]: <MessageSquare className="h-5 w-5" />,
  [UNIT_TYPE.OTHER]: <FileSignature className="h-5 w-5" />,
};

export const StatusBadgeStyles = {
  [UNIT_STATUS.AVAILABLE]:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
  [UNIT_STATUS.OCCUPIED]:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
  [UNIT_STATUS.UNDER_MAINTENANCE]:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
  [UNIT_STATUS.RESERVED]:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50",
  [UNIT_STATUS.HOLD]:
    "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  [UNIT_STATUS.NOT_READY]:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
};
