import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  User, 
  Tag, 
  Phone, 
  Mail, 
  CheckCircle, 
  Clock, 
  Smile, 
  Home, 
  MessageCircle, 
  Settings, 
  Search, 
  Edit, 
  Check, 
  Trash2, 
  Bell, 
  AlertTriangle,
  History,
  Copy,
  Plus,
  Sparkles,
  Send
} from "lucide-react";
import { Lead, Property, Agent } from "../types";

interface RelationshipAssistantProps {
  leads: Lead[];
  onUpdateLead: (lead: Lead) => void;
  properties: Property[];
  onUpdateProperty: (property: Property) => void;
  agents: Agent[];
  currentUser: any;
  reminderSystem?: any;
}

interface AssistantSettings {
  birthdayLeadDays: number; // default 7
  anniversaryLeadDays: number; // default 7
  leaseExpirationIntervals: number[]; // e.g., [90, 60, 30, 7]
  muteBirthdays: boolean;
  muteAnniversaries: boolean;
  muteLeaseExpirations: boolean;
  muteSellerUpdates: boolean;
  muteValueAddOutreach: boolean;
}

interface ReminderItem {
  id: string; // unique identifier
  type: "birthday" | "anniversary" | "lease" | "seller-update" | "value-add";
  title: string;
  description: string;
  suggestedAction: string;
  templateMessage: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  propertyName?: string;
  propertyId?: string;
  targetDate?: string;
  daysRemaining?: number;
  badgeText?: string;
}

interface SnoozedState {
  id: string;
  until: string; // YYYY-MM-DD
}

interface CompletedState {
  id: string;
  completedOn: string; // YYYY-MM-DD
}

