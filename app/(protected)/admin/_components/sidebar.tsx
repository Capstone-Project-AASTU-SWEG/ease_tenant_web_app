"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart3,
  Bell,
  Building,
  LogOut,
  Settings,
  UsersIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  return (
    <div className="flex h-screen items-center justify-center px-2 py-4">
      <section className="relative flex h-[100%] flex-col items-center justify-center rounded-lg border p-6">
        <ul className="absolute top-4 flex flex-col gap-5">
          <Profile />
        </ul>
        <ul className="flex flex-col gap-5">
          <SidebarOption href="/admin" icon={BarChart3} label="Overview" />
          <SidebarOption
            href="/admin/tenants"
            icon={UsersIcon}
            label="Tenants"
          />
          <SidebarOption
            href="/admin/buildings"
            icon={Building}
            label="Buildings"
          />
          <SidebarOption href="#" icon={Bell} label="Notifications" />
          <SidebarOption
            href="/admin/settings"
            icon={Settings}
            label="Settings"
          />
        </ul>

        {/* Bottom Navigation */}
        <ul className="absolute bottom-4 flex flex-col gap-5">
          <SidebarOption href="#" icon={LogOut} label="Logout" />
        </ul>
      </section>
    </div>
  );
};

const Profile = () => {
  const router = useRouter();

  return (
    <Avatar
      onClick={() => {
        router.push("/profile");
      }}
    >
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

type SidebarOptionProps = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const SidebarOption = ({ href, label, icon: Icon }: SidebarOptionProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = href === pathname;

  const handleNavigation = () => {
    router.push(href);
  };
  return (
    <li>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className="relative isolate"
            onClick={handleNavigation}
          >
            <Icon
              className={cn("h-6 w-6 text-neutral-600", {
                "text-primary": isActive,
              })}
              strokeWidth={2}
            />
            {isActive && (
              <span className="absolute left-1/2 top-1/2 -z-[9] size-[2.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10"></span>
            )}
          </TooltipTrigger>
          <TooltipContent
            className=""
            side="right"
            sideOffset={isActive ? 14 : 10}
          >
            <span>{label}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};

export default Sidebar;
