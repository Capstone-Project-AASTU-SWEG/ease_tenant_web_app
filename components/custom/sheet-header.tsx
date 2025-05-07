import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Group } from "./group";
import { Center } from "./center";
import { LucideProps } from "lucide-react";

type Props = {
  title: string;

  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  description: string;
};

const CustomSheetHeader = ({ title, description, icon }: Props) => {
  const Icon = icon;
  return (
    <SheetHeader className="py-4">
      <Group>
        <Center className="h-full w-[3rem] rounded-lg bg-primary/10">
          <Icon className="h-6 w-6" />
        </Center>
        <div>
          <SheetTitle className="">{title}</SheetTitle>
          <SheetDescription className="">{description}</SheetDescription>
        </div>
      </Group>
    </SheetHeader>
  );
};

export default CustomSheetHeader;
