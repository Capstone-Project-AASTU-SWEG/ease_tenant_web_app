import { Building, Lock, User } from "lucide-react";

export const BUSINESS_TYPE_OPTIONS = [
  { value: "retail", label: "Retail" },
  { value: "office", label: "Office" },
  { value: "restaurant", label: "Restaurant/Food Service" },
  { value: "medical", label: "Medical/Healthcare" },
  { value: "manufacturing", label: "Manufacturing/Industrial" },
  { value: "technology", label: "Technology" },
  { value: "financial", label: "Financial Services" },
  { value: "legal", label: "Legal Services" },
  { value: "education", label: "Education/Training" },
  { value: "nonprofit", label: "Non-profit Organization" },
  { value: "other", label: "Other" },
];

export enum TENANT_SIGNUP_SECTION_TYPE {
  CONTACT = "Contact",
  BUSINESS = "Business",
  ACCOUNT = "Account",
}

export const TENANT_SIGNUP_SECTIONS = [
  {
    id: TENANT_SIGNUP_SECTION_TYPE.CONTACT,
    title: "Contact",
    icon: User,
    color: "text-indigo-500",
  },
  {
    id: TENANT_SIGNUP_SECTION_TYPE.BUSINESS,
    title: "Business",
    icon: Building,
    color: "text-primary",
  },
  {
    id: TENANT_SIGNUP_SECTION_TYPE.ACCOUNT,
    title: "Account",
    icon: Lock,
    color: "text-emerald-500",
  },
];
