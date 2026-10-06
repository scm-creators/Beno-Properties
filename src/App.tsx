/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { INITIAL_PROPERTIES, INITIAL_AGENTS, GAUTENG_SUBURBS, INITIAL_CLIENT_INVITATIONS, INITIAL_APPOINTMENTS } from "./data";
import {
  Property,
  Agent,
  SearchFilters,
  ListPropertySubmission,
  EmailAlertSubscription,
  PropertyFinderRequest,
  ContactMessage,
  BlogArticle,
  UserProfile,
  Lead,
  Appointment,
  ClientInvitation,
} from "./types";
import Navbar from "./components/Navbar";
import SearchEngine from "./components/SearchEngine";
import PropertyCard from "./components/PropertyCard";
import QuickCTAs from "./components/QuickCTAs";
import BondCalculator from "./components/BondCalculator";
import PropertyDetailsModal from "./components/PropertyDetailsModal";
import AgentDirectory from "./components/AgentDirectory";
import ContactUsPage from "./components/ContactUsPage";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Dashboard from "./components/Dashboard";
import BenoLogo from "./components/BenoLogo";
import Helmet from "./components/Helmet";
import Sitemap from "./components/Sitemap";
import { AnimatePresence } from "motion/react";
import { Building2, Landmark, RefreshCw, Star, SlidersHorizontal, AlertCircle, HelpCircle, ShieldCheck, History } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  testConnection,
  signOutUser,
  syncOrCreateUserProfile,
  updateUserProfileInFirestore,
  saveAppointmentToFirestore,
  saveClientInvitationToFirestore,
  saveLeadToFirestore,
  savePropertyToFirestore,
  subscribeToAppointments,
  subscribeToClientInvitations,
  subscribeToLeads,
} from "./firebase";

const INITIAL_USERS: UserProfile[] = [
  {
    id: "BENO-USR-1",
    name: "Sipho Khumalo",
    email: "sipho@gmail.com",
    role: "client",
    favorites: ["BENO-1024"],
    createdAt: "2026-06-25T14:15:00-07:00"
  },
  {
    id: "BENO-AGT-1",
    name: "David Beno",
    email: "david@benoproperties.co.za",
    role: "agent",
    favorites: [],
    title: "Principal Agent & Founder",
    specialization: ["Luxury Sales", "Estate Portfolios", "Investment Advisory"],
    bio: "With over 15 years of premium real estate experience in Gauteng, David founded Beno Properties to deliver bespoke property match-making and seamless transaction advisory services to discerning buyers and landlords.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-06-15T10:00:00-07:00"
  },
  {
    id: "BENO-AGT-2",
    name: "Lungile Khumalo",
    email: "lungile@benoproperties.co.za",
    role: "agent",
    favorites: [],
    title: "Senior Residential Specialist",
    specialization: ["Gauteng North Sales", "Family Townhouses", "New Developments"],
    bio: "Lungile is passionate about matching families with their dream homes. Known for her in-depth knowledge of Centurion, Midrand, and Pretoria East markets, she ensures a stress-free transition for every home buyer.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-06-15T10:00:00-07:00"
  },
  {
    id: "BENO-AGT-3",
    name: "Zama Ndlovu",
    email: "zama@benoproperties.co.za",
    role: "agent",
    favorites: [],
    title: "Executive Rentals Manager",
    specialization: ["Corporate Rentals", "Tenant Vetting"],
    bio: "Zama leads the Beno Rentals team. She specializes in secure corporate rentals, luxury apartments in Sandton and Rosebank, and maintaining a high occupancy rate with fully vetted long-term tenants.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-06-15T10:00:00-07:00"
  },
  {
    id: "BENO-ADM-1",
    name: "Beno Admin",
    email: "admin@benoproperties.co.za",
    role: "admin",
    favorites: [],
    createdAt: "2026-06-15T10:00:00-07:00"
  }
];

const INITIAL_LEADS: Lead[] = [
  {
    id: "LEAD-101",
    type: "Property Finder",
    name: "Sipho Khumalo",
    email: "sipho@gmail.com",
    phone: "072 555 1234",
    status: "In Progress",
    category: "Buyer",
    assignedAgentId: "BENO-AGT-2",
    notes: "Client prefers estate homes with backup solar generators. Arranged site visits.",
    details: "Searching for 3+ Bed Family Townhouse in Midrand under R2.5M.",
    createdAt: "2026-06-26T11:00:00-07:00",
    date_of_birth: "1988-03-12",
    client_since_date: "2025-07-21" // Anniversary in 7 days!
  },
  {
    id: "LEAD-102",
    type: "Inquiry",
    name: "Thabo Nkosi",
    email: "thabo.nkosi@gmail.com",
    phone: "083 555 9876",
    status: "New",
    category: "Buyer",
    assignedAgentId: "Unassigned",
    notes: "Inquired on reference BENO-1024. Needs clarification on staff flatlet sizing.",
    propertyRefId: "BENO-1024",
    details: "Is the price negotiable? I would like to schedule an exclusive viewing for next Saturday.",
    createdAt: "2026-07-06T09:15:00-07:00",
    date_of_birth: "1990-07-19", // Birthday in 5 days!
    client_since_date: "2026-02-14"
  },
  {
    id: "LEAD-103",
    type: "Landlord Listing",
    name: "Jennifer van Wyk",
    email: "jennifer.vw@mweb.co.za",
    phone: "082 555 2468",
    status: "Contacted",
    category: "Seller",
    assignedAgentId: "BENO-AGT-1",
    notes: "Founder David scheduled a property inspection for valuation purposes.",
    details: "Wants to list custom 4-bed mansion in Waterkloof. Expected valuation R12.5M.",
    createdAt: "2026-07-05T14:30:00-07:00"
    // Missing dates to test graceful absence handling!
  },
  {
    id: "LEAD-104",
    type: "Contact",
    name: "Amara Okeke",
    email: "amara@yahoo.com",
    phone: "071 555 4321",
    status: "New",
    category: "General",
    assignedAgentId: "Unassigned",
    notes: "Wants information about corporate rentals vetting guidelines.",
    details: "I am relocating from Nigeria to Sandton for an executive role. Please send rental requirements.",
    createdAt: "2026-07-07T08:00:00-07:00",
    date_of_birth: "1995-07-14", // Birthday today!
    client_since_date: "2026-07-07"
  }
];

