"use client";

import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building,
  FileText,
  LogOut,
  MessageCircle,
  ShoppingBasket,
  UserPlus,
  UsersIcon,
  Wrench,
  X,
  Menu,
  LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { USER_TYPE } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/quries/useAuth";
import LogJSON from "@/components//custom/log-json";
import { getFullNameFromObj } from "@/utils";

interface NavigationItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  user: {
    firstName?: string;
    lastName?: string;
    role: USER_TYPE;
  } | null;
  userType: USER_TYPE;
  pathname: string;
  router: ReturnType<typeof useRouter>;
}

const ownerNavigationItems: NavigationItem[] = [
  { href: "/dashboard", icon: BarChart3, label: "Overview" },
  { href: "/dashboard/users", icon: UsersIcon, label: "Users" },
  { href: "/dashboard/buildings", icon: Building, label: "Buildings" },
  { href: "/dashboard/leases", icon: FileText, label: "Leases" },
  { href: "/dashboard/applications", icon: UserPlus, label: "Applications" },
  {
    href: "/dashboard/marketplace",
    icon: ShoppingBasket,
    label: "Marketplace",
  },
  { href: "/dashboard/maintenance", icon: Wrench, label: "Maintenance" },
  { href: "/dashboard/messages", icon: MessageCircle, label: "Chat" },
];

const managerNavigationItems: NavigationItem[] = [
  { href: "/dashboard/management", icon: BarChart3, label: "Overview" },
  { href: "/dashboard/users", icon: UsersIcon, label: "Users" },
  { href: "/dashboard/leases", icon: FileText, label: "Leases" },
  { href: "/dashboard/applications", icon: UserPlus, label: "Applications" },
  {
    href: "/dashboard/marketplace",
    icon: ShoppingBasket,
    label: "Marketplace",
  },
  { href: "/dashboard/maintenance", icon: Wrench, label: "Maintenance" },
  { href: "/dashboard/messages", icon: MessageCircle, label: "Chat" },
];

const tenantNavigationItems: NavigationItem[] = [
  { href: "/dashboard/tenant", icon: UsersIcon, label: "Overview" },
  { href: "/dashboard/buildings", icon: Building, label: "Buildings" },
  {
    href: "/dashboard/marketplace",
    icon: ShoppingBasket,
    label: "Marketplace",
  },
  // { href: "/dashboard/maintenance", icon: Wrench, label: "Maintenance" },
  { href: "/dashboard/messages", icon: MessageCircle, label: "Chat" },
];

const maintenaceNavigationItems: NavigationItem[] = [
  { href: "/dashboard/maintenance", icon: Wrench, label: "Overview" },
  { href: "/dashboard/buildings", icon: Building, label: "Buildings" },
  {
    href: "/dashboard/marketplace",
    icon: ShoppingBasket,
    label: "Marketplace",
  },
  { href: "/dashboard/messages", icon: MessageCircle, label: "Chat" },
];

