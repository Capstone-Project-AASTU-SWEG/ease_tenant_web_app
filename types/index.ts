export type CommonUserData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

export type Tenant = {
  // Personal Information
  firstName: string;
  lastName: string;
  fullName?: string;
  occupation: string;
  email: string;
  phone: string;
  emergencyContact?: string;
  workPhoneNumber?: string;

  // Business Information
  businessName: string;
  businessType: string;
  businessDescription?: string;
  businessWebsite: string;
  taxId?: string;
  businessRegistrationNumber: string;
};

export type ServiceProvider = {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  contractDetails?: string;
};

export type MaintenanceWorker = {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  specialization: string;
  availability?: string;
};

export enum USER_TYPE {
  TENANT = "Tenant",
  MANAGER = "Manager",
  OWNER = "Owner",
  UNKNOWN = "Unknown",
  SERVICE_PROVIDER = "Service Provider",
  MAINTENANCE = "Maintenance Personal",
}

export type User =
  | Tenant
  | Manager
  | Owner
  | ServiceProvider
  | MaintenanceWorker;

export type Manager = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedBuildingId?: string;
  employmentDate?: Date;
  salary?: number;
};

export type Owner = {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
};

export type AuthPayload = {
  userType: USER_TYPE;
  userID: string;
  phoneNumber: string;
};

/* ========== CORE TYPES ========== */
export type Address = {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
};

export enum MAINTENANCE_STATUS {
  EXCELLENT = "Excellent",
  GOOD = "Good",
  FAIR = "Fair",
  NEEDS_REPAIR = "Needs Repair",
  UNDER_MAINTENANCE = "Under Maintenance",
  UNDER_RENOVATION = "Under Renovation",
  POOR = "Poor",
  CRITICAL = "Critical",
}

/* ========== UNIT TYPES ========== */
export enum UNIT_TYPE {
  OFFICE = "Office",
  RETAIL = "Retail",
  WAREHOUSE = "Warehouse",
  RESTAURANT = "Restaurant",
  CAFE = "Café",
  MEDICAL = "Medical",
  FITNESS = "Fitness/Gym",
  SALON = "Salon/Spa",
  BANK = "Bank/Financial",
  PHARMACY = "Pharmacy",
  CONVENIENCE = "Convenience Store",
  OTHER = "Other Commercial",
}

export enum UNIT_STATUS {
  AVAILABLE = "Available",
  OCCUPIED = "Occupied",
  UNDER_MAINTENANCE = "Under Maintenance",
  RESERVED = "Reserved",
  HOLD = "On Hold",
  NOT_READY = "Not Ready",
}

export enum UNIT_FEATURE {
  STREET_ACCESS = "Street Access",
  HIGH_CEILINGS = "High Ceilings",
  LOADING_DOCK = "Loading Dock",
  ADA_ACCESSIBLE = "ADA Accessible",
  HVAC = "Dedicated HVAC",
  UTILITIES = "Separate Utilities",
  PARKING = "Dedicated Parking",
  WINDOWS = "Street-Facing Windows",
  RESTROOMS = "Private Restrooms",
  KITCHEN = "Kitchen Facilities",
  ELEVATOR = "Freight Elevator",
  FIRE_SUPPRESSION = "Fire Suppression System",
}

