/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  User, Heart, Bell, Plus, ShieldAlert, Sparkles, Inbox, 
  Trash2, Edit, Save, Check, CheckCircle, Upload, Image as ImageIcon,
  FolderOpen, UserPlus, FileText, ChevronRight, Filter, Search, Tag, Phone,
  Calendar, Wrench, AlertCircle, ChevronDown, ChevronUp, CalendarCheck, BarChart3
} from "lucide-react";
import { 
  UserProfile, Property, Lead, Agent, EmailAlertSubscription,
  PropertyType, PropertyStatus, Appointment, ClientInvitation
} from "../types";
import { formatPriceZAR } from "./PropertyCard";
import { GAUTENG_SUBURBS } from "../data";
import RelationshipAssistant from "./RelationshipAssistant";
import TenantVetting from "./TenantVetting";
import BondCalculator from "./BondCalculator";
import AppointmentsManager from "./AppointmentsManager";
import MonthlyReports from "./MonthlyReports";
import { useReminderSystem } from "../hooks/useReminderSystem";

interface DashboardProps {
  currentUser: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  properties: Property[];
  onAddProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onUpdateProperty: (property: Property) => void;
  leads: Lead[];
  onUpdateLead: (updatedLead: Lead) => void;
  agents: Agent[];
  alertSubscriptions: EmailAlertSubscription[];
  onDeleteAlert: (id: string) => void;
  onAddAlert: (alert: EmailAlertSubscription) => void;
  onSelectPropertyDetails?: (id: string) => void;
  onDeleteProfile?: (id: string) => void;
  onOpenAuth?: (prompt?: string) => void;
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  clientInvitations: ClientInvitation[];
  onAddInvitation: (invitation: ClientInvitation) => void;
  onUpdateInvitation: (invitation: ClientInvitation) => void;
  onDeleteInvitation: (id: string) => void;
}

