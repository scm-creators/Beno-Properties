/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PropertyStatus = "For Sale" | "To Rent";

export type PropertyType = 
  | "House" 
  | "Apartment" 
  | "Townhouse" 
  | "Vacant Land" 
  | "Farm" 
  | "Commercial" 
  | "Industrial";

export interface Property {
  id: string; // Web Reference ID, e.g., "BENO-1024"
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number; // in ZAR (Rands)
  location: string; // Suburb, e.g., "Sandton"
  city: string; // e.g., "Johannesburg"
  province: string; // e.g., "Gauteng"
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  sizeSqM?: number;
  imageUrl: string;
  additionalImages?: string[];
  isFeatured?: boolean;
  agentId: string; // references Agent
  createdAt: string;
  purchase_date?: string; // YYYY-MM-DD (nullable)
  lease_start_date?: string; // YYYY-MM-DD (nullable)
  lease_end_date?: string; // YYYY-MM-DD (nullable)
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  imageUrl: string;
  specialization: string[];
  bio: string;
}

export interface ListPropertySubmission {
  id: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  propertyTitle: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  expectedPrice: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  submittedAt: string;
}

export interface EmailAlertSubscription {
  id: string;
  name: string;
  email: string;
  preferredType: PropertyType | "Any";
  preferredStatus: PropertyStatus | "Any";
  maxPrice: number;
  location: string;
  submittedAt: string;
}

export interface PropertyFinderRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  specificAreas: string; // comma separated
  additionalNotes: string;
  submittedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyRefId?: string; // Optional reference to property
  submittedAt: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl: string;
  publishedDate: string;
  readTime: string;
}

export interface SearchFilters {
  location: string;
  status: PropertyStatus | "All";
  type: PropertyType | "All";
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

export type UserRole = "client" | "agent" | "admin" | "landlord";

export interface UserProfile {
  id: string; // e.g. "USER-1234"
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  favorites: string[]; // List of Property IDs
  bio?: string; // For agents
  title?: string; // For agents, e.g., "Gauteng Specialist"
  specialization?: string[]; // For agents
  imageUrl?: string; // For agents
  createdAt: string;
}

export interface Lead {
  id: string;
  type: "Contact" | "Inquiry" | "Property Finder" | "Landlord Listing" | "Email Alert";
  name: string;
  email: string;
  phone: string;
  status: "New" | "Contacted" | "In Progress" | "Closed" | "Lost";
  category: "Buyer" | "Seller" | "Tenant" | "General";
  assignedAgentId: string; // "Unassigned" or Agent ID
  notes: string;
  propertyRefId?: string;
  details?: string; // description of requirements
  tags?: string[];
  createdAt: string;
  date_of_birth?: string; // YYYY-MM-DD (nullable)
  client_since_date?: string; // YYYY-MM-DD (nullable)
}

export interface OccupantDetail {
  id: string;
  name: string;
  surname: string;
  relationship: string;
  sex: string;
  idNumber: string;
  age: number;
  contactNo: string;
}

export interface IncomeExpenseSchedule {
  salaryIncome: number;
  businessIncome: number;
  otherIncome: number;
  rentExpense: number;
  foodExpense: number;
  transportExpense: number;
  schoolFeesExpense: number;
  debtExpense: number;
  insuranceExpense: number;
  otherExpense: number;
}

export interface VerificationChecklist {
  creditCheckDone: boolean;
  creditCheckDate?: string;
  employmentConfirmed: boolean;
  employmentConfirmedBy?: string;
  landlordRefChecked: boolean;
  landlordRefNotes?: string;
  familyRefChecked: boolean;
  familyRefNotes?: string;
  otherRefChecked: boolean;
  otherRefNotes?: string;
}

export interface CreditReport {
  score: number;
  riskCategory: "Low Risk" | "Medium Risk" | "High Risk" | "Very High Risk";
  judgementsCount: number;
  judgementsDetails?: string;
  defaultsCount: number;
  defaultsDetails?: string;
  paymentProfileScore: string; // e.g. "98% on-time"
  fraudIndicatorsCount: number;
  bureauReference: string;
  generatedAt: string;
}

export interface TenantApplication {
  id: string;
  propertyId: string;
  applicantId: string; // User ID
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  
  // Property Details
  monthlyRental: number;
  depositAmount: number;
  utilitiesDeposit: number;
  leaseAdminFee: number;
  leasePeriodMonths: number;

