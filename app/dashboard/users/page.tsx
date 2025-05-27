"use client";

import { useState } from "react";
import {
  useGetAllMaintenances,
  useGetAllManagers,
  useGetAllServiceProviders,
  useGetAllTenants,
} from "@/app/quries/useUsers";
import PageHeader from "@/components/custom/page-header";
import PageWrapper from "@/components/custom/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ChevronDown,
  Building2,
  Mail,
  Phone,
  Calendar,
  FileText,
  Shield,
  Eye,
  Pencil,
  MessageSquare,
  AlertTriangle,
  Trash2,
  Briefcase,
  AlertCircle,
  User2,
  MoreVertical,
  User2Icon,
  UserCog2Icon,
  UserPen,
  InfoIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { User, USER_TYPE, UserDetail } from "@/types";
import SearchInput from "@/components/custom/search-input";
import Stat from "@/components/custom/stat";
// import LogJSON from "@/components/custom/log-json";
import { useAuth } from "@/app/quries/useAuth";
import { cn } from "@/lib/utils";
import LogJSON from "@/components/custom/log-json";
import { Group } from "@/components/custom/group";
import { useRouter } from "next/navigation";
// import LogJSON from "@/components/custom/log-json";

// ===== Main Page Component =====
export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const tenants = useGetAllTenants();
  const managers = useGetAllManagers();
  const serviceProviders = useGetAllServiceProviders();

  const maintenanceWorkers = useGetAllMaintenances();

  const { isOwner, isManager } = useAuth();

  return (
    <PageWrapper className="py-0">
      <PageHeader
        title="Building Clients"
        description="Manage all clients of your commercial building"
      />

      <LogJSON
        data={{
          tenants: tenants.data,
          manages: managers.data,
          serviceProviders: serviceProviders.data,
          maintenanceWorkers: maintenanceWorkers.data,
        }}
      />

      <section
        className={cn(
          "mb-8 mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
          {
            "lg:grid-cols-3": isManager,
          },
        )}
      >
        <Stat
          icon={User2Icon}
          title="Total Tenants"
          value={tenants.data?.length.toString() || 0}
          moreInfo={`${10} Suspended tenants`}
          layout="horizontal"
        />
        {isOwner && (
          <Stat
            icon={UserPen}
            title="Total Managers"
            value={managers.data?.length.toString() || 0}
            moreInfo={`${10} Suspended managers`}
            layout="horizontal"
          />
        )}
        <Stat
          icon={UserCog2Icon}
          title="Total Service Providers"
          value={serviceProviders.data?.length.toString() || 0}
          moreInfo={`${10} Suspended service providers`}
          layout="horizontal"
        />
        <Stat
          icon={User2Icon}
          title="Total Maintenance Workers"
          value={maintenanceWorkers.data?.length.toString() || 0}
          moreInfo={`${10} Suspended maintenance workers`}
          layout="horizontal"
        />
      </section>

      <SearchInput
        classNames={{
          wrapper: "mb-6",
        }}
        searchQuery={searchQuery}
        onSearchQuery={setSearchQuery}
      />

      {/* <LogJSON data={{tenants, managers}} /> */}

      <Tabs defaultValue="tenants" className="w-full">
        <TabsList className="mb-8 flex justify-start gap-3">
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          {isOwner && <TabsTrigger value="managers">Managers</TabsTrigger>}
          <TabsTrigger value="service-providers">Service Providers</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants">
          <ClientList
            isPending={tenants.isLoading}
            clients={tenants.data || []}
            clientType={USER_TYPE.TENANT}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="managers">
          <ClientList
            isPending={managers.isLoading}
            clients={managers.data || []}
            clientType={USER_TYPE.MANAGER}
            searchQuery={searchQuery}
            emptyMessage="No managers found. Add managers to see them here."
          />
        </TabsContent>

        <TabsContent value="service-providers">
          <ClientList
            isPending={serviceProviders.isLoading}
            clients={serviceProviders.data || []}
            clientType={USER_TYPE.SERVICE_PROVIDER}
            searchQuery={searchQuery}
            emptyMessage="No service providers found. Add service providers to see them here."
          />
        </TabsContent>

        <TabsContent value="maintenance">
          <ClientList
            isPending={maintenanceWorkers.isLoading}
            clients={maintenanceWorkers.data || []}
            clientType={USER_TYPE.MAINTENANCE}
            searchQuery={searchQuery}
            emptyMessage="No maintenance workers found. Add maintenance workers to see them here."
          />
        </TabsContent>
      </Tabs>

      <Toaster />
    </PageWrapper>
  );
}

