import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import clsx from "clsx";

type ViewMode = "grid" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  className?: string;
}

const ViewToggle: FC<ViewToggleProps> = ({
  viewMode,
  setViewMode,
  className,
}) => {
  return (
    <div className={clsx("flex rounded-md border", className)}>
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8 rounded-r-none"
        onClick={() => setViewMode("grid")}
        aria-label="Grid view"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8 rounded-l-none"
        onClick={() => setViewMode("list")}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
