import { useState, useEffect, useCallback } from "react";
import { Lead, Property, UserProfile } from "../types";

export interface ReminderNotification {
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
  targetDate?: string; // date of birth, purchase date, etc.
  daysRemaining?: number;
  badgeText?: string;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string if marked complete
  snoozedUntil?: string; // YYYY-MM-DD if snoozed
  lastSentDate?: string; // YYYY-MM-DD of the last triggered date
}

export function useReminderSystem(
  currentUser: UserProfile,
  leads: Lead[],
  properties: Property[]
) {
  // Main notification pool
  const [notifications, setNotifications] = useState<ReminderNotification[]>(() => {
    try {
      const stored = localStorage.getItem(`beno_reminder_notifications_${currentUser.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Event tracking to prevent duplicates and respect cadences
  const [lastSentDates, setLastSentDates] = useState<{ [eventKey: string]: string }>(() => {
    try {
      const stored = localStorage.getItem(`beno_last_sent_dates_${currentUser.id}`);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  // Save changes
  useEffect(() => {
    localStorage.setItem(`beno_reminder_notifications_${currentUser.id}`, JSON.stringify(notifications));
  }, [notifications, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`beno_last_sent_dates_${currentUser.id}`, JSON.stringify(lastSentDates));
  }, [lastSentDates, currentUser.id]);

  const getDaysUntilAnniversary = useCallback((dateStr: string, today: Date): { days: number; nextDate: Date } => {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return { days: -1, nextDate: new Date() };
    
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const nextAnniv = new Date(today.getFullYear(), month, day);
    nextAnniv.setHours(0, 0, 0, 0);
    
    const currentToday = new Date(today);
    currentToday.setHours(0, 0, 0, 0);

    if (nextAnniv.getTime() < currentToday.getTime()) {
      nextAnniv.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = nextAnniv.getTime() - currentToday.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return { days: diffDays, nextDate: nextAnniv };
  }, []);

  const getDaysDifference = useCallback((targetDateStr: string, today: Date): number => {
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const current = new Date(today);
    current.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - current.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  // Central checker function
  const checkReminderSystem = useCallback(() => {
    if (currentUser.role !== "agent" && currentUser.role !== "admin") return;

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    
    const triggeredEvents: ReminderNotification[] = [];
    const updatedLastSent = { ...lastSentDates };
    let hasSentUpdates = false;

    // Helper to calculate days difference between two YYYY-MM-DD strings
    const getDaysBetween = (d1: string, d2: string) => {
      const t1 = new Date(d1).getTime();
      const t2 = new Date(d2).getTime();
      return Math.round(Math.abs(t1 - t2) / (1000 * 60 * 60 * 24));
    };

    // 1. Birthdays (7-day cadence)
    leads.forEach((lead) => {
      if (lead.date_of_birth && lead.status !== "Closed" && lead.status !== "Lost") {
        const { days, nextDate } = getDaysUntilAnniversary(lead.date_of_birth, today);
        if (days >= 0 && days <= 7) {
          const year = nextDate.getFullYear();
          const eventKey = `birthday-${lead.id}-${year}`;
          
          if (!updatedLastSent[eventKey]) {
            const bdayDateText = nextDate.toLocaleDateString("en-ZA", { day: "numeric", month: "long" });
            triggeredEvents.push({
              id: eventKey,
              type: "birthday",
              title: `🎂 Client Birthday Warning (${days} Days)`,
              description: `${lead.name}'s birthday is in ${days === 0 ? "today!" : days === 1 ? "1 day" : `${days} days`} (${bdayDateText}).`,
              suggestedAction: `Send a celebratory message or call to maintain client delight.`,
              templateMessage: `Hi ${lead.name.split(" ")[0]}! Wishing you an incredible, blessed birthday from the Beno Properties team! May your year ahead be filled with joy, prosperity, and beautiful new spaces. Have a fantastic day! 🎂✨`,
              clientName: lead.name,
              clientEmail: lead.email,
              clientPhone: lead.phone,
              targetDate: lead.date_of_birth,
              daysRemaining: days,
              badgeText: days === 0 ? "TODAY" : days === 1 ? "TOMORROW" : `${days} Days`,
              createdAt: today.toISOString(),
              lastSentDate: todayStr
            });
            updatedLastSent[eventKey] = todayStr;
            hasSentUpdates = true;
          }
        }
      }
    });

    // 2. Anniversaries (purchase, lease start, or client_since)
    // 2.1. Property Anniversaries
    properties.forEach((prop) => {
      const anniversaryBase = prop.purchase_date || prop.lease_start_date;
      if (anniversaryBase) {
        const isLeaseAnniv = !!prop.lease_start_date && !prop.purchase_date;
        const { days, nextDate } = getDaysUntilAnniversary(anniversaryBase, today);
        
        if (days >= 0 && days <= 7) {
          const year = nextDate.getFullYear();
          const eventKey = `anniversary-prop-${prop.id}-${year}`;

          if (!updatedLastSent[eventKey]) {
            const leadMatch = leads.find((l) => l.propertyRefId === prop.id) || leads[0];
            const clientName = leadMatch ? leadMatch.name : "Property Client";
            const clientEmail = leadMatch ? leadMatch.email : undefined;
            const clientPhone = leadMatch ? leadMatch.phone : undefined;

            const yearDiff = nextDate.getFullYear() - parseInt(anniversaryBase.split("-")[0], 10);
            const suffix = yearDiff === 1 ? "1st" : yearDiff === 2 ? "2nd" : yearDiff === 3 ? "3rd" : `${yearDiff}th`;

            triggeredEvents.push({
              id: eventKey,
              type: "anniversary",
              title: `🏠 ${isLeaseAnniv ? "Lease" : "Purchase"} Anniversary (${days} Days)`,
              description: `Residency anniversary for ${prop.title} is in ${days} days. This marks their ${suffix} anniversary!`,
              suggestedAction: `Check in on their home satisfaction or rental feedback.`,
              templateMessage: `Hi ${clientName.split(" ")[0]}! Happy ${suffix} anniversary of ${isLeaseAnniv ? "making this beautiful space your home" : "buying your property"} at ${prop.location}! We hope you are still creating wonderful memories there. Let us know if you need any property assistance. - Beno Properties 🏠`,
              clientName,
              clientEmail,
              clientPhone,
              propertyName: prop.title,
              propertyId: prop.id,
              targetDate: anniversaryBase,
              daysRemaining: days,
              badgeText: `${suffix} Anniv.`,
              createdAt: today.toISOString(),
              lastSentDate: todayStr
            });
            updatedLastSent[eventKey] = todayStr;
            hasSentUpdates = true;
          }
        }
      }
    });

    // 2.2. Client Relationship Anniversaries (client_since_date)
    leads.forEach((lead) => {
      if (lead.client_since_date && lead.status !== "Closed" && lead.status !== "Lost") {
        const { days, nextDate } = getDaysUntilAnniversary(lead.client_since_date, today);
        if (days >= 0 && days <= 7) {
          const year = nextDate.getFullYear();
          const eventKey = `anniversary-lead-${lead.id}-${year}`;

          if (!updatedLastSent[eventKey]) {
            const yearDiff = nextDate.getFullYear() - parseInt(lead.client_since_date.split("-")[0], 10);
            const suffix = yearDiff === 1 ? "1st" : yearDiff === 2 ? "2nd" : yearDiff === 3 ? "3rd" : `${yearDiff}th`;

            triggeredEvents.push({
              id: eventKey,
              type: "anniversary",
              title: `🤝 Client Anniversary (${days} Days)`,
              description: `Anniversary of working with ${lead.name} is in ${days} days. This marks ${suffix} year since onboarding!`,
              suggestedAction: `Reach out with a short message thanking them for their continued partnership.`,
              templateMessage: `Hi ${lead.name.split(" ")[0]}! Happy ${suffix} anniversary since we started working together! It has been an absolute pleasure partnering with you on your property journey. Wishing you continued success! - Beno Properties Team 🤝`,
              clientName: lead.name,
              clientEmail: lead.email,
              clientPhone: lead.phone,
              targetDate: lead.client_since_date,
              daysRemaining: days,
              badgeText: `${suffix} Partnership`,
              createdAt: today.toISOString(),
              lastSentDate: todayStr
            });
            updatedLastSent[eventKey] = todayStr;
            hasSentUpdates = true;
          }
        }
      }
    });

    // 3. Lease Expirations (90, 60, 30, 7 days)
    properties.forEach((prop) => {
      if (prop.status === "To Rent" && prop.lease_end_date) {
        const daysRemaining = getDaysDifference(prop.lease_end_date, today);
        const intervals = [90, 60, 30, 7];
        const triggeredInterval = intervals.find(
          (interval) => daysRemaining <= interval && daysRemaining > 0
        );

        if (triggeredInterval !== undefined) {
          const eventKey = `lease-exp-${prop.id}-${triggeredInterval}`;

          if (!updatedLastSent[eventKey]) {
            const leadMatch = leads.find((l) => l.propertyRefId === prop.id && l.category === "Tenant") || leads[0];
            const clientName = leadMatch ? leadMatch.name : "Active Tenant";
            const clientEmail = leadMatch ? leadMatch.email : undefined;
            const clientPhone = leadMatch ? leadMatch.phone : undefined;

            triggeredEvents.push({
              id: eventKey,
              type: "lease",
              title: `📋 Lease Expiring in ${triggeredInterval} Days`,
              description: `The lease for "${prop.title}" in ${prop.location} is due to expire in ${daysRemaining} days (on ${prop.lease_end_date}).`,
              suggestedAction: `Discuss renewal options or schedule an exit inspection with ${clientName}.`,
              templateMessage: `Dear ${clientName.split(" ")[0]},\n\nHope you are well! We noted that your lease agreement for ${prop.location} is due to expire in ${daysRemaining} days (on ${prop.lease_end_date}). We would love to discuss your renewal options at your earliest convenience.\n\nWarm regards,\nBeno Properties Team`,
              clientName,
              clientEmail,
              clientPhone,
              propertyName: prop.title,
              propertyId: prop.id,
              targetDate: prop.lease_end_date,
              daysRemaining,
              badgeText: `${daysRemaining} Days`,
              createdAt: today.toISOString(),
              lastSentDate: todayStr
            });
            updatedLastSent[eventKey] = todayStr;
            hasSentUpdates = true;
          }
        }
      }
    });

    // 4. Seller / Landlord weekly update reminders (Weekly cadence)
    properties.forEach((prop) => {
      const eventKey = `seller-update-${prop.id}`;
      const lastSent = updatedLastSent[eventKey];

      // Trigger if never sent or sent >= 7 days ago
      if (!lastSent || getDaysBetween(todayStr, lastSent) >= 7) {
        // Identify owner/landlord lead
        const ownerLead = leads.find((l) => l.propertyRefId === prop.id && (l.category === "Seller" || l.type === "Landlord Listing")) || 
                          leads.find((l) => l.category === "Seller");
        const ownerName = ownerLead ? ownerLead.name : "Property Owner";
        const ownerEmail = ownerLead ? ownerLead.email : undefined;
        const ownerPhone = ownerLead ? ownerLead.phone : undefined;

        triggeredEvents.push({
          id: eventKey,
          type: "seller-update",
          title: `🏠 Weekly ${prop.status === "For Sale" ? "Seller" : "Landlord"} Status Update`,
          description: `It's time for your weekly listing feedback report to ${ownerName} for property "${prop.title}".`,
          suggestedAction: `Draft a listing performance report including latest viewings and inquiries.`,
          templateMessage: `Dear ${ownerName.split(" ")[0]},\n\nHere is your weekly listing performance update for your property at ${prop.location}:\n- Active Inquiries: 3 new leads this week\n- Viewer Impressions: High traction on Beno Portal\n- Show Days / Next Steps: Open house scheduled for Sunday.\n\nWe will keep you fully informed. Please let me know if you have any questions!`,
          clientName: ownerName,
          clientEmail: ownerEmail,
          clientPhone: ownerPhone,
          propertyName: prop.title,
          propertyId: prop.id,
          badgeText: "Weekly Update",
          createdAt: today.toISOString(),
          lastSentDate: todayStr
        });
        updatedLastSent[eventKey] = todayStr;
        hasSentUpdates = true;
      }
    });

    // 5. Weekly client "Value-Add" outreach (Weekly cadence)
    leads.forEach((lead) => {
      if (lead.status !== "Closed" && lead.status !== "Lost") {
        const eventKey = `value-add-${lead.id}`;
        const lastSent = updatedLastSent[eventKey];

        if (!lastSent || getDaysBetween(todayStr, lastSent) >= 7) {
          const focusLocation = lead.propertyRefId ? (properties.find(p => p.id === lead.propertyRefId)?.location || "Gauteng") : "Johannesburg";
          
          triggeredEvents.push({
            id: eventKey,
            type: "value-add",
            title: `📬 Weekly Value-Add Outreach`,
            description: `Keep the relationship warm with ${lead.name} by sharing real estate insights or market updates.`,
            suggestedAction: `Share local suburb trends or home insights to remain top of mind.`,
            templateMessage: `Hi ${lead.name.split(" ")[0]}! Just checking in with some quick value this week. Property values in ${focusLocation} are showing great resilience with buyers seeking security and backup energy features. Here is our quick list of tips for optimizing property equity this quarter! Let me know if you'd like the full report! 📈 - Beno Properties`,
            clientName: lead.name,
            clientEmail: lead.email,
            clientPhone: lead.phone,
            badgeText: "Value Nudge",
            createdAt: today.toISOString(),
            lastSentDate: todayStr
          });
          updatedLastSent[eventKey] = todayStr;
          hasSentUpdates = true;
        }
      }
    });

    // Clean up old completed statuses of weekly events so they can trigger again next week
    setNotifications((prev) => {
      const cleaned = prev.map((notif) => {
        if (notif.completedAt && (notif.type === "seller-update" || notif.type === "value-add")) {
          const completedDays = getDaysBetween(todayStr, notif.completedAt.slice(0, 10));
          if (completedDays >= 7) {
            // strip completion to allow re-trigger/re-alert
            return { ...notif, completedAt: undefined, snoozedUntil: undefined };
          }
        }
        return notif;
      });

      // Insert any newly triggered events
      triggeredEvents.forEach((newEvent) => {
        if (!cleaned.some((item) => item.id === newEvent.id)) {
          cleaned.unshift(newEvent);
        } else {
          // If already in list but completed over a week ago, reset completion so it appears active
          const idx = cleaned.findIndex((item) => item.id === newEvent.id);
          if (idx !== -1) {
            const existing = cleaned[idx];
            if (existing.completedAt) {
              const compDays = getDaysBetween(todayStr, existing.completedAt.slice(0, 10));
              if (compDays >= 7) {
                cleaned[idx] = { ...newEvent, completedAt: undefined, snoozedUntil: undefined };
              }
            }
          }
        }
      });

      return cleaned;
    });

    if (hasSentUpdates) {
      setLastSentDates(updatedLastSent);
    }
  }, [currentUser.role, leads, properties, lastSentDates, getDaysUntilAnniversary, getDaysDifference]);

  // Daily checks (or simulation)
  useEffect(() => {
    checkReminderSystem();

    const interval = setInterval(() => {
      checkReminderSystem();
    }, 15000); // 15 seconds dynamic check

    return () => clearInterval(interval);
  }, [checkReminderSystem]);

  // Action: Mark Complete
  const markComplete = useCallback((id: string) => {
    const todayISO = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, completedAt: todayISO } : notif
      )
    );
  }, []);

  // Action: Snooze
  const snooze = useCallback((id: string, days: number) => {
    const today = new Date();
    today.setDate(today.getDate() + days);
    const snoozeUntilStr = today.toISOString().slice(0, 10);

    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, snoozedUntil: snoozeUntilStr } : notif
      )
    );
  }, []);

  // Action: Reset System
  const resetSystem = useCallback(() => {
    setNotifications([]);
    setLastSentDates({});
    try {
      localStorage.removeItem(`beno_reminder_notifications_${currentUser.id}`);
      localStorage.removeItem(`beno_last_sent_dates_${currentUser.id}`);
    } catch (e) {}
  }, [currentUser.id]);

  // Filter displayed active notifications (non-completed and non-snoozed)
  const todayStr = new Date().toISOString().slice(0, 10);
  const activeNotifications = notifications.filter((notif) => {
    if (notif.completedAt) return false;
    if (notif.snoozedUntil && notif.snoozedUntil > todayStr) return false;
    return true;
  });

  return {
    notifications: activeNotifications,
    allNotifications: notifications,
    markComplete,
    snooze,
    resetSystem,
    checkReminderSystem,
  };
}
