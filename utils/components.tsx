import { Badge } from "@/components/ui/badge";
import { LEASE_STATUS } from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileSignature,
  FileText,
  Send,
} from "lucide-react";

// Get status badge for lease
export const getStatusBadge = (status: LEASE_STATUS) => {
  switch (status) {
    case LEASE_STATUS.DRAFT:
      return (
        <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            <span>Draft</span>
          </div>
        </Badge>
      );
    case LEASE_STATUS.SENT:
      return (
        <Badge
          variant="secondary"
          className="border-0 bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          <div className="flex items-center gap-1.5">
            <Send className="h-3 w-3" />
            <span>Sent</span>
          </div>
        </Badge>
      );
    case LEASE_STATUS.SIGNED:
      return (
        <Badge
          variant="default"
          className="border-0 bg-purple-100 text-purple-700 hover:bg-purple-200"
        >
          <div className="flex items-center gap-1.5">
            <FileSignature className="h-3 w-3" />
            <span>Signed</span>
          </div>
        </Badge>
      );
    case LEASE_STATUS.ACTIVE:
      return (
        <Badge
          variant="default"
          className="border-0 bg-green-100 text-green-700 hover:bg-green-200"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3" />
            <span>Active</span>
          </div>
        </Badge>
      );
    case LEASE_STATUS.EXPIRED:
      return (
        <Badge
          variant="destructive"
          className="border-0 bg-amber-100 text-amber-700 hover:bg-amber-200"
        >
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>Expired</span>
          </div>
        </Badge>
      );
    case LEASE_STATUS.TERMINATED:
      return (
        <Badge
          variant="destructive"
          className="border-0 bg-red-100 text-red-700 hover:bg-red-200"
        >
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3 w-3" />
            <span>Terminated</span>
          </div>
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};
