/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Mail,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Send,
  Sparkles,
  FileText,
  RotateCcw,
  Eye,
  Tag,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Save,
  X
} from "lucide-react";
import { EmailTemplate, Property, Lead, Agent } from "../types";
import { DEFAULT_EMAIL_TEMPLATES } from "../data";
import { formatPriceZAR } from "./PropertyCard";

interface EmailTemplateManagerProps {
  currentAgent?: Agent | null;
  properties?: Property[];
  leads?: Lead[];
  onQuickSendEmail?: (emailData: { to: string; subject: string; body: string; leadId?: string }) => void;
}

const STORAGE_KEY = "beno_saved_email_templates";

export const AVAILABLE_PLACEHOLDERS = [
  { tag: "{client_name}", label: "Client Name", sample: "Sarah Mthembu", desc: "Full name or first name of the inquirer" },
  { tag: "{property_name}", label: "Property Name", sample: "The Houghton Sky Penthouse", desc: "Title of the inquired listing" },
  { tag: "{property_ref}", label: "Property Ref", sample: "BENO-1082", desc: "Unique inventory reference ID" },
  { tag: "{property_location}", label: "Property Location", sample: "Houghton Estate, Johannesburg", desc: "Suburb and city of the listing" },
  { tag: "{property_price}", label: "Price / Rent", sample: "R 18,500,000", desc: "Formatted price or monthly rental" },
  { tag: "{viewing_time}", label: "Viewing Time", sample: "Saturday 14:00 - 15:00", desc: "Scheduled viewing slot or appointment time" },
  { tag: "{agent_name}", label: "Agent Name", sample: "David Beno", desc: "Name of the assigned real estate professional" },
  { tag: "{agent_phone}", label: "Agent Phone", sample: "+27 (0) 82 555 0192", desc: "Mobile contact number for calls & WhatsApp" },
  { tag: "{agent_email}", label: "Agent Email", sample: "david@benoproperties.co.za", desc: "Professional contact email" },
  { tag: "{office_address}", label: "Office Address", sample: "No 1 Casino Road, Foundershill, Modderfontein", desc: "Beno Properties headquarters address" },
];

export function replacePlaceholders(
  text: string,
  context: {
    clientName?: string;
    propertyName?: string;
    propertyRef?: string;
    propertyLocation?: string;
    propertyPrice?: string;
    viewingTime?: string;
    agentName?: string;
    agentPhone?: string;
    agentEmail?: string;
    officeAddress?: string;
  }
): string {
  let result = text;
  result = result.replace(/\{client_name\}/g, context.clientName || "Valued Client");
  result = result.replace(/\{property_name\}/g, context.propertyName || "Luxury Property");
  result = result.replace(/\{property_ref\}/g, context.propertyRef || "BENO-REF");
  result = result.replace(/\{property_location\}/g, context.propertyLocation || "Gauteng");
  result = result.replace(/\{property_price\}/g, context.propertyPrice || "Market Rate");
  result = result.replace(/\{viewing_time\}/g, context.viewingTime || "By Private Appointment");
  result = result.replace(/\{agent_name\}/g, context.agentName || "Beno Properties Representative");
  result = result.replace(/\{agent_phone\}/g, context.agentPhone || "+27 10 141 0720");
  result = result.replace(/\{agent_email\}/g, context.agentEmail || "info@benopropertiessa.com");
  result = result.replace(/\{office_address\}/g, context.officeAddress || "No 1 Casino Road, Foundershill, Modderfontein, Johannesburg");
  return result;
}

