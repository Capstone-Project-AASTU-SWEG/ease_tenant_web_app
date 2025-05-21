import React, {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import { SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Group } from "./group";
import { LucideProps } from "lucide-react";

type Props = {
  title: string;

  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  description: string;
  rightSection?: ReactNode;
};

const CustomSheetHeader = ({
  title,
  description,
  icon,
  rightSection,
}: Props) => {
  const Icon = icon;
  return (
    <SheetHeader className="py-4">
      <Group justify={"between"} align={"start"}>
        <Group>
          <Icon className="h-10 w-10" />

          <div>
            <SheetTitle className="">{title}</SheetTitle>
            <SheetDescription className="">{description}</SheetDescription>
          </div>
        </Group>
        {rightSection}
      </Group>
    </SheetHeader>
  );
};

export default CustomSheetHeader;
