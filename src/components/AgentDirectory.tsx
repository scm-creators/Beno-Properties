/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  Phone,
  Mail,
  Award,
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
  Building,
  UserCheck,
  Star,
  MapPin,
  MessageCircle,
  Share2,
  Check,
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Calendar,
  Send,
  X,
  Image as ImageIcon
} from "lucide-react";
import { Agent, Property, UserProfile, PropertyType, PropertyStatus } from "../types";
import PropertyCard, { formatPriceZAR } from "./PropertyCard";
import { GAUTENG_SUBURBS } from "../data";

interface AgentDirectoryProps {
  agents: Agent[];
  properties?: Property[];
  currentUser?: UserProfile | null;
  onContactClick: (agent: Agent) => void;
  onViewPropertyDetails?: (property: Property) => void;
  onToggleFavorite?: (propertyId: string) => void;
  onToggleCompare?: (propertyId: string) => void;
  comparedPropertyIds?: string[];
  onUpdateAgent?: (updatedAgent: Agent) => void;
  onAddProperty?: (newProp: Property) => void;
  onUpdateProperty?: (updatedProp: Property) => void;
  onDeleteProperty?: (propertyId: string) => void;
  onOpenAuth?: (prompt?: string) => void;
  initialAgentId?: string | null;
}

export default function AgentDirectory({
  agents = [],
  properties = [],
  currentUser = null,
  onContactClick,
  onViewPropertyDetails = () => {},
  onToggleFavorite,
  onToggleCompare,
  comparedPropertyIds = [],
  onUpdateAgent,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  onOpenAuth,
  initialAgentId = null,
}: AgentDirectoryProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(initialAgentId);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (initialAgentId) {
      setSelectedAgentId(initialAgentId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [initialAgentId]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [listingStatusFilter, setListingStatusFilter] = useState<"All" | "For Sale" | "To Rent">("All");

  // Agent Profile Edit Modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [editSpecialization, setEditSpecialization] = useState("");

  // Add / Edit Property Modal for Agent
  const [isAddingListing, setIsAddingListing] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propTitle, setPropTitle] = useState("");
  const [propPrice, setPropPrice] = useState("");
  const [propStatus, setPropStatus] = useState<PropertyStatus>("For Sale");
  const [propType, setPropType] = useState<PropertyType>("House");
  const [propLocation, setPropLocation] = useState(GAUTENG_SUBURBS[0] || "Sandton");
  const [propBeds, setPropBeds] = useState("");
  const [propBaths, setPropBaths] = useState("");
  const [propSize, setPropSize] = useState("");
  const [propImageUrl, setPropImageUrl] = useState("");
  const [propDescription, setPropDescription] = useState("");

  // Direct Agent Inquiry Form State
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);

  // Feedback Notifications
  const [copiedShare, setCopiedShare] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Selected Agent Object
  const selectedAgent = useMemo(() => {
    if (!selectedAgentId) return null;
    return agents.find((a) => a.id === selectedAgentId) || null;
  }, [agents, selectedAgentId]);

  // Properties listed by selected agent
  const agentProperties = useMemo(() => {
    if (!selectedAgent) return [];
    return properties.filter((p) => p.agentId === selectedAgent.id);
  }, [properties, selectedAgent]);

  // Filtered properties for selected agent based on For Sale / To Rent
  const filteredAgentProperties = useMemo(() => {
    return agentProperties.filter((p) => {
      if (listingStatusFilter === "All") return true;
      return p.status === listingStatusFilter;
    });
  }, [agentProperties, listingStatusFilter]);

  // Unique specializations across all agents
  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    agents.forEach((a) => {
      (a.specialization || []).forEach((s) => set.add(s));
    });
    return ["All", ...Array.from(set)];
  }, [agents]);

  // Filtered Agents for Directory View
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      if (selectedSpecialty !== "All" && !(agent.specialization || []).includes(selectedSpecialty)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = agent.name.toLowerCase().includes(q);
        const matchesTitle = agent.title.toLowerCase().includes(q);
        const matchesBio = agent.bio.toLowerCase().includes(q);
        const matchesSpec = (agent.specialization || []).some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesTitle && !matchesBio && !matchesSpec) return false;
      }
      return true;
    });
  }, [agents, selectedSpecialty, searchQuery]);

  // Check if the current logged-in user is authorized to manage this agent's profile & listings
  const canManageCurrentAgent = (agent: Agent): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true;
    if (currentUser.role === "agent" && (currentUser.id === agent.id || currentUser.email.toLowerCase() === agent.email.toLowerCase())) {
      return true;
    }
    return false;
  };

  // Open Edit Profile Modal
  const handleOpenEditProfile = (agent: Agent) => {
    setEditName(agent.name);
    setEditTitle(agent.title);
    setEditPhone(agent.phone);
    setEditEmail(agent.email);
    setEditBio(agent.bio);
    setEditPhotoUrl(agent.imageUrl);
    setEditSpecialization((agent.specialization || []).join(", "));
    setIsEditingProfile(true);
  };

  // Save Agent Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;

    const updatedAgent: Agent = {
      ...selectedAgent,
      name: editName.trim() || selectedAgent.name,
      title: editTitle.trim() || selectedAgent.title,
      phone: editPhone.trim() || selectedAgent.phone,
      email: editEmail.trim() || selectedAgent.email,
      bio: editBio.trim() || selectedAgent.bio,
      imageUrl: editPhotoUrl.trim() || selectedAgent.imageUrl,
      specialization: editSpecialization.split(",").map((s) => s.trim()).filter(Boolean)
    };

    if (onUpdateAgent) {
      onUpdateAgent(updatedAgent);
    }

    setIsEditingProfile(false);
    showToast(`Profile for ${updatedAgent.name} successfully updated!`);
  };

  // Open Add Listing Modal
  const handleOpenAddListing = () => {
    setEditingProperty(null);
    setPropTitle("");
    setPropPrice("");
    setPropStatus("For Sale");
    setPropType("House");
    setPropLocation(GAUTENG_SUBURBS[0] || "Sandton");
    setPropBeds("3");
    setPropBaths("2");
    setPropSize("250");
    setPropImageUrl("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80");
    setPropDescription("");
    setIsAddingListing(true);
  };

  // Open Edit Listing Modal
  const handleOpenEditListing = (prop: Property) => {
    setEditingProperty(prop);
    setPropTitle(prop.title);
    setPropPrice(String(prop.price));
    setPropStatus(prop.status);
    setPropType(prop.type);
    setPropLocation(prop.location);
    setPropBeds(String(prop.bedrooms || ""));
    setPropBaths(String(prop.bathrooms || ""));
    setPropSize(String(prop.sizeSqM || ""));
    setPropImageUrl(prop.imageUrl);
    setPropDescription(prop.description);
    setIsAddingListing(true);
  };

  // Save New or Edited Property
  const handleSavePropertyListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;

    const priceNum = Number(propPrice) || 1000000;
    const bedsNum = propBeds ? Number(propBeds) : undefined;
    const bathsNum = propBaths ? Number(propBaths) : undefined;
    const sizeNum = propSize ? Number(propSize) : undefined;

    if (editingProperty) {
      const updated: Property = {
        ...editingProperty,
        title: propTitle.trim(),
        price: priceNum,
        status: propStatus,
        type: propType,
        location: propLocation,
        bedrooms: bedsNum,
        bathrooms: bathsNum,
        sizeSqM: sizeNum,
        imageUrl: propImageUrl.trim() || editingProperty.imageUrl,
        description: propDescription.trim() || editingProperty.description
      };
      if (onUpdateProperty) onUpdateProperty(updated);
      showToast(`Listing "${updated.title}" updated successfully!`);
    } else {
      const newRefId = `BENO-${Math.floor(1000 + Math.random() * 9000)}`;
      const newProp: Property = {
        id: newRefId,
        title: propTitle.trim(),
        price: priceNum,
        status: propStatus,
        type: propType,
        location: propLocation,
        city: "Johannesburg",
        province: "Gauteng",
        bedrooms: bedsNum,
        bathrooms: bathsNum,
        sizeSqM: sizeNum,
        imageUrl: propImageUrl.trim() || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        description: propDescription.trim() || "Exclusive listing managed by Beno Properties.",
        agentId: selectedAgent.id,
        isFeatured: true,
        createdAt: new Date().toISOString()
      };
      if (onAddProperty) onAddProperty(newProp);
      showToast(`Listing "${newProp.title}" published under ${selectedAgent.name}!`);
    }

    setIsAddingListing(false);
    setEditingProperty(null);
  };

  // Delete Listing
  const handleDeleteListing = (prop: Property) => {
    if (confirm(`Are you sure you want to remove listing "${prop.title}" (${prop.id})?`)) {
      if (onDeleteProperty) onDeleteProperty(prop.id);
      showToast(`Listing ${prop.id} removed from catalog.`);
    }
  };

  // Share Agent Profile Permalink
  const handleShareProfile = async (agent: Agent) => {
    const url = `${window.location.origin}${window.location.pathname}?tab=agents&agentId=${encodeURIComponent(agent.id)}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${agent.name} - ${agent.title} | Beno Properties`,
          text: `Connect with ${agent.name} at Beno Properties for premium Gauteng real estate sales and rentals.`,
          url
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiedShare(true);
      showToast("Agent profile link copied to clipboard!");
      setTimeout(() => setCopiedShare(false), 2500);
    } catch (err) {
      console.warn("Share failed", err);
    }
  };

  // Submit Direct Inquiry to Agent
  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    setInquirySent(true);
    showToast(`Inquiry sent directly to ${selectedAgent.name}! They will contact you shortly.`);
    setTimeout(() => {
      setInquiryName("");
      setInquiryEmail("");
      setInquiryPhone("");
      setInquiryMessage("");
      setInquirySent(false);
    }, 3500);
  };

  // --------------------------------------------------------------------------------------------------
  // VIEW 1: DEDICATED AGENT PROFILE PAGE (when selectedAgentId is not null)
  // --------------------------------------------------------------------------------------------------
  if (selectedAgent) {
    const isOwnerOrAdmin = canManageCurrentAgent(selectedAgent);

    return (
      <div className="w-full space-y-10" id="agent-profile-page">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Breadcrumb Navigation & Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => {
              setSelectedAgentId(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-hover uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Agents
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShareProfile(selectedAgent)}
              className="px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Share agent direct profile link"
            >
              {copiedShare ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              {copiedShare ? "Link Copied!" : "Share Profile"}
            </button>

            {isOwnerOrAdmin && (
              <button
                onClick={() => handleOpenEditProfile(selectedAgent)}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer uppercase tracking-wider"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Manage Profile
              </button>
            )}
          </div>
        </div>

        {/* Hero Agent Profile Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-lg overflow-hidden relative">
          {/* Subtle decorative gold badge */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#C5A85C]/5 rounded-bl-full pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            {/* Agent Photo */}
            <div className="w-full md:w-56 aspect-square rounded-3xl overflow-hidden bg-gray-100 border-2 border-brand-secondary/30 shadow-md relative shrink-0">
              <img
                src={selectedAgent.imageUrl}
                alt={selectedAgent.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md py-1 px-2 rounded-xl text-center">
                <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-amber-400" />
                  PPRA Certified
                </span>
              </div>
            </div>

            {/* Agent Details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-mono tracking-widest text-brand-secondary uppercase font-bold bg-brand-secondary/10 px-2.5 py-0.5 rounded-full border border-brand-secondary/20">
                    Beno Senior Partner
                  </span>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available for Viewings
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {selectedAgent.name}
                </h1>
                <p className="text-sm font-semibold text-gray-500 font-mono mt-0.5">
                  {selectedAgent.title} • Beno Properties HQ
                </p>
              </div>

              {/* Specialization Tags */}
              <div className="flex flex-wrap gap-2">
                {(selectedAgent.specialization || []).map((spec) => (
                  <span
                    key={spec}
                    className="text-xs font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 rounded-lg px-3 py-1"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Biography */}
              <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Professional Biography & Philosophy
                </h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedAgent.bio}
                </p>
              </div>

              {/* Contact Links Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`tel:${selectedAgent.phone.replace(/\s+/g, "")}`}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
                >
                  <Phone className="h-4 w-4" />
                  Call {selectedAgent.phone}
                </a>

                <a
                  href={`mailto:${selectedAgent.email}?subject=${encodeURIComponent(`Inquiry via Beno Properties - ${selectedAgent.name}`)}`}
                  className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs"
                >
                  <Mail className="h-4 w-4 text-brand-primary" />
                  Email Agent
                </a>

                <a
                  href={`https://wa.me/${selectedAgent.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${selectedAgent.name}, I am contacting you regarding your listings on Beno Properties.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-200 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Active Listed Portfolio</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">{agentProperties.length} Properties</div>
            </div>
            <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-200 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Industry Experience</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">15+ Years</div>
            </div>
            <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-200 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Client Trust Rating</span>
              <div className="text-2xl font-black text-amber-500 font-mono mt-0.5 flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                4.9 / 5.0
              </div>
            </div>
            <div className="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-200 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Office Location</span>
              <div className="text-xs font-bold text-slate-900 mt-2 truncate">Modderfontein HQ</div>
            </div>
          </div>
        </div>

        {/* Section: Properties Currently Listed on the Platform by this Agent */}
        <div className="space-y-6" id="agent-listings-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-brand-primary" />
                <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900">
                  Properties Represented by {selectedAgent.name}
                </h2>
                <span className="px-2.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold">
                  {agentProperties.length} Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Browse hand-picked listings exclusively brokered by this specialist advisor.
              </p>
            </div>

            {/* Filter buttons & Add listing for owner */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-white border border-gray-200 p-1 rounded-xl flex items-center text-xs">
                {(["All", "For Sale", "To Rent"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setListingStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                      listingStatusFilter === filter
                        ? "bg-brand-primary text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {isOwnerOrAdmin && (
                <button
                  onClick={handleOpenAddListing}
                  className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer uppercase tracking-wider"
                >
                  <Plus className="h-4 w-4" />
                  Add New Listing
                </button>
              )}
            </div>
          </div>

          {filteredAgentProperties.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-3">
              <Building className="h-10 w-10 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-800">
                No {listingStatusFilter !== "All" ? listingStatusFilter : ""} Listings Currently Found
              </h3>
              <p className="text-xs text-gray-500">
                {selectedAgent.name} has no listings matching this status category right now. Contact them directly to discuss upcoming off-market opportunities.
              </p>
              {isOwnerOrAdmin && (
                <button
                  onClick={handleOpenAddListing}
                  className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-hover transition-colors"
                >
                  Publish New Property Under My Profile
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgentProperties.map((prop) => (
                <div key={prop.id} className="relative group flex flex-col h-full">
                  <PropertyCard
                    property={prop}
                    onViewDetails={() => onViewPropertyDetails(prop)}
                    isFavorited={currentUser ? (currentUser.favorites || []).includes(prop.id) : false}
                    onToggleFavorite={onToggleFavorite}
                    isCompared={comparedPropertyIds.includes(prop.id)}
                    onToggleCompare={onToggleCompare}
                  />

                  {/* Agent Management Overlay buttons if current user is owner or admin */}
                  {isOwnerOrAdmin && (
                    <div className="mt-2 flex items-center justify-end gap-2 px-1">
                      <button
                        onClick={() => handleOpenEditListing(prop)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold uppercase rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Edit this listing"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit Listing
                      </button>
                      <button
                        onClick={() => handleDeleteListing(prop)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Remove listing"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Direct Consultation & Inquiry Form */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold uppercase tracking-tight text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-primary" />
              Book Private Consultation with {selectedAgent.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Request a confidential market valuation, schedule private viewings, or seek bespoke Gauteng property advice.
            </p>
          </div>

          {inquirySent ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-fadeIn">
              <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">Inquiry Received</h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Thank you! Your inquiry has been forwarded directly to {selectedAgent.name}. They will be in touch via phone or email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="e.g. Sindi Ndlovu"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="sindi@domain.co.za"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  placeholder="+27 82 123 4567"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Interested In</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white cursor-pointer">
                  <option>Buying a Property</option>
                  <option>Renting a Property</option>
                  <option>Listing & Selling My Property</option>
                  <option>Complimentary Market Valuation</option>
                  <option>General Property Advice</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Message / Requirements</label>
                <textarea
                  rows={3}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder={`Hi ${selectedAgent.name}, I would like more information regarding...`}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Send Inquiry to {selectedAgent.name}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* MODAL: EDIT AGENT PROFILE */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden space-y-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                    <Edit2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 uppercase">Manage Agent Profile</h3>
                    <p className="text-xs text-gray-500 font-mono">ID: {selectedAgent.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Professional Title *</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Profile Picture URL</label>
                  <input
                    type="url"
                    value={editPhotoUrl}
                    onChange={(e) => setEditPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Specializations (Comma-separated)</label>
                  <input
                    type="text"
                    value={editSpecialization}
                    onChange={(e) => setEditSpecialization(e.target.value)}
                    placeholder="Luxury Sales, Corporate Rentals, Midrand Estates"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Professional Biography</label>
                  <textarea
                    rows={4}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 leading-relaxed focus:outline-none focus:border-brand-primary focus:bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT LISTING */}
        {isAddingListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden space-y-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
                    <Building className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 uppercase">
                      {editingProperty ? `Edit Listing (${editingProperty.id})` : `Add Listing under ${selectedAgent.name}`}
                    </h3>
                    <p className="text-xs text-gray-500">Property will be published to the catalog and linked to your profile.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddingListing(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePropertyListing} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={propTitle}
                    onChange={(e) => setPropTitle(e.target.value)}
                    placeholder="e.g. Modern 4-Bedroom Family Home in Bryanston"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Status *</label>
                    <select
                      value={propStatus}
                      onChange={(e) => setPropStatus(e.target.value as PropertyStatus)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                    >
                      <option value="For Sale">For Sale</option>
                      <option value="To Rent">To Rent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Type *</label>
                    <select
                      value={propType}
                      onChange={(e) => setPropType(e.target.value as PropertyType)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                    >
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Land">Land / Stand</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Price (ZAR) *</label>
                    <input
                      type="number"
                      required
                      value={propPrice}
                      onChange={(e) => setPropPrice(e.target.value)}
                      placeholder="e.g. 4500000"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Location / Suburb *</label>
                    <select
                      value={propLocation}
                      onChange={(e) => setPropLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                    >
                      {GAUTENG_SUBURBS.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={propBeds}
                      onChange={(e) => setPropBeds(e.target.value)}
                      placeholder="e.g. 4"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={propBaths}
                      onChange={(e) => setPropBaths(e.target.value)}
                      placeholder="e.g. 3"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={propImageUrl}
                    onChange={(e) => setPropImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:border-brand-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Description & Key Highlights</label>
                  <textarea
                    rows={4}
                    value={propDescription}
                    onChange={(e) => setPropDescription(e.target.value)}
                    placeholder="Provide features, backup solar, security amenities..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 leading-relaxed focus:outline-none focus:border-brand-primary focus:bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingListing(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                  >
                    {editingProperty ? "Save Listing Updates" : "Publish Listing"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------------------------------
  // VIEW 2: ALL AGENTS DIRECTORY OVERVIEW (Default)
  // --------------------------------------------------------------------------------------------------
  return (
    <div className="w-full space-y-10" id="agent-directory">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Intro Heading & Stats */}
      <div className="text-center max-w-3xl mx-auto space-y-3" id="agents-intro">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-mono font-bold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />
          PPRA Certified Real Estate Agency
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 uppercase tracking-tight">
          Meet Our Team of Real Estate Specialists
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          At Beno Properties, our specialist advisors pair extensive local area insights across Gauteng with a deep, uncompromising focus on client advocacy, accurate market valuations, and seamless transactions.
        </p>

        {/* Directory KPI Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="bg-white border border-gray-200 p-3 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Specialist Agents</span>
            <div className="text-xl font-black text-gray-900 font-mono mt-0.5">{agents.length}</div>
          </div>
          <div className="bg-white border border-gray-200 p-3 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Active Properties</span>
            <div className="text-xl font-black text-brand-primary font-mono mt-0.5">{properties.length} Listed</div>
          </div>
          <div className="bg-white border border-gray-200 p-3 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Average Rating</span>
            <div className="text-xl font-black text-amber-500 font-mono mt-0.5 flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-amber-400" />
              4.9 / 5.0
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-3 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Coverage</span>
            <div className="text-xs font-bold text-gray-900 mt-2">All Gauteng Nodes</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-3xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents by name, title, or suburb..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
          />
        </div>

        {/* Specialization Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {allSpecialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                selectedSpecialty === spec
                  ? "bg-brand-primary text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="agents-grid">
        {filteredAgents.map((agent) => {
          const listingsCount = properties.filter((p) => p.agentId === agent.id).length;
          const isOwnerOrAdmin = canManageCurrentAgent(agent);

          return (
            <div
              key={agent.id}
              id={`agent-card-${agent.id}`}
              className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Photo with verified badge */}
                  <div
                    className="relative w-full sm:w-36 aspect-square rounded-2xl overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <img
                      src={agent.imageUrl}
                      alt={agent.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs p-1 rounded-full">
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                    </div>
                  </div>

                  {/* Info Header */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-mono tracking-widest text-brand-secondary uppercase font-bold block mb-0.5">
                          Verified Practitioner
                        </span>
                        <h3
                          onClick={() => {
                            setSelectedAgentId(agent.id);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-lg font-bold text-gray-900 group-hover:text-brand-primary transition-colors cursor-pointer"
                        >
                          {agent.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium font-mono">
                          {agent.title}
                        </p>
                      </div>

                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-bold font-mono shrink-0">
                        {listingsCount} {listingsCount === 1 ? "Listing" : "Listings"}
                      </span>
                    </div>

                    {/* Specializations list */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(agent.specialization || []).map((spec) => (
                        <span
                          key={spec}
                          className="text-[10px] font-semibold text-brand-primary bg-brand-primary/10 border border-brand-primary/10 rounded-md px-2 py-0.5"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 pt-1">
                      {agent.bio}
                    </p>
                  </div>
                </div>

                {/* Contacts Block */}
                <div className="pt-4 border-t border-gray-150 mt-5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-600">
                    <a
                      href={`tel:${agent.phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-1.5 hover:text-brand-secondary transition-colors"
                      title="Call agent"
                    >
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      <span>{agent.phone}</span>
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-1.5 hover:text-brand-secondary transition-colors"
                      title="Email agent"
                    >
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <span className="truncate max-w-[120px] sm:max-w-xs">{agent.email}</span>
                    </a>
                  </div>

                  <button
                    onClick={() => handleShareProfile(agent)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    title="Share profile link"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => onContactClick(agent)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Contact Agent
                </button>

                <div className="flex items-center gap-2">
                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => {
                        setSelectedAgentId(agent.id);
                        handleOpenEditProfile(agent);
                      }}
                      className="px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
                      title="Manage this profile"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    View Profile & Listings
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Why Beno Properties banner */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 mt-12 flex flex-col lg:flex-row gap-8 items-center justify-between shadow-sm" id="agents-why-beno">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-secondary font-mono text-xs uppercase tracking-widest font-bold">
            <Award className="h-4 w-4 text-brand-secondary animate-pulse" />
            The Beno Quality Pledge
          </div>
          <h3 className="text-xl font-extrabold text-gray-900">Looking for a tailored, premium investment strategy?</h3>
          <p className="text-gray-500 text-xs max-w-2xl leading-relaxed">
            Our directors and senior advisors compile custom neighborhood feasibility studies, capital appreciation assessments, and off-market catalog portfolios for corporate and private client acquisitions.
          </p>
        </div>
        <button
          onClick={() => {
            const contactBtn = document.getElementById("nav-btn-contact");
            if (contactBtn) contactBtn.click();
          }}
          className="flex-shrink-0 bg-brand-primary hover:bg-brand-hover text-white font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          Book Executive Council
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