function MobileNavigation({
  navigationItems,
  user,
  userType,
  pathname,
  router,
}: MobileNavigationProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const primaryNavItems = navigationItems.slice(0, 4);
  const secondaryNavItems = navigationItems.slice(4);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 z-50 w-full rounded-t-2xl border-t border-gray-200 bg-primary shadow-lg">
        <div className="grid h-16 grid-cols-5">
          {primaryNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                pathname === item.href
                  ? "text-white"
                  : "text-white/40 hover:text-white/80",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}

          {/* Menu Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-white/50 hover:text-white"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs font-medium">Menu</span>
          </button>
        </div>
      </div>

      {/* Full Menu Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
          <SheetTitle className="sr-only"></SheetTitle>
          <div className="flex h-full flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setDrawerOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* User Profile Section */}
            <div className="border-b px-6 py-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                  <AvatarImage alt={user?.firstName || "User"} />
                  <AvatarFallback className="bg-primary/5 text-lg font-medium text-primary">
                    {`${user?.firstName?.at(0) ?? ""}${user?.lastName?.at(0) ?? ""}`.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}</h3>
                  <p className="text-sm text-gray-500">{userType}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 h-8 text-xs"
                    onClick={() => {
                      router.push("/dashboard/profile");
                      setDrawerOpen(false);
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-2 py-4">
              <div className="space-y-1 px-2">
                <p className="mb-2 px-2 text-xs font-medium uppercase text-gray-500">
                  Quick Access
                </p>
                {primaryNavItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      router.push(item.href);
                      setDrawerOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}

                <div className="my-4 h-px bg-gray-200" />

                <p className="mb-2 px-2 text-xs font-medium uppercase text-gray-500">
                  All Features
                </p>
                {secondaryNavItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      router.push(item.href);
                      setDrawerOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logout Button */}
            <div className="border-t p-4">
              <Button
                variant="ghost"
                className="flex w-full items-center justify-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => router.push("/auth/sign-in")}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Content Padding */}
      <div className="pb-16 pt-16"></div>
    </>
  );
}

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpened, setIsOpened] = useState(false);
  const isMobile = useIsMobile();

  const {
    isTenant,
    isManager,
    isOwner,
    isMaintenance,
    data: userData,
  } = useAuth();
  let navigationItems: NavigationItem[] = [];

  const hasUnit = !!userData?.unit;

  if (isTenant) {
    navigationItems = tenantNavigationItems;

    if (!hasUnit) {
      navigationItems = navigationItems.filter(
        (i) => !i.href.includes("/messages"),
      );
    }
  } else if (isManager) {
    navigationItems = managerNavigationItems;
  } else if (isOwner) {
    navigationItems = ownerNavigationItems;
  } else if (isMaintenance) {
    navigationItems = maintenaceNavigationItems;
  }

  return (
    <SidebarProvider
      onOpenChange={setIsOpened}
      open={isOpened}
      className="max-w-fit"
    >
      <LogJSON
        data={{
          userData: userData,
        }}
      />
      {isMobile ? (
        <MobileNavigation
          navigationItems={navigationItems}
          user={userData?.user || null}
          userType={userData?.user.role || USER_TYPE.UNKNOWN}
          pathname={pathname}
          router={router}
        />
      ) : (
        <Sidebar
          variant="floating"
          collapsible="icon"
          className="border-none bg-gradient-to-b from-primary to-primary/90 shadow-lg transition-all duration-300"
        >
          <SidebarTrigger
            onClick={() => setIsOpened((prev) => !prev)}
            className="absolute right-0 top-4 z-[60] translate-x-1/2 rounded-full bg-white p-1.5 text-primary shadow-md transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 md:top-6"
          />

          <SidebarHeader className="mb-6 flex flex-col items-center justify-center pt-6">
            <Avatar
              onClick={() => router.push("/dashboard/profile")}
              className="h-12 w-12 cursor-pointer rounded-lg border-2 border-white/20 shadow-md transition-transform duration-200 hover:scale-105"
            >
              <AvatarImage alt={userData?.user?.firstName || "User"} />
              <AvatarFallback className="rounded-lg bg-primary-foreground text-lg font-medium text-primary">
                {`${userData?.user?.firstName?.at(0) ?? ""}${userData?.user?.lastName?.at(0) ?? ""}`.toUpperCase() ||
                  "***"}
              </AvatarFallback>
            </Avatar>
            <div className="mt-3 text-center text-white">
              <p className="line-clamp-1 font-medium">{`${getFullNameFromObj(userData?.user)}`}</p>
              <p className="text-xs opacity-70">{userData?.user.role}</p>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.label} className="my-1">
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className={cn(
                      "transition-all duration-200",
                      "rounded-lg px-3 py-2.5",
                      "text-white/90 hover:bg-white/10 hover:text-white",
                      "data-[active=true]:bg-white/15 data-[active=true]:text-white data-[active=true]:shadow-sm",
                    )}
                  >
                    <button
                      onClick={() => {
                        router.push(item.href);
                        if (isMobile) setIsOpened(false);
                      }}
                      className="flex items-center gap-3"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="mt-auto pb-6 pt-4">
            <div className="mx-4 mb-4 h-px bg-white/10" />
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Logout"
                  className="mx-2 rounded-lg px-3 py-2.5 text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white"
                >
                  <button
                    onClick={() => router.push("/auth/sign-in")}
                    className="flex w-full items-center gap-3"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      )}
    </SidebarProvider>
  );
}
