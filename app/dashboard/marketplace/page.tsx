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
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Star,
  Filter,
  ShoppingCart,
  Heart,
  Share2,
  Info,
  Clock,
  Calendar,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageWrapper from "@/components/custom/page-wrapper";
import SearchInput from "@/components/custom/search-input";

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
        className="relative space-y-8 pb-10"
      >
        {/* Background elements */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
          <p className="text-muted-foreground">
            Discover services and products for your commercial space
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
                All Services
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
                Technology
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <SearchInput
              searchQuery={searchQuery}
              onSearchQuery={setSearchQuery}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-neutral-200/50 bg-background/60 backdrop-blur-sm hover:bg-primary/10"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </motion.div>
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => (
                  <ServiceCard
                    key={service.title}
                    {...service}
                    index={index}
                    onClick={() => handleServiceClick(service)}
                    onBook={() => handleBookService(service)}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-background/50 p-12 text-center backdrop-blur-sm">
                  <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium">No services found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No services match your current filters. Try adjusting your
                    search or category selection.
                  </p>
                  <Button
                    className="mt-6 rounded-full"
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
          <DialogContent className="border-none bg-background/80 backdrop-blur-xl sm:max-w-[425px]">
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
                  <Input
                    type="number"
                    placeholder="Min"
                    className="bg-background/60"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="bg-background/60"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Rating</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="rounded-full bg-background/60 p-2 hover:bg-primary/10"
                    >
                      <Star
                        className={`h-5 w-5 ${star <= 4 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm">& Up</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Features</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Eco-Friendly",
                    "24/7 Support",
                    "Insured",
                    "Certified",
                    "Emergency Service",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={feature}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={feature} className="text-sm">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Availability</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="any">Any Time</option>
                  <option value="today">Available Today</option>
                  <option value="week">Available This Week</option>
                  <option value="weekend">Available on Weekends</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFilterOpen(false)}>
                Reset
              </Button>
              <Button type="submit" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Service Details Dialog */}
        {selectedService && (
          <Dialog
            open={isServiceDetailsOpen}
            onOpenChange={setIsServiceDetailsOpen}
          >
            <DialogContent className="border-none bg-background/80 backdrop-blur-xl sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedService.title}</DialogTitle>
                <DialogDescription>
                  {selectedService.category} Service
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={selectedService.image || "/placeholder.svg"}
                    alt={selectedService.title}
                    className="h-full w-full object-cover"
                    fill
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary/90 text-white">
                        {selectedService.price}
                      </Badge>
                      <div className="flex items-center text-white">
                        <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {selectedService.rating}
                        </span>
                        <span className="ml-1">
                          ({selectedService.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedService.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.badges.map((badge) => (
                      <Badge
                        key={badge}
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-muted/20 p-4">
                  <h3 className="mb-2 font-semibold">Service Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Response time: <strong>Within 24 hours</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Availability: <strong>Mon-Fri, 8am-6pm</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Service area: <strong>25 mile radius</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Satisfaction guarantee: <strong>100%</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Reviews</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((review) => (
                      <div
                        key={review}
                        className="rounded-lg bg-background/60 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                              <span className="text-xs font-medium text-primary">
                                JD
                              </span>
                            </div>
                            <span className="font-medium">John Doe</span>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Great service! The team was professional, on time, and
                          did an excellent job. Would definitely recommend.
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full text-sm">
                    View All {selectedService.reviews} Reviews
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsServiceDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsServiceDetailsOpen(false);
                    setIsBookingOpen(true);
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Book Service
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Booking Dialog */}
        {selectedService && (
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogContent className="border-none bg-background/80 backdrop-blur-xl sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Book Service</DialogTitle>
                <DialogDescription>
                  Schedule {selectedService.title}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-3 rounded-lg bg-muted/20 p-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
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
                        className="mr-2 bg-primary/10 text-primary"
                      >
                        {selectedService.category}
                      </Badge>
                      <span>{selectedService.price}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="service-date">Service Date</Label>
                  <Input
                    id="service-date"
                    type="date"
                    className="bg-background/60"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="service-time">Preferred Time</Label>
                  <select
                    id="service-time"
                    className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a time</option>
                    <option value="morning">Morning (8am - 12pm)</option>
                    <option value="afternoon">Afternoon (12pm - 4pm)</option>
                    <option value="evening">Evening (4pm - 8pm)</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="service-location">Service Location</Label>
                  <select
                    id="service-location"
                    className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a property</option>
                    <option value="tech-tower">Tech Tower, Office #201</option>
                    <option value="eastside-plaza">
                      Eastside Plaza, Suite #405
                    </option>
                    <option value="west-point">West Point, Store #102</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="service-notes">Special Instructions</Label>
                  <Textarea
                    id="service-notes"
                    placeholder="Any specific requirements or access instructions..."
                    className="min-h-[100px] bg-background/60"
                  />
                </div>

                <div className="rounded-lg bg-primary/10 p-3">
                  <h4 className="mb-2 font-medium text-primary">
                    Booking Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>{selectedService.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Duration</span>
                      <span>2 hours</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-primary/20 pt-2 font-medium">
                      <span>Total</span>
                      <span>{selectedService.price}</span>
                    </div>
                  </div>
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
}

function ServiceCard({
  title,
  category,
  image,
  rating,
  reviews,
  price,
  description,
  badges,
  index = 0,
  onClick,
  onBook,
}: ServiceProps & {
  index?: number;
  onClick?: () => void;
  onBook?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className="overflow-hidden border border-neutral-200/50 bg-background/70 backdrop-blur-md transition-all duration-300 hover:shadow-lg"
        onClick={onClick}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            fill
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          />
          <div className="absolute right-2 top-2 flex gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full bg-background/80 p-1.5 backdrop-blur-sm hover:bg-background/90"
            >
              <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full bg-background/80 p-1.5 backdrop-blur-sm hover:bg-background/90"
            >
              <Share2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </motion.button>
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-primary/90 text-white">{price}</Badge>
          </div>
        </div>
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <Badge variant="outline" className="mt-1 bg-background/60">
                {category}
              </Badge>
            </div>
            <div className="flex items-center text-sm">
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating}</span>
              <span className="ml-1 text-muted-foreground">({reviews})</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1">
            {badges.slice(0, 3).map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className="bg-primary/10 text-xs text-primary"
              >
                {badge}
              </Badge>
            ))}
            {badges.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{badges.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-4">
          <div className="font-medium">{price}</div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              className="rounded-full bg-primary shadow-sm transition-all hover:bg-primary/90"
              onClick={(e) => {
                e.stopPropagation();
                onBook?.();
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Book Service
            </Button>
          </motion.div>
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
    price: "$25/hr",
    description:
      "Professional cleaning service tailored for commercial spaces. Regular and deep cleaning options available.",
    badges: ["Eco-Friendly", "Insured", "Background Checked"],
  },
  {
    title: "IT Support & Management",
    category: "Technology",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    reviews: 87,
    price: "$75/hr",
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
    price: "$30/hr",
    description:
      "Licensed security personnel for building security, event management, and access control.",
    badges: ["Armed/Unarmed", "Uniformed", "Licensed"],
  },
  {
    title: "HVAC Maintenance & Repair",
    category: "Maintenance",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    reviews: 92,
    price: "$85/hr",
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
    price: "$150/mo",
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
    price: "Custom Quote",
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
    price: "Custom Quote",
    description:
      "Smart office technology integration including access control, temperature management, and security systems.",
    badges: ["IoT Specialists", "Custom Design"],
  },
  {
    title: "Commercial Pest Control",
    category: "Maintenance",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    reviews: 112,
    price: "$200/mo",
    description:
      "Preventative and responsive pest control services specifically for commercial spaces.",
    badges: ["Eco-Friendly Options", "Regular Inspection"],
  },
  {
    title: "Security Camera Installation",
    category: "Security",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    reviews: 93,
    price: "Custom Quote",
    description:
      "Design and installation of state-of-the-art security camera and monitoring systems.",
    badges: ["24/7 Monitoring Available", "Cloud Storage"],
  },
];