  // Personal Details
  applicantType: "Sole" | "Joint" | "CC" | "Company" | "Trust";
  idPassportNumber: string;
  maritalStatus: "Single" | "COP" | "ANC" | "Divorced" | "Widowed" | "Other";
  currentAddress: string;
  previousAddress: string;
  currentLandlordDetails: string;
  employmentStatus: "Employed" | "Self-Employed" | "Unemployed";
  employerName?: string;
  grossMonthlyIncome: number;
  netMonthlyIncome: number;

  // Juristic Entity details
  juristicRegNumber?: string;
  juristicTradeName?: string;
  juristicRepName?: string;
  juristicRepIdNumber?: string;
  juristicNatureOfBusiness?: string;
  juristicRegAddress?: string;

  // Banking Details
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  accountType: string;
  branchName: string;

  // Disclosures
  hasJudgementsDefaults: boolean;
  judgementsDefaultsDetails?: string;

  // Co-applicant / Surety
  hasCoApplicantSurety: boolean;
  coApplicantName?: string;
  coApplicantID?: string;
  coApplicantContact?: string;
  coApplicantRelation?: string;

  // References
  familyRefName: string;
  familyRefRelation: string;
  familyRefContact: string;
  professionalRefName: string;
  professionalRefRelation: string;
  professionalRefContact: string;

  // Eviction alternative
  evictionAlternativeAddress: string;

  // Occupants
  occupants: OccupantDetail[];
  
  // Pets
  hasPets: boolean;
  petDetails?: string;

  // Financial Schedule
  financialSchedule: IncomeExpenseSchedule;

  // POPIA and Credit Check Consent
  popiaConsent: boolean;
  creditCheckConsent: boolean;
  signatureTyped: string;
  submittedAt: string;

  // Workflow steps
  status: "Draft" | "DocumentsPending" | "PaymentPending" | "VettingInProgress" | "ForwardedToLandlord" | "Approved" | "Rejected" | "MoreInfoRequested";
  documentsUploaded: {
    idCopyUrl?: string;
    bankStatementsUrl?: string;
    payslipsUrl?: string;
    signedFormUrl?: string;
  };
  paymentConfirmed: boolean;
  paymentRef?: string;
  paymentTimestamp?: string;
  
  // Credit Check report
  creditReport?: CreditReport;
  
  // Verification Checklist (For Office Use Only)
  verificationChecklist: VerificationChecklist;
  agentNotes?: string;
  landlordFeedback?: string;
  statusHistory: { status: string; timestamp: string; note: string }[];
}

// Client Invitation
export interface ClientInvitation {
  id: string; // e.g. "INV-101"
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  category: "Buyer" | "Tenant" | "Seller" | "Investor" | "General";
  invitedByAgentId: string;
  invitedByAgentName: string;
  propertyRefId?: string;
  propertyTitle?: string;
  inviteLink: string;
  status: "Sent" | "Opened" | "Accepted" | "Expired";
  sentAt: string; // ISO date string
  acceptedAt?: string;
  customMessage?: string;
  notes?: string;
}

// Appointment Types
export type AppointmentType =
  | "Property Viewing"
  | "Valuation Consultation"
  | "Listing Presentation"
  | "Tenancy Onboarding"
  | "Contract & Lease Signing"
  | "Virtual Tour"
  | "Advisory Call";

export type AppointmentStatus =
  | "Scheduled"
  | "Confirmed"
  | "Completed"
  | "Rescheduled"
  | "Cancelled"
  | "No Show";

export type AppointmentOutcome =
  | "Offer Submitted"
  | "Follow-up Required"
  | "Application Submitted"
  | "Not Interested"
  | "Pending Decision"
  | "Successfully Closed";

export interface Appointment {
  id: string; // e.g. "APT-101"
  title: string;
  type: AppointmentType;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientId?: string;
  leadId?: string;
  agentId: string;
  agentName: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyLocation?: string;
  location: string; // physical address or online meeting link
  isVirtual: boolean;
  virtualMeetingUrl?: string;
  dateTime: string; // ISO string e.g. "2026-08-20T14:30:00"
  durationMinutes: number; // 30, 45, 60, 90, 120
  status: AppointmentStatus;
  outcome?: AppointmentOutcome;
  estimatedDealValue?: number; // in ZAR Rands
  notes?: string;
  outcomeNotes?: string;
  reminderSent?: boolean;
  createdAt: string;
  updatedAt?: string;
}

