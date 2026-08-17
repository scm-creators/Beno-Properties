/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Calendar, Clock, UserPlus, Send, CheckCircle2, XCircle, AlertCircle,
  MapPin, Users, Share2, Copy, ExternalLink, Download, Search, Filter,
  Plus, Check, MessageCircle, Mail, Phone, Video, Building2, ChevronRight,
  Eye, CalendarCheck, FileText, ArrowUpRight, Sparkles, RefreshCw, X
} from "lucide-react";
import {
  Appointment, ClientInvitation, Property, Agent, Lead, UserProfile,
  AppointmentType, AppointmentStatus, AppointmentOutcome
} from "../types";
import { formatPriceZAR } from "./PropertyCard";

interface AppointmentsManagerProps {
  currentUser: UserProfile;
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  clientInvitations: ClientInvitation[];
  onAddInvitation: (invitation: ClientInvitation) => void;
  onUpdateInvitation: (invitation: ClientInvitation) => void;
  onDeleteInvitation: (id: string) => void;
  properties: Property[];
  agents: Agent[];
  leads: Lead[];
  onSelectPropertyDetails?: (id: string) => void;
}

const APPOINTMENT_TYPES: AppointmentType[] = [
  "Property Viewing",
  "Valuation Consultation",
  "Listing Presentation",
  "Tenancy Onboarding",
  "Contract & Lease Signing",
  "Virtual Tour",
  "Advisory Call"
];

const APPOINTMENT_STATUSES: (AppointmentStatus | "All")[] = [
  "All",
  "Scheduled",
  "Confirmed",
  "Completed",
  "Rescheduled",
  "Cancelled"
];

const APPOINTMENT_OUTCOMES: AppointmentOutcome[] = [
  "Offer Submitted",
  "Application Submitted",
  "Successfully Closed",
  "Follow-up Required",
  "Pending Decision",
  "Not Interested"
];

