"use client";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bell,
  Building,
  LogOut,
  LucideProps,
  MessageCircle,
  Settings,
  ShoppingBasket,
  UsersIcon,
  Wrench,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { authUser, authUserType } from "@/app/auth/_hooks/useAuth";
import { USER_TYPE } from "@/types";

const adminNavigationItems = [
  { href: "/dashboard", icon: BarChart3, label: "Overview" },
  { href: "/dashboard/tenants", icon: UsersIcon, label: "Tenants" },
  { href: "/dashboard/buildings", icon: Building, label: "Buildings" },
  {
    href: "/dashboard/marketplace",
    icon: ShoppingBasket,
    label: "Marketplace",
  },
  { href: "/dashboard/maintenance", icon: Wrench, label: "Maintenance" },
  { href: "/dashboard/messages", icon: MessageCircle, label: "Chat" },
  { href: "#", icon: Bell, label: "Notifications" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const tenantNavigationItems = [
  { href: "/dashboard/tenants", icon: UsersIcon, label: "Overview" },
  { href: "/dashboard/buildings", icon: Building, label: "Buildings" },
  {
    href: "/dashboard/marketplace",
    icon: ShoppingBasket,
    label: "Marketplace",
  },
  { href: "/dashboard/maintenance", icon: Wrench, label: "Maintenance" },
  { href: "/dashboard/messages", icon: MessageCircle, label: "Chat" },
  { href: "#", icon: Bell, label: "Notifications" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpened, setIsOpened] = useState(false);
  const user = authUser();
  const userType = authUserType();

  let navigationItems: {
    href: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    label: string;
  }[] = [];

  switch (userType) {
    case USER_TYPE.TENANT:
      navigationItems = tenantNavigationItems;
      break;
    case USER_TYPE.OWNER:
    case USER_TYPE.MANAGER:
      navigationItems = adminNavigationItems;
  }

  return (
    <SidebarProvider
      onOpenChange={setIsOpened}
      open={isOpened}
      className="max-w-fit"
    >
      <Sidebar
        variant="floating"
        collapsible="icon"
        className="rounded-0 border-none bg-primary"
      >
        <SidebarTrigger
          onClick={() => {
            setIsOpened((prev) => !prev);
          }}
          className="absolute right-0 top-2 z-[19] translate-x-1/2 rounded-full bg-white text-primary hover:scale-110 hover:bg-white"
        ></SidebarTrigger>

        <SidebarHeader className="mb-4 flex justify-center">
          <Avatar
            onClick={() => router.push("/profile")}
            className="cursor-pointer"
          >
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>
              {`${user?.firstName.at(0)}${user?.lastName.at(0)}`.toUpperCase() ||
                "404"}
            </AvatarFallback>
          </Avatar>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.label} className="flex justify-center">
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className={cn(
                    "hover:bg-white/10 hover:text-white data-[active=true]:bg-white/10",
                    "text-white/90 data-[active=true]:text-white",
                    "rounded-full",
                  )}
                >
                  <button onClick={() => router.push(item.href)} className="">
                    <item.icon />
                    <span>{item.label}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Logout"
                className="rounded-full text-white/90 hover:bg-white/10"
              >
                <button onClick={() => router.push("#")}>
                  <LogOut className="" />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
