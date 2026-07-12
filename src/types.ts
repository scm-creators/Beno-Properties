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

export type UserRole = "client" | "agent" | "admin";

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
}

