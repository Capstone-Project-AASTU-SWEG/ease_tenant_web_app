import React, {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import { Card, CardContent } from "../ui/card";
import { LucideProps } from "lucide-react";

type Props = {
  title: string;
  children?: ReactNode;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const FormCard = ({ icon, children, title }: Props) => {
  const Icon = icon;
  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className="border-b bg-muted/30 px-5 py-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h4 className="font-medium">{title}</h4>
        </div>
      </div>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
};

export default FormCard;