export default function App() {
  // Navigation & Admin State
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);

  // Authentication & User Portal State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [existingUsers, setExistingUsers] = useState<UserProfile[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalPrompt, setAuthModalPrompt] = useState<string>("");
  const [leads, setLeads] = useState<Lead[]>([]);

  // Core Data Lists (with LocalStorage persistence)
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [listSubmissions, setListSubmissions] = useState<ListPropertySubmission[]>([]);
  const [alertSubscriptions, setAlertSubscriptions] = useState<EmailAlertSubscription[]>([]);
  const [finderRequests, setFinderRequests] = useState<PropertyFinderRequest[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clientInvitations, setClientInvitations] = useState<ClientInvitation[]>([]);

  // Selected property for detailed modal
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Recently Viewed state
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("beno_recently_viewed");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (selectedProperty) {
      setRecentlyViewedIds((prev) => {
        const filtered = prev.filter((id) => id !== selectedProperty.id);
        const updated = [selectedProperty.id, ...filtered].slice(0, 10); // Keep last 10
        localStorage.setItem("beno_recently_viewed", JSON.stringify(updated));
        return updated;
      });
    }
  }, [selectedProperty]);

  const recentlyViewedProperties = recentlyViewedIds
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is Property => !!p);

  // Global search filters
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    status: "All",
    type: "All",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });

  // Load from local storage or set initial values on mount
  useEffect(() => {
    // 1. Properties
    const storedProperties = localStorage.getItem("beno_properties");
    if (storedProperties) {
      try {
        setProperties(JSON.parse(storedProperties));
      } catch (e) {
        setProperties(INITIAL_PROPERTIES);
      }
    } else {
      setProperties(INITIAL_PROPERTIES);
      localStorage.setItem("beno_properties", JSON.stringify(INITIAL_PROPERTIES));
    }

    // 2. Users Database
    let finalUsers = INITIAL_USERS;
    const storedUsers = localStorage.getItem("beno_users");
    if (storedUsers) {
      try {
        finalUsers = JSON.parse(storedUsers);
        // Sanitize any existing duplicates in local storage users
        const uniqueUsers: UserProfile[] = [];
        const seenUserIds = new Set<string>();
        finalUsers.forEach(u => {
          if (!seenUserIds.has(u.id)) {
            seenUserIds.add(u.id);
            uniqueUsers.push(u);
          }
        });
        finalUsers = uniqueUsers;
        setExistingUsers(finalUsers);
      } catch (e) {
        setExistingUsers(INITIAL_USERS);
      }
    } else {
      setExistingUsers(INITIAL_USERS);
      localStorage.setItem("beno_users", JSON.stringify(INITIAL_USERS));
    }

    // Combine INITIAL_AGENTS with registered users of role "agent"
    let deletedAgentIds: string[] = [];
    try {
      const storedDeleted = localStorage.getItem("beno_deleted_agents");
      if (storedDeleted) {
        deletedAgentIds = JSON.parse(storedDeleted);
      }
    } catch (e) {}

    const computedAgents = INITIAL_AGENTS.filter(a => !deletedAgentIds.includes(a.id));
    finalUsers.filter(u => u.role === "agent" && !deletedAgentIds.includes(u.id)).forEach(au => {
      if (!computedAgents.some(a => a.id === au.id)) {
        computedAgents.push({
          id: au.id,
          name: au.name,
          title: au.title || "Associate Partner",
          phone: au.phone || "+27 (0) 82 555 0100",
          email: au.email,
          imageUrl: au.imageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
          specialization: au.specialization || ["Residential Sales"],
          bio: au.bio || "Registered Beno real estate professional."
        });
      }
    });

    // Strictly ensure all agents have completely unique IDs before setting state
    const uniqueComputedAgents: Agent[] = [];
    const seenAgentIds = new Set<string>();
    computedAgents.forEach(a => {
      if (!seenAgentIds.has(a.id)) {
        seenAgentIds.add(a.id);
        uniqueComputedAgents.push(a);
      }
    });
    setAgents(uniqueComputedAgents);

    // 3. Current User Session
    const storedCurrentUser = localStorage.getItem("beno_current_user");
    if (storedCurrentUser) {
      try {
        const u = JSON.parse(storedCurrentUser);
        setCurrentUser(u);
        if (u.role === "admin") {
          setIsAdmin(true);
        }
      } catch (e) {}
    }

    // 4. Leads Database
    const storedLeads = localStorage.getItem("beno_leads");
    if (storedLeads) {
      try {
        setLeads(JSON.parse(storedLeads));
      } catch (e) {
        setLeads(INITIAL_LEADS);
      }
    } else {
      setLeads(INITIAL_LEADS);
      localStorage.setItem("beno_leads", JSON.stringify(INITIAL_LEADS));
    }

    // 5. Submissions
    const storedListings = localStorage.getItem("beno_list_submissions");
    if (storedListings) {
      try {
        setListSubmissions(JSON.parse(storedListings));
      } catch (e) {}
    }
    const storedAlerts = localStorage.getItem("beno_alert_subscriptions");
    if (storedAlerts) {
      try {
        setAlertSubscriptions(JSON.parse(storedAlerts));
      } catch (e) {}
    }
    const storedFinder = localStorage.getItem("beno_finder_requests");
    if (storedFinder) {
      try {
        setFinderRequests(JSON.parse(storedFinder));
      } catch (e) {}
    }
    const storedContacts = localStorage.getItem("beno_contact_messages");
    if (storedContacts) {
      try {
        setContactMessages(JSON.parse(storedContacts));
      } catch (e) {}
    }

    // 6. Appointments Database
    const storedAppointments = localStorage.getItem("beno_appointments");
    if (storedAppointments) {
      try {
        setAppointments(JSON.parse(storedAppointments));
      } catch (e) {
        setAppointments(INITIAL_APPOINTMENTS);
      }
    } else {
      setAppointments(INITIAL_APPOINTMENTS);
      localStorage.setItem("beno_appointments", JSON.stringify(INITIAL_APPOINTMENTS));
    }

    // 7. Client Invitations Database
    const storedInvitations = localStorage.getItem("beno_client_invitations");
    if (storedInvitations) {
      try {
        setClientInvitations(JSON.parse(storedInvitations));
      } catch (e) {
        setClientInvitations(INITIAL_CLIENT_INVITATIONS);
      }
    } else {
      setClientInvitations(INITIAL_CLIENT_INVITATIONS);
      localStorage.setItem("beno_client_invitations", JSON.stringify(INITIAL_CLIENT_INVITATIONS));
    }

    // Test Firestore connection on boot as instructed by skill
    testConnection().catch(console.error);

    // Listen to Firebase Auth state
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userProfile = await syncOrCreateUserProfile(fbUser);
          setCurrentUser(userProfile);
          localStorage.setItem("beno_current_user", JSON.stringify(userProfile));
          if (userProfile.role === "admin") {
            setIsAdmin(true);
          }
          setExistingUsers((prev) => {
            if (!prev.some((u) => u.id === userProfile.id)) {
              const updated = [userProfile, ...prev];
              localStorage.setItem("beno_users", JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        } catch (e) {
          console.warn("Error syncing user profile on auth state change:", e);
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Subscribe to realtime updates for appointments, client invitations, and leads when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const unsubApts = subscribeToAppointments(currentUser.id, currentUser.role, (remoteApts) => {
      if (remoteApts && remoteApts.length > 0) {
        setAppointments((prev) => {
          const merged = [...remoteApts];
          prev.forEach((p) => {
            if (!merged.some((m) => m.id === p.id)) {
              merged.push(p);
            }
          });
          localStorage.setItem("beno_appointments", JSON.stringify(merged));
          return merged;
        });
      }
    });

    const unsubInvs = subscribeToClientInvitations((remoteInvs) => {
      if (remoteInvs && remoteInvs.length > 0) {
        setClientInvitations((prev) => {
          const merged = [...remoteInvs];
          prev.forEach((p) => {
            if (!merged.some((m) => m.id === p.id)) {
              merged.push(p);
            }
          });
          localStorage.setItem("beno_client_invitations", JSON.stringify(merged));
          return merged;
        });
      }
    });

    const unsubLeads = subscribeToLeads((remoteLeads) => {
      if (remoteLeads && remoteLeads.length > 0) {
        setLeads((prev) => {
          const merged = [...remoteLeads];
          prev.forEach((p) => {
            if (!merged.some((m) => m.id === p.id)) {
              merged.push(p);
            }
          });
          localStorage.setItem("beno_leads", JSON.stringify(merged));
          return merged;
        });
      }
    });

    return () => {
      if (unsubApts) unsubApts();
      if (unsubInvs) unsubInvs();
      if (unsubLeads) unsubLeads();
    };
  }, [currentUser]);

  // Helpers to persist appointments and invitations
  const updateAndStoreAppointments = (updated: Appointment[]) => {
    setAppointments(updated);
    localStorage.setItem("beno_appointments", JSON.stringify(updated));
  };

  const handleAddAppointment = (newApt: Appointment) => {
    const updated = [newApt, ...appointments];
    updateAndStoreAppointments(updated);
    saveAppointmentToFirestore(newApt).catch((e) => {
      console.warn("Could not sync appointment to Firestore:", e);
    });
  };

  const handleUpdateAppointment = (updatedApt: Appointment) => {
    const updated = appointments.map((a) => (a.id === updatedApt.id ? updatedApt : a));
    updateAndStoreAppointments(updated);
    saveAppointmentToFirestore(updatedApt).catch((e) => {
      console.warn("Could not sync appointment update to Firestore:", e);
    });
  };

  const handleDeleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    updateAndStoreAppointments(updated);
  };

  const updateAndStoreInvitations = (updated: ClientInvitation[]) => {
    setClientInvitations(updated);
    localStorage.setItem("beno_client_invitations", JSON.stringify(updated));
  };

  const handleAddInvitation = (newInv: ClientInvitation) => {
    const updated = [newInv, ...clientInvitations];
    updateAndStoreInvitations(updated);
    saveClientInvitationToFirestore(newInv).catch((e) => {
      console.warn("Could not sync client invitation to Firestore:", e);
    });
  };

  const handleUpdateInvitation = (updatedInv: ClientInvitation) => {
    const updated = clientInvitations.map((i) => (i.id === updatedInv.id ? updatedInv : i));
    updateAndStoreInvitations(updated);
    saveClientInvitationToFirestore(updatedInv).catch((e) => {
      console.warn("Could not sync client invitation update to Firestore:", e);
    });
  };

  const handleDeleteInvitation = (id: string) => {
    const updated = clientInvitations.filter((i) => i.id !== id);
    updateAndStoreInvitations(updated);
  };

  // Support loading property on mount or url changes if specified in URL query
  useEffect(() => {
    if (properties && properties.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const propId = params.get("property") || params.get("refId");
      if (propId) {
        const found = properties.find((p) => p.id === propId);
        if (found) {
          setSelectedProperty(found);
        }
      }
    }
  }, [properties]);

  // Save properties to local storage whenever they change
  const updateAndStoreProperties = (updatedProps: Property[]) => {
    setProperties(updatedProps);
    localStorage.setItem("beno_properties", JSON.stringify(updatedProps));
  };

  // Callback: Add a property (Admin)
  const handleAddProperty = (newProp: Property) => {
    const updated = [newProp, ...properties];
    updateAndStoreProperties(updated);
    savePropertyToFirestore(newProp).catch((e) => {
      console.warn("Could not sync property to Firestore:", e);
    });
  };

  // Callback: Delete a property (Admin)
  const handleDeleteProperty = (id: string) => {
    const updated = properties.filter((p) => p.id !== id);
    updateAndStoreProperties(updated);
  };

  // Callback: Update property details (Admin quick status/price edit)
  const handleUpdateProperty = (updatedProp: Property) => {
    const updated = properties.map((p) => (p.id === updatedProp.id ? updatedProp : p));
    updateAndStoreProperties(updated);
    savePropertyToFirestore(updatedProp).catch((e) => {
      console.warn("Could not sync property update to Firestore:", e);
    });
  };

  // Helper to store leads list
  const updateAndStoreLeads = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem("beno_leads", JSON.stringify(updatedLeads));
    if (updatedLeads.length > 0) {
      saveLeadToFirestore(updatedLeads[0]).catch((e) => {
        console.warn("Could not sync lead to Firestore:", e);
      });
    }
  };

  // Callback: Client lists a property
  const handleAddListProperty = (submission: ListPropertySubmission) => {
    const updated = [submission, ...listSubmissions];
    setListSubmissions(updated);
    localStorage.setItem("beno_list_submissions", JSON.stringify(updated));

    // Capture as Lead
    const newLead: Lead = {
      id: `LEAD-${Date.now()}`,
      type: "Landlord Listing",
      name: submission.ownerName,
      email: submission.ownerEmail,
      phone: submission.ownerPhone,
      status: "New",
      category: "Seller",
      assignedAgentId: "Unassigned",
      notes: "Automatically captured from Client 'List My Property' submission form.",
      details: `Submitted property: ${submission.propertyTitle} (${submission.status} in ${submission.location}), Expected Price: R${submission.expectedPrice}`,
      createdAt: new Date().toISOString()
    };
    updateAndStoreLeads([newLead, ...leads]);
  };

  // Callback: Client subscribes to email alerts
  const handleAddEmailAlert = (subscription: EmailAlertSubscription) => {
    const updated = [subscription, ...alertSubscriptions];
    setAlertSubscriptions(updated);
    localStorage.setItem("beno_alert_subscriptions", JSON.stringify(updated));

    // Capture as Lead
    const newLead: Lead = {
      id: `LEAD-${Date.now()}`,
      type: "Email Alert",
      name: subscription.name || "Anonymous Alert Subscriber",
      email: subscription.email,
      phone: "+27 (0) 82 000 0000",
      status: "New",
      category: "Buyer",
      assignedAgentId: "Unassigned",
      notes: "Automatically captured from Saved Search Alert subscription form.",
      details: `Subscribed with filters - Location: ${subscription.location}, Preferred Type: ${subscription.preferredType}, Preferred Status: ${subscription.preferredStatus}, Max Price: R${subscription.maxPrice}`,
      createdAt: new Date().toISOString()
    };
    updateAndStoreLeads([newLead, ...leads]);
  };

  // Callback: Client submits property finder request
  const handleAddPropertyFinder = (request: PropertyFinderRequest) => {
    const updated = [request, ...finderRequests];
    setFinderRequests(updated);
    localStorage.setItem("beno_finder_requests", JSON.stringify(updated));

    // Capture as Lead
    const newLead: Lead = {
      id: `LEAD-${Date.now()}`,
      type: "Property Finder",
      name: request.name,
      email: request.email,
      phone: request.phone,
      status: "New",
      category: "Buyer",
      assignedAgentId: "Unassigned",
      notes: "Automatically captured from 'Property Finder' custom assistant form.",
      details: `Specific Areas: ${request.specificAreas}, Bedrooms: ${request.bedrooms}, Budget range: R${request.minPrice} to R${request.maxPrice}, Note: ${request.additionalNotes}`,
      createdAt: new Date().toISOString()
    };
    updateAndStoreLeads([newLead, ...leads]);
  };

  // Callback: Client submits general contact message or property inquiry
  const handleAddContactMessage = (msg: ContactMessage) => {
    const updated = [msg, ...contactMessages];
    setContactMessages(updated);
    localStorage.setItem("beno_contact_messages", JSON.stringify(updated));

    // Capture as Lead
    const newLead: Lead = {
      id: `LEAD-${Date.now()}`,
      type: msg.propertyRefId ? "Inquiry" : "Contact",
      name: msg.name,
      email: msg.email,
      phone: msg.phone,
      status: "New",
      category: msg.propertyRefId ? "Buyer" : "General",
      assignedAgentId: "Unassigned",
      propertyRefId: msg.propertyRefId,
      notes: msg.propertyRefId 
        ? `Automatically captured from Inquiry Form for property reference ${msg.propertyRefId}.`
        : "Automatically captured from general Contact Us feedback form.",
      details: msg.message,
      createdAt: new Date().toISOString()
    };
    updateAndStoreLeads([newLead, ...leads]);
  };

  // Callback: Client requests a virtual tour
  const handleAddVirtualTourRequest = (tourRequest: { name: string; email: string; phone: string; propertyId: string }) => {
    // 1. Add as virtual tour contact message
    const msg: ContactMessage = {
      id: `MSG-VT-${Date.now().toString().slice(-4)}`,
      name: tourRequest.name,
      email: tourRequest.email,
      phone: tourRequest.phone,
      message: `Requested a Virtual Tour presentation for Ref: ${tourRequest.propertyId}.`,
      propertyRefId: tourRequest.propertyId,
      submittedAt: new Date().toISOString(),
    };
    const updatedMsgs = [msg, ...contactMessages];
    setContactMessages(updatedMsgs);
    localStorage.setItem("beno_contact_messages", JSON.stringify(updatedMsgs));

    // 2. Capture as Lead with the tags: ["Virtual Tour Requested"]
    const newLead: Lead = {
      id: `LEAD-${Date.now()}`,
      type: "Inquiry",
      name: tourRequest.name,
      email: tourRequest.email,
      phone: tourRequest.phone,
      status: "New",
      category: "Buyer",
      assignedAgentId: "Unassigned",
      propertyRefId: tourRequest.propertyId,
      notes: "Direct client request for a video/virtual tour presentation.",
      details: `Requested virtual tour presentation for listing Ref: ${tourRequest.propertyId}.`,
      tags: ["Virtual Tour Requested"],
      createdAt: new Date().toISOString()
    };
    updateAndStoreLeads([newLead, ...leads]);
  };

  // Reset local storage database to factory defaults
  const handleResetCatalog = () => {
    if (confirm("Reset real estate catalog to default South African pre-populated listings? This clears custom uploads.")) {
      updateAndStoreProperties(INITIAL_PROPERTIES);
      setListSubmissions([]);
      setAlertSubscriptions([]);
      setFinderRequests([]);
      setContactMessages([]);
      localStorage.removeItem("beno_list_submissions");
      localStorage.removeItem("beno_alert_subscriptions");
      localStorage.removeItem("beno_finder_requests");
      localStorage.removeItem("beno_contact_messages");
    }
  };

  // Footer Actions: Quick links click
  const handlePopularAreaClick = (area: string) => {
    setFilters({
      location: area,
      status: "All",
      type: "All",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
    });
    setCurrentTab("home");
    // Scroll smoothly to listings stage
    const listingsAnchor = document.getElementById("catalog-anchor");
    if (listingsAnchor) {
      listingsAnchor.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter listings based on active search filter parameters
  const getFilteredProperties = () => {
    return properties.filter((prop) => {
      // 1. Transaction Tab Override
      if (currentTab === "sale" && prop.status !== "For Sale") return false;
      if (currentTab === "rent" && prop.status !== "To Rent") return false;

      // 2. Search Status filter (Only active if not on For Sale / To Rent tabs)
      if (currentTab === "home" && filters.status !== "All" && prop.status !== filters.status) {
        return false;
      }

      // 3. Location / Reference ID search match
      if (filters.location.trim() !== "") {
        const query = filters.location.toLowerCase();
        const matchesRefId = prop.id.toLowerCase() === query;
        const matchesSuburb = prop.location.toLowerCase().includes(query);
        const matchesCity = prop.city.toLowerCase().includes(query);
        if (!matchesRefId && !matchesSuburb && !matchesCity) {
          return false;
        }
      }

      // 4. Property Type
      if (filters.type !== "All" && prop.type !== filters.type) {
        return false;
      }

      // 5. Min Price
      if (filters.minPrice !== "" && prop.price < Number(filters.minPrice)) {
        return false;
      }

      // 6. Max Price
      if (filters.maxPrice !== "" && prop.price > Number(filters.maxPrice)) {
        return false;
      }

      // 7. Bedrooms
      if (filters.bedrooms !== "") {
        const minBedsRequired = Number(filters.bedrooms);
        if (!prop.bedrooms || prop.bedrooms < minBedsRequired) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredProperties = getFilteredProperties();
  const featuredProperties = properties.filter((p) => p.isFeatured);

  const activeAgent = selectedProperty
    ? agents.find((a) => a.id === selectedProperty.agentId) || agents[0]
    : agents[0];

  // Callbacks for Auth and Portal Management
  const handleRegisterUser = (newUser: UserProfile) => {
    const updatedUsers = [newUser, ...existingUsers];
    setExistingUsers(updatedUsers);
    localStorage.setItem("beno_users", JSON.stringify(updatedUsers));

    if (newUser.role === "agent") {
      const newAgent: Agent = {
        id: newUser.id,
        name: newUser.name,
        title: newUser.title || "Associate Partner",
        phone: newUser.phone || "+27 (0) 82 555 0100",
        email: newUser.email,
        imageUrl: newUser.imageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        specialization: newUser.specialization || ["Residential Sales"],
        bio: newUser.bio || "Registered Beno real estate professional."
      };
      setAgents((prev) => {
        if (prev.some((a) => a.id === newAgent.id)) {
          return prev.map((a) => a.id === newAgent.id ? newAgent : a);
        }
        return [...prev, newAgent];
      });
    }
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem("beno_current_user", JSON.stringify(user));
    setIsAuthModalOpen(false);
    
    if (user.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    setCurrentTab("portal");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem("beno_current_user");
    signOutUser().catch(console.error);
    setCurrentTab("home");
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    const updatedUsers = existingUsers.map(u => u.id === updatedProfile.id ? updatedProfile : u);
    setExistingUsers(updatedUsers);
    localStorage.setItem("beno_users", JSON.stringify(updatedUsers));

    if (currentUser && currentUser.id === updatedProfile.id) {
      setCurrentUser(updatedProfile);
      localStorage.setItem("beno_current_user", JSON.stringify(updatedProfile));
    }

    updateUserProfileInFirestore(updatedProfile).catch((e) => {
      console.warn("Could not sync profile to Firestore:", e);
    });

    if (updatedProfile.role === "agent") {
      const updatedAgents = agents.map(a => {
        if (a.id === updatedProfile.id) {
          return {
            ...a,
            name: updatedProfile.name,
            title: updatedProfile.title || a.title,
            phone: updatedProfile.phone || a.phone,
            email: updatedProfile.email,
            imageUrl: updatedProfile.imageUrl || a.imageUrl,
            specialization: updatedProfile.specialization || a.specialization,
            bio: updatedProfile.bio || a.bio
          };
        }
        return a;
      });
      setAgents(updatedAgents);
    }
  };

  const handleDeleteProfile = (id: string) => {
    // 1. Add ID to deleted agents in localStorage
    let deletedAgentIds: string[] = [];
    try {
      const storedDeleted = localStorage.getItem("beno_deleted_agents");
      if (storedDeleted) {
        deletedAgentIds = JSON.parse(storedDeleted);
      }
    } catch (e) {}

    if (!deletedAgentIds.includes(id)) {
      deletedAgentIds.push(id);
      localStorage.setItem("beno_deleted_agents", JSON.stringify(deletedAgentIds));
    }

    // 2. Remove from existing users
    const updatedUsers = existingUsers.filter(u => u.id !== id);
    setExistingUsers(updatedUsers);
    localStorage.setItem("beno_users", JSON.stringify(updatedUsers));

    // 3. Update agents state
    setAgents(prev => prev.filter(a => a.id !== id));

    // 4. If deleted user is current user, log them out
    if (currentUser && currentUser.id === id) {
      handleLogout();
    }
  };

  const handleToggleFavorite = (propertyId: string) => {
    if (!currentUser) {
      setAuthModalPrompt("Sign In / Register to Save Property");
      setIsAuthModalOpen(true);
      return;
    }

    const currentFavorites = currentUser.favorites || [];
    const isFav = currentFavorites.includes(propertyId);
    const updatedFavorites = isFav
      ? currentFavorites.filter(id => id !== propertyId)
      : [...currentFavorites, propertyId];

    const updatedProfile = {
      ...currentUser,
      favorites: updatedFavorites
    };
    handleUpdateProfile(updatedProfile);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    const updated = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    updateAndStoreLeads(updated);
  };

  const handleDeleteAlert = (id: string) => {
    const updated = alertSubscriptions.filter(a => a.id !== id);
    setAlertSubscriptions(updated);
    localStorage.setItem("beno_alert_subscriptions", JSON.stringify(updated));
  };

  const handleAddAlert = (alert: EmailAlertSubscription) => {
    const updated = [alert, ...alertSubscriptions];
    setAlertSubscriptions(updated);
    localStorage.setItem("beno_alert_subscriptions", JSON.stringify(updated));
  };

  // Dynamic SEO Metadata Builder
  const getSeoMetadata = () => {
    // If a property is selected in a detail modal, prioritize its rich information
    if (selectedProperty) {
      const priceText = `R${selectedProperty.price.toLocaleString()}`;
      const bedBathText = `${selectedProperty.bedrooms} Bed · ${selectedProperty.bathrooms} Bath`;
      return {
        title: `${selectedProperty.title} in ${selectedProperty.location} | Beno Properties`,
        description: `View this exquisite ${selectedProperty.type} for ${selectedProperty.status.toLowerCase()} in ${selectedProperty.location}, ${selectedProperty.city}. ${bedBathText} listed at ${priceText}. Contact our expert partners today!`,
        keywords: `Gauteng real estate, luxury property, ${selectedProperty.location}, ${selectedProperty.type} ${selectedProperty.status.toLowerCase()}`,
        ogTitle: `${selectedProperty.title} - ${priceText}`,
        ogDescription: `${bedBathText} luxury ${selectedProperty.type.toLowerCase()} in ${selectedProperty.location}, ${selectedProperty.city}. Available now.`,
        ogImage: selectedProperty.imageUrl,
        ogUrl: `${window.location.origin}/property/${selectedProperty.id}`,
      };
    }

    // Otherwise, build based on active tab
    switch (currentTab) {
      case "sale":
        return {
          title: "Elite Houses & Properties For Sale in Gauteng | Beno Properties",
          description: "Browse our hand-picked collection of premium family homes, luxury penthouses, modern clusters, and development stands for sale across Johannesburg and Pretoria.",
          keywords: "Gauteng sales, luxury homes, buy house soweto, buy house sandton, johannesburg real estate",
          ogTitle: "Exquisite Properties For Sale | Beno Properties",
          ogDescription: "Discover beautiful, hand-selected real estate for sale in Gauteng's most sought-after suburbs.",
          ogImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=630&q=80",
          ogUrl: `${window.location.origin}/sale`,
        };
      case "rent":
        return {
          title: "Premium Properties To Rent in Gauteng | Beno Properties",
          description: "Secure lock-up-and-go corporate apartments, executive townhouses, and A-grade commercial office suites for rent with certified tenancy matching in Gauteng.",
          keywords: "rent midrand, sandton apartments, corporate leasing soweto, luxury rentals pretoria",
          ogTitle: "Elite Corporate & Family Rentals | Beno Properties",
          ogDescription: "Find secure, highly curated corporate rentals and executive townhouses to lease across Gauteng.",
          ogImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=630&q=80",
          ogUrl: `${window.location.origin}/rent`,
        };
      case "tools":
        return {
          title: "Bond Calculator & Transfer Duty Guide | Beno Properties(SA)",
          description: "Calculate your South African home loan repayments, monthly interest premium targets, and learn about SARS transfer duty tax brackets for your property purchase.",
          keywords: "home loan calculator south africa, bond registration fees, transfer duty calculator sars",
          ogTitle: "Home Loan Bond Repayment Simulator | Beno Properties(SA)",
          ogDescription: "Compute your estimated monthly mortgage bond repayments and explore SA buying cost guidelines.",
          ogImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&h=630&q=80",
          ogUrl: `${window.location.origin}/tools`,
        };
      case "agents":
        return {
          title: "Our Expert Real Estate Partners | Beno Properties(SA)",
          description: "Meet our certified real estate professional agents. Based in Johannesburg, offering premium property match-making and transaction advisory.",
          keywords: "johannesburg real estate agents, gauteng property brokers, david beno, sipho khumalo",
          ogTitle: "Professional Real Estate Team | Beno Properties(SA)",
          ogDescription: "Connect directly with our registered, expert Gauteng real estate specialists for luxury sales and rentals.",
          ogImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&h=630&q=80",
          ogUrl: `${window.location.origin}/agents`,
        };
      case "contact":
        return {
          title: "Contact Beno Properties(SA) | Modderfontein, Johannesburg",
          description: "Reach out to our partners today. Visit our office at No 1 Casino Road, Foundershill, Modderfontein, Johannesburg. Email us at nolithazwane@benopropertiessa.com, or call 010 141 0720 / 081 265 2533.",
          keywords: "contact beno properties sa, modderfontein real estate office, casino road modderfontein",
          ogTitle: "Connect With Our Gauteng Team | Beno Properties(SA)",
          ogDescription: "Have a listing or viewing inquiry? Get in touch with our team via email or our secure contact forms.",
          ogImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&h=630&q=80",
          ogUrl: `${window.location.origin}/contact`,
        };
      case "portal":
        return {
          title: "Partner Workspace & Portal | Beno Properties(SA)",
          description: "Secure workspace dashboard for Beno Properties(SA) partners. Access active client profiles, save real-time search alerts, and manage luxury listings.",
          keywords: "agent login, partner portal, real estate CRM soweto, real estate dashboard",
          ogTitle: "Exclusive Partner Portal | Beno Properties(SA)",
          ogDescription: "Collaborate and manage real estate clients, listings, and leads in our secure cloud workspace.",
          ogImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=80",
          ogUrl: `${window.location.origin}/portal`,
        };
      case "home":
      default:
        return {
          title: "Beno Properties(SA) | Premium South African Real Estate",
          description: "At Beno Properties(SA), we believe every property is an opportunity to build a better future. We are committed to delivering quality service, expert advice, and lasting value — helping our clients make informed real estate decisions with confidence.",
          keywords: "beno properties sa, modderfontein real estate, luxury housing gauteng, buy house johannesburg, rent sandton",
          ogTitle: "Beno Properties(SA) - Premium Gauteng Real Estate",
          ogDescription: "Delivering exceptional property match-making and transaction advisory services across Gauteng.",
          ogImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=630&q=80",
          ogUrl: window.location.origin,
        };
    }
  };

  const seo = getSeoMetadata();

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F7] text-slate-900" id="beno-app-root">
      {/* Dynamic SEO Meta & Open Graph Tags */}
      <Helmet {...seo} />
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthModalPrompt("");
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* WORKSPACE PORTAL (Rendered under My Workspace tab when logged in) */}
        {currentTab === "portal" && currentUser ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="portal-workspace-stage">
            <Dashboard
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              properties={properties}
              onAddProperty={handleAddProperty}
              onDeleteProperty={handleDeleteProperty}
              onUpdateProperty={handleUpdateProperty}
              leads={leads}
              onUpdateLead={handleUpdateLead}
              agents={agents}
              alertSubscriptions={alertSubscriptions.filter(a => a.email === currentUser.email)}
              onDeleteAlert={handleDeleteAlert}
              onAddAlert={handleAddAlert}
              onSelectPropertyDetails={(refId) => {
                const p = properties.find(prop => prop.id === refId);
                if (p) setSelectedProperty(p);
              }}
              onDeleteProfile={handleDeleteProfile}
              onOpenAuth={(promptText) => {
                setAuthModalPrompt(promptText || "");
                setIsAuthModalOpen(true);
              }}
              appointments={appointments}
              onAddAppointment={handleAddAppointment}
              onUpdateAppointment={handleUpdateAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              clientInvitations={clientInvitations}
              onAddInvitation={handleAddInvitation}
              onUpdateInvitation={handleUpdateInvitation}
              onDeleteInvitation={handleDeleteInvitation}
            />
          </div>
        ) : currentTab === "portal" && !currentUser ? (
          <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6" id="portal-lock-screen">
            <div className="bg-white border border-gray-200 p-8 sm:p-12 rounded-3xl shadow-xl space-y-6">
              <div className="mx-auto w-16 h-16 bg-[#C5A85C]/10 rounded-full flex items-center justify-center border border-[#C5A85C]/25">
                <BenoLogo variant="icon" size="sm" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight">Partner Portal</h2>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Sign in or create an account to access active client profiles, save real-time search alerts, manage your favorite listings, and update your professional agent details.
                </p>
              </div>
              <button
                onClick={() => {
                  setAuthModalPrompt("");
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-3.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                Access Partner Workspace
              </button>
            </div>
          </div>
        ) : isAdmin ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" id="admin-workspace-view">
            {/* Admin Header Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-10 w-10 text-amber-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Administrative Sandbox Workspace
                  </h3>
                  <p className="text-slate-400 text-xs">
                    You are currently managing Beno Properties(SA) records. All edits sync immediately.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleResetCatalog}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Restores the initial Gauteng portfolio & clears submitted client leads"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset Catalog Defaults
                </button>
                <button
                  onClick={() => setIsAdmin(false)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wide transition-colors cursor-pointer"
                >
                  Exit Admin Console
                </button>
              </div>
            </div>

            {/* Admin Panel containing property tables & leads */}
            <AdminPanel
              properties={properties}
              onAddProperty={handleAddProperty}
              onDeleteProperty={handleDeleteProperty}
              onUpdateProperty={handleUpdateProperty}
              listSubmissions={listSubmissions}
              alertSubscriptions={alertSubscriptions}
              finderRequests={finderRequests}
              contactMessages={contactMessages}
            />
          </div>
        ) : (
          /* PUBLIC CLIENT-FACING VIEWS */
          <div id="public-frontend-views">
            {/* HERO HERO HERO (Visible on Home / Sale / Rent tabs) */}
            {(currentTab === "home" || currentTab === "sale" || currentTab === "rent") && (
              <div className="relative bg-brand-primary pt-20 pb-32 overflow-hidden border-b border-gray-800" id="hero-block">
                {/* Visual grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A85C]/5 rounded-full filter blur-3xl animate-pulse" />
                <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#C5A85C]/3 rounded-full filter blur-3xl animate-pulse" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                  {/* Tagline */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-brand-secondary">
                    <Star className="h-3.5 w-3.5 text-brand-secondary fill-brand-secondary" />
                    PPRA Certified Real Estate Agency
                  </div>

                  {/* Heading */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white uppercase tracking-tight leading-none max-w-4xl mx-auto">
                    {currentTab === "home" && (
                      <>
                        Discover Your Perfect <span className="text-brand-secondary italic">Sanctuary</span>
                      </>
                    )}
                    {currentTab === "sale" && (
                      <>
                        Exquisite Properties <span className="text-brand-secondary italic">For Sale</span>
                      </>
                    )}
                    {currentTab === "rent" && (
                      <>
                        Premium Properties <span className="text-brand-secondary italic">To Rent</span>
                      </>
                    )}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-sans">
                    {currentTab === "home" && "At Beno Properties(SA), we believe every property is an opportunity to build a better future. We are committed to delivering quality service, expert advice, and lasting value — helping our clients make informed real estate decisions with confidence."}
                    {currentTab === "sale" && "Browse our curated catalog of elite family houses, luxury penthouses, modern clusters, and development vacant stands ready for purchase in Gauteng."}
                    {currentTab === "rent" && "Secure lock-up-and-go corporate apartments, executive townhouses, and A-grade commercial suites with certified long-term tenancy matching."}
                  </p>

                  {/* Platform Analytics Metrics (Client UI, no larping) */}
                  <div className="grid grid-cols-3 max-w-lg mx-auto gap-4 pt-4 text-center font-mono">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                      <span className="text-lg font-bold text-white tracking-tight">R500M+</span>
                      <span className="text-[10px] text-brand-secondary block uppercase mt-0.5">Asset Sales</span>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                      <span className="text-lg font-bold text-white tracking-tight">150+</span>
                      <span className="text-[10px] text-brand-secondary block uppercase mt-0.5">Safe Leases</span>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                      <span className="text-lg font-bold text-white tracking-tight">15+ Yrs</span>
                      <span className="text-[10px] text-brand-secondary block uppercase mt-0.5">Local Trust</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN CATALOG WORKSPACE (Home, Sale, Rent) */}
            {(currentTab === "home" || currentTab === "sale" || currentTab === "rent") && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" id="main-catalog-stage">
                {/* Advanced Search Engine overlapping Hero */}
                <SearchEngine
                  filters={filters}
                  setFilters={setFilters}
                  properties={properties}
                  onSearch={(appliedFilters) => {
                    setFilters(appliedFilters);
                  }}
                />

                {/* Quick CTA Actions (Only show on Home page to minimize noise) */}
                {currentTab === "home" && (
                  <QuickCTAs
                    onAddListProperty={handleAddListProperty}
                    onAddEmailAlert={handleAddEmailAlert}
                    onAddPropertyFinder={handleAddPropertyFinder}
                    onOpenCalculator={() => {
                      setCurrentTab("tools");
                      // Scroll to top
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                )}

                {/* Properties Catalog Title Anchor */}
                <div className="pt-12 scroll-mt-24" id="catalog-anchor">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5 mb-8">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-brand-secondary" />
                        {currentTab === "home" ? "Our Latest Properties" : "Catalog Search Results"}
                      </h2>
                      <p className="text-gray-500 text-xs mt-1.5">
                        {currentTab === "home"
                          ? "Browse active residential, agricultural, and commercial developments across Johannesburg and Pretoria."
                          : `Displaying listings matching your specific requirements.`}
                      </p>
                    </div>

                    {/* Quick Counts indicator */}
                    <span className="text-xs font-mono text-gray-600 self-start md:self-end bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                      Found <strong className="text-brand-secondary font-bold">{filteredProperties.length}</strong> matching listings
                    </span>
                  </div>

                  {/* Listings Grid */}
                  {filteredProperties.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-gray-300 rounded-3xl max-w-xl mx-auto space-y-4 bg-white" id="no-listings-found-banner">
                      <div className="mx-auto text-gray-400 bg-gray-150 p-4 rounded-full w-14 h-14 flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-brand-secondary" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">No Properties Match Your Query</h3>
                      <p className="text-gray-500 text-xs px-6 max-w-sm mx-auto leading-relaxed">
                        We couldn't find any results matching your search filters in Gauteng. Try adjusting your bedroom counts, relaxing price brackets, or checking other suburbs.
                      </p>
                      <button
                        onClick={() => {
                          setFilters({
                            location: "",
                            status: "All",
                            type: "All",
                            minPrice: "",
                            maxPrice: "",
                            bedrooms: "",
                          });
                        }}
                        className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs uppercase tracking-wider font-bold cursor-pointer transition-colors"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="properties-grid">
                      {filteredProperties.map((prop) => (
                        <PropertyCard
                          key={prop.id}
                          property={prop}
                          onViewDetails={(p) => setSelectedProperty(p)}
                          isFavorited={currentUser ? (currentUser.favorites || []).includes(prop.id) : false}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Recently Viewed Section */}
                {currentTab === "home" && recentlyViewedProperties.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-gray-200" id="recently-viewed-section">
                    <div className="flex items-center gap-2 mb-6">
                      <History className="h-5 w-5 text-brand-secondary" />
                      <h3 className="text-lg font-extrabold text-gray-900 uppercase tracking-tight">
                        Recently Viewed Properties
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {recentlyViewedProperties.slice(0, 3).map((prop) => (
                        <PropertyCard
                          key={`recent-${prop.id}`}
                          property={prop}
                          onViewDetails={(p) => setSelectedProperty(p)}
                          isFavorited={currentUser ? (currentUser.favorites || []).includes(prop.id) : false}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: TOOLS & CALCULATORS */}
            {currentTab === "tools" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="tools-tab-stage">
                <div className="space-y-10">
                  <div className="text-center max-w-2xl mx-auto" id="tools-intro">
                    <span className="text-xs font-mono text-brand-secondary uppercase tracking-widest bg-brand-primary px-4 py-1.5 rounded-full shadow-sm">
                      Financial Planning Suite
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase tracking-tight mt-3">
                      Home Loan Repayments Calculator
                    </h2>
                    <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                      Buying a home is an exquisite investment. Use our bond/mortgage simulator to compute monthly premium targets, loan deposit ratios, and basic salary thresholds.
                    </p>
                  </div>

                  <BondCalculator />

                  {/* Transfer duty costs information card (South African specific) */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm" id="sa-transfer-duty-info">
                    <h3 className="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                      <Landmark className="h-4 w-4 text-brand-secondary" />
                      South African Property Buying Costs Guide
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 leading-relaxed">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1.5 uppercase">1. SARS Transfer Duty</h4>
                        <p>
                          A government tax levied on all property acquisitions. Properties under **R1.1 Million** are completely exempt from Transfer Duty under the current tax brackets. Above this threshold, a tiered sliding percentage applies.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1.5 uppercase">2. Bond Registration Fees</h4>
                        <p>
                          Paid directly to your bank's appointed registering conveyancer to legally record the mortgage bond at the Deeds Office. This fee is distinct from property transfer fees.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1.5 uppercase">3. Initiate Deposit Planning</h4>
                        <p>
                          While banks occasionally approve 100% home loans, supplying a **10% to 20% cash deposit** drastically reduces your monthly bond repayments, secures a cheaper interest rate, and speeds up approval times.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: OUR AGENTS */}
            {currentTab === "agents" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="agents-tab-stage">
                <AgentDirectory
                  agents={agents}
                  onContactClick={(agent) => {
                    // Navigate to contact, preset message
                    setCurrentTab("contact");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}

            {/* TAB: CONTACT US */}
            {currentTab === "contact" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="contact-tab-stage">
                <ContactUsPage onSubmitMessage={handleAddContactMessage} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER FOOTER FOOTER */}
      <Footer
        onBlogClick={(blog) => {
          // Open blog, scrolling handled by state modal
        }}
        onPopularAreaClick={handlePopularAreaClick}
        onSitemapClick={() => setIsSitemapOpen(true)}
      />

      {/* DYNAMIC SITEMAP / SEO HUB OVERLAY */}
      <AnimatePresence>
        {isSitemapOpen && (
          <Sitemap
            isOpen={isSitemapOpen}
            onClose={() => setIsSitemapOpen(false)}
            properties={properties}
            onNavigate={(tab, propertyId) => {
              setCurrentTab(tab);
              if (propertyId) {
                const found = properties.find((p) => p.id === propertyId);
                if (found) setSelectedProperty(found);
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </AnimatePresence>

      {/* DYNAMIC DETAIL MODAL (Inquire & Bond Calculations) */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          agent={activeAgent}
          onClose={() => setSelectedProperty(null)}
          onSubmitContactMessage={handleAddContactMessage}
          onSubmitVirtualTourRequest={handleAddVirtualTourRequest}
        />
      )}

      {/* USER AUTHENTICATION MODAL */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          existingUsers={existingUsers}
          onRegisterUser={handleRegisterUser}
          prompt={authModalPrompt}
        />
      )}
    </div>
  );
}