// ===== Client Actions Sheet Component =====
interface ClientActionsSheetProps {
  client: User;
  clientType: USER_TYPE;
  isOpen: boolean;
  onClose: () => void;
}

function ClientActionsSheet({
  client,
  clientType,
  isOpen,
  onClose,
}: ClientActionsSheetProps) {
  const router = useRouter();
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!client) return null;

  const fullName = `${client.firstName} ${client.lastName}`;
  const initials = `${client.firstName?.[0] || ""}${client.lastName?.[0] || ""}`;

  const handleSuspend = () => {
    toast({
      title: "Client suspended",
      description: `${fullName} has been suspended.`,
    });
    setSuspendDialogOpen(false);
    onClose();
  };

  const handleDelete = () => {
    toast({
      title: "Client deleted",
      description: `${fullName} has been removed from the system.`,
      variant: "destructive",
    });
    setDeleteDialogOpen(false);
    onClose();
  };

  const handleSendMessage = () => {
    router.push("/dashboard/messages");
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`/placeholder.svg?height=64&width=64&text=${initials}`}
                  alt={fullName}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-xl">{fullName}</SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <Badge variant="outline">{clientType}</Badge>
                  {"businessName" in client && client.businessName && (
                    <span className="text-sm text-muted-foreground">
                      {client.businessName}
                    </span>
                  )}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <User2 className="h-4 w-4" />
                Personal Information
              </h3>
              <Separator />

              <div className="grid grid-cols-[20px_1fr] items-center gap-x-2 gap-y-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email}</span>

                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>

                {"occupation" in client && client.occupation && (
                  <>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{client.occupation}</span>
                  </>
                )}

                {"emergencyContact" in client && client.emergencyContact && (
                  <>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Emergency:
                      </span>{" "}
                      {client.emergencyContact}
                    </div>
                  </>
                )}

                {"workPhoneNumber" in client && client.workPhoneNumber && (
                  <>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Work:
                      </span>{" "}
                      {client.workPhoneNumber}
                    </div>
                  </>
                )}
              </div>
            </div>

            {clientType === USER_TYPE.TENANT &&
              "businessName" in client &&
              client.businessName && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="h-4 w-4" />
                    Business Information
                  </h3>
                  <Separator />

                  <div className="grid grid-cols-[20px_1fr] items-center gap-x-2 gap-y-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{client.businessName}</span>

                    {"businessType" in client && client.businessType && (
                      <>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{client.businessType}</span>
                      </>
                    )}

                    {"businessDescription" in client &&
                      client.businessDescription && (
                        <>
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">
                            {client.businessDescription}
                          </p>
                        </>
                      )}

                    {"businessWebsite" in client && client.businessWebsite && (
                      <>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={client.businessWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {client.businessWebsite}
                        </a>
                      </>
                    )}

                    {"businessRegistrationNumber" in client &&
                      client.businessRegistrationNumber && (
                        <>
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-xs text-muted-foreground">
                              Reg #:
                            </span>{" "}
                            {client.businessRegistrationNumber}
                          </div>
                        </>
                      )}

                    {"taxId" in client && client.taxId && (
                      <>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="text-xs text-muted-foreground">
                            Tax ID:
                          </span>{" "}
                          {client.taxId}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

            {clientType === USER_TYPE.SERVICE_PROVIDER && (
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="h-4 w-4" />
                  Service Information
                </h3>
                <Separator />

                <div className="grid grid-cols-[20px_1fr] items-center gap-x-2 gap-y-3">
                  {"businessName" in client && (
                    <>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{client.businessName}</span>
                    </>
                  )}

                  {"serviceType" in client && (
                    <>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{client.serviceType}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {clientType === USER_TYPE.MAINTENANCE && (
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="h-4 w-4" />
                  Maintenance Information
                </h3>
                <Separator />

                <div className="grid grid-cols-[20px_1fr] items-center gap-x-2 gap-y-3">
                  {"specialization" in client && (
                    <>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{client.specialization}</span>
                    </>
                  )}

                  {"availability" in client && client.availability && (
                    <>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{client.availability}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {clientType === USER_TYPE.SERVICE_PROVIDER && (
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <InfoIcon className="h-4 w-4" />
                  Service Description
                </h3>
                <Separator />
                {"serviceDescription" in client &&
                  client.serviceDescription && (
                    <Group spacing={"sm"}>
                      <span>{client.serviceDescription}</span>
                    </Group>
                  )}
              </div>
            )}
          </div>

          <SheetFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
            <Group
              justify={"center"}
              className="mt-6 rounded-lg bg-primary/5 p-4"
            >
              <Button onClick={handleSendMessage}>Send Message</Button>

              <Button
                variant="outline"
                className="border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
                onClick={() => setSuspendDialogOpen(true)}
              >
                Suspend
              </Button>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </Group>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Suspend Confirmation Dialog */}
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Suspend Client
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend {fullName}? They will no longer
              be able to access the building or services until reinstated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-500 hover:bg-amber-600"
              onClick={handleSuspend}
            >
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Client
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {fullName}? This action cannot be
              undone and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ===== Client Card Component =====
interface ClientCardProps {
  client: User;
  clientType: USER_TYPE;
  onViewDetails: (client: User) => void;
  onEditClient: (client: User) => void;
  onSendMessage: (client: User) => void;
  onSuspendClient: (client: User) => void;
  onDeleteClient: (client: User) => void;
}

function ClientCard({
  client,
  clientType,
  onViewDetails,
  onEditClient,
  onSendMessage,
  onSuspendClient,
  onDeleteClient,
}: ClientCardProps) {
  const fullName = `${client.firstName} ${client.lastName}`;
  const initials = `${client.firstName?.[0] || ""}${client.lastName?.[0] || ""}`;

  return (
    <Card
      className="overflow-hidden shadow-sm"
      onClick={() => onViewDetails(client)}
    >
      <div className="flex items-center p-4">
        <Avatar className="mr-4 h-10 w-10">
          <AvatarImage
            src={`/placeholder.svg?height=40&width=40&text=${initials}`}
            alt={fullName}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="truncate font-medium">{fullName}</h3>
            <Badge variant="outline" className="ml-2">
              {clientType}
            </Badge>
          </div>

          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            {"businessName" in client && client.businessName && (
              <div className="mr-4 flex items-center truncate">
                <Building2 className="mr-1 h-3 w-3" />
                <span className="truncate">{client.businessName}</span>
              </div>
            )}
            <div className="flex items-center truncate">
              <Mail className="mr-1 h-3 w-3" />
              <span className="truncate">{client.email}</span>
            </div>
          </div>
        </div>

        <div className="ml-4 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onViewDetails(client)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditClient(client)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSendMessage(client)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Send Message</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onSuspendClient(client)}
                className="text-amber-500"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                <span>Suspend</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClient(client)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}

// ===== Client List Component =====
interface ClientListProps {
  isPending?: boolean;
  clients: UserDetail[];
  clientType: USER_TYPE;
  searchQuery: string;
  emptyMessage?: string;
}

function ClientList({
  clients,
  clientType,
  searchQuery,
  emptyMessage = "No clients found.",
  isPending = false,
}: ClientListProps) {
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const searchableFields = [
      client.firstName,
      client.lastName,
      client.email,
      client.phone,
      "businessName" in client ? client.businessName : "",
    ].filter(Boolean);

    return searchableFields.some(
      (field) => field && field.toLowerCase().includes(query),
    );
  });

  // Sort clients based on sort option
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        );
      case "business":
        return ("businessName" in a ? a.businessName || "" : "").localeCompare(
          "businessName" in b ? b.businessName || "" : "",
        );
      case "email":
        return a.email.localeCompare(b.email);
      default:
        return 0;
    }
  });

  const handleViewDetails = (client: User) => {
    setSelectedClient(client);
    setIsSheetOpen(true);
  };

  const handleEditClient = (client: User) => {
    console.log("Edit client:", client);
  };

  const handleSendMessage = (client: User) => {
    console.log("Send message to:", client);
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${client.firstName} ${client.lastName}.`,
    });
  };

  const handleSuspendClient = (client: User) => {
    setSelectedClient(client);
    setIsSheetOpen(true);
  };

  const handleDeleteClient = (client: User) => {
    setSelectedClient(client);
    setIsSheetOpen(true);
  };

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (sortedClients.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 font-light text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {sortedClients.length}{" "}
            {sortedClients.length === 1
              ? clientType.toLowerCase()
              : `${clientType.toLowerCase()}s`}{" "}
            found
          </p>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("business")}>
                Business
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("email")}>
                Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className={"space-y-4"}>
        {sortedClients.map((client, index) => (
          <ClientCard
            key={`${client.email}-${index}`}
            client={client}
            clientType={clientType}
            onViewDetails={handleViewDetails}
            onEditClient={handleEditClient}
            onSendMessage={handleSendMessage}
            onSuspendClient={handleSuspendClient}
            onDeleteClient={handleDeleteClient}
          />
        ))}
      </div>
      {selectedClient && (
        <ClientActionsSheet
          client={selectedClient}
          clientType={clientType}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      )}
    </div>
  );
}