export default function AppointmentsManager({
  currentUser,
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  clientInvitations,
  onAddInvitation,
  onUpdateInvitation,
  onDeleteInvitation,
  properties,
  agents,
  leads,
  onSelectPropertyDetails
}: AppointmentsManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<"appointments" | "invitations">("appointments");

  // Filters
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [agentFilter, setAgentFilter] = useState<string>(
    currentUser.role === "agent" ? currentUser.id : "All"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  // Selected item for modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedInvitation, setSelectedInvitation] = useState<ClientInvitation | null>(null);

  // Feedback states
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Schedule Appointment Form State
  const [formClientType, setFormClientType] = useState<"existing" | "new">("existing");
  const [formLeadId, setFormLeadId] = useState<string>("");
  const [formClientName, setFormClientName] = useState("");
  const [formClientEmail, setFormClientEmail] = useState("");
  const [formClientPhone, setFormClientPhone] = useState("");
  const [formAgentId, setFormAgentId] = useState(
    currentUser.role === "agent" ? currentUser.id : agents[0]?.id || "BENO-AGT-1"
  );
  const [formType, setFormType] = useState<AppointmentType>("Property Viewing");
  const [formPropertyId, setFormPropertyId] = useState<string>("");
  const [formLocation, setFormLocation] = useState("");
  const [formIsVirtual, setFormIsVirtual] = useState(false);
  const [formVirtualUrl, setFormVirtualUrl] = useState("https://meet.google.com/beno-exclusive");
  const [formDate, setFormDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [formTime, setFormTime] = useState("14:00");
  const [formDuration, setFormDuration] = useState<number>(60);
  const [formEstimatedValue, setFormEstimatedValue] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Invite Client Form State
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteCategory, setInviteCategory] = useState<"Buyer" | "Tenant" | "Seller" | "Investor" | "General">("Buyer");
  const [invitePropertyId, setInvitePropertyId] = useState("");
  const [inviteAgentId, setInviteAgentId] = useState(
    currentUser.role === "agent" ? currentUser.id : agents[0]?.id || "BENO-AGT-1"
  );
  const [inviteCustomMsg, setInviteCustomMsg] = useState(
    "Welcome to Beno Properties. We invite you to access our exclusive property portfolio and track your private viewings."
  );
  const [inviteNotes, setInviteNotes] = useState("");

  // Outcome Form State
  const [outcomeVal, setOutcomeVal] = useState<AppointmentOutcome>("Offer Submitted");
  const [outcomeNotes, setOutcomeNotes] = useState("");

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  // Handle lead selection auto-fill
  const handleLeadSelect = (leadId: string) => {
    setFormLeadId(leadId);
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      setFormClientName(lead.name);
      setFormClientEmail(lead.email);
      setFormClientPhone(lead.phone);
      if (lead.propertyRefId) {
        setFormPropertyId(lead.propertyRefId);
        const prop = properties.find((p) => p.id === lead.propertyRefId);
        if (prop) {
          setFormLocation(`${prop.location}, ${prop.city}`);
          setFormEstimatedValue(prop.price.toString());
        }
      }
    }
  };

  // Handle property selection auto-fill
  const handlePropertySelect = (propId: string) => {
    setFormPropertyId(propId);
    const prop = properties.find((p) => p.id === propId);
    if (prop) {
      if (!formLocation || formLocation.includes(",")) {
        setFormLocation(`${prop.location}, ${prop.city} (${prop.title.slice(0, 30)}...)`);
      }
      if (!formEstimatedValue) {
        setFormEstimatedValue(prop.price.toString());
      }
    }
  };

  // Submit Schedule Appointment
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientName || !formClientEmail || !formDate || !formTime) {
      showToast("Please provide client name, email, date and time.");
      return;
    }

    const assignedAgent = agents.find((a) => a.id === formAgentId) || agents[0];
    const selectedProp = properties.find((p) => p.id === formPropertyId);

    const newAppointment: Appointment = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      title: `${formType}: ${selectedProp ? selectedProp.title : formClientName}`,
      type: formType,
      clientName: formClientName,
      clientEmail: formClientEmail,
      clientPhone: formClientPhone,
      leadId: formLeadId || undefined,
      agentId: assignedAgent?.id || "BENO-AGT-1",
      agentName: assignedAgent?.name || "David Beno",
      propertyId: selectedProp?.id,
      propertyTitle: selectedProp?.title,
      propertyLocation: selectedProp?.location,
      location: formIsVirtual
        ? (formVirtualUrl || "Google Meet Online Room")
        : (formLocation || (selectedProp ? `${selectedProp.location}, ${selectedProp.city}` : "Beno Properties Sandton Office")),
      isVirtual: formIsVirtual,
      virtualMeetingUrl: formIsVirtual ? formVirtualUrl : undefined,
      dateTime: `${formDate}T${formTime}:00-07:00`,
      durationMinutes: Number(formDuration) || 60,
      status: "Scheduled",
      estimatedDealValue: formEstimatedValue ? Number(formEstimatedValue) : (selectedProp?.price || 0),
      notes: formNotes,
      reminderSent: false,
      createdAt: new Date().toISOString()
    };

    onAddAppointment(newAppointment);
    setIsScheduleModalOpen(false);
    showToast(`Appointment scheduled successfully for ${formClientName}!`);

    // Reset fields
    setFormClientName("");
    setFormClientEmail("");
    setFormClientPhone("");
    setFormLeadId("");
    setFormPropertyId("");
    setFormLocation("");
    setFormNotes("");
    setFormEstimatedValue("");
  };

  // Submit Client Invitation
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) {
      showToast("Please provide the client name and email.");
      return;
    }

    const assignedAgent = agents.find((a) => a.id === inviteAgentId) || agents[0];
    const selectedProp = properties.find((p) => p.id === invitePropertyId);
    const token = Math.random().toString(36).substring(2, 10);
    const invId = `INV-${Date.now().toString().slice(-4)}`;

    const newInvite: ClientInvitation = {
      id: invId,
      clientName: inviteName,
      clientEmail: inviteEmail,
      clientPhone: invitePhone,
      category: inviteCategory,
      invitedByAgentId: assignedAgent.id,
      invitedByAgentName: assignedAgent.name,
      propertyRefId: selectedProp?.id,
      propertyTitle: selectedProp?.title,
      inviteLink: `${window.location.origin}${window.location.pathname}?invite=${invId}&token=${token}`,
      status: "Sent",
      sentAt: new Date().toISOString(),
      customMessage: inviteCustomMsg,
      notes: inviteNotes
    };

    onAddInvitation(newInvite);
    setIsInviteModalOpen(false);
    showToast(`VIP Invitation sent to ${inviteName} (${inviteEmail})!`);

    // Reset
    setInviteName("");
    setInviteEmail("");
    setInvitePhone("");
    setInvitePropertyId("");
    setInviteNotes("");
  };

  // Handle Mark Confirmed
  const handleToggleConfirm = (apt: Appointment) => {
    const updatedStatus: AppointmentStatus = apt.status === "Confirmed" ? "Scheduled" : "Confirmed";
    const updated = {
      ...apt,
      status: updatedStatus,
      updatedAt: new Date().toISOString()
    };
    onUpdateAppointment(updated);
    showToast(`Appointment marked as ${updatedStatus}.`);
  };

  // Handle Mark Completed & Outcome
  const handleSaveOutcome = () => {
    if (!selectedAppointment) return;
    const updated: Appointment = {
      ...selectedAppointment,
      status: "Completed",
      outcome: outcomeVal,
      outcomeNotes: outcomeNotes,
      updatedAt: new Date().toISOString()
    };
    onUpdateAppointment(updated);
    setIsOutcomeModalOpen(false);
    setSelectedAppointment(null);
    showToast(`Appointment marked as Completed with outcome "${outcomeVal}".`);
  };

  // Handle Reschedule
  const handleSaveReschedule = () => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return;
    const updated: Appointment = {
      ...selectedAppointment,
      dateTime: `${rescheduleDate}T${rescheduleTime}:00-07:00`,
      status: "Rescheduled",
      updatedAt: new Date().toISOString()
    };
    onUpdateAppointment(updated);
    setIsRescheduleModalOpen(false);
    setSelectedAppointment(null);
    showToast(`Appointment rescheduled to ${rescheduleDate} at ${rescheduleTime}.`);
  };

  // Copy text helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLink(text);
      showToast(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedLink(null), 3000);
    });
  };

  // Export .ics Calendar File
  const handleExportICS = (apt: Appointment) => {
    const startDate = new Date(apt.dateTime);
    const endDate = new Date(startDate.getTime() + (apt.durationMinutes || 60) * 60000);

    const formatDateICS = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Beno Properties//Appointments//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${apt.id}@benoproperties.co.za`,
      `DTSTAMP:${formatDateICS(new Date())}`,
      `DTSTART:${formatDateICS(startDate)}`,
      `DTEND:${formatDateICS(endDate)}`,
      `SUMMARY:${apt.title}`,
      `DESCRIPTION:${apt.notes || "Beno Properties Real Estate Appointment"}\\nAgent: ${apt.agentName}\\nClient: ${apt.clientName} (${apt.clientPhone || apt.clientEmail})`,
      `LOCATION:${apt.location}`,
      `STATUS:${apt.status === "Cancelled" ? "CANCELLED" : "CONFIRMED"}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${apt.id}-${apt.clientName.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("iCalendar (.ics) file downloaded!");
  };

  // Pre-formatted reminder message for WhatsApp/Email
  const getReminderText = (apt: Appointment) => {
    const dateFormatted = new Date(apt.dateTime).toLocaleDateString("en-ZA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const timeFormatted = new Date(apt.dateTime).toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit"
    });

    return `*Beno Properties Appointment Confirmation*\n\nDear ${apt.clientName},\nThis is a friendly confirmation for your upcoming *${apt.type}* with *${apt.agentName}*.\n\n📅 *Date:* ${dateFormatted}\n⏰ *Time:* ${timeFormatted} (${apt.durationMinutes} mins)\n📍 *Location:* ${apt.location}\n${apt.propertyTitle ? `🏡 *Property:* ${apt.propertyTitle}\n` : ""}${apt.isVirtual && apt.virtualMeetingUrl ? `🔗 *Meeting Link:* ${apt.virtualMeetingUrl}\n` : ""}\nIf you need to reschedule or have questions, please reach out to ${apt.agentName}.\n\nBeno Properties | Luxury Real Estate Gauteng`;
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (statusFilter !== "All" && apt.status !== statusFilter) return false;
      if (typeFilter !== "All" && apt.type !== typeFilter) return false;
      if (agentFilter !== "All" && apt.agentId !== agentFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = apt.clientName.toLowerCase().includes(q);
        const matchTitle = apt.title.toLowerCase().includes(q);
        const matchLoc = apt.location.toLowerCase().includes(q);
        const matchProp = apt.propertyTitle?.toLowerCase().includes(q);
        if (!matchName && !matchTitle && !matchLoc && !matchProp) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [appointments, statusFilter, typeFilter, agentFilter, searchQuery]);

  // Filtered Invitations
  const filteredInvitations = useMemo(() => {
    return clientInvitations.filter((inv) => {
      if (agentFilter !== "All" && inv.invitedByAgentId !== agentFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = inv.clientName.toLowerCase().includes(q);
        const matchEmail = inv.clientEmail.toLowerCase().includes(q);
        const matchProp = inv.propertyTitle?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchProp) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }, [clientInvitations, agentFilter, searchQuery]);

  // Quick KPI summary
  const kpis = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const todayCount = appointments.filter((a) => a.dateTime.startsWith(todayStr)).length;
    const upcomingCount = appointments.filter((a) => new Date(a.dateTime) >= now && a.status !== "Cancelled").length;
    const completedCount = appointments.filter((a) => a.status === "Completed").length;
    const invitesAccepted = clientInvitations.filter((i) => i.status === "Accepted").length;

    return {
      todayCount,
      upcomingCount,
      completedCount,
      invitesAccepted,
      totalInvites: clientInvitations.length
    };
  }, [appointments, clientInvitations]);

  return (
    <div className="space-y-6" id="appointments-manager-workspace">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-gray-700 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Action Controls */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-brand-primary/10 text-brand-primary font-bold text-xs px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                Agent Scheduling Suite
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-500 text-xs font-medium">Beno VIP Relationship Engine</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight font-display">
              Appointments & Client Invitations
            </h1>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl">
              Invite VIP buyers, tenants, and landlords into private access portals and seamlessly manage in-person viewings, valuations, and contract signings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setFormClientType("new");
                setIsScheduleModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
              id="btn-schedule-appointment-header"
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule Appointment</span>
            </button>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
              id="btn-invite-client-header"
            >
              <UserPlus className="h-4 w-4" />
              <span>Invite New Client</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Today's Schedule</span>
              <CalendarCheck className="h-4 w-4 text-brand-primary" />
            </div>
            <p className="text-2xl font-black text-gray-900 mt-1 font-mono">{kpis.todayCount}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Appointments scheduled today</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Upcoming Active</span>
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-gray-900 mt-1 font-mono">{kpis.upcomingCount}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Future confirmed & scheduled</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Completed Sessions</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-gray-900 mt-1 font-mono">{kpis.completedCount}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Viewings & valuations closed</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Client Invitations</span>
              <Users className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-gray-900 mt-1 font-mono">
              {kpis.invitesAccepted} <span className="text-xs font-normal text-gray-400">/ {kpis.totalInvites}</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {kpis.totalInvites > 0 ? `${Math.round((kpis.invitesAccepted / kpis.totalInvites) * 100)}% accepted` : "No invites sent"}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Switcher */}
        <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200" id="appointments-subtab-switcher">
          <button
            onClick={() => setActiveSubTab("appointments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "appointments"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            id="tab-btn-appointments"
          >
            <Calendar className="h-3.5 w-3.5 text-brand-primary" />
            <span>Appointments & Viewings ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("invitations")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "invitations"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            id="tab-btn-invitations"
          >
            <UserPlus className="h-3.5 w-3.5 text-amber-600" />
            <span>Client Invitations Hub ({clientInvitations.length})</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search client, title, property..."
              className="w-full bg-white border border-gray-200 text-gray-800 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-brand-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {currentUser.role === "admin" && (
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="bg-white border border-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary"
            >
              <option value="All">All Agents</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          )}

          {activeSubTab === "appointments" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | "All")}
              className="bg-white border border-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-primary"
            >
              {APPOINTMENT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st === "All" ? "All Statuses" : st}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* VIEW 1: APPOINTMENTS LIST */}
      {activeSubTab === "appointments" && (
        <div className="space-y-4" id="appointments-list-container">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No Appointments Found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                No appointments match your current filters. Click "Schedule Appointment" to book a new viewing or valuation.
              </p>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                <Plus className="h-4 w-4" />
                Schedule Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAppointments.map((apt) => {
                const aptDate = new Date(apt.dateTime);
                const isPast = aptDate < new Date();
                const formattedDate = aptDate.toLocaleDateString("en-ZA", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                });
                const formattedTime = aptDate.toLocaleTimeString("en-ZA", {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div
                    key={apt.id}
                    className={`bg-white border rounded-2xl p-5 transition-all shadow-sm hover:shadow-md ${
                      apt.status === "Completed"
                        ? "border-emerald-200 bg-emerald-50/20"
                        : apt.status === "Cancelled"
                        ? "border-gray-200 opacity-60 bg-gray-50/50"
                        : apt.status === "Confirmed"
                        ? "border-blue-200"
                        : "border-gray-200"
                    }`}
                    id={`appointment-card-${apt.id}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                              apt.status === "Confirmed"
                                ? "bg-blue-100 text-blue-700"
                                : apt.status === "Completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : apt.status === "Scheduled"
                                ? "bg-amber-100 text-amber-700"
                                : apt.status === "Rescheduled"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {apt.status}
                          </span>

                          <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
                            {apt.type}
                          </span>

                          {apt.isVirtual && (
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Virtual Tour
                            </span>
                          )}

                          {apt.outcome && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              Outcome: {apt.outcome}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-gray-900 tracking-tight">
                            {apt.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1 font-semibold text-gray-700">
                              <Calendar className="h-3.5 w-3.5 text-brand-primary" />
                              {formattedDate} at {formattedTime} ({apt.durationMinutes} mins)
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              {apt.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5 text-gray-400" />
                              Client: <strong className="text-gray-800">{apt.clientName}</strong>
                              {apt.clientPhone && ` (${apt.clientPhone})`}
                            </span>
                          </div>
                        </div>

                        {/* Property & Agent info chips */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {apt.propertyId && (
                            <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-[11px] text-gray-700">
                              <Building2 className="h-3.5 w-3.5 text-brand-primary" />
                              <span>Ref: {apt.propertyId}</span>
                              {onSelectPropertyDetails && (
                                <button
                                  onClick={() => onSelectPropertyDetails(apt.propertyId!)}
                                  className="text-brand-primary hover:underline font-bold ml-1 flex items-center gap-0.5"
                                >
                                  View <ArrowUpRight className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          )}

                          <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-[11px] text-gray-600">
                            <span>Agent: <strong>{apt.agentName}</strong></span>
                          </div>

                          {apt.estimatedDealValue && apt.estimatedDealValue > 0 && (
                            <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1 text-[11px] text-emerald-800 font-mono font-bold">
                              <span>Est. Pipeline: {formatPriceZAR(apt.estimatedDealValue)}</span>
                            </div>
                          )}
                        </div>

                        {/* Notes / Outcomes */}
                        {(apt.notes || apt.outcomeNotes) && (
                          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-600 mt-2 space-y-1">
                            {apt.notes && (
                              <p>
                                <strong className="text-gray-700">Notes:</strong> {apt.notes}
                              </p>
                            )}
                            {apt.outcomeNotes && (
                              <p className="text-emerald-800 font-medium">
                                <strong>Outcome Report:</strong> {apt.outcomeNotes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Interactive Action Buttons */}
                      <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-start gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                        {apt.status !== "Completed" && (
                          <>
                            <button
                              onClick={() => handleToggleConfirm(apt)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                                apt.status === "Confirmed"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-brand-primary hover:text-brand-primary"
                              }`}
                              title="Toggle Confirmed Status"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>{apt.status === "Confirmed" ? "Confirmed" : "Confirm"}</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setOutcomeVal("Offer Submitted");
                                setOutcomeNotes("");
                                setIsOutcomeModalOpen(true);
                              }}
                              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Mark Completed</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedAppointment(apt);
                                const curD = apt.dateTime.split("T")[0];
                                const curT = apt.dateTime.split("T")[1]?.slice(0, 5) || "14:00";
                                setRescheduleDate(curD);
                                setRescheduleTime(curT);
                                setIsRescheduleModalOpen(true);
                              }}
                              className="text-xs font-medium text-gray-600 hover:text-gray-900 px-2.5 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200"
                            >
                              Reschedule
                            </button>
                          </>
                        )}

                        <div className="flex items-center gap-1.5">
                          {/* Export ICS */}
                          <button
                            onClick={() => handleExportICS(apt)}
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all"
                            title="Download .ics Calendar File"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>

                          {/* Reminder Trigger */}
                          <button
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setIsReminderModalOpen(true);
                            }}
                            className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl border border-gray-200 transition-all"
                            title="Send WhatsApp or Email Reminder"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete appointment for ${apt.clientName}?`)) {
                                onDeleteAppointment(apt.id);
                                showToast("Appointment deleted.");
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-gray-200 transition-all"
                            title="Cancel / Delete Appointment"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CLIENT INVITATIONS HUB */}
      {activeSubTab === "invitations" && (
        <div className="space-y-4" id="invitations-hub-container">
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">VIP Private Client Invites</h3>
                <p className="text-xs text-gray-600 mt-0.5 max-w-xl">
                  Generate high-touch invitation links for pre-qualified buyers and corporate tenants. Clients get access to a tailored portal with saved listings, private viewing requests, and direct messaging.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0 flex items-center gap-1.5"
            >
              <UserPlus className="h-4 w-4" />
              <span>Send New Invitation</span>
            </button>
          </div>

          {filteredInvitations.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No Client Invitations Found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Invite buyers, tenants, or property owners to create private client relationships.
              </p>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                <Plus className="h-4 w-4" />
                Invite Client Now
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600 divide-y divide-gray-100">
                  <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Client & Contact</th>
                      <th className="px-5 py-3">Role / Purpose</th>
                      <th className="px-5 py-3">Assigned Agent</th>
                      <th className="px-5 py-3">Recommended Property</th>
                      <th className="px-5 py-3">Status & Sent Date</th>
                      <th className="px-5 py-3 text-right">Invite Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInvitations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-900">{inv.clientName}</div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                            <span>{inv.clientEmail}</span>
                            {inv.clientPhone && <span>• {inv.clientPhone}</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              inv.category === "Buyer"
                                ? "bg-emerald-100 text-emerald-800"
                                : inv.category === "Tenant"
                                ? "bg-blue-100 text-blue-800"
                                : inv.category === "Seller"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {inv.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-800">
                          {inv.invitedByAgentName}
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          {inv.propertyTitle ? (
                            <span className="truncate block font-medium text-gray-700">
                              {inv.propertyTitle}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Portfolio Catalog</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                inv.status === "Accepted"
                                  ? "bg-emerald-500"
                                  : inv.status === "Opened"
                                  ? "bg-blue-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            <span className="font-bold text-gray-800">{inv.status}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            Sent {new Date(inv.sentAt).toLocaleDateString("en-ZA")}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleCopy(inv.inviteLink, "VIP Invite Link")}
                              className="p-1.5 text-gray-500 hover:text-brand-primary hover:bg-gray-100 rounded-lg border border-gray-200 transition-all"
                              title="Copy VIP Invite Link"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                const text = `*VIP Invitation to Beno Properties*\n\nDear ${inv.clientName},\n${inv.customMessage || "You are invited to access our private real estate client portal."}\n\nAccess your VIP Portal: ${inv.inviteLink}`;
                                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                              }}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-all"
                              title="Share via WhatsApp"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                setFormClientType("new");
                                setFormClientName(inv.clientName);
                                setFormClientEmail(inv.clientEmail);
                                setFormClientPhone(inv.clientPhone || "");
                                if (inv.propertyRefId) {
                                  setFormPropertyId(inv.propertyRefId);
                                }
                                setIsScheduleModalOpen(true);
                              }}
                              className="text-[11px] font-bold bg-brand-primary text-white px-2.5 py-1 rounded-lg hover:bg-brand-primary/90 transition-all"
                            >
                              Book Viewing
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete invitation for ${inv.clientName}?`)) {
                                  onDeleteInvitation(inv.id);
                                  showToast("Invitation deleted.");
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title="Delete Invitation"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: SCHEDULE APPOINTMENT */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight font-display">
                    Schedule Real Estate Appointment
                  </h3>
                  <p className="text-xs text-gray-500">
                    Book property viewings, CMA valuations, and advisory meetings.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 mt-4">
              {/* Select Existing Lead vs New Client */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">Client Information</label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setFormClientType("existing")}
                      className={`px-2 py-0.5 rounded-lg font-bold text-[11px] ${
                        formClientType === "existing"
                          ? "bg-brand-primary text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      From Leads ({leads.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormClientType("new");
                        setFormLeadId("");
                      }}
                      className={`px-2 py-0.5 rounded-lg font-bold text-[11px] ${
                        formClientType === "new"
                          ? "bg-brand-primary text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      New Client
                    </button>
                  </div>
                </div>

                {formClientType === "existing" ? (
                  <div className="mb-2">
                    <select
                      value={formLeadId}
                      onChange={(e) => handleLeadSelect(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white"
                    >
                      <option value="">-- Choose Existing Lead / Client --</option>
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name} ({l.category} • {l.phone || l.email})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Client Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formClientName}
                      onChange={(e) => setFormClientName(e.target.value)}
                      placeholder="e.g. Dr. Sipho Mthembu"
                      className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formClientEmail}
                      onChange={(e) => setFormClientEmail(e.target.value)}
                      placeholder="client@email.co.za"
                      className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white mt-1"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={formClientPhone}
                    onChange={(e) => setFormClientPhone(e.target.value)}
                    placeholder="+27 82 000 0000"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white mt-1"
                  />
                </div>
              </div>

              {/* Appointment Type & Assigned Agent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Appointment Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as AppointmentType)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white mt-1"
                  >
                    {APPOINTMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Assigned Agent</label>
                  <select
                    value={formAgentId}
                    onChange={(e) => setFormAgentId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white mt-1"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.title.split("&")[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Association */}
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400">Linked Property (Optional)</label>
                <select
                  value={formPropertyId}
                  onChange={(e) => handlePropertySelect(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white mt-1"
                >
                  <option value="">-- No specific property linked --</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id}: {p.title} ({p.location} • {formatPriceZAR(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date, Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white mt-1"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white mt-1"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Duration</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white mt-1"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={90}>1.5 Hours</option>
                    <option value={120}>2 Hours</option>
                  </select>
                </div>
              </div>

              {/* Location & Virtual Option */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Meeting Location / Venue</label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsVirtual}
                      onChange={(e) => setFormIsVirtual(e.target.checked)}
                      className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <span>Virtual / Online Tour</span>
                  </label>
                </div>

                {formIsVirtual ? (
                  <input
                    type="url"
                    value={formVirtualUrl}
                    onChange={(e) => setFormVirtualUrl(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full bg-indigo-50/50 border border-indigo-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white"
                  />
                ) : (
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. 14 Rivonia Ridge, Sandton or Beno Head Office"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white"
                  />
                )}
              </div>

              {/* Estimated Value & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Est. Transaction Value (ZAR)</label>
                  <input
                    type="number"
                    value={formEstimatedValue}
                    onChange={(e) => setFormEstimatedValue(e.target.value)}
                    placeholder="e.g. 5250000"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Agenda / Private Notes</label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Client needs solar specs"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-brand-primary focus:bg-white mt-1"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Confirm & Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INVITE CLIENT */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight font-display">
                    Invite VIP Client
                  </h3>
                  <p className="text-xs text-gray-500">
                    Send personalized invitation to access private listings & schedules.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Eleanor Sterling"
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-amber-500 focus:bg-white mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="eleanor@sterling.com"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-amber-500 focus:bg-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="+27 83 000 0000"
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-amber-500 focus:bg-white mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Client Purpose</label>
                  <select
                    value={inviteCategory}
                    onChange={(e) => setInviteCategory(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-amber-500 focus:bg-white mt-1"
                  >
                    <option value="Buyer">Buyer (Property Acquisition)</option>
                    <option value="Tenant">Tenant (Rental Candidate)</option>
                    <option value="Seller">Seller (Mandate / Valuation)</option>
                    <option value="Investor">Investor (Development / Commercial)</option>
                    <option value="General">General Inquirer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Assigned Agent</label>
                  <select
                    value={inviteAgentId}
                    onChange={(e) => setInviteAgentId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-amber-500 focus:bg-white mt-1"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400">Recommended Property (Optional)</label>
                <select
                  value={invitePropertyId}
                  onChange={(e) => setInvitePropertyId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-amber-500 focus:bg-white mt-1"
                >
                  <option value="">-- General VIP Access --</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id}: {p.title} ({p.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400">VIP Welcome Message</label>
                <textarea
                  rows={2}
                  value={inviteCustomMsg}
                  onChange={(e) => setInviteCustomMsg(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-amber-500 focus:bg-white mt-1"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Generate & Send Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: OUTCOME & COMPLETION */}
      {isOutcomeModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight">
                    Record Viewing Outcome
                  </h3>
                  <p className="text-xs text-gray-500">{selectedAppointment.clientName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOutcomeModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-gray-700">Appointment Outcome</label>
                <select
                  value={outcomeVal}
                  onChange={(e) => setOutcomeVal(e.target.value as AppointmentOutcome)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-emerald-600 focus:bg-white mt-1"
                >
                  {APPOINTMENT_OUTCOMES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Debrief & Next Action Notes</label>
                <textarea
                  rows={3}
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  placeholder="e.g. Client loved the patio. Offered R14.2M, preparing OTP draft."
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 focus:border-emerald-600 focus:bg-white mt-1"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOutcomeModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOutcome}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Save Outcome & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SEND REMINDER */}
      {isReminderModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight">
                    Send Appointment Reminder
                  </h3>
                  <p className="text-xs text-gray-500">{selectedAppointment.clientName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsReminderModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <p className="text-xs text-gray-600">
                Pre-formatted reminder with appointment details, address, and agent contact:
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-700 font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {getReminderText(selectedAppointment)}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleCopy(getReminderText(selectedAppointment), "Reminder Text")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-all"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Reminder Text</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const text = getReminderText(selectedAppointment);
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                      setIsReminderModalOpen(false);
                      showToast("WhatsApp opened with reminder!");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-sm transition-all"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Send on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const subject = `Beno Properties Appointment Reminder: ${selectedAppointment.title}`;
                      const body = getReminderText(selectedAppointment);
                      window.open(`mailto:${selectedAppointment.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                      setIsReminderModalOpen(false);
                      showToast("Email client opened!");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: RESCHEDULE */}
      {isRescheduleModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight">
                    Reschedule Appointment
                  </h3>
                  <p className="text-xs text-gray-500">{selectedAppointment.title}</p>
                </div>
              </div>
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700">New Date</label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">New Time</label>
                  <input
                    type="time"
                    required
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl p-2.5 mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReschedule}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Save Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