export default function EmailTemplateManager({
  currentAgent,
  properties = [],
  leads = [],
  onQuickSendEmail
}: EmailTemplateManagerProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to load templates from localStorage", e);
    }
    return DEFAULT_EMAIL_TEMPLATES;
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || "TMPL-1");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form State for Create / Edit
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<EmailTemplate["category"]>("Inquiry Follow-up");
  const [formDescription, setFormDescription] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formBody, setFormBody] = useState("");
  const [activeInputFocus, setActiveInputFocus] = useState<"subject" | "body">("body");

  // Live Preview Sample Context Selector
  const [previewLeadId, setPreviewLeadId] = useState<string>(leads[0]?.id || "SAMPLE");
  const [previewPropertyId, setPreviewPropertyId] = useState<string>(properties[0]?.id || "SAMPLE");
  const [customViewingTime, setCustomViewingTime] = useState<string>("Thursday at 14:30");

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (e) {
      console.warn("Failed to save templates to localStorage", e);
    }
  }, [templates]);

  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Selected sample lead & property for live placeholder substitution
  const sampleLead = leads.find(l => l.id === previewLeadId) || {
    id: "SAMPLE-LEAD",
    name: "Tebogo Moloi",
    email: "tebogo.moloi@gmail.com",
    phone: "+27 82 456 7890",
    propertyRefId: properties[0]?.id || "BENO-1082"
  };

  const sampleProperty = properties.find(p => p.id === previewPropertyId) || properties[0] || {
    id: "BENO-1082",
    title: "Sandton Executive Penthouse",
    location: "Morningside, Sandton",
    price: 4850000,
    status: "For Sale"
  };

  const previewContext = {
    clientName: sampleLead.name,
    propertyName: sampleProperty.title,
    propertyRef: sampleProperty.id,
    propertyLocation: sampleProperty.location,
    propertyPrice: formatPriceZAR(sampleProperty.price, sampleProperty.status as any),
    viewingTime: customViewingTime,
    agentName: currentAgent?.name || "David Beno",
    agentPhone: currentAgent?.phone || "+27 (0) 82 555 0192",
    agentEmail: currentAgent?.email || "david@benoproperties.co.za",
    officeAddress: "No 1 Casino Road, Foundershill, Modderfontein, Johannesburg"
  };

  const resolvedSubject = activeTemplate ? replacePlaceholders(activeTemplate.subject, previewContext) : "";
  const resolvedBody = activeTemplate ? replacePlaceholders(activeTemplate.body, previewContext) : "";

  // Start Create New
  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setIsEditing(true);
    setFormTitle("");
    setFormCategory("Inquiry Follow-up");
    setFormDescription("");
    setFormSubject("Inquiry Follow-up: {property_name} | Beno Properties");
    setFormBody(`Dear {client_name},\n\nThank you for your interest in {property_name} ({property_ref}) in {property_location}.\n\n...\n\nWarm regards,\n{agent_name}\n{agent_phone}`);
  };

  // Start Edit
  const handleStartEdit = (template: EmailTemplate) => {
    setIsCreatingNew(false);
    setIsEditing(true);
    setFormTitle(template.title);
    setFormCategory(template.category);
    setFormDescription(template.description);
    setFormSubject(template.subject);
    setFormBody(template.body);
  };

  // Save Template
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSubject.trim() || !formBody.trim()) {
      showToast("Please fill in template title, subject, and body.");
      return;
    }

    if (isCreatingNew) {
      const newTemplate: EmailTemplate = {
        id: `TMPL-CUSTOM-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim() || "Custom inquiry follow-up template.",
        subject: formSubject.trim(),
        body: formBody.trim(),
        placeholders: AVAILABLE_PLACEHOLDERS.map(p => p.tag).filter(tag => formSubject.includes(tag) || formBody.includes(tag)),
        isDefault: false,
        createdByAgentId: currentAgent?.id || "CURRENT-AGENT",
        createdAt: new Date().toISOString()
      };
      setTemplates(prev => [newTemplate, ...prev]);
      setSelectedTemplateId(newTemplate.id);
      showToast(`Template "${newTemplate.title}" created successfully!`);
    } else {
      setTemplates(prev =>
        prev.map(t =>
          t.id === selectedTemplateId
            ? {
                ...t,
                title: formTitle.trim(),
                category: formCategory,
                description: formDescription.trim(),
                subject: formSubject.trim(),
                body: formBody.trim(),
                placeholders: AVAILABLE_PLACEHOLDERS.map(p => p.tag).filter(tag => formSubject.includes(tag) || formBody.includes(tag)),
                updatedAt: new Date().toISOString()
              }
            : t
        )
      );
      showToast("Template updated successfully!");
    }

    setIsEditing(false);
    setIsCreatingNew(false);
  };

  // Delete Template
  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (templates.length <= 1) {
      showToast("You must keep at least one email template.");
      return;
    }
    const templateToDelete = templates.find(t => t.id === id);
    if (!confirm(`Are you sure you want to delete "${templateToDelete?.title}"?`)) return;

    const remaining = templates.filter(t => t.id !== id);
    setTemplates(remaining);
    if (selectedTemplateId === id) {
      setSelectedTemplateId(remaining[0]?.id || "");
    }
    setIsEditing(false);
    showToast("Template removed.");
  };

  // Duplicate Template
  const handleDuplicateTemplate = (template: EmailTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: EmailTemplate = {
      ...template,
      id: `TMPL-COPY-${Date.now()}`,
      title: `${template.title} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString()
    };
    setTemplates(prev => [duplicated, ...prev]);
    setSelectedTemplateId(duplicated.id);
    showToast(`Duplicated "${template.title}"`);
  };

  // Reset to Defaults
  const handleResetToDefaults = () => {
    if (confirm("Reset all templates back to standard Beno Properties default templates?")) {
      setTemplates(DEFAULT_EMAIL_TEMPLATES);
      setSelectedTemplateId(DEFAULT_EMAIL_TEMPLATES[0].id);
      setIsEditing(false);
      showToast("Templates reset to system defaults.");
    }
  };

  // Insert placeholder at cursor into subject or body
  const insertPlaceholder = (tag: string) => {
    if (!isEditing) return;
    if (activeInputFocus === "subject") {
      setFormSubject(prev => prev + " " + tag);
    } else {
      setFormBody(prev => prev + "\n" + tag);
    }
    showToast(`Inserted ${tag}`);
  };

  // Copy Preview to Clipboard
  const handleCopyPreview = async () => {
    if (!resolvedBody) return;
    const fullText = `Subject: ${resolvedSubject}\n\n${resolvedBody}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedField("all");
      showToast("Full email (subject & body) copied to clipboard!");
      setTimeout(() => setCopiedField(null), 2500);
    } catch (err) {
      console.warn("Clipboard copy failed", err);
    }
  };

  // Open in Mail Client
  const handleOpenMailto = () => {
    const to = sampleLead.email || "";
    const subject = encodeURIComponent(resolvedSubject);
    const body = encodeURIComponent(resolvedBody);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  // Open WhatsApp Link
  const handleOpenWhatsApp = () => {
    const phone = (sampleLead.phone || "").replace(/[^0-9]/g, "");
    const formattedPhone = phone.startsWith("0") ? "27" + phone.slice(1) : phone;
    const text = encodeURIComponent(`*${resolvedSubject}*\n\n${resolvedBody}`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden p-6 space-y-6" id="email-template-manager-root">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
                Client Inquiry Email Templates
              </h2>
              <p className="text-xs text-gray-500">
                Create, customize, and save standardized response templates with smart placeholders like <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[10px] text-brand-primary font-bold">{"{client_name}"}</code> and <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[10px] text-brand-primary font-bold">{"{property_name}"}</code>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToDefaults}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default Beno templates"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleStartCreate}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer uppercase tracking-wider"
          >
            <Plus className="h-4 w-4" />
            Create Template
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Left List + Right Editor/Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Template Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-gray-500 uppercase tracking-wider px-1">
            <span>Saved Templates ({templates.length})</span>
            <span className="text-[10px] text-gray-400">Click to preview</span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {templates.map(tmpl => {
              const isSelected = tmpl.id === selectedTemplateId && !isCreatingNew;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplateId(tmpl.id);
                    setIsEditing(false);
                    setIsCreatingNew(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20 shadow-sm"
                      : "bg-gray-50/70 border-gray-200 hover:bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          tmpl.category === "Viewing"
                            ? "bg-purple-100 text-purple-700"
                            : tmpl.category === "Price Alert"
                            ? "bg-rose-100 text-rose-700"
                            : tmpl.category === "Offer & Closing"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {tmpl.category}
                        </span>
                        {tmpl.isDefault && (
                          <span className="text-[9px] font-mono text-gray-400">System</span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                        {tmpl.title}
                      </h4>
                    </div>

                    {/* Action buttons on card hover */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplateId(tmpl.id);
                          handleStartEdit(tmpl);
                        }}
                        className="p-1 hover:bg-white rounded text-gray-500 hover:text-gray-900 transition-colors"
                        title="Edit template"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDuplicateTemplate(tmpl, e)}
                        className="p-1 hover:bg-white rounded text-gray-500 hover:text-gray-900 transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      {!tmpl.isDefault && (
                        <button
                          onClick={(e) => handleDeleteTemplate(tmpl.id, e)}
                          className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600 transition-colors"
                          title="Delete template"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {tmpl.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {tmpl.placeholders.slice(0, 3).map(p => (
                      <span key={p} className="text-[9px] font-mono bg-white border border-gray-200 text-gray-600 px-1.5 py-0.2 rounded">
                        {p}
                      </span>
                    ))}
                    {tmpl.placeholders.length > 3 && (
                      <span className="text-[9px] font-mono text-gray-400 self-center">
                        +{tmpl.placeholders.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Editor OR Live Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {isEditing ? (
            /* TEMPLATE EDITING / CREATION FORM */
            <form onSubmit={handleSaveTemplate} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-primary text-white rounded-lg">
                    <Edit2 className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase">
                      {isCreatingNew ? "Create New Email Template" : `Edit: ${formTitle || activeTemplate?.title}`}
                    </h3>
                    <p className="text-[11px] text-gray-500">Insert placeholders below to dynamically populate lead and property details.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setIsCreatingNew(false);
                    }}
                    className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Template
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. VIP Show Day Invitation"
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Inquiry Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="Inquiry Follow-up">Inquiry Follow-up</option>
                    <option value="Viewing">Viewing & Tours</option>
                    <option value="Price Alert">Price Alert & Match</option>
                    <option value="Offer & Closing">Offer & Closing (OTP)</option>
                    <option value="Tenant Vetting">Tenant Vetting & Lease</option>
                    <option value="General">General Inquiries</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Brief Usage Description
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="When should agents deploy this template?"
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Available Placeholders Toolbar */}
              <div className="bg-white border border-amber-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5 uppercase font-mono">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    Insert Placeholder Tag (Click to append into {activeInputFocus}):
                  </span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="text-gray-500">Targeting:</span>
                    <button
                      type="button"
                      onClick={() => setActiveInputFocus("subject")}
                      className={`px-2 py-0.5 rounded font-mono font-bold cursor-pointer ${
                        activeInputFocus === "subject" ? "bg-amber-400 text-slate-950" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Subject
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInputFocus("body")}
                      className={`px-2 py-0.5 rounded font-mono font-bold cursor-pointer ${
                        activeInputFocus === "body" ? "bg-amber-400 text-slate-950" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Body
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_PLACEHOLDERS.map(p => (
                    <button
                      key={p.tag}
                      type="button"
                      onClick={() => insertPlaceholder(p.tag)}
                      title={`${p.label}: e.g. ${p.sample} (${p.desc})`}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <span>{p.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Subject */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onFocus={() => setActiveInputFocus("subject")}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Inquiry Regarding {property_name} | Beno Properties"
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Email Body */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Email Message Body *
                </label>
                <textarea
                  rows={10}
                  required
                  value={formBody}
                  onFocus={() => setActiveInputFocus("body")}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="Draft your follow-up message with placeholders..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-900 leading-relaxed font-mono focus:outline-none focus:border-brand-primary"
                />
              </div>
            </form>
          ) : (
            /* LIVE PREVIEW & DISPATCH PANEL */
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5 shadow-sm">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      {activeTemplate?.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900">{activeTemplate?.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{activeTemplate?.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(activeTemplate)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit Template
                  </button>
                  <button
                    onClick={handleCopyPreview}
                    className="px-3.5 py-1.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    {copiedField === "all" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Email
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sample Context Simulator Controls */}
              <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-700 uppercase">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-brand-primary" />
                    Live Placeholder Preview Context
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">
                    Simulate placeholders using real client & catalog data
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-mono mb-1">Select Client / Lead:</label>
                    <select
                      value={previewLeadId}
                      onChange={(e) => setPreviewLeadId(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 font-medium focus:outline-none"
                    >
                      {leads.length > 0 ? (
                        leads.map(l => (
                          <option key={l.id} value={l.id}>{l.name} ({l.category})</option>
                        ))
                      ) : (
                        <option value="SAMPLE">Sarah Mthembu (Prospective Buyer)</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 font-mono mb-1">Select Property:</label>
                    <select
                      value={previewPropertyId}
                      onChange={(e) => setPreviewPropertyId(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 font-medium focus:outline-none"
                    >
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 font-mono mb-1">Viewing Time:</label>
                    <input
                      type="text"
                      value={customViewingTime}
                      onChange={(e) => setCustomViewingTime(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 font-medium focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Rendered Email Simulator Container */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                {/* Email Header Bar */}
                <div className="bg-gray-100/90 border-b border-gray-200 p-3 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-16 text-right">To:</span>
                    <span className="text-gray-900 font-bold bg-white px-2 py-0.5 rounded border border-gray-200">
                      {sampleLead.name} &lt;{sampleLead.email || "client@domain.co.za"}&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-16 text-right">From:</span>
                    <span className="text-gray-700">
                      {currentAgent?.name || "David Beno"} &lt;{currentAgent?.email || "david@benoproperties.co.za"}&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-16 text-right">Subject:</span>
                    <span className="text-gray-900 font-bold bg-white px-2 py-0.5 rounded border border-gray-200 flex-1">
                      {resolvedSubject}
                    </span>
                  </div>
                </div>

                {/* Email Body Content */}
                <div className="p-5 bg-white text-gray-800 text-xs leading-relaxed whitespace-pre-wrap font-sans min-h-[220px]">
                  {resolvedBody}
                </div>

                {/* Email Actions Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    Placeholders resolved dynamically ({activeTemplate?.placeholders.length} tags)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenWhatsApp}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      title="Send as WhatsApp message"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Send via WhatsApp
                    </button>
                    <button
                      onClick={handleOpenMailto}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      title="Open default mail client"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Launch in Email Client
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------------------
// QUICK LEAD FOLLOW-UP MODAL (Used when clicking "Follow Up" on any lead card)
// -------------------------------------------------------------------------------------
interface QuickFollowUpModalProps {
  lead: Lead | { id: string; name: string; email: string; phone?: string; propertyRefId?: string; details?: string };
  properties: Property[];
  agents: Agent[];
  onClose: () => void;
  onMarkContacted?: (leadId: string) => void;
}

export function QuickFollowUpModal({
  lead,
  properties,
  agents,
  onClose,
  onMarkContacted
}: QuickFollowUpModalProps) {
  const [templates] = useState<EmailTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Storage error", e);
    }
    return DEFAULT_EMAIL_TEMPLATES;
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || "TMPL-1");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    lead.propertyRefId || properties[0]?.id || ""
  );
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || "BENO-AGT-1");
  const [customViewingTime, setCustomViewingTime] = useState<string>("Saturday at 11:00 AM");
  const [copied, setCopied] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];
  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const resolvedSubject = replacePlaceholders(selectedTemplate?.subject || "", {
    clientName: lead.name,
    propertyName: selectedProperty?.title || "Beno Properties Listing",
    propertyRef: selectedProperty?.id || lead.propertyRefId || "BENO-REF",
    propertyLocation: selectedProperty?.location || "Gauteng",
    propertyPrice: selectedProperty ? formatPriceZAR(selectedProperty.price, selectedProperty.status as any) : "Market Rate",
    viewingTime: customViewingTime,
    agentName: selectedAgent?.name || "David Beno",
    agentPhone: selectedAgent?.phone || "+27 82 555 0192",
    agentEmail: selectedAgent?.email || "david@benoproperties.co.za",
    officeAddress: "No 1 Casino Road, Foundershill, Modderfontein, Johannesburg"
  });

  const resolvedBody = replacePlaceholders(selectedTemplate?.body || "", {
    clientName: lead.name,
    propertyName: selectedProperty?.title || "Beno Properties Listing",
    propertyRef: selectedProperty?.id || lead.propertyRefId || "BENO-REF",
    propertyLocation: selectedProperty?.location || "Gauteng",
    propertyPrice: selectedProperty ? formatPriceZAR(selectedProperty.price, selectedProperty.status as any) : "Market Rate",
    viewingTime: customViewingTime,
    agentName: selectedAgent?.name || "David Beno",
    agentPhone: selectedAgent?.phone || "+27 82 555 0192",
    agentEmail: selectedAgent?.email || "david@benoproperties.co.za",
    officeAddress: "No 1 Casino Road, Foundershill, Modderfontein, Johannesburg"
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${resolvedSubject}\n\n${resolvedBody}`);
      setCopied(true);
      setToast("Email copied to clipboard!");
      if (onMarkContacted) onMarkContacted(lead.id);
      setTimeout(() => {
        setCopied(false);
        setToast(null);
      }, 3000);
    } catch (e) {
      console.warn("Copy error", e);
    }
  };

  const handleLaunchEmail = () => {
    if (onMarkContacted) onMarkContacted(lead.id);
    const url = `mailto:${lead.email}?subject=${encodeURIComponent(resolvedSubject)}&body=${encodeURIComponent(resolvedBody)}`;
    window.location.href = url;
  };

  const handleLaunchWhatsApp = () => {
    if (onMarkContacted) onMarkContacted(lead.id);
    const phone = (lead.phone || "").replace(/[^0-9]/g, "");
    const formatted = phone.startsWith("0") ? "27" + phone.slice(1) : phone;
    const text = encodeURIComponent(`*${resolvedSubject}*\n\n${resolvedBody}`);
    window.open(`https://wa.me/${formatted}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden space-y-4 p-6 max-h-[92vh] overflow-y-auto">
        {toast && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{toast}</span>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Inquiry Follow-up: {lead.name}
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                {lead.email} {lead.phone ? `• ${lead.phone}` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Template & Property Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1">
              Choose Email Template:
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-brand-primary cursor-pointer"
            >
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.title} ({t.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1">
              Referenced Property:
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-brand-primary cursor-pointer"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.title} ({p.id})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resolved Preview Card */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-gray-50 border-b border-gray-200 p-2.5 text-xs font-mono">
            <span className="text-gray-400">Subject: </span>
            <span className="font-bold text-gray-900">{resolvedSubject}</span>
          </div>
          <div className="p-4 bg-white text-xs text-gray-800 leading-relaxed font-sans whitespace-pre-wrap max-h-60 overflow-y-auto">
            {resolvedBody}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            {lead.phone && (
              <button
                onClick={handleLaunchWhatsApp}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </button>
            )}
            <button
              onClick={handleLaunchEmail}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md uppercase tracking-wider"
            >
              <Send className="h-3.5 w-3.5" />
              Open Email Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