export default function Dashboard({
  currentUser,
  onUpdateProfile,
  properties,
  onAddProperty,
  onDeleteProperty,
  onUpdateProperty,
  leads,
  onUpdateLead,
  agents,
  alertSubscriptions,
  onDeleteAlert,
  onAddAlert,
  onSelectPropertyDetails,
  onDeleteProfile,
  onOpenAuth,
  appointments = [],
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  clientInvitations = [],
  onAddInvitation,
  onUpdateInvitation,
  onDeleteInvitation,
}: DashboardProps) {
  // Navigation tabs based on user role
  const getTabs = () => {
    switch (currentUser.role) {
      case "client":
        return [
          { id: "profile", label: "My Profile", icon: User },
          { id: "client-appointments", label: "My Appointments", icon: CalendarCheck },
          { id: "favorites", label: "Saved Favorites", icon: Heart },
          { id: "alerts", label: "Search Alerts", icon: Bell },
          { id: "tools", label: "Tools", icon: Wrench },
        ];
      case "agent":
        return [
          { id: "agent-profile", label: "Agent Profile", icon: User },
          { id: "appointments", label: "Appointments & Invites", icon: CalendarCheck },
          { id: "monthly-reports", label: "Monthly Reports", icon: BarChart3 },
          { id: "relationship-assistant", label: "Relationship Nudge", icon: Calendar },
          { id: "tenant-vetting", label: "Tenant Vetting", icon: FileText },
          { id: "agent-properties", label: "My Listings", icon: FolderOpen },
          { id: "assigned-leads", label: "Assigned Leads", icon: UserPlus },
        ];
      case "landlord":
        return [
          { id: "landlord-profile", label: "Owner Profile", icon: User },
          { id: "tenant-vetting", label: "Landlord Portal", icon: FileText },
        ];
      case "admin":
        return [
          { id: "admin-profile", label: "Admin Profile", icon: User },
          { id: "appointments", label: "Appointments & Invites", icon: CalendarCheck },
          { id: "monthly-reports", label: "Monthly Reports", icon: BarChart3 },
          { id: "relationship-assistant", label: "Relationship Nudge", icon: Calendar },
          { id: "tenant-vetting", label: "Tenant Vetting", icon: FileText },
          { id: "lead-manager", label: "Lead Board", icon: Inbox },
          { id: "all-listings", label: "Portfolio Listings", icon: FolderOpen },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabs();
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "profile");

  // Integrated Client & Property Event Reminder System
  const reminderSystem = useReminderSystem(currentUser, leads, properties);
  const [alertsCollapsed, setAlertsCollapsed] = useState(false);

  // Edit profile state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || "");
  const [profileBio, setProfileBio] = useState(currentUser.bio || "");
  const [profileTitle, setProfileTitle] = useState(currentUser.title || "");
  const [profileImgUrl, setProfileImgUrl] = useState(currentUser.imageUrl || "");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const profilePhotoFileRef = useRef<HTMLInputElement>(null);

  // Search Alerts State
  const [alertLocation, setAlertLocation] = useState(GAUTENG_SUBURBS[0]);
  const [alertType, setAlertType] = useState<PropertyType>("House");
  const [alertStatus, setAlertStatus] = useState<PropertyStatus>("For Sale");
  const [alertMaxPrice, setAlertMaxPrice] = useState("");
  const [alertCreated, setAlertCreated] = useState(false);

  // Property Listing form state (for Agents and Admins)
  const [propTitle, setPropTitle] = useState("");
  const [propDesc, setPropDesc] = useState("");
  const [propType, setPropType] = useState<PropertyType>("House");
  const [propStatus, setPropStatus] = useState<PropertyStatus>("For Sale");
  const [propPrice, setPropPrice] = useState("");
  const [propLocation, setPropLocation] = useState(GAUTENG_SUBURBS[0]);
  const [propSize, setPropSize] = useState("");
  const [propBeds, setPropBeds] = useState("");
  const [propBaths, setPropBaths] = useState("");
  const [propParking, setPropParking] = useState("");
  
  // Image upload states (Base64)
  const [propCoverBase64, setPropCoverBase64] = useState<string>("");
  const [propBulkBase64, setPropBulkBase64] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [propSuccessMsg, setPropSuccessMsg] = useState("");

  const coverFileRef = useRef<HTMLInputElement>(null);
  const bulkFileRef = useRef<HTMLInputElement>(null);

  // Active tool sub-tab for tools workspace (Tenant Vetting / Bond Calculator)
  const [selectedTool, setSelectedTool] = useState<"vetting" | "bond">("vetting");

  // Lead management filter & search states
  const [leadSearch, setLeadSearch] = useState("");
  const [leadFilterType, setLeadFilterType] = useState<string>("All");
  const [leadFilterStatus, setLeadFilterStatus] = useState<string>("All");
  const [leadFilterAgent, setLeadFilterAgent] = useState<string>("All");

  // Inline edit state for leads
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [leadNotesEdit, setLeadNotesEdit] = useState("");

  // Edit property inline state (simple inline)
  const [editingPropId, setEditingPropId] = useState<string | null>(null);
  const [editPropPrice, setEditPropPrice] = useState("");
  const [editPropStatus, setEditPropStatus] = useState<PropertyStatus>("For Sale");

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name: profileName,
      email: profileEmail,
      phone: profilePhone || undefined,
      bio: currentUser.role === "agent" ? profileBio : undefined,
      title: currentUser.role === "agent" ? profileTitle : undefined,
      imageUrl: currentUser.role === "agent" ? profileImgUrl : undefined,
    };
    onUpdateProfile(updated);
    setProfileSuccess(true);
    setIsEditingProfile(false);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  const handleCancelProfileEdit = () => {
    setProfileName(currentUser.name);
    setProfileEmail(currentUser.email);
    setProfilePhone(currentUser.phone || "");
    setProfileBio(currentUser.bio || "");
    setProfileTitle(currentUser.title || "");
    setProfileImgUrl(currentUser.imageUrl || "");
    setIsEditingProfile(false);
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImgUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteProfileClick = () => {
    if (onDeleteProfile) {
      if (confirm("Are you absolutely sure you want to delete your Agent profile and close your account? This action is permanent and will delete your catalog records. It cannot be undone.")) {
        onDeleteProfile(currentUser.id);
      }
    }
  };

  // Saved alerts creation
  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertMaxPrice) return;

    const newAlert: EmailAlertSubscription = {
      id: `ALRT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: currentUser.name,
      email: currentUser.email,
      location: alertLocation,
      maxPrice: Number(alertMaxPrice),
      preferredType: alertType,
      preferredStatus: alertStatus,
      submittedAt: new Date().toISOString(),
    };

    onAddAlert(newAlert);
    setAlertCreated(true);
    setAlertMaxPrice("");
    setTimeout(() => setAlertCreated(false), 2000);
  };

  // Convert File to Base64 helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isBulk: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    if (!isBulk) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPropCoverBase64(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file as File);
    } else {
      const promises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file as File);
        });
      });

      Promise.all(promises).then((results) => {
        setPropBulkBase64((prev) => [...prev, ...results]);
        setIsUploading(false);
      });
    }
  };

  // Create listing
  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle || !propPrice) return;

    const defaultImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
    const coverUrl = propCoverBase64 || defaultImage;

    const newProperty: Property = {
      id: `BENO-${Math.floor(1000 + Math.random() * 9000)}`,
      title: propTitle,
      description: propDesc || "No description provided.",
      type: propType,
      status: propStatus,
      price: Number(propPrice),
      location: propLocation,
      city: "Johannesburg",
      province: "Gauteng",
      sizeSqM: propSize ? Number(propSize) : undefined,
      bedrooms: propBeds ? Number(propBeds) : undefined,
      bathrooms: propBaths ? Number(propBaths) : undefined,
      parkingSpaces: propParking ? Number(propParking) : undefined,
      imageUrl: coverUrl,
      additionalImages: propBulkBase64.length > 0 ? propBulkBase64 : undefined,
      agentId: currentUser.role === "agent" ? currentUser.id : "BENO-AGT-1", // if admin, map to founder
      createdAt: new Date().toISOString(),
    };

    onAddProperty(newProperty);
    setPropSuccessMsg("Your listing was created and is immediately live!");
    
    // Clear
    setPropTitle("");
    setPropDesc("");
    setPropPrice("");
    setPropSize("");
    setPropBeds("");
    setPropBaths("");
    setPropParking("");
    setPropCoverBase64("");
    setPropBulkBase64([]);

    setTimeout(() => {
      setPropSuccessMsg("");
      setActiveTab(currentUser.role === "agent" ? "agent-properties" : "all-listings");
    }, 2500);
  };

  // Inline saving for listings
  const handleStartEditingProp = (p: Property) => {
    setEditingPropId(p.id);
    setEditPropPrice(p.price.toString());
    setEditPropStatus(p.status);
  };

  const handleSaveInlineProp = (p: Property) => {
    onUpdateProperty({
      ...p,
      price: Number(editPropPrice) || p.price,
      status: editPropStatus,
    });
    setEditingPropId(null);
  };

  // Leads inline edit notes
  const handleStartEditLead = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setLeadNotesEdit(lead.notes);
  };

  const handleSaveLeadNotes = (lead: Lead) => {
    onUpdateLead({
      ...lead,
      notes: leadNotesEdit,
    });
    setEditingLeadId(null);
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    // Only show assigned leads to the agent if active tab is assigned-leads
    if (activeTab === "assigned-leads" && lead.assignedAgentId !== currentUser.id) {
      return false;
    }

    const matchesSearch = 
      lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.phone.includes(leadSearch) ||
      lead.notes.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (lead.propertyRefId && lead.propertyRefId.toLowerCase().includes(leadSearch.toLowerCase()));

    const matchesType = leadFilterType === "All" || lead.type === leadFilterType;
    const matchesStatus = leadFilterStatus === "All" || lead.status === leadFilterStatus;
    const matchesAgent = leadFilterAgent === "All" || lead.assignedAgentId === leadFilterAgent;

    return matchesSearch && matchesType && matchesStatus && matchesAgent;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="portal-dashboard">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Navigation / User Overview */}
        <div className="w-full lg:w-1/4 flex flex-col gap-6" id="dashboard-nav-card">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            
            {/* Clickable/Hoverable Avatar for Photo Upload */}
            <div 
              onClick={() => {
                if (isEditingProfile && (activeTab === "profile" || activeTab === "agent-profile" || activeTab === "admin-profile" || activeTab === "landlord-profile")) {
                  profilePhotoFileRef.current?.click();
                }
              }}
              title={isEditingProfile ? "Click to upload local photo" : undefined}
              className={`relative w-20 h-20 rounded-full overflow-hidden bg-brand-primary/5 border border-gray-200 mb-3 flex items-center justify-center transition-all ${
                isEditingProfile && (activeTab === "profile" || activeTab === "agent-profile" || activeTab === "admin-profile" || activeTab === "landlord-profile")
                  ? "cursor-pointer ring-4 ring-amber-400 ring-offset-2 hover:opacity-95 group"
                  : ""
              }`}
            >
              {profileImgUrl ? (
                <img src={profileImgUrl} alt={currentUser.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : currentUser.imageUrl ? (
                <img src={currentUser.imageUrl} alt={currentUser.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-brand-primary" />
              )}

              {isEditingProfile && (activeTab === "profile" || activeTab === "agent-profile" || activeTab === "admin-profile" || activeTab === "landlord-profile") && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="h-5 w-5 text-white" />
                  <span className="text-[8px] font-bold uppercase mt-1">Upload</span>
                </div>
              )}
              
              <span className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                currentUser.role === "admin" ? "bg-red-500" : currentUser.role === "agent" ? "bg-amber-500" : "bg-emerald-500"
              }`} />
            </div>
            
            <h3 className="text-base font-bold text-gray-900">{currentUser.name}</h3>
            <p className="text-xs font-mono text-gray-400 uppercase mt-0.5">{currentUser.role} Account</p>
            
            {currentUser.role === "agent" && currentUser.title && (
              <span className="mt-2 text-xs bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2.5 py-0.5 rounded-full">
                {currentUser.title}
              </span>
            )}
            {currentUser.role === "admin" && (
              <span className="mt-2 text-xs bg-red-50 text-red-800 border border-red-200 font-bold px-2.5 py-0.5 rounded-full">
                Back-Office Director
              </span>
            )}

            <div className="w-full border-t border-gray-150 mt-5 pt-4 space-y-1 text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">My Desk Nav</span>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-brand-primary text-white font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Tab Workspaces */}
        <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm" id="dashboard-workspace">
          
          {/* Real-time Background Client & Property Event Notifications */}
          {(currentUser.role === "agent" || currentUser.role === "admin") && reminderSystem.notifications.length > 0 && (
            <div className="mb-6 bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 sm:p-5 shadow-sm animate-fadeIn" id="agent-background-notifications">
              <div className={`flex items-center justify-between ${!alertsCollapsed ? "mb-3.5 pb-2 border-b border-amber-200/30" : ""}`}>
                <div 
                  className="flex items-center gap-2 cursor-pointer select-none group"
                  onClick={() => setAlertsCollapsed(!alertsCollapsed)}
                  title={alertsCollapsed ? "Expand alerts panel" : "Collapse alerts panel"}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-amber-800 transition-colors">
                    <Bell className="h-3.5 w-3.5 text-amber-600 animate-bounce" />
                    Agent Desk: Active Client & Property Alerts ({reminderSystem.notifications.length})
                  </h4>
                  {alertsCollapsed ? (
                    <ChevronDown className="h-3.5 w-3.5 text-amber-700 group-hover:text-amber-900 transition-colors" />
                  ) : (
                    <ChevronUp className="h-3.5 w-3.5 text-amber-700 group-hover:text-amber-900 transition-colors" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      reminderSystem.resetSystem();
                    }}
                    className="text-[10px] font-bold text-amber-700 hover:text-amber-900 uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Clear & Reset Alerts
                  </button>
                  <span className="text-amber-300 text-[10px]">|</span>
                  <button
                    onClick={() => setAlertsCollapsed(!alertsCollapsed)}
                    className="text-[10px] font-bold text-amber-700 hover:text-amber-900 uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    {alertsCollapsed ? "Expand" : "Collapse"}
                  </button>
                </div>
              </div>
              {!alertsCollapsed && (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 animate-fadeIn">
                  {reminderSystem.notifications.map((notif) => (
                    <div key={notif.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-amber-100 p-3 rounded-xl shadow-xs hover:border-amber-200/80 transition-all">
                      <div className="flex gap-2.5">
                        <div className="mt-0.5 bg-amber-100/50 rounded-lg p-1.5 shrink-0 flex items-center justify-center h-8 w-8">
                          {notif.type === "birthday" ? (
                            <span className="text-sm">🎂</span>
                          ) : notif.type === "anniversary" ? (
                            <span className="text-sm">🏠</span>
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-xs font-black text-gray-900">{notif.title}</h5>
                            {notif.badgeText && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                {notif.badgeText}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-600 font-medium mt-0.5 leading-relaxed">{notif.description}</p>
                          <span className="text-[9px] font-mono text-gray-400 mt-1 block">Triggered: {new Date(notif.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0 self-start md:self-center">
                        <button
                          onClick={() => {
                            setActiveTab("relationship-assistant");
                          }}
                          className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-2xs transition-colors"
                        >
                          Action Nudge
                        </button>
                        <button
                          onClick={() => reminderSystem.markComplete(notif.id)}
                          className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                        >
                          Mark Done
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => reminderSystem.snooze(notif.id, 1)}
                            className="px-2 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                            title="Snooze for 1 Day"
                          >
                            Snooze 1d
                          </button>
                          <button
                            onClick={() => reminderSystem.snooze(notif.id, 7)}
                            className="px-2 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                            title="Snooze for 1 Week"
                          >
                            Snooze 7d
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* PROFILE WORKSPACE (All roles have basic profile update) */}
          {(activeTab === "profile" || activeTab === "agent-profile" || activeTab === "admin-profile" || activeTab === "landlord-profile") && (
            <div className="space-y-6" id="ws-profile">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Account Profile Credentials</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Maintain your contact information and public portal representations.</p>
                </div>
                
                {/* Edit Toggle Button */}
                {!isEditingProfile && (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer transition-all self-start"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit Profile
                  </button>
                )}
              </div>

              {profileSuccess && (
                <div className="p-3.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {/* Hidden File Input for photo upload */}
              <input
                type="file"
                accept="image/*"
                ref={profilePhotoFileRef}
                onChange={handleProfilePhotoChange}
                className="hidden"
              />

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      disabled={!isEditingProfile}
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className={`w-full border rounded-xl p-3 text-sm text-gray-800 transition-all ${
                        isEditingProfile 
                          ? "bg-white border-gray-200 focus:outline-none focus:border-brand-primary" 
                          : "bg-gray-100 border-gray-150 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      disabled={!isEditingProfile}
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className={`w-full border rounded-xl p-3 text-sm text-gray-800 transition-all ${
                        isEditingProfile 
                          ? "bg-white border-gray-200 focus:outline-none focus:border-brand-primary" 
                          : "bg-gray-100 border-gray-150 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    disabled={!isEditingProfile}
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="e.g. +27 (0) 82 555 1234"
                    className={`w-full border rounded-xl p-3 text-sm text-gray-800 transition-all ${
                      isEditingProfile 
                        ? "bg-white border-gray-200 focus:outline-none focus:border-brand-primary" 
                        : "bg-gray-100 border-gray-150 text-gray-500 cursor-not-allowed"
                    }`}
                  />
                </div>

                {currentUser.role === "agent" && (
                  <div className="p-4 bg-amber-50/40 border border-amber-200/50 rounded-2xl space-y-4">
                    <span className="text-xs font-extrabold text-amber-900 uppercase font-mono block">Agent Public Presentation</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-800 uppercase mb-1.5">Professional Title</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profileTitle}
                          onChange={(e) => setProfileTitle(e.target.value)}
                          placeholder="e.g. Area Specialist & Director"
                          className={`w-full border rounded-xl p-3 text-xs text-gray-800 transition-all ${
                            isEditingProfile 
                              ? "bg-white border-gray-200 focus:outline-none focus:border-brand-primary" 
                              : "bg-gray-100 border-gray-150 text-gray-500 cursor-not-allowed"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold text-amber-800 uppercase">Avatar URL</label>
                          {isEditingProfile && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => profilePhotoFileRef.current?.click()}
                                className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Upload className="h-3 w-3" /> Upload Photo
                              </button>
                              {profileImgUrl && (
                                <button
                                  type="button"
                                  onClick={() => setProfileImgUrl("")}
                                  className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="h-3 w-3" /> Clear
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <input
                          type="url"
                          disabled={!isEditingProfile}
                          value={profileImgUrl}
                          onChange={(e) => setProfileImgUrl(e.target.value)}
                          placeholder="https://..."
                          className={`w-full border rounded-xl p-3 text-xs text-gray-800 transition-all ${
                            isEditingProfile 
                              ? "bg-white border-gray-200 focus:outline-none focus:border-brand-primary" 
                              : "bg-gray-100 border-gray-150 text-gray-500 cursor-not-allowed"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-800 uppercase mb-1.5">Biography & Mission</label>
                      <textarea
                        rows={4}
                        disabled={!isEditingProfile}
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        placeholder="Tell clients about your expertise, focus neighborhoods, and commitment..."
                        className={`w-full border rounded-xl p-3 text-xs text-gray-800 leading-relaxed transition-all ${
                          isEditingProfile 
                            ? "bg-white border-gray-200 focus:outline-none focus:border-brand-primary" 
                            : "bg-gray-100 border-gray-150 text-gray-500 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="pt-4 border-t border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {isEditingProfile ? (
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelProfileEdit}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs italic">
                      Click "Edit Profile" at the top right to make changes.
                    </div>
                  )}

                  {/* Delete Account Button */}
                  {onDeleteProfile && (
                    <button
                      type="button"
                      onClick={handleDeleteProfileClick}
                      className="px-5 py-2.5 text-xs font-bold text-red-600 hover:text-white border border-red-200 hover:bg-red-600 rounded-full cursor-pointer transition-all flex items-center gap-1.5 self-start"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* SAVED FAVORITES WORKSPACE */}
          {activeTab === "favorites" && (
            <div className="space-y-6" id="ws-favorites">
              <div>
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Saved Favorites</h3>
                <p className="text-gray-500 text-xs mt-0.5">Real-time catalog matches you've liked for comparison.</p>
              </div>

              {currentUser.favorites.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <Heart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No properties in your favorites yet.</p>
                  <p className="text-gray-400 text-xs mt-1">Click the heart button on any listing on the home page to save it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties
                    .filter((p) => currentUser.favorites.includes(p.id))
                    .map((prop) => (
                      <div key={prop.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow relative bg-white">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                          <img src={prop.imageUrl} alt={prop.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          <button
                            onClick={() => {
                              const list = currentUser.favorites.filter((id) => id !== prop.id);
                              onUpdateProfile({ ...currentUser, favorites: list });
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/95 text-red-500 rounded-full hover:bg-white shadow-sm cursor-pointer"
                            title="Remove from favorites"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="p-4 space-y-2">
                          <span className="text-[10px] font-mono text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded uppercase font-bold">
                            {prop.status}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900 truncate" title={prop.title}>{prop.title}</h4>
                          <div className="text-xs text-gray-500">{prop.location}, {prop.city}</div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="font-mono text-xs font-extrabold text-brand-primary">
                              {formatPriceZAR(prop.price, prop.status)}
                            </span>
                            <button
                              onClick={() => onSelectPropertyDetails && onSelectPropertyDetails(prop.id)}
                              className="text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-wider flex items-center cursor-pointer"
                            >
                              Details
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* SEARCH ALERTS WORKSPACE */}
          {activeTab === "alerts" && (
            <div className="space-y-8" id="ws-alerts">
              <div>
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Saved Search Alerts</h3>
                <p className="text-gray-500 text-xs mt-0.5">Subscribe to instant automated notifications when properties matching your criteria hit the market.</p>
              </div>

              {/* Create alert form */}
              <form onSubmit={handleCreateAlert} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <span className="text-xs font-extrabold text-gray-800 uppercase font-mono block flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-brand-primary animate-bounce" />
                  Define Search Alert Criteria
                </span>

                {alertCreated && (
                  <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl text-xs font-bold">
                    Search alert created successfully!
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Target Suburb</label>
                    <select
                      value={alertLocation}
                      onChange={(e) => setAlertLocation(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none"
                    >
                      {GAUTENG_SUBURBS.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Property Type</label>
                    <select
                      value={alertType}
                      onChange={(e) => setAlertType(e.target.value as PropertyType)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none"
                    >
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Deal Status</label>
                    <select
                      value={alertStatus}
                      onChange={(e) => setAlertStatus(e.target.value as PropertyStatus)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none"
                    >
                      <option value="For Sale">For Sale</option>
                      <option value="To Rent">To Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Max Budget (ZAR)</label>
                    <input
                      type="number"
                      required
                      value={alertMaxPrice}
                      onChange={(e) => setAlertMaxPrice(e.target.value)}
                      placeholder="e.g. 3500000"
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-extrabold uppercase rounded-full cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Save Search Alert
                </button>
              </form>

              {/* Alerts List */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">My Active Alert Subscriptions</span>
                {alertSubscriptions.filter((sub) => sub.email.toLowerCase() === currentUser.email.toLowerCase()).length === 0 ? (
                  <p className="text-gray-400 text-xs py-2 font-mono">You do not have any active alerts configured.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {alertSubscriptions
                      .filter((sub) => sub.email.toLowerCase() === currentUser.email.toLowerCase())
                      .map((alert) => (
                        <div key={alert.id} className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 bg-brand-primary rounded-full animate-pulse" />
                              <span className="text-xs font-bold text-gray-900">{alert.location} Alerts</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono mt-1">
                              {alert.preferredType} / {alert.preferredStatus} under {formatPriceZAR(alert.maxPrice, "For Sale")}
                            </p>
                          </div>
                          <button
                            onClick={() => onDeleteAlert(alert.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-150 transition-all cursor-pointer"
                            title="Delete alert"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AGENT REPRESENTED PROPERTIES / LISTINGS */}
          {(activeTab === "agent-properties" || activeTab === "all-listings") && (
            <div className="space-y-8" id="ws-represented-listings">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                    {currentUser.role === "admin" ? "All Agency Properties" : "My Represented Listings"}
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">Manage details and upload bulk visual properties.</p>
                </div>
                
                {/* Switch to Create state internally */}
                <button
                  onClick={() => {
                    // Quick modal or toggle
                    const section = document.getElementById("add-property-sub-form");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add New Property
                </button>
              </div>

              {/* Property Catalog list for Agent or Admin */}
              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-50 text-gray-500 font-mono uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="p-4">Reference</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Price</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {properties
                      .filter((p) => currentUser.role === "admin" || p.agentId === currentUser.id)
                      .map((prop) => (
                        <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-brand-secondary">{prop.id}</td>
                          <td className="p-4 font-semibold text-gray-950 truncate max-w-xs">{prop.title}</td>
                          <td className="p-4">{prop.location}</td>
                          <td className="p-4">
                            {editingPropId === prop.id ? (
                              <select
                                value={editPropStatus}
                                onChange={(e) => setEditPropStatus(e.target.value as PropertyStatus)}
                                className="bg-white border border-gray-200 rounded p-1 text-[10px]"
                              >
                                <option value="For Sale">For Sale</option>
                                <option value="To Rent">To Rent</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                                prop.status === "For Sale" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                              }`}>
                                {prop.status}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-gray-900">
                            {editingPropId === prop.id ? (
                              <input
                                type="number"
                                value={editPropPrice}
                                onChange={(e) => setEditPropPrice(e.target.value)}
                                className="bg-white border border-gray-200 rounded p-1 text-[10px] w-24 text-right"
                              />
                            ) : (
                              formatPriceZAR(prop.price, prop.status)
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              {editingPropId === prop.id ? (
                                <button
                                  onClick={() => handleSaveInlineProp(prop)}
                                  className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStartEditingProp(prop)}
                                  className="p-1.5 bg-gray-100 text-gray-500 rounded hover:bg-gray-200 cursor-pointer"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm("Delete listing permanently?")) {
                                    onDeleteProperty(prop.id);
                                  }
                                }}
                                className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 border border-red-200 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Add property subform (Manual & Bulk image loading base64) */}
              <div className="bg-gray-55 border border-gray-200 rounded-2xl p-6 space-y-6" id="add-property-sub-form">
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-brand-primary" />
                    New Real Estate Placement Form
                  </h4>
                  <p className="text-[11px] text-gray-550 leading-normal mt-0.5">Submit full parameters, with drag & drop support for cover photo & gallery.</p>
                </div>

                {propSuccessMsg && (
                  <div className="p-3.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>{propSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCreateListingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Listing Name *</label>
                      <input
                        type="text"
                        required
                        value={propTitle}
                        onChange={(e) => setPropTitle(e.target.value)}
                        placeholder="e.g. Modern Rosebank 3-Bed Cluster"
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Location Suburb *</label>
                      <select
                        value={propLocation}
                        onChange={(e) => setPropLocation(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none"
                      >
                        {GAUTENG_SUBURBS.map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Type</label>
                      <select
                        value={propType}
                        onChange={(e) => setPropType(e.target.value as PropertyType)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none"
                      >
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Vacant Land">Vacant Land</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Status</label>
                      <select
                        value={propStatus}
                        onChange={(e) => setPropStatus(e.target.value as PropertyStatus)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none"
                      >
                        <option value="For Sale">For Sale</option>
                        <option value="To Rent">To Rent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Asking Value (ZAR) *</label>
                      <input
                        type="number"
                        required
                        value={propPrice}
                        onChange={(e) => setPropPrice(e.target.value)}
                        placeholder="e.g. 1950000"
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Size (m²)</label>
                      <input
                        type="number"
                        value={propSize}
                        onChange={(e) => setPropSize(e.target.value)}
                        placeholder="e.g. 150"
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Bedrooms</label>
                      <input
                        type="number"
                        value={propBeds}
                        onChange={(e) => setPropBeds(e.target.value)}
                        placeholder="e.g. 3"
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Bathrooms</label>
                      <input
                        type="number"
                        value={propBaths}
                        onChange={(e) => setPropBaths(e.target.value)}
                        placeholder="e.g. 2"
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Parking Bays</label>
                      <input
                        type="number"
                        value={propParking}
                        onChange={(e) => setPropParking(e.target.value)}
                        placeholder="e.g. 2"
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Manual & Bulk Uploading buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Cover photo (Manual upload) */}
                    <div className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center text-center space-y-2 relative">
                      <ImageIcon className="h-6 w-6 text-brand-primary" />
                      <span className="text-xs font-bold text-gray-800">Manual Cover Image Upload</span>
                      <p className="text-[10px] text-gray-400">Upload primary presentation photo (.jpg, .png)</p>
                      
                      <button
                        type="button"
                        onClick={() => coverFileRef.current?.click()}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase rounded text-[10px] cursor-pointer"
                      >
                        Select Cover File
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={coverFileRef}
                        onChange={(e) => handleFileChange(e, false)}
                        className="hidden"
                      />
                      {propCoverBase64 && (
                        <div className="mt-2 w-full max-w-xs flex items-center justify-between bg-emerald-50 text-emerald-800 text-[10px] px-2.5 py-1.5 rounded border border-emerald-150">
                          <span className="font-bold">Cover Ready ✔</span>
                          <button
                            type="button"
                            onClick={() => setPropCoverBase64("")}
                            className="text-red-500 hover:underline font-extrabold"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bulk gallery uploads */}
                    <div className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center text-center space-y-2 relative">
                      <Upload className="h-6 w-6 text-brand-secondary" />
                      <span className="text-xs font-bold text-gray-800">Bulk Property Gallery Uploads</span>
                      <p className="text-[10px] text-gray-400">Select multiple supplementary images in bulk</p>
                      
                      <button
                        type="button"
                        onClick={() => bulkFileRef.current?.click()}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase rounded text-[10px] cursor-pointer"
                      >
                        Upload Bulk Files
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={bulkFileRef}
                        onChange={(e) => handleFileChange(e, true)}
                        className="hidden"
                      />
                      {propBulkBase64.length > 0 && (
                        <div className="mt-2 w-full max-w-xs flex items-center justify-between bg-emerald-50 text-emerald-800 text-[10px] px-2.5 py-1.5 rounded border border-emerald-150">
                          <span className="font-bold">{propBulkBase64.length} Photos Ready ✔</span>
                          <button
                            type="button"
                            onClick={() => setPropBulkBase64([])}
                            className="text-red-500 hover:underline font-extrabold"
                          >
                            Clear All
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isUploading && (
                    <p className="text-center text-brand-primary text-xs font-mono animate-pulse">Encoding media formats to base64 datasets, please hold...</p>
                  )}

                  {/* Render Thumbnail previews */}
                  {propBulkBase64.length > 0 && (
                    <div className="bg-white p-3 border border-gray-200 rounded-xl">
                      <span className="text-[9px] font-bold text-gray-400 uppercase block mb-2">Gallery Upload Previews</span>
                      <div className="flex flex-wrap gap-2">
                        {propBulkBase64.map((b64, idx) => (
                          <div key={idx} className="w-12 h-12 rounded overflow-hidden border border-gray-200 bg-gray-50 relative">
                            <img src={b64} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setPropBulkBase64(propBulkBase64.filter((_, i) => i !== idx))}
                              className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-bold h-3 w-3 flex items-center justify-center rounded-bl"
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Amenities & Detailed Summary *</label>
                    <textarea
                      rows={3}
                      required
                      value={propDesc}
                      onChange={(e) => setPropDesc(e.target.value)}
                      placeholder="Explain location, security level, solar backup grids, garden sizes..."
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brand-primary text-white font-extrabold rounded-full text-xs uppercase tracking-wider cursor-pointer transition-all hover:bg-brand-hover shadow-sm"
                  >
                    Publish Listing Immediately
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* LEAD MANAGEMENT SYSTEM WORKSPACE */}
          {(activeTab === "lead-manager" || activeTab === "assigned-leads") && (
            <div className="space-y-6" id="ws-leads-dashboard">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                    {activeTab === "assigned-leads" ? "My Assigned Inbound Leads" : "Enterprise Lead Control Board"}
                  </h3>
                  <p className="text-gray-500 text-xs mt-0.5">Filter, categorize, assign, and track statuses of all inquiries.</p>
                </div>
              </div>

              {/* Lead filters */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, ref..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none"
                  />
                </div>

                <div>
                  <select
                    value={leadFilterType}
                    onChange={(e) => setLeadFilterType(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none"
                  >
                    <option value="All">All Lead Sources</option>
                    <option value="Contact">General Contact</option>
                    <option value="Inquiry">Property Inquiry</option>
                    <option value="Property Finder">Property Finder</option>
                    <option value="Landlord Listing">Landlord Listing</option>
                    <option value="Email Alert">Email Alert Sub</option>
                  </select>
                </div>

                <div>
                  <select
                    value={leadFilterStatus}
                    onChange={(e) => setLeadFilterStatus(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed / Signed</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                {activeTab === "lead-manager" && (
                  <div>
                    <select
                      value={leadFilterAgent}
                      onChange={(e) => setLeadFilterAgent(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none"
                    >
                      <option value="All">All Agents</option>
                      <option value="Unassigned">Unassigned Only</option>
                      {agents.map((agt) => (
                        <option key={agt.id} value={agt.id}>{agt.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Leads Listing cards */}
              {filteredLeads.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-gray-250 rounded-2xl bg-gray-50/50">
                  <Inbox className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No leads match current criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead) => {
                    const assignedAgentName = agents.find((a) => a.id === lead.assignedAgentId)?.name || "Unassigned";
                    
                    return (
                      <div 
                        key={lead.id} 
                        className={`border rounded-2xl p-5 bg-white shadow-sm transition-all relative ${
                          lead.status === "New" 
                            ? "border-l-4 border-l-brand-primary border-gray-200" 
                            : lead.status === "Closed" 
                            ? "border-l-4 border-l-emerald-500 border-gray-200" 
                            : "border-gray-200"
                        }`}
                      >
                        {/* Top info row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-gray-900">{lead.name}</span>
                              <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold bg-brand-primary/10 text-brand-primary">
                                {lead.type}
                              </span>
                              <span className="font-mono text-[9px] text-gray-400">ID: {lead.id}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 font-mono mt-1">
                              <span>📧 {lead.email}</span>
                              <span>📞 {lead.phone}</span>
                            </div>
                            {lead.tags && lead.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {lead.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    ★ {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Category Selector */}
                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                              <Tag className="h-3 w-3 text-gray-400" />
                              <select
                                value={lead.category}
                                onChange={(e) => onUpdateLead({ ...lead, category: e.target.value as any })}
                                className="bg-transparent text-[10px] text-gray-800 font-bold border-none focus:outline-none cursor-pointer uppercase"
                              >
                                <option value="Buyer">Buyer</option>
                                <option value="Seller">Seller</option>
                                <option value="Tenant">Tenant</option>
                                <option value="General">General</option>
                              </select>
                            </div>

                            {/* Status Selector */}
                            <select
                              value={lead.status}
                              onChange={(e) => onUpdateLead({ ...lead, status: e.target.value as any })}
                              className={`text-[10px] font-bold uppercase rounded-lg px-2 py-1 focus:outline-none cursor-pointer border ${
                                lead.status === "New" 
                                  ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" 
                                  : lead.status === "Closed" 
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                                  : lead.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Closed">Closed</option>
                              <option value="Lost">Lost</option>
                            </select>
                          </div>
                        </div>

                        {/* Mid Details block */}
                        <div className="py-3 text-xs text-gray-700 leading-relaxed font-sans space-y-2">
                          {lead.propertyRefId && (
                            <div className="flex items-center gap-1.5 text-xs text-brand-primary font-bold">
                              <span>Property Ref:</span>
                              <button 
                                onClick={() => onSelectPropertyDetails && onSelectPropertyDetails(lead.propertyRefId!)}
                                className="underline hover:text-brand-hover uppercase tracking-wider font-mono cursor-pointer"
                              >
                                {lead.propertyRefId}
                              </button>
                            </div>
                          )}
                          <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-150 leading-relaxed italic text-gray-600">
                            "{lead.details || "No details submitted."}"
                          </div>
                        </div>

                        {/* Assign Agent & Notes */}
                        <div className="pt-3 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30 -mx-5 -mb-5 px-5 pb-5 rounded-b-2xl">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-gray-400 font-mono">Assigned Representative:</span>
                            {activeTab === "lead-manager" ? (
                              <select
                                value={lead.assignedAgentId}
                                onChange={(e) => onUpdateLead({ ...lead, assignedAgentId: e.target.value })}
                                className="bg-white border border-gray-200 rounded px-2 py-1 text-[10px] text-gray-700 font-bold focus:outline-none"
                              >
                                <option value="Unassigned">Unassigned</option>
                                {agents.map((agt) => (
                                  <option key={agt.id} value={agt.id}>{agt.name}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                                {assignedAgentName}
                              </span>
                            )}
                          </div>

                          {/* Notes field */}
                          <div className="flex-1 flex items-center gap-2 max-w-lg">
                            {editingLeadId === lead.id ? (
                              <div className="w-full flex items-center gap-2">
                                <input
                                  type="text"
                                  value={leadNotesEdit}
                                  onChange={(e) => setLeadNotesEdit(e.target.value)}
                                  className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-800"
                                  placeholder="Type notes (e.g., Called client, requested viewing)..."
                                />
                                <button
                                  onClick={() => handleSaveLeadNotes(lead)}
                                  className="p-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-all cursor-pointer"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="w-full flex items-center justify-between gap-3">
                                <span className="text-[10px] text-gray-500 font-mono truncate max-w-[200px] sm:max-w-xs block" title={lead.notes}>
                                  <strong>Admin Notes:</strong> {lead.notes || "None. Click edit to add."}
                                </span>
                                <button
                                  onClick={() => handleStartEditLead(lead)}
                                  className="text-[9px] font-bold text-brand-primary hover:underline uppercase tracking-wider flex items-center cursor-pointer"
                                >
                                  <Edit className="h-3 w-3 mr-0.5" />
                                  Edit Notes
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <AppointmentsManager
              currentUser={currentUser}
              appointments={appointments}
              onAddAppointment={onAddAppointment}
              onUpdateAppointment={onUpdateAppointment}
              onDeleteAppointment={onDeleteAppointment}
              clientInvitations={clientInvitations}
              onAddInvitation={onAddInvitation}
              onUpdateInvitation={onUpdateInvitation}
              onDeleteInvitation={onDeleteInvitation}
              properties={properties}
              agents={agents}
              leads={leads}
              onSelectPropertyDetails={onSelectPropertyDetails}
            />
          )}

          {activeTab === "monthly-reports" && (
            <MonthlyReports
              currentUser={currentUser}
              appointments={appointments}
              clientInvitations={clientInvitations}
              properties={properties}
              agents={agents}
            />
          )}

          {activeTab === "client-appointments" && (
            <div className="space-y-6" id="ws-client-appointments">
              <div className="border-b border-gray-150 pb-4">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-brand-secondary" />
                  My Scheduled Viewings & Appointments
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Track your private viewings, virtual tours, and consultation sessions with Beno Properties agents.
                </p>
              </div>

              {(() => {
                const clientApts = appointments.filter(
                  (a) => a.clientEmail.toLowerCase() === currentUser.email.toLowerCase() ||
                         a.clientName.toLowerCase().includes(currentUser.name.toLowerCase())
                );

                if (clientApts.length === 0) {
                  return (
                    <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center max-w-lg mx-auto">
                      <CalendarCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h4 className="text-base font-bold text-gray-800">No Scheduled Appointments</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        You don't have any upcoming property viewings or consultations booked yet. Browse our catalog and click "Inquire & Schedule Viewing" on any property.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 gap-4">
                    {clientApts.map((apt) => (
                      <div
                        key={apt.id}
                        className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full">
                              {apt.type}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                apt.status === "Confirmed"
                                  ? "bg-blue-100 text-blue-800"
                                  : apt.status === "Completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-gray-900">{apt.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="font-semibold text-gray-700">
                              📅 {new Date(apt.dateTime).toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })} at{" "}
                              {new Date(apt.dateTime).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <span>📍 {apt.location}</span>
                            <span>👤 Host Agent: <strong>{apt.agentName}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center">
                          {apt.isVirtual && apt.virtualMeetingUrl && (
                            <a
                              href={apt.virtualMeetingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
                            >
                              Join Online Tour
                            </a>
                          )}
                          {apt.propertyId && onSelectPropertyDetails && (
                            <button
                              onClick={() => onSelectPropertyDetails(apt.propertyId!)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all"
                            >
                              View Property
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === "relationship-assistant" && (
            <RelationshipAssistant
              leads={leads}
              onUpdateLead={onUpdateLead}
              properties={properties}
              onUpdateProperty={onUpdateProperty}
              agents={agents}
              currentUser={currentUser}
              reminderSystem={reminderSystem}
            />
          )}

          {activeTab === "tenant-vetting" && (
            <TenantVetting
              properties={properties}
              onUpdateProperty={onUpdateProperty}
              currentUser={currentUser}
              isClientPortal={false}
              onOpenAuth={onOpenAuth}
            />
          )}

          {activeTab === "tools" && (
            <div className="space-y-6" id="ws-tools">
              <div className="border-b border-gray-150 pb-4">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-brand-secondary" />
                  Client Planning Tools
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Access specialized tools designed to streamline your rental and purchasing journey.
                </p>
              </div>

              {/* Tools selector tabs */}
              <div className="flex border-b border-gray-200 gap-2 mb-6" id="tools-selector-tabs">
                <button
                  onClick={() => setSelectedTool("vetting")}
                  className={`px-4 py-2.5 text-xs font-bold uppercase border-b-2 transition-all cursor-pointer ${
                    selectedTool === "vetting"
                      ? "border-brand-primary text-brand-primary font-extrabold"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Tenant Vetting & Screening
                </button>
                <button
                  onClick={() => setSelectedTool("bond")}
                  className={`px-4 py-2.5 text-xs font-bold uppercase border-b-2 transition-all cursor-pointer ${
                    selectedTool === "bond"
                      ? "border-brand-primary text-brand-primary font-extrabold"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Bond & Repayment Calculator
                </button>
              </div>

              <div className="pt-2">
                {selectedTool === "vetting" ? (
                  <TenantVetting
                    properties={properties}
                    onUpdateProperty={onUpdateProperty}
                    currentUser={currentUser}
                    isClientPortal={true}
                    onOpenAuth={onOpenAuth}
                  />
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-inner animate-fadeIn">
                    <BondCalculator />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
