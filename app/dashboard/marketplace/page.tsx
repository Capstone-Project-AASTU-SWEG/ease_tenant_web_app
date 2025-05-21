"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Star,
  Filter,
  Clock,
  Calendar,
  CheckCircle,
  ArrowBigRight,
  PhoneCall,
} from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import PageWrapper from "@/components/custom/page-wrapper";
import SearchInput from "@/components/custom/search-input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IMAGES } from "@/constants/assets";

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceProps | null>(
    null,
  );
  const [isServiceDetailsOpen, setIsServiceDetailsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleServiceClick = (service: ServiceProps) => {
    setSelectedService(service);
    setIsServiceDetailsOpen(true);
  };

  const handleBookService = (service: ServiceProps) => {
    setSelectedService(service);
    setIsServiceDetailsOpen(false);
    setIsBookingOpen(true);
  };

  const filteredServices = services.filter((service) => {
    // Filter by category
    const matchesCategory =
      activeTab === "all" ||
      service.category.toLowerCase() === activeTab.toLowerCase();

    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative space-y-6 pb-10"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold tracking-tight">Marketplace</h2>
          <p className="text-muted-foreground">
            Discover services for your commercial space
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-background/50 backdrop-blur-sm">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="cleaning"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Cleaning
              </TabsTrigger>
              <TabsTrigger
                value="maintenance"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Maintenance
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="technology"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Tech
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <SearchInput
              searchQuery={searchQuery}
              onSearchQuery={setSearchQuery}
            />
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-neutral-200/50 bg-background/60 backdrop-blur-sm hover:bg-primary/10"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + searchQuery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => (
                  <ServiceCard
                    key={service.title}
                    {...service}
                    index={index}
                    onClick={() => handleServiceClick(service)}
                    
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-background/50 p-8 text-center backdrop-blur-sm">
                  <Search className="mb-4 h-10 w-10 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium">No services found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your search or category selection.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setActiveTab("all");
                      setSearchQuery("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Filter Dialog */}
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Filter Services</DialogTitle>
              <DialogDescription>
                Refine your search with these filters
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Price Range</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" />
                  <span>to</span>
                  <Input type="number" placeholder="Max" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Rating</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="rounded-full p-1 hover:bg-primary/10"
                    >
                      <Star
                        className={`h-4 w-4 ${star <= 4 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm">& Up</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFilterOpen(false)}>
                Reset
              </Button>
              <Button onClick={() => setIsFilterOpen(false)}>Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Service Details Drawer */}
        {selectedService && (
          <Sheet
            open={isServiceDetailsOpen}
            onOpenChange={setIsServiceDetailsOpen}
          >
            <SheetContent className="w-full overflow-y-auto sm:max-w-md">
              <SheetHeader className="pb-4">
                <SheetTitle>{selectedService.title}</SheetTitle>
                <SheetDescription>
                  {selectedService.category} Service
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 py-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={selectedService.image || "/placeholder.svg"}
                    alt={selectedService.title}
                    className="h-full w-full object-cover"
                    fill
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary/90 text-white">
                        {selectedService.price}
                      </Badge>
                      <div className="flex items-center text-white">
                        <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {selectedService.rating}
                        </span>
                        <span className="ml-1 text-xs">
                          ({selectedService.reviews})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Description</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedService.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Features</h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedService.badges.map((badge) => (
                      <Badge
                        key={badge}
                        variant="secondary"
                        className="bg-primary/10 text-xs text-primary"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-muted/20 p-3">
                  <h3 className="text-sm font-medium">Service Details</h3>
                  <div className="mt-2 grid grid-cols-1 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        Response time: <strong>Within 24 hours</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        Availability: <strong>Mon-Fri, 8am-6pm</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <SheetFooter className="pt-4">
                <Button
                  className="w-full"
                >
                  <PhoneCall className="mr-2 h-4 w-4" />
                  +251-957-736889
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}

        {/* Booking Dialog */}
        {selectedService && (
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Book Service</DialogTitle>
                <DialogDescription>
                  Schedule {selectedService.title}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-3 rounded-lg bg-muted/20 p-3">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={selectedService.image || "/placeholder.svg"}
                      alt={selectedService.title}
                      className="h-full w-full object-cover"
                      fill
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedService.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Badge
                        variant="outline"
                        className="mr-2 bg-primary/10 text-xs text-primary"
                      >
                        {selectedService.category}
                      </Badge>
                      <span>{selectedService.price}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="service-date">Service Date</Label>
                  <Input id="service-date" type="date" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="service-time">Preferred Time</Label>
                  <select
                    id="service-time"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select a time</option>
                    <option value="morning">Morning (8am - 12pm)</option>
                    <option value="afternoon">Afternoon (12pm - 4pm)</option>
                    <option value="evening">Evening (4pm - 8pm)</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="service-notes">Special Instructions</Label>
                  <Textarea
                    id="service-notes"
                    placeholder="Any specific requirements or access instructions..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsBookingOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Confirm Booking</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    </PageWrapper>
  );
}

interface ServiceProps {
  title: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  description: string;
  badges: string[];
  isPromotion?: boolean;
}

function ServiceCard({
  title,
  category,
  image,
  rating,
  reviews,
  price,
  badges,
  isPromotion = false,
  index = 0,
  onClick,
 
}: ServiceProps & {
  index?: number;
  onClick?: () => void;
 
}) {
  const [isHovered, setIsHovered] = useState(false);

  console.log({ image });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={`overflow-hidden border ${
          isPromotion
            ? "border-primary/20 bg-primary/5 shadow-sm"
            : "border-neutral-200/50 bg-background/70"
        } backdrop-blur-md transition-all duration-300 hover:shadow-md`}
        onClick={onClick}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={IMAGES.SERVICE_PLACEHOLDER}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            fill
          />
          {isPromotion && (
            <div className="absolute left-0 top-2 bg-primary px-2 py-0.5 text-xs font-medium text-white shadow-sm">
              FEATURED
            </div>
          )}
          <div className="absolute bottom-2 left-2">
            <Badge
              className={`${isPromotion ? "bg-primary" : "bg-primary/90"} text-white`}
            >
              {price}
            </Badge>
          </div>
        </div>
        <CardHeader className="p-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <Badge
                variant="outline"
                className="mt-1 bg-background/60 text-xs"
              >
                {category}
              </Badge>
            </div>
            <div className="flex items-center text-xs">
              <Star className="mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating}</span>
              <span className="ml-1 text-muted-foreground">({reviews})</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex flex-wrap gap-1">
            {badges.slice(0, 2).map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className="bg-primary/10 text-xs text-primary"
              >
                {badge}
              </Badge>
            ))}
            {badges.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{badges.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-3">
          <div className="text-sm font-medium">{price}</div>
          <Button
            size="sm"
            className={`rounded-full ${
              isPromotion ? "bg-primary shadow-sm" : "bg-primary/90"
            } transition-all hover:bg-primary/90`}
            onClick={onClick}
          >
            Detail
            <ArrowBigRight className="mr-1.5 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Sample data
const services: ServiceProps[] = [
  {
    title: "Premium Office Cleaning",
    category: "Cleaning",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    reviews: 124,
    price: "25/hr Birr",
    description:
      "Professional cleaning service tailored for commercial spaces. Regular and deep cleaning options available.",
    badges: ["Eco-Friendly", "Insured", "Background Checked"],
    isPromotion: true,
  },
  {
    title: "IT Support & Management",
    category: "Technology",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    reviews: 87,
    price: "75/hr Birr",
    description:
      "On-demand IT support, networking setup, and technology management for businesses.",
    badges: ["24/7 Support", "Certified Technicians"],
  },
  {
    title: "Security Guard Services",
    category: "Security",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    reviews: 156,
    price: "30/hr Birr",
    description:
      "Licensed security personnel for building security, event management, and access control.",
    badges: ["Armed/Unarmed", "Uniformed", "Licensed"],
    isPromotion: true,
  },
  {
    title: "HVAC Maintenance & Repair",
    category: "Maintenance",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    reviews: 92,
    price: "85/hr Birr",
    description:
      "Preventative maintenance and emergency repair services for HVAC systems.",
    badges: ["Emergency Service", "Certified Technicians"],
  },
  {
    title: "Office Plant Services",
    category: "Maintenance",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    reviews: 68,
    price: "150/mo Birr",
    description:
      "Interior plant design, installation, and ongoing maintenance for your workspace.",
    badges: ["Sustainable", "Design Services"],
  },
  {
    title: "Window Cleaning",
    category: "Cleaning",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    reviews: 103,
    price: "Custom",
    description:
      "Professional interior and exterior window cleaning for commercial buildings of all heights.",
    badges: ["Insured", "High-Rise Certified"],
  },
  {
    title: "Smart Office Solutions",
    category: "Technology",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    reviews: 76,
    price: "Custom",
    description:
      "Smart office technology integration including access control, temperature management, and security systems.",
    badges: ["IoT Specialists", "Custom Design"],
    isPromotion: true,
  },
  {
    title: "Commercial Pest Control",
    category: "Maintenance",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    reviews: 112,
    price: "200/mo Birr",
    description:
      "Preventative and responsive pest control services specifically for commercial spaces.",
    badges: ["Eco-Friendly Options", "Regular Inspection"],
  },
];
