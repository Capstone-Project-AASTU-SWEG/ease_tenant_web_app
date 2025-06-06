export type CommonUserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: USER_TYPE;
};

export type Tenant = {
  // Personal Information
  id: string;
  userId?: CommonUserData;
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
  status: string;
  signature?: string;
  unit?: Unit;
};

export type ServiceProvider = {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  businessName: string;
  serviceType: string;
  serviceDescription: string;
  servicePrice: number;
  businessAddress: string;
  status: string;
  taxId: string;
  images: string[];
} & WithTimestampsStr;

export type MaintenanceWorker = {
  id: string;
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

export type User = CommonUserData &
  (Tenant | Manager | Owner | ServiceProvider | MaintenanceWorker);

export type UserDetail = User & {
  userId: CommonUserData & { role: USER_TYPE };
  application: Application;
  building: Building;
  maintenanceRequests: MaintenanceRequest[];
};

export type Manager = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedBuildingId?: string;
  assignedBuilding?: Building;
  employmentDate?: Date;
  signature?: string;
  salary?: number;
};

export type Owner = {
  id: string;
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
  images?: string[];
  operatingHours: string;
  accessibilityFeatures?: string[];
  fireSafetyCertified: boolean;
  leaseTerms: LeaseTerms;
  buildingType: string;

  createdAt: Date;
  updatedAt: Date;
};

export type BuildingFromAPI = Building & {
  vacantUnits: number;
  occupancyRate: number;
  avaliableUnits: number;
  occupiedUnits: number;
  units: Unit[];
};

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

export type WithTimestampsStr = {
  createdAt: string;
  updatedAt: string;
};

export type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type APPLICATION_STATUS =
  | "pending"
  | "approved"
  | "rejected"
  | "in_review";

export type APPLICATION_TYPE = "rental" | "maintenance" | "service";

export type PRIORITY_LEVEL = "low" | "medium" | "high" | "urgent";

export interface BaseApplication {
  id: string;
  type: APPLICATION_TYPE;
  status: APPLICATION_STATUS;
  priority: PRIORITY_LEVEL;
  notes?: string;
  building: Building;
  assignedTo: User;
  submittedBy: User;
  submittedAt: string;
  lastUpdated: string;
  createdAt?: string;
  updatedAt?: string;
}

export type RentalApplication = BaseApplication & {
  type: "rental";
  unit: Unit;
  submittedBy: Tenant;
  leaseDetails: {
    requestedStartDate: Date;
    requestedDuration: number;
    specialRequirements?: string;
    numberOfEmployees: number;
  };
  documents: File[];
  documentsMetadata: {
    name: string;
  }[];
};

export type ServiceApplication = BaseApplication & {
  type: "service";
  user: ServiceProvider;
};

export type Application = RentalApplication | ServiceApplication;

export enum LEASE_STATUS {
  DRAFT = "Draft",
  SENT = "Sent",
  SIGNED = "Signed",
  ACTIVE = "Active",
  EXPIRED = "Expired",
  TERMINATED = "Terminated",
}

// Template type
export type LeaseTemplate = {
  id: string;
  name: string;
  description: string;
  sections: {
    title: string;
    content: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
};

// Lease type
export type Lease = {
  id: string;
  templateId: string;
  unitId: string;
  unit?: Unit;
  tenantId: string;
  status: LEASE_STATUS;
  contractFile: string;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  signedAt?: Date;
  finalContractFile?: string;
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  isOnline: boolean;
};

export type Message = {
  id: string;
  message: string;
  time: string;
  sender: "me" | "other";
  read: boolean;
  senderRole: USER_TYPE;
  receiverRole: USER_TYPE;
  receiverId: CommonUserData;
  status: string;
} & WithTimestampsStr;

export type MaintenanceRequest = {
  id: string;
  tenant: Tenant;
  unit: Unit;
  category: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Closed" | "Completed" | "Cancelled";
  images: string[];
} & WithTimestampsStr;
