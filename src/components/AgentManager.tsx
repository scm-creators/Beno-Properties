/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  UserPlus, Edit, Trash2, Phone, Mail, Award, CheckCircle, 
  Search, X, ShieldCheck, Image, AlertTriangle, Briefcase, 
  User, Check, Sparkles, Filter, ExternalLink, Plus
} from "lucide-react";
import { Agent, Property } from "../types";

interface AgentManagerProps {
  agents: Agent[];
  properties?: Property[];
  onAddAgent: (agent: Agent) => void;
  onUpdateAgent: (agent: Agent) => void;
  onDeleteAgent: (id: string) => void;
}

// Preset real estate professional portrait photos
const PRESET_AVATARS = [
  { label: "Male Executive", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" },
  { label: "Female Specialist", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
  { label: "Female Executive", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" },
  { label: "Commercial Partner", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80" },
  { label: "Modern Advisor", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
  { label: "Senior Consultant", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
];

const PRESET_SPECIALTIES = [
  "Luxury Sales",
  "Gauteng North Sales",
  "Midrand & Centurion",
  "Sandton & Rosebank",
  "Corporate Rentals",
  "Tenant Vetting",
  "Commercial Offices",
  "Industrial Warehouses",
  "New Developments",
  "Estate Portfolios",
  "Investment Advisory",
  "Agricultural Land"
];

export default function AgentManager({
  agents,
  properties = [],
  onAddAgent,
  onUpdateAgent,
  onDeleteAgent,
}: AgentManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [deletingAgent, setDeletingAgent] = useState<Agent | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    phone: "",
    email: "",
    imageUrl: PRESET_AVATARS[0].url,
    bio: "",
    specialization: ["Luxury Sales"] as string[],
    customSpecialtyInput: "",
  });

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      title: "Associate Property Consultant",
      phone: "+27 (0) 82 555 " + Math.floor(1000 + Math.random() * 9000),
      email: "",
      imageUrl: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)].url,
      bio: "Dedicated Beno Properties real estate consultant providing professional client representation throughout Gauteng.",
      specialization: ["Residential Sales", "Investment Advisory"],
      customSpecialtyInput: "",
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      title: agent.title,
      phone: agent.phone,
      email: agent.email,
      imageUrl: agent.imageUrl,
      bio: agent.bio,
      specialization: [...agent.specialization],
      customSpecialtyInput: "",
    });
  };

  const handleToggleSpecialty = (spec: string) => {
    setFormData((prev) => {
      if (prev.specialization.includes(spec)) {
        return { ...prev, specialization: prev.specialization.filter((s) => s !== spec) };
      } else {
        return { ...prev, specialization: [...prev.specialization, spec] };
      }
    });
  };

  const handleAddCustomSpecialty = () => {
    const trimmed = formData.customSpecialtyInput.trim();
    if (!trimmed) return;
    if (!formData.specialization.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        specialization: [...prev.specialization, trimmed],
        customSpecialtyInput: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, customSpecialtyInput: "" }));
    }
  };

  const handleRemoveSpecialty = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specialization: prev.specialization.filter((s) => s !== spec),
    }));
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showFeedback("Name and Email are required to register an agent.", "error");
      return;
    }

    const newId = `BENO-AGT-${Date.now().toString().slice(-4)}`;
    const newAgent: Agent = {
      id: newId,
      name: formData.name.trim(),
      title: formData.title.trim() || "Associate Property Consultant",
      phone: formData.phone.trim() || "+27 (0) 82 555 0100",
      email: formData.email.trim().toLowerCase(),
      imageUrl: formData.imageUrl || PRESET_AVATARS[0].url,
      specialization: formData.specialization.length > 0 ? formData.specialization : ["Residential Sales"],
      bio: formData.bio.trim() || "Registered Beno real estate professional.",
      approvalStatus: "approved",
    };

    onAddAgent(newAgent);
    setIsAddModalOpen(false);
    showFeedback(`Agent ${newAgent.name} successfully registered.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;
    if (!formData.name.trim() || !formData.email.trim()) {
      showFeedback("Name and Email are required.", "error");
      return;
    }

    const updatedAgent: Agent = {
      ...editingAgent,
      name: formData.name.trim(),
      title: formData.title.trim() || editingAgent.title,
      phone: formData.phone.trim() || editingAgent.phone,
      email: formData.email.trim().toLowerCase(),
      imageUrl: formData.imageUrl || editingAgent.imageUrl,
      specialization: formData.specialization.length > 0 ? formData.specialization : ["Residential Sales"],
      bio: formData.bio.trim() || editingAgent.bio,
    };

    onUpdateAgent(updatedAgent);
    setEditingAgent(null);
    showFeedback(`Agent ${updatedAgent.name} profile updated.`);
  };

  const handleConfirmDelete = () => {
    if (!deletingAgent) return;
    const name = deletingAgent.name;
    onDeleteAgent(deletingAgent.id);
    setDeletingAgent(null);
    showFeedback(`Agent ${name} was deleted and unassigned.`);
  };

  // Filtered agents list
  const filteredAgents = agents.filter((agent) => {
    const query = searchTerm.toLowerCase();
    return (
      agent.name.toLowerCase().includes(query) ||
      agent.title.toLowerCase().includes(query) ||
      agent.email.toLowerCase().includes(query) ||
      agent.phone.toLowerCase().includes(query) ||
      agent.specialization.some((s) => s.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6" id="agent-manager-component">
      {/* Feedback banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between border transition-all ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-600" />
            )}
            <span className="font-semibold">{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search agents by name, email, specialization, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm shrink-0"
          id="btn-add-agent"
        >
          <UserPlus className="h-4 w-4" />
          Add New Agent
        </button>
      </div>

      {/* Agents Roster Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-lg">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{agents.length}</div>
            <div className="text-xs text-gray-500 font-medium">Active Licensed Agents</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-lg">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">
              {properties.length}
            </div>
            <div className="text-xs text-gray-500 font-medium">Listings Under Management</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">PPRA</div>
            <div className="text-xs text-gray-500 font-medium">Fully Compliant Roster</div>
          </div>
        </div>
      </div>

      {/* Agents Table / Grid */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-700">
            Agency Agent Roster ({filteredAgents.length} of {agents.length})
          </h4>
          <span className="text-[11px] text-gray-500 font-mono">
            Direct real-time catalog mapping
          </span>
        </div>

        {filteredAgents.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <User className="h-10 w-10 mx-auto text-gray-300" />
            <p className="text-sm font-medium text-gray-600">No agents found matching your query.</p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-brand-primary underline cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAgents.map((agent) => {
              const assignedCount = properties.filter((p) => p.agentId === agent.id).length;
              return (
                <div
                  key={agent.id}
                  id={`agent-row-${agent.id}`}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-gray-50/70 transition-colors"
                >
                  {/* Left: Avatar & Identity */}
                  <div className="flex items-start sm:items-center gap-4 min-w-[260px]">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      <img
                        src={agent.imageUrl}
                        alt={agent.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900">{agent.name}</h4>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200">
                          {agent.id}
                        </span>
                        {agent.approvalStatus === "pending" ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                            ⏳ Pending Approval
                          </span>
                        ) : agent.approvalStatus === "rejected" ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full border border-rose-200">
                            ✕ Rejected
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                            ✓ Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-secondary font-mono font-semibold">{agent.title}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {agent.specialization.slice(0, 3).map((spec) => (
                          <span
                            key={spec}
                            className="text-[9px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                          >
                            {spec}
                          </span>
                        ))}
                        {agent.specialization.length > 3 && (
                          <span className="text-[9px] font-mono text-gray-400">
                            +{agent.specialization.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Center: Contact Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono text-gray-600">
                    <a
                      href={`tel:${agent.phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-1.5 hover:text-brand-secondary transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      <span>{agent.phone}</span>
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-1.5 hover:text-brand-secondary transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <span className="max-w-[180px] truncate">{agent.email}</span>
                    </a>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200/60 font-sans text-[11px] font-semibold">
                      {assignedCount} {assignedCount === 1 ? "Listing" : "Listings"}
                    </span>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {agent.approvalStatus === "pending" && (
                      <button
                        onClick={() => {
                          onUpdateAgent({ ...agent, approvalStatus: "approved" });
                          showFeedback(`Agent ${agent.name} approved and activated.`);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        title="Approve Agent Registration"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(agent)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Edit Agent"
                      id={`btn-edit-agent-${agent.id}`}
                    >
                      <Edit className="h-3.5 w-3.5 text-gray-600" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingAgent(agent)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
                      title="Delete Agent"
                      id={`btn-delete-agent-${agent.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: ADD AGENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                  Register New Real Estate Agent
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  The agent will be added to the team directory and assigned listings.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Naledi Madonsela"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Luxury Estate Specialist"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. naledi@benoproperties.co.za"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Direct Phone Line *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +27 (0) 82 555 1234"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Profile Image Preset Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                  Profile Photo (Preset Headshots or Custom URL)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {PRESET_AVATARS.map((avatar) => (
                    <button
                      type="button"
                      key={avatar.label}
                      onClick={() => setFormData({ ...formData, imageUrl: avatar.url })}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        formData.imageUrl === avatar.url
                          ? "border-brand-primary ring-2 ring-brand-primary/30"
                          : "border-gray-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {formData.imageUrl === avatar.url && (
                        <div className="absolute inset-0 bg-brand-primary/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Or paste custom image URL..."
                  className="w-full px-3.5 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-700 font-mono focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              {/* Specializations Tag Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                  Specializations & Local Markets
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_SPECIALTIES.map((spec) => {
                    const isSelected = formData.specialization.includes(spec);
                    return (
                      <button
                        type="button"
                        key={spec}
                        onClick={() => handleToggleSpecialty(spec)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-primary text-white border-brand-primary"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {spec}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.customSpecialtyInput}
                    onChange={(e) => setFormData({ ...formData, customSpecialtyInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomSpecialty();
                      }
                    }}
                    placeholder="Add custom specialization (e.g. Magaliesburg Smallholdings)..."
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSpecialty}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Professional Biography */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Professional Biography & Background
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Outline years of experience, key property types, and service philosophy..."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Confirm & Register Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT AGENT */}
      {editingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                  Edit Agent Profile: {editingAgent.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update designation, contact details, headshot, and specialization tags.
                </p>
              </div>
              <button
                onClick={() => setEditingAgent(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Direct Phone Line *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Profile Image Preset Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                  Profile Photo (Presets or Custom URL)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {PRESET_AVATARS.map((avatar) => (
                    <button
                      type="button"
                      key={avatar.label}
                      onClick={() => setFormData({ ...formData, imageUrl: avatar.url })}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        formData.imageUrl === avatar.url
                          ? "border-brand-primary ring-2 ring-brand-primary/30"
                          : "border-gray-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {formData.imageUrl === avatar.url && (
                        <div className="absolute inset-0 bg-brand-primary/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Paste custom image URL..."
                  className="w-full px-3.5 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-700 font-mono focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              {/* Specializations Tag Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                  Specializations & Local Markets
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_SPECIALTIES.map((spec) => {
                    const isSelected = formData.specialization.includes(spec);
                    return (
                      <button
                        type="button"
                        key={spec}
                        onClick={() => handleToggleSpecialty(spec)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-primary text-white border-brand-primary"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {spec}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.customSpecialtyInput}
                    onChange={(e) => setFormData({ ...formData, customSpecialtyInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomSpecialty();
                      }
                    }}
                    placeholder="Add custom specialization..."
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSpecialty}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Professional Biography */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Professional Biography & Background
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingAgent(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900">
                Delete Agent {deletingAgent.name}?
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                This will remove {deletingAgent.name} ({deletingAgent.title}) from the agency public directory and revoke access.
              </p>
              {properties.filter((p) => p.agentId === deletingAgent.id).length > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                  Notice: This agent currently has {properties.filter((p) => p.agentId === deletingAgent.id).length} listings assigned.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAgent(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Delete Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