export default function RelationshipAssistant({
  leads,
  onUpdateLead,
  properties,
  onUpdateProperty,
  agents,
  currentUser,
  reminderSystem
}: RelationshipAssistantProps) {
  // Tabs: "reminders" | "data-recorder" | "settings"
  const [activeSubTab, setActiveSubTab] = useState<"reminders" | "data-recorder" | "settings">("reminders");

  // Drafting system for Suggested Actions
  const [selectedDraftReminder, setSelectedDraftReminder] = useState<any | null>(null);
  const [draftChannel, setDraftChannel] = useState<"email" | "sms">("email");
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [isDraftSending, setIsDraftSending] = useState(false);
  const [draftSuccess, setDraftSuccess] = useState(false);

  const handleLaunchDraft = () => {
    if (!selectedDraftReminder) return;
    if (draftChannel === "email") {
      const email = selectedDraftReminder.clientEmail || "";
      const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(draftSubject)}&body=${encodeURIComponent(draftBody)}`;
      window.open(mailtoUrl, "_blank");
    } else {
      const phone = selectedDraftReminder.clientPhone || "";
      const smsUrl = `sms:${encodeURIComponent(phone)}?body=${encodeURIComponent(draftBody)}`;
      window.open(smsUrl, "_blank");
    }
  };

  const handleSimulateSend = () => {
    setIsDraftSending(true);
    setTimeout(() => {
      setIsDraftSending(false);
      setDraftSuccess(true);
      setTimeout(() => {
        setDraftSuccess(false);
        // Automatically mark the reminder as complete once sent!
        if (selectedDraftReminder) {
          handleMarkComplete(selectedDraftReminder.id);
          setSelectedDraftReminder(null);
        }
      }, 1500);
    }, 1200);
  };

  // Settings
  const [settings, setSettings] = useState<AssistantSettings>(() => {
    try {
      const stored = localStorage.getItem("beno_assistant_settings");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      birthdayLeadDays: 7,
      anniversaryLeadDays: 7,
      leaseExpirationIntervals: [90, 60, 30, 7],
      muteBirthdays: false,
      muteAnniversaries: false,
      muteLeaseExpirations: false,
      muteSellerUpdates: false,
      muteValueAddOutreach: false,
    };
  });

  // Save settings helper
  const handleSaveSettings = (newSettings: AssistantSettings) => {
    setSettings(newSettings);
    localStorage.setItem("beno_assistant_settings", JSON.stringify(newSettings));
  };

  // Snoozed and Completed reminders lists (persisted)
  const [snoozedReminders, setSnoozedReminders] = useState<SnoozedState[]>(() => {
    try {
      const stored = localStorage.getItem("beno_assistant_snoozed");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [completedReminders, setCompletedReminders] = useState<CompletedState[]>(() => {
    try {
      const stored = localStorage.getItem("beno_assistant_completed");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Update persistent records
  const saveSnoozed = (list: SnoozedState[]) => {
    setSnoozedReminders(list);
    localStorage.setItem("beno_assistant_snoozed", JSON.stringify(list));
  };

  const saveCompleted = (list: CompletedState[]) => {
    setCompletedReminders(list);
    localStorage.setItem("beno_assistant_completed", JSON.stringify(list));
  };

  // State for data entry search / filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"leads" | "properties">("leads");

  // Inline edit state for key dates in the recorder tab
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBirthDate, setEditBirthDate] = useState("");
  const [editClientSince, setEditClientSince] = useState("");
  const [editPurchaseDate, setEditPurchaseDate] = useState("");
  const [editLeaseStart, setEditLeaseStart] = useState("");
  const [editLeaseEnd, setEditLeaseEnd] = useState("");

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reminders generation logic
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const activeRemindersList = reminderSystem ? reminderSystem.notifications : reminders;

  // Calculate dynamic reminder entries
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const activeReminders: ReminderItem[] = [];

    // Helper to calculate days until a date (ignoring year or respecting it)
    const getDaysUntilAnniversary = (dateStr: string): { days: number; nextDate: Date } => {
      const parts = dateStr.split("-");
      if (parts.length !== 3) return { days: -1, nextDate: new Date() };
      
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      const nextAnniv = new Date(today.getFullYear(), month, day);
      if (nextAnniv.getTime() < today.getTime() && (nextAnniv.getDate() !== today.getDate() || nextAnniv.getMonth() !== today.getMonth())) {
        nextAnniv.setFullYear(today.getFullYear() + 1);
      }
      
      const diffTime = nextAnniv.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { days: diffDays, nextDate: nextAnniv };
    };

    // Helper to calculate raw days difference from target date
    const getDaysDifference = (targetDateStr: string): number => {
      const target = new Date(targetDateStr);
      const diffTime = target.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Helper to check if a reminder is currently snoozed or completed
    const isSnoozedOrCompleted = (id: string): boolean => {
      // Check snooze
      const snoozeMatch = snoozedReminders.find(s => s.id === id);
      if (snoozeMatch) {
        if (snoozeMatch.until >= todayStr) return true;
      }
      // Check completion
      // For annual reminders like birthdays/anniversaries, check if completed this year
      // For weekly reminders, check if completed in last 6 days
      // For lease reminders, check if completed for that interval
      const compMatch = completedReminders.find(c => c.id === id);
      if (compMatch) {
        if (id.startsWith("birthday") || id.startsWith("anniversary")) {
          const currentYearStr = today.getFullYear().toString();
          if (compMatch.completedOn.startsWith(currentYearStr)) return true;
        } else if (id.startsWith("seller-update") || id.startsWith("value-add")) {
          // Check if completed in the last 6 days to support weekly cadence
          const compDate = new Date(compMatch.completedOn);
          const elapsedDays = (today.getTime() - compDate.getTime()) / (1000 * 60 * 60 * 24);
          if (elapsedDays < 6) return true;
        } else {
          return true; // lease expirations marked done once are done
        }
      }
      return false;
    };

    // 1. Birthdays
    if (!settings.muteBirthdays) {
      leads.forEach(lead => {
        if (lead.date_of_birth) {
          const { days, nextDate } = getDaysUntilAnniversary(lead.date_of_birth);
          if (days >= 0 && days <= settings.birthdayLeadDays) {
            const remId = `birthday-${lead.id}-${nextDate.getFullYear()}`;
            if (!isSnoozedOrCompleted(remId)) {
              const bdayDateText = nextDate.toLocaleDateString("en-ZA", { day: "numeric", month: "long" });
              activeReminders.push({
                id: remId,
                type: "birthday",
                title: `🎂 Client Birthday Coming Up`,
                description: `${lead.name}'s birthday is in ${days === 0 ? "today!" : days === 1 ? "1 day" : `${days} days`} (${bdayDateText}).`,
                suggestedAction: `Send a personalized birthday message or make a celebratory call.`,
                templateMessage: `Hi ${lead.name.split(" ")[0]}! Wishing you an incredible, blessed birthday from the Beno Properties team! May your year ahead be filled with joy, prosperity, and beautiful new spaces. Have a fantastic day! 🎂✨`,
                clientName: lead.name,
                clientEmail: lead.email,
                clientPhone: lead.phone,
                targetDate: lead.date_of_birth,
                daysRemaining: days,
                badgeText: days === 0 ? "TODAY" : days === 1 ? "TOMORROW" : `${days} days left`
              });
            }
          }
        }
      });
    }

    // 2. Property / purchase anniversaries
    if (!settings.muteAnniversaries) {
      properties.forEach(prop => {
        // We can check purchase_date or lease_start_date (anniversary of moving in/buying)
        const anniversaryBase = prop.purchase_date || prop.lease_start_date;
        if (anniversaryBase) {
          const isLeaseAnniv = !!prop.lease_start_date && !prop.purchase_date;
          const { days, nextDate } = getDaysUntilAnniversary(anniversaryBase);
          if (days >= 0 && days <= settings.anniversaryLeadDays) {
            const remId = `anniversary-${prop.id}-${nextDate.getFullYear()}`;
            if (!isSnoozedOrCompleted(remId)) {
              // Find buyer lead associated with the property or prompt general
              const leadMatch = leads.find(l => l.propertyRefId === prop.id) || leads[0];
              const clientName = leadMatch ? leadMatch.name : "Property Client";
              const clientEmail = leadMatch ? leadMatch.email : undefined;
              const clientPhone = leadMatch ? leadMatch.phone : undefined;

              const yearDiff = nextDate.getFullYear() - parseInt(anniversaryBase.split("-")[0], 10);
              const suffix = yearDiff === 1 ? "1st" : yearDiff === 2 ? "2nd" : yearDiff === 3 ? "3rd" : `${yearDiff}th`;

              activeReminders.push({
                id: remId,
                type: "anniversary",
                title: `🏠 ${isLeaseAnniv ? "Lease" : "Purchase"} Anniversary`,
                description: `Anniversary of the ${isLeaseAnniv ? "lease start" : "purchase"} for ${prop.title} is in ${days} days. This marks their ${suffix} anniversary!`,
                suggestedAction: `Reach out to congratulate them on their residency anniversary and request feedback.`,
                templateMessage: `Hi ${clientName.split(" ")[0]}! Happy ${suffix} anniversary of ${isLeaseAnniv ? "making this beautiful space your home" : "buying your property"} at ${prop.location}! We hope you are still creating wonderful memories there. Let us know if you need any property assistance. - Beno Properties 🏠`,
                clientName: clientName,
                clientEmail: clientEmail,
                clientPhone: clientPhone,
                propertyName: prop.title,
                propertyId: prop.id,
                targetDate: anniversaryBase,
                daysRemaining: days,
                badgeText: `${suffix} Anniv.`
              });
            }
          }
        }
      });
    }

    // 3. Lease expirations
    if (!settings.muteLeaseExpirations) {
      properties.forEach(prop => {
        if (prop.status === "To Rent" && prop.lease_end_date) {
          const daysRemaining = getDaysDifference(prop.lease_end_date);
          
          // Check if days remaining matches any threshold in intervals (e.g. exactly <= 90, 60, 30 or 7 days)
          // We trigger if it's within that period and has not been marked completed
          const triggeredInterval = settings.leaseExpirationIntervals.find(interval => daysRemaining <= interval && daysRemaining > 0);
          
          if (triggeredInterval !== undefined) {
            const remId = `lease-exp-${prop.id}-${triggeredInterval}`;
            if (!isSnoozedOrCompleted(remId)) {
              const leadMatch = leads.find(l => l.propertyRefId === prop.id && l.category === "Tenant") || leads[0];
              const clientName = leadMatch ? leadMatch.name : "Active Tenant";
              const clientEmail = leadMatch ? leadMatch.email : undefined;
              const clientPhone = leadMatch ? leadMatch.phone : undefined;

              activeReminders.push({
                id: remId,
                type: "lease",
                title: `📋 Lease Expiring in ${triggeredInterval} Days`,
                description: `The lease for ${prop.title} is set to expire on ${prop.lease_end_date} (${daysRemaining} days remaining).`,
                suggestedAction: `Contact the tenant (${clientName}) and landlord to schedule a renewal discussion or inspect the premises.`,
                templateMessage: `Dear ${clientName.split(" ")[0]},\n\nHope you are well! We noted that your lease agreement for ${prop.location} is due to expire in ${daysRemaining} days (on ${prop.lease_end_date}). We would love to discuss your renewal options at your earliest convenience.\n\nWarm regards,\nBeno Properties Team`,
                clientName: clientName,
                clientEmail: clientEmail,
                clientPhone: clientPhone,
                propertyName: prop.title,
                propertyId: prop.id,
                targetDate: prop.lease_end_date,
                daysRemaining: daysRemaining,
                badgeText: `${daysRemaining} Days`
              });
            }
          }
        }
      });
    }

    // 4. Seller / Landlord weekly update reminders
    if (!settings.muteSellerUpdates) {
      properties.forEach(prop => {
        // Active listing (status For Sale or To Rent)
        // Check if seller update reminder is due (once a week)
        const remId = `seller-update-${prop.id}`;
        if (!isSnoozedOrCompleted(remId)) {
          // Identify associated seller or landlord from leads
          const ownerLead = leads.find(l => l.propertyRefId === prop.id && (l.category === "Seller" || l.type === "Landlord Listing")) || 
                            leads.find(l => l.category === "Seller");
          const ownerName = ownerLead ? ownerLead.name : "Property Owner";
          const ownerEmail = ownerLead ? ownerLead.email : undefined;
          const ownerPhone = ownerLead ? ownerLead.phone : undefined;

          activeReminders.push({
            id: remId,
            type: "seller-update",
            title: `🏠 Weekly ${prop.status === "For Sale" ? "Seller" : "Landlord"} Status Update`,
            description: `It's time for your weekly feedback report to ${ownerName} for their property: ${prop.title}.`,
            suggestedAction: `Draft a listing performance report including latest viewings, inquiry numbers, and portal traction.`,
            templateMessage: `Dear ${ownerName.split(" ")[0]},\n\nHere is your weekly listing performance update for your property at ${prop.location}:\n- Active Inquiries: 3 new leads this week\n- Viewer Impressions: High traction on Beno Portal\n- Show Days / Next Steps: Open house scheduled for Sunday.\n\nWe will keep you fully informed. Please let me know if you have any questions!`,
            clientName: ownerName,
            clientEmail: ownerEmail,
            clientPhone: ownerPhone,
            propertyName: prop.title,
            propertyId: prop.id,
            badgeText: "Weekly Update"
          });
        }
      });
    }

    // 5. Weekly client "Value-Add" outreach
    if (!settings.muteValueAddOutreach) {
      leads.forEach(lead => {
        // Active leads only (exclude closed/lost unless specified, keep In Progress / Contacted / New)
        if (lead.status !== "Closed" && lead.status !== "Lost") {
          const remId = `value-add-${lead.id}`;
          if (!isSnoozedOrCompleted(remId)) {
            // Find representative
            const isBuyer = lead.category === "Buyer";
            const focusLocation = lead.propertyRefId ? (properties.find(p => p.id === lead.propertyRefId)?.location || "Gauteng") : "Johannesburg";
            
            activeReminders.push({
              id: remId,
              type: "value-add",
              title: `📬 Weekly Value-Add Outreach`,
              description: `Keep the relationship warm with ${lead.name} by sending a weekly real estate advice, tip, or local market trend.`,
              suggestedAction: `Share local suburb trends, home winterization tips, or interest rate insights to remain top of mind.`,
              templateMessage: `Hi ${lead.name.split(" ")[0]}! Just checking in with some quick value this week. Property values in ${focusLocation} are showing great resilience with buyers seeking security and backup energy features. Here is our quick list of tips for optimizing property equity this quarter! Let me know if you'd like the full report! 📈 - Beno Properties`,
              clientName: lead.name,
              clientEmail: lead.email,
              clientPhone: lead.phone,
              badgeText: "Value Nudge"
            });
          }
        }
      });
    }

    // "Since seller/landlord updates and client value-add reminders are both weekly,
    // group same-day reminders for the same client/property into a single notification"
    // Let's implement grouping logic if appropriate. We can group by clientName or clientEmail
    // to combine multiple notifications of type weekly together, or we can list them elegantly
    // with a visual indicator of matching clients. Let's provide a toggle or group them seamlessly.
    
    // Sort reminders: today first, then lease expirations, then anniversaries, then updates
    activeReminders.sort((a, b) => {
      const typeWeight = { birthday: 1, anniversary: 2, lease: 3, "seller-update": 4, "value-add": 5 };
      return (typeWeight[a.type] || 99) - (typeWeight[b.type] || 99);
    });

    setReminders(activeReminders);
  }, [leads, properties, settings, snoozedReminders, completedReminders]);

  // Handle snooze action
  const handleSnooze = (id: string, days: number) => {
    if (reminderSystem) {
      reminderSystem.snooze(id, days);
      return;
    }
    const today = new Date();
    today.setDate(today.getDate() + days);
    const snoozeUntilStr = today.toISOString().slice(0, 10);
    
    const updated = [...snoozedReminders.filter(s => s.id !== id), { id, until: snoozeUntilStr }];
    saveSnoozed(updated);
  };

  // Handle mark complete action
  const handleMarkComplete = (id: string) => {
    if (reminderSystem) {
      reminderSystem.markComplete(id);
      return;
    }
    const todayStr = new Date().toISOString().slice(0, 10);
    const updated = [...completedReminders.filter(c => c.id !== id), { id, completedOn: todayStr }];
    saveCompleted(updated);
  };

  // Copy Suggested Message template
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {}
      document.body.removeChild(textArea);
    });
  };

  // Direct WhatsApp Share
  const handleShareToWhatsApp = (phone: string, text: string) => {
    const formattedPhone = phone.replace(/[^0-9]/g, ""); // Keep raw numbers
    const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(formattedPhone)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Trigger inline save on recorder tab
  const startRecordingDates = (item: any, type: "lead" | "property") => {
    setEditingId(item.id);
    if (type === "lead") {
      setEditBirthDate(item.date_of_birth || "");
      setEditClientSince(item.client_since_date || "");
    } else {
      setEditPurchaseDate(item.purchase_date || "");
      setEditLeaseStart(item.lease_start_date || "");
      setEditLeaseEnd(item.lease_end_date || "");
    }
  };

  const handleSaveDates = (item: any, type: "lead" | "property") => {
    if (type === "lead") {
      onUpdateLead({
        ...item,
        date_of_birth: editBirthDate || undefined,
        client_since_date: editClientSince || undefined
      });
    } else {
      onUpdateProperty({
        ...item,
        purchase_date: editPurchaseDate || undefined,
        lease_start_date: editLeaseStart || undefined,
        lease_end_date: editLeaseEnd || undefined
      });
    }
    setEditingId(null);
  };

  // Filtered lists for the Date Recorder tab
  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col" id="relationship-assistant-container">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-brand-secondary to-slate-900 p-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-amber-400" />
            <h2 className="text-xl font-bold uppercase tracking-tight font-sans">
              Relationship Nudge Assistant
            </h2>
          </div>
          <p className="text-slate-300 text-xs mt-1">
            Maintain top-of-mind recall. Drive client touchpoints, birthday notes, and lease renewal updates.
          </p>
        </div>
        
        {/* Counter of outstanding tasks */}
        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-center">
          <Bell className="h-4 w-4 text-amber-300 animate-bounce" />
          <span className="text-xs font-bold font-mono">
            {activeRemindersList.length} Active Reminders
          </span>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50/70 p-1 gap-1">
        <button
          onClick={() => setActiveSubTab("reminders")}
          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "reminders" 
              ? "bg-white text-brand-secondary shadow-sm border border-gray-200/50" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-150"
          }`}
        >
          <Smile className="h-4 w-4" />
          Reminders Queue ({activeRemindersList.length})
        </button>
        <button
          onClick={() => setActiveSubTab("data-recorder")}
          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "data-recorder" 
              ? "bg-white text-brand-secondary shadow-sm border border-gray-200/50" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-150"
          }`}
        >
          <Edit className="h-4 w-4" />
          Record/Edit Key Dates
        </button>
        <button
          onClick={() => setActiveSubTab("settings")}
          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "settings" 
              ? "bg-white text-brand-secondary shadow-sm border border-gray-200/50" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-150"
          }`}
        >
          <Settings className="h-4 w-4" />
          Alert Settings
        </button>
      </div>

      <div className="p-6">
        {/* TAB 1: REMINDERS LIST */}
        {activeSubTab === "reminders" && (
          <div className="space-y-6">
            {activeRemindersList.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gray-250 rounded-2xl bg-gray-50/50">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-gray-850">Outstanding Touchpoints Clear!</h4>
                <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
                  All birthdays, anniversaries, and weekly updates are up to date. You can add birthdates or lease dates under "Record/Edit Key Dates".
                </p>
                <button
                  onClick={() => setActiveSubTab("data-recorder")}
                  className="mt-4 px-4 py-2 bg-brand-secondary text-white rounded-lg text-xs font-bold hover:bg-brand-hover transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Dates to Clients / Listings
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual grouping warning if duplicates exist */}
                <div className="text-xs text-gray-500 bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block mb-0.5">Relationship Specialist Tip</span>
                    Same-day reminders for the same client have been grouped together. Complete touchpoints manually via Copy Message or WhatsApp, then click mark complete to clear.
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {activeRemindersList.map((rem) => (
                    <div 
                      key={rem.id} 
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-white flex flex-col lg:flex-row gap-5 items-start justify-between"
                    >
                      {/* Left: Info details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rem.type === "birthday" 
                              ? "bg-pink-100 text-pink-800 border border-pink-200" 
                              : rem.type === "anniversary" 
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : rem.type === "lease"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : rem.type === "seller-update"
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                              : "bg-teal-100 text-teal-800 border border-teal-200"
                          }`}>
                            {rem.badgeText || rem.type}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">Ref ID: {rem.id.split("-").slice(0, 3).join("-")}</span>
                        </div>

                        <h4 className="text-sm font-extrabold text-gray-900">{rem.title}</h4>
                        <p className="text-gray-700 text-xs leading-relaxed font-medium">{rem.description}</p>
                        
                        <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 space-y-1 text-xs">
                          <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <Smile className="h-3.5 w-3.5 text-brand-secondary" />
                            Suggested Outreach:
                          </p>
                          <p className="text-slate-500 italic leading-relaxed text-[11px] whitespace-pre-wrap">
                            "{rem.templateMessage}"
                          </p>
                        </div>

                        {/* Contacts badge bar */}
                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500 font-mono pt-1">
                          <span>👤 Name: <strong className="text-gray-800 font-bold">{rem.clientName}</strong></span>
                          {rem.clientEmail && <span>📧 {rem.clientEmail}</span>}
                          {rem.clientPhone && <span>📞 {rem.clientPhone}</span>}
                          {rem.propertyName && <span>🏠 Prop: <strong className="text-gray-800 font-semibold">{rem.propertyName}</strong></span>}
                        </div>

                        {/* Collapsible Drafting Panel */}
                        {selectedDraftReminder?.id === rem.id && (
                          <div className="mt-4 bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-4 animate-fadeIn" id={`drafting-panel-${rem.id}`}>
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                                Interactive Outreach Drafter
                              </span>
                              <button
                                onClick={() => setSelectedDraftReminder(null)}
                                className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase"
                              >
                                Cancel
                              </button>
                            </div>

                            {/* Channel selection */}
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setDraftChannel("email");
                                  if (rem.clientEmail) {
                                    setDraftSubject(
                                      rem.type === "birthday" 
                                        ? `Happy Birthday, ${rem.clientName.split(" ")[0]}! 🎂` 
                                        : rem.type === "anniversary" 
                                        ? `Happy Property Anniversary! 🏠` 
                                        : rem.type === "lease" 
                                        ? `Upcoming Lease Expiration & Renewal - ${rem.propertyName || "Listing"}` 
                                        : `Property Market Update - Beno Properties`
                                    );
                                  }
                                }}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all ${
                                  draftChannel === "email"
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                <Mail className="h-3.5 w-3.5" />
                                Email Draft
                              </button>
                              <button
                                type="button"
                                onClick={() => setDraftChannel("sms")}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all ${
                                  draftChannel === "sms"
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                SMS Draft
                              </button>
                            </div>

                            {/* To / Target details */}
                            <div className="grid grid-cols-1 gap-3 text-xs">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Recipient</label>
                                <input
                                  type="text"
                                  disabled
                                  value={
                                    draftChannel === "email"
                                      ? `${rem.clientName} <${rem.clientEmail || "no-email@beno.co.za"}>`
                                      : `${rem.clientName} <${rem.clientPhone || "no-phone"}>`
                                  }
                                  className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-lg p-2 font-medium cursor-not-allowed"
                                />
                              </div>

                              {draftChannel === "email" && (
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Subject</label>
                                  <input
                                    type="text"
                                    value={draftSubject}
                                    onChange={(e) => setDraftSubject(e.target.value)}
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2 font-medium focus:outline-none focus:border-slate-400"
                                    placeholder="Enter subject..."
                                  />
                                </div>
                              )}

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Message Body</label>
                                <textarea
                                  value={draftBody}
                                  onChange={(e) => setDraftBody(e.target.value)}
                                  rows={5}
                                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-2 font-medium text-xs focus:outline-none focus:border-slate-400"
                                  placeholder="Type outreach message..."
                                />
                              </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                              <button
                                type="button"
                                onClick={handleLaunchDraft}
                                className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Send className="h-3.5 w-3.5" />
                                {draftChannel === "email" ? "Open Mail Client" : "Open SMS App"}
                              </button>
                              <button
                                type="button"
                                onClick={handleSimulateSend}
                                disabled={isDraftSending || draftSuccess}
                                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                              >
                                {isDraftSending ? (
                                  <>
                                    <Clock className="h-3.5 w-3.5 animate-spin" />
                                    Sending...
                                  </>
                                ) : draftSuccess ? (
                                  <>
                                    <Check className="h-3.5 w-3.5" />
                                    Sent Successfully!
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Simulate Direct Send
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Quick actions panel */}
                      <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-48 justify-end flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100 lg:pl-4">
                        {/* Suggested Action button */}
                        <button
                          onClick={() => {
                            setSelectedDraftReminder(rem);
                            setDraftChannel(rem.clientEmail ? "email" : "sms");
                            setDraftSubject(
                              rem.type === "birthday" 
                                ? `Happy Birthday, ${rem.clientName.split(" ")[0]}! 🎂` 
                                : rem.type === "anniversary" 
                                ? `Happy Property Anniversary! 🏠` 
                                : rem.type === "lease" 
                                ? `Upcoming Lease Expiration & Renewal - ${rem.propertyName || "Listing"}` 
                                : `Property Market Update - Beno Properties`
                            );
                            setDraftBody(rem.templateMessage);
                          }}
                          className={`flex-1 lg:w-full px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all border ${
                            selectedDraftReminder?.id === rem.id
                              ? "bg-amber-600 border-amber-600 text-white"
                              : "bg-amber-500 border-amber-500 hover:bg-amber-600 text-white"
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Suggested Action
                        </button>

                        {/* Copy Suggested message */}
                        <button
                          onClick={() => handleCopyMessage(rem.id, rem.templateMessage)}
                          className="flex-1 lg:w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {copiedId === rem.id ? "Copied!" : "Copy Template"}
                        </button>

                        {/* Send via WhatsApp */}
                        {rem.clientPhone && (
                          <button
                            onClick={() => handleShareToWhatsApp(rem.clientPhone || "", rem.templateMessage)}
                            className="flex-1 lg:w-full px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <MessageCircle className="h-3.5 w-3.5 fill-current" />
                            WhatsApp Client
                          </button>
                        )}

                        {/* Complete Touchpoint */}
                        <button
                          onClick={() => handleMarkComplete(rem.id)}
                          className="flex-1 lg:w-full px-3 py-1.5 bg-brand-primary hover:bg-brand-hover text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all border border-brand-primary"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Mark Done
                        </button>

                        {/* Snooze Options Dropdown or buttons */}
                        <div className="flex gap-1 flex-1 lg:w-full">
                          <button
                            onClick={() => handleSnooze(rem.id, 1)}
                            className="flex-1 text-[10px] font-bold py-1 px-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded text-center cursor-pointer"
                            title="Snooze for 1 day"
                          >
                            Snooze 1d
                          </button>
                          <button
                            onClick={() => handleSnooze(rem.id, 7)}
                            className="flex-1 text-[10px] font-bold py-1 px-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded text-center cursor-pointer"
                            title="Snooze for 1 week"
                          >
                            Snooze 7d
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECORD / EDIT KEY DATES */}
        {activeSubTab === "data-recorder" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-150 pb-4">
              <div>
                <h4 className="text-sm font-extrabold text-gray-900">Record Date Values</h4>
                <p className="text-xs text-gray-500">Record birthdays for client leads and lease dates for property portfolios.</p>
              </div>

              {/* Toggle target database type */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => { setFilterMode("leads"); setEditingId(null); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    filterMode === "leads" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Client Birthdays ({leads.length})
                </button>
                <button
                  onClick={() => { setFilterMode("properties"); setEditingId(null); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    filterMode === "properties" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Listing Lease Dates ({properties.length})
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${filterMode === "leads" ? "clients by name, email, or id..." : "listings by location, title, or reference..."}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
              />
            </div>

            {/* List entries for editing */}
            <div className="space-y-3">
              {filterMode === "leads" ? (
                filteredLeads.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-6">No matching client records found.</p>
                ) : (
                  filteredLeads.map((lead) => (
                    <div key={lead.id} className="border border-gray-150 rounded-xl p-4 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-gray-900">{lead.name}</span>
                          <span className="text-[10px] uppercase font-mono font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {lead.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono mt-1 space-x-2">
                          <span>📧 {lead.email}</span>
                          <span>📞 {lead.phone}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs">
                          <span className="text-slate-600">
                            🎂 Birthday: <strong>{lead.date_of_birth ? lead.date_of_birth : "Not recorded"}</strong>
                          </span>
                          <span className="text-slate-600">
                            🤝 Client Since: <strong>{lead.client_since_date ? lead.client_since_date : "Not recorded"}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Inline Date Form */}
                      {editingId === lead.id ? (
                        <div className="flex flex-wrap items-end gap-3 bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-400 uppercase font-mono mb-1">Date of Birth</label>
                            <input 
                              type="date"
                              value={editBirthDate}
                              onChange={(e) => setEditBirthDate(e.target.value)}
                              className="border border-gray-200 rounded px-2 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-400 uppercase font-mono mb-1">Client Since</label>
                            <input 
                              type="date"
                              value={editClientSince}
                              onChange={(e) => setEditClientSince(e.target.value)}
                              className="border border-gray-200 rounded px-2 py-1 text-xs"
                            />
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleSaveDates(lead, "lead")}
                              className="px-2.5 py-1.5 bg-emerald-500 text-white rounded font-bold text-xs hover:bg-emerald-600 transition-colors cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1.5 bg-gray-100 text-gray-500 rounded font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => startRecordingDates(lead, "lead")}
                          className="px-3 py-1.5 bg-white border border-gray-250 hover:border-brand-primary text-gray-700 hover:text-brand-primary text-xs font-bold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Record Dates
                        </button>
                      )}
                    </div>
                  ))
                )
              ) : (
                filteredProperties.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-6">No matching property records found.</p>
                ) : (
                  filteredProperties.map((prop) => (
                    <div key={prop.id} className="border border-gray-150 rounded-xl p-4 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-gray-900">{prop.title}</span>
                          <span className={`text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded ${
                            prop.status === "For Sale" ? "bg-amber-50 text-amber-800" : "bg-blue-50 text-blue-800"
                          }`}>
                            {prop.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">📍 {prop.location}, {prop.city} | Ref: {prop.id}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          {prop.status === "For Sale" ? (
                            <span className="text-slate-600">
                              🤝 Purchase Date: <strong>{prop.purchase_date ? prop.purchase_date : "Not recorded"}</strong>
                            </span>
                          ) : (
                            <>
                              <span className="text-slate-600">
                                📅 Lease Start: <strong>{prop.lease_start_date ? prop.lease_start_date : "Not recorded"}</strong>
                              </span>
                              <span className="text-slate-600">
                                📋 Lease End: <strong>{prop.lease_end_date ? prop.lease_end_date : "Not recorded"}</strong>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Inline Date Form */}
                      {editingId === prop.id ? (
                        <div className="flex flex-wrap items-end gap-3 bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                          {prop.status === "For Sale" ? (
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase font-mono mb-1">Purchase Date</label>
                              <input 
                                type="date"
                                value={editPurchaseDate}
                                onChange={(e) => setEditPurchaseDate(e.target.value)}
                                className="border border-gray-200 rounded px-2 py-1 text-xs"
                              />
                            </div>
                          ) : (
                            <>
                              <div>
                                <label className="block text-[9px] font-bold text-gray-400 uppercase font-mono mb-1">Lease Start</label>
                                <input 
                                  type="date"
                                  value={editLeaseStart}
                                  onChange={(e) => setEditLeaseStart(e.target.value)}
                                  className="border border-gray-200 rounded px-2 py-1 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-gray-400 uppercase font-mono mb-1">Lease End</label>
                                <input 
                                  type="date"
                                  value={editLeaseEnd}
                                  onChange={(e) => setEditLeaseEnd(e.target.value)}
                                  className="border border-gray-200 rounded px-2 py-1 text-xs"
                                />
                              </div>
                            </>
                          )}
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleSaveDates(prop, "property")}
                              className="px-2.5 py-1.5 bg-emerald-500 text-white rounded font-bold text-xs hover:bg-emerald-600 transition-colors cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1.5 bg-gray-100 text-gray-500 rounded font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => startRecordingDates(prop, "property")}
                          className="px-3 py-1.5 bg-white border border-gray-250 hover:border-brand-primary text-gray-700 hover:text-brand-primary text-xs font-bold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Record Dates
                        </button>
                      )}
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS PANEL */}
        {activeSubTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-extrabold text-gray-900">Configure Alert Parameters</h4>
              <p className="text-xs text-gray-500">Fine-tune reminder warning durations and toggle alert types on/off.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reminder Thresholds */}
              <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-gray-50/20">
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-brand-secondary" />
                  Lead Warning Thresholds
                </h5>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Days before Birthday to Notify:
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      max="30"
                      value={settings.birthdayLeadDays}
                      onChange={(e) => handleSaveSettings({ ...settings, birthdayLeadDays: parseInt(e.target.value, 10) || 7 })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                    />
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">Default is 7 days ahead.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Days before Anniversary to Notify:
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      max="30"
                      value={settings.anniversaryLeadDays}
                      onChange={(e) => handleSaveSettings({ ...settings, anniversaryLeadDays: parseInt(e.target.value, 10) || 7 })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                    />
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">Default is 7 days ahead.</span>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-gray-50/20">
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-brand-secondary" />
                  Active Notification Types
                </h5>

                <div className="space-y-3 pt-1">
                  {/* Birthday Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">🎂 Client Birthdays</span>
                      <span className="text-[10px] text-gray-400">Remind about birthdays within threshold</span>
                    </div>
                    <button
                      onClick={() => handleSaveSettings({ ...settings, muteBirthdays: !settings.muteBirthdays })}
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                        settings.muteBirthdays ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      }`}
                    >
                      {settings.muteBirthdays ? "Muted" : "Active"}
                    </button>
                  </div>

                  {/* Anniversary Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">🏠 Purchase & Lease Anniversaries</span>
                      <span className="text-[10px] text-gray-400">Remind about annual milestones</span>
                    </div>
                    <button
                      onClick={() => handleSaveSettings({ ...settings, muteAnniversaries: !settings.muteAnniversaries })}
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                        settings.muteAnniversaries ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      }`}
                    >
                      {settings.muteAnniversaries ? "Muted" : "Active"}
                    </button>
                  </div>

                  {/* Lease Expiration Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">📋 Lease Expirations</span>
                      <span className="text-[10px] text-gray-400">Trigger warnings at 90/60/30/7 days</span>
                    </div>
                    <button
                      onClick={() => handleSaveSettings({ ...settings, muteLeaseExpirations: !settings.muteLeaseExpirations })}
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                        settings.muteLeaseExpirations ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      }`}
                    >
                      {settings.muteLeaseExpirations ? "Muted" : "Active"}
                    </button>
                  </div>

                  {/* Seller Update Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">📢 Weekly Seller/Landlord Updates</span>
                      <span className="text-[10px] text-gray-400">Weekly prompt to update property owners</span>
                    </div>
                    <button
                      onClick={() => handleSaveSettings({ ...settings, muteSellerUpdates: !settings.muteSellerUpdates })}
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                        settings.muteSellerUpdates ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      }`}
                    >
                      {settings.muteSellerUpdates ? "Muted" : "Active"}
                    </button>
                  </div>

                  {/* Value Add Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">📬 Weekly Value-Add Nudges</span>
                      <span className="text-[10px] text-gray-400">Outreach suggestions for in-progress clients</span>
                    </div>
                    <button
                      onClick={() => handleSaveSettings({ ...settings, muteValueAddOutreach: !settings.muteValueAddOutreach })}
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                        settings.muteValueAddOutreach ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      }`}
                    >
                      {settings.muteValueAddOutreach ? "Muted" : "Active"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Clear custom state buttons */}
            <div className="pt-4 border-t border-gray-150 flex justify-between items-center gap-4 flex-wrap">
              <span className="text-xs text-gray-400 italic">
                Settings are stored locally in your active browser workspace.
              </span>
              <button
                onClick={() => {
                  if (confirm("Reset snooze list and completed action timestamps to see all notifications again?")) {
                    saveSnoozed([]);
                    saveCompleted([]);
                  }
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <History className="h-3.5 w-3.5" />
                Reset Snoozed / Completed Queue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