export type Unit = {
  id: string;
  buildingId: string;
  floorNumber: number;
  unitNumber: string;
  sizeSqFt: number;
  type: UNIT_TYPE;
  status: UNIT_STATUS;
  monthlyRent: number;
  tenantId?: string;
  amenities: string[];
  images?: string[];
  videos?: string[];
  lastRenovationDate?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

/* ========== LEASE TYPES ========== */
export enum PAYMENT_FREQUENCY {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  SEMI_ANNUALLY = "SEMI-ANNUALLY",
  ANNUALLY = "ANNUALLY",
}

// Enum representing different types of lease agreements in commercial real estate
export enum LEASE_TYPE {
  FULL_SERVICE = "Full Service",
  MODIFIED_GROSS = "Modified Gross",
  TRIPLE_NET = "Triple Net (NNN)",
  PERCENTAGE = "Percentage Lease",
  GROSS = "Gross Lease",
}

export type LeaseTerms = {
  minLeasePeriodMonths: number;
  maxLeasePeriodMonths: number;
  leaseRenewalPolicy?: string;
  paymentFrequency: PAYMENT_FREQUENCY;
  latePaymentPenalty?: number;
  securityDeposit: number;
  petPolicy?: string;
};

/* ========== FINANCIAL TYPES ========== */
export enum PAYMENT_METHOD {
  CREDIT_CARD = "Credit Card",
  BANK_TRANSFER = "Bank Transfer",
  CASH = "Cash",
  CHECK = "Check",
  OTHER = "Other",
}

export enum PAYMENT_STATUS {
  PAID = "Paid",
  PENDING = "Pending",
  OVERDUE = "Overdue",
  PARTIAL = "Partial",
  REFUNDED = "Refunded",
}

export enum EXPENSE_CATEGORY {
  TAX = "Tax",
  MAINTENANCE = "Maintenance",
  UTILITIES = "Utilities",
  INSURANCE = "Insurance",
  OTHER = "Other",
}

export enum EXPENSE_FREQUENCY {
  MONTHLY = "Monthly",
  QUARTERLY = "Quarterly",
  ANNUAL = "Annual",
  ONE_TIME = "One-Time",
}

export enum MAINTENANCE_PRIORITY {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  EMERGENCY = "Emergency",
}

export enum MAINTENANCE_TICKET_STATUS {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  ON_HOLD = "On Hold",
}

export enum MAINTENANCE_TYPE {
  PREVENTIVE = "Preventive",
  REPAIR = "Repair",
  INSPECTION = "Inspection",
  UPGRADE = "Upgrade",
}

export enum BUILDING_STATUS {
  ACTIVE = "Active",
  UNDER_RENOVATION = "Under renovation",
  DEMOLISHED = "Demolished",
}

// Building Types
export type Building = {
  id: string;
  name: string;
  description?: string;
  address: Address;
  managerId?: string;
  manager?: Manager;
  totalFloors: number;
  totalUnits: number;
  amenities: string[];
  elevators: number;
  parkingSpaces: number;
  emergencyExits: number;
  yearBuilt?: number;
  regulationDocuments: {
    name: string;
    url: string;
  }[];
  status: BUILDING_STATUS;
  imageUrls?: string[];
  videoUrls?: string[];
  operatingHours: string;
  accessibilityFeatures?: string[];
  fireSafetyCertified: boolean;
  leaseTerms: LeaseTerms;
  createdAt: Date;
  updatedAt: Date;
};

/* ========== REST OF THE TYPES REMAIN THE SAME ========== */
// [Previous type definitions continue with the same structure,
//  just using the new UPPER_CASE enum names where referenced]

/* ========== UTILITY TYPES ========== */
export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type WithTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// ======================================================
// Type Definitions
// ======================================================

/**
 * Application status types
 */
export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "in_review"
  | "on_hold";

/**
 * Application types
 */
export type ApplicationType =
  | "rental"
  | "maintenance"
  | "provider"
  | "service"
  | "other";

/**
 * Application priority levels
 */
export type PriorityLevel = "low" | "medium" | "high" | "urgent";

/**
 * Base application interface
 */
export interface BaseApplication {
  id: string;
  type: ApplicationType;
  status: ApplicationStatus;
  submittedAt: string;
  submittedBy: User;
  priority: PriorityLevel;
  lastUpdated: string;
  notes?: string;
  assignedTo?: User;
}

/**
 * Rental application specific fields
 */
export interface RentalApplication extends BaseApplication {
  type: "rental";
  unitDetails: Unit;
  businessDetails: {
    name: string;
    type: string;
    employees: number;
  };
  leaseDetails: {
    requestedStartDate: string;
    requestedDuration: number;
    specialRequirements?: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
}

/**
 * Maintenance request specific fields
 */
export interface MaintenanceApplication extends BaseApplication {
  type: "maintenance";
  issueDetails: {
    category: string;
    title: string;
    description: string;
    location: string;
    reportedAt: string;
  };
  unitDetails: {
    buildingId: string;
    buildingName: string;
    unitId: string;
    unitNumber: string;
    floorNumber: number;
  };
  scheduledFor?: string;
  estimatedCost?: number;
  images?: Array<{
    id: string;
    url: string;
    caption?: string;
  }>;
}

/**
 * Provider registration application specific fields
 */
export interface ProviderApplication extends BaseApplication {
  type: "provider";
  providerDetails: {
    companyName: string;
    serviceType: string;
    contactPerson: string;
    phone: string;
    email: string;
    website?: string;
    yearsInBusiness: number;
    employeeCount: number;
  };
  servicesOffered: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuedBy: string;
    expiryDate: string;
    verificationUrl?: string;
  }>;
  insuranceDetails: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expiryDate: string;
  };
  references: Array<{
    name: string;
    company: string;
    phone: string;
    email: string;
  }>;
}

/**
 * Service provider application specific fields
 */
export interface ServiceApplication extends BaseApplication {
  type: "service";
  serviceDetails: {
    category: string;
    title: string;
    description: string;
    pricing: {
      type: "fixed" | "hourly" | "quote";
      amount?: number;
    };
    availability: string[];
  };
  providerDetails: {
    id: string;
    name: string;
    rating?: number;
    completedJobs?: number;
  };
  targetBuildings?: Array<{
    id: string;
    name: string;
  }>;
}

/**
 * Other application types
 */
export interface OtherApplication extends BaseApplication {
  type: "other";
  title: string;
  description: string;
  category?: string;
  requestedAction?: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
}

/**
 * Union type for all application types
 */
export type Application =
  | RentalApplication
  | MaintenanceApplication
  | ProviderApplication
  | ServiceApplication
  | OtherApplication;
