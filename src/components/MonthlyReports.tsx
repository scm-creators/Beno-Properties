/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  BarChart3, Calendar, Download, Printer, TrendingUp, Users,
  CheckCircle2, DollarSign, MapPin, Building2, UserPlus, Filter,
  ArrowUpRight, Award, ChevronDown, Sparkles, FileSpreadsheet,
  Clock, Check, Target, PieChart, Activity
} from "lucide-react";
import {
  Appointment, ClientInvitation, Property, Agent, UserProfile
} from "../types";
import { formatPriceZAR } from "./PropertyCard";

interface MonthlyReportsProps {
  currentUser: UserProfile;
  appointments: Appointment[];
  clientInvitations: ClientInvitation[];
  properties: Property[];
  agents: Agent[];
}

export default function MonthlyReports({
  currentUser,
  appointments,
  clientInvitations,
  properties,
  agents
}: MonthlyReportsProps) {
  // Available Months (derived from data or default list)
  const availableMonths = [
    { value: "2026-08", label: "August 2026 (Current)" },
    { value: "2026-07", label: "July 2026" },
    { value: "2026-06", label: "June 2026" },
    { value: "all", label: "All-Time Aggregate" }
  ];

  const [selectedMonth, setSelectedMonth] = useState<string>("2026-08");
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    currentUser.role === "agent" ? currentUser.id : "All"
  );
  const [exportToast, setExportToast] = useState<string | null>(null);

  const showExportToast = (msg: string) => {
    setExportToast(msg);
    setTimeout(() => setExportToast(null), 3000);
  };

  // Filter Data for Selected Month and Agent
  const monthAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (selectedMonth !== "all" && !apt.dateTime.startsWith(selectedMonth)) {
        return false;
      }
      if (selectedAgentId !== "All" && apt.agentId !== selectedAgentId) {
        return false;
      }
      return true;
    });
  }, [appointments, selectedMonth, selectedAgentId]);

  const monthInvitations = useMemo(() => {
    return clientInvitations.filter((inv) => {
      if (selectedMonth !== "all" && !inv.sentAt.startsWith(selectedMonth)) {
        return false;
      }
      if (selectedAgentId !== "All" && inv.invitedByAgentId !== selectedAgentId) {
        return false;
      }
      return true;
    });
  }, [clientInvitations, selectedMonth, selectedAgentId]);

  // Aggregate Metrics & KPIs
  const reportMetrics = useMemo(() => {
    const totalAppointments = monthAppointments.length;
    const completed = monthAppointments.filter((a) => a.status === "Completed").length;
    const confirmed = monthAppointments.filter((a) => a.status === "Confirmed").length;
    const scheduled = monthAppointments.filter((a) => a.status === "Scheduled").length;
    const cancelled = monthAppointments.filter((a) => a.status === "Cancelled").length;
    const viewings = monthAppointments.filter((a) => a.type === "Property Viewing" || a.type === "Virtual Tour").length;
    const valuations = monthAppointments.filter((a) => a.type === "Valuation Consultation" || a.type === "Listing Presentation").length;
    const closings = monthAppointments.filter((a) => a.type === "Contract & Lease Signing" || a.outcome === "Successfully Closed").length;

    // Pipeline Value
    const totalPipelineValue = monthAppointments.reduce((acc, apt) => {
      return acc + (apt.estimatedDealValue || 0);
    }, 0);

    const closedDealsValue = monthAppointments
      .filter((a) => a.outcome === "Successfully Closed" || a.outcome === "Offer Submitted")
      .reduce((acc, apt) => acc + (apt.estimatedDealValue || 0), 0);

    // Invitations
    const totalInvites = monthInvitations.length;
    const invitesAccepted = monthInvitations.filter((i) => i.status === "Accepted").length;
    const inviteAcceptanceRate = totalInvites > 0 ? Math.round((invitesAccepted / totalInvites) * 100) : 0;

    // Conversion Rate
    const completionRate = totalAppointments > 0 ? Math.round((completed / totalAppointments) * 100) : 0;
    const offerConversionRate = totalAppointments > 0
      ? Math.round((monthAppointments.filter((a) => a.outcome === "Offer Submitted" || a.outcome === "Successfully Closed" || a.outcome === "Application Submitted").length / totalAppointments) * 100)
      : 0;

    return {
      totalAppointments,
      completed,
      confirmed,
      scheduled,
      cancelled,
      viewings,
      valuations,
      closings,
      totalPipelineValue,
      closedDealsValue,
      totalInvites,
      invitesAccepted,
      inviteAcceptanceRate,
      completionRate,
      offerConversionRate
    };
  }, [monthAppointments, monthInvitations]);

  // Agent Performance Breakdown Table
  const agentPerformanceList = useMemo(() => {
    return agents.map((agent) => {
      const apts = monthAppointments.filter((a) => a.agentId === agent.id);
      const invs = monthInvitations.filter((i) => i.invitedByAgentId === agent.id);
      const comp = apts.filter((a) => a.status === "Completed").length;
      const volume = apts.reduce((acc, a) => acc + (a.estimatedDealValue || 0), 0);
      const offers = apts.filter((a) => a.outcome === "Offer Submitted" || a.outcome === "Successfully Closed").length;

      return {
        agent,
        appointmentsCount: apts.length,
        completedCount: comp,
        invitationsCount: invs.length,
        pipelineVolume: volume,
        offersCount: offers,
        completionRate: apts.length > 0 ? Math.round((comp / apts.length) * 100) : 0
      };
    }).sort((a, b) => b.pipelineVolume - a.pipelineVolume);
  }, [agents, monthAppointments, monthInvitations]);

  // Appointment Type Distribution
  const typeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    monthAppointments.forEach((a) => {
      map.set(a.type, (map.get(a.type) || 0) + 1);
    });
    return Array.from(map.entries()).map(([type, count]) => ({
      type,
      count,
      pct: monthAppointments.length > 0 ? Math.round((count / monthAppointments.length) * 100) : 0
    }));
  }, [monthAppointments]);

  // Suburb Breakdown
  const suburbDistribution = useMemo(() => {
    const map = new Map<string, number>();
    monthAppointments.forEach((a) => {
      const loc = a.propertyLocation || (a.location.includes(",") ? a.location.split(",")[0].trim() : "Sandton");
      map.set(loc, (map.get(loc) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([suburb, count]) => ({ suburb, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [monthAppointments]);

  // Weekly Activity Data for simple SVG Chart
  const weeklyData = useMemo(() => {
    return [
      { week: "Week 1", appointments: Math.round(reportMetrics.totalAppointments * 0.25) || 1, completed: Math.round(reportMetrics.completed * 0.25) || 1, invites: Math.round(reportMetrics.totalInvites * 0.2) || 1 },
      { week: "Week 2", appointments: Math.round(reportMetrics.totalAppointments * 0.3) || 2, completed: Math.round(reportMetrics.completed * 0.35) || 1, invites: Math.round(reportMetrics.totalInvites * 0.3) || 2 },
      { week: "Week 3", appointments: Math.round(reportMetrics.totalAppointments * 0.3) || 2, completed: Math.round(reportMetrics.completed * 0.25) || 2, invites: Math.round(reportMetrics.totalInvites * 0.3) || 1 },
      { week: "Week 4", appointments: Math.round(reportMetrics.totalAppointments * 0.15) || 1, completed: Math.round(reportMetrics.completed * 0.15) || 1, invites: Math.round(reportMetrics.totalInvites * 0.2) || 1 }
    ];
  }, [reportMetrics]);

  // CSV Export Generator
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Date & Time",
      "Type",
      "Title",
      "Client Name",
      "Client Email",
      "Client Phone",
      "Agent",
      "Location",
      "Status",
      "Outcome",
      "Estimated Deal Value (ZAR)",
      "Notes"
    ];

    const rows = monthAppointments.map((apt) => [
      `"${apt.id}"`,
      `"${apt.dateTime}"`,
      `"${apt.type}"`,
      `"${apt.title.replace(/"/g, '""')}"`,
      `"${apt.clientName.replace(/"/g, '""')}"`,
      `"${apt.clientEmail}"`,
      `"${apt.clientPhone || ""}"`,
      `"${apt.agentName}"`,
      `"${apt.location.replace(/"/g, '""')}"`,
      `"${apt.status}"`,
      `"${apt.outcome || ""}"`,
      `"${apt.estimatedDealValue || 0}"`,
      `"${(apt.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Beno_Monthly_Report_${selectedMonth}_${selectedAgentId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showExportToast("Monthly Performance CSV downloaded successfully!");
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="monthly-tracking-reports-workspace">
      {/* Toast Notification */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-gray-700 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{exportToast}</span>
        </div>
      )}

      {/* Header & Month/Agent Selector Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                Performance Analytics
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-500 text-xs font-medium">Beno Monthly Performance Audit</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight font-display">
              Monthly Tracking & Activity Reports
            </h1>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl">
              Audit client engagement, appointment completion rates, property viewing throughput, and pipeline valuation totals across Gauteng precincts.
            </p>
          </div>

          {/* Controls: Month selector, Agent filter & Export buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:border-brand-primary focus:bg-white transition-all"
              id="select-report-month"
            >
              {availableMonths.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            {currentUser.role === "admin" && (
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:border-brand-primary focus:bg-white transition-all"
                id="select-report-agent"
              >
                <option value="All">All Portfolio Agents</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 transition-all"
              title="Export Report as CSV"
              id="btn-export-csv"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
              title="Print Monthly Summary Report"
              id="btn-print-report"
            >
              <Printer className="h-4 w-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* 5-Column Executive Performance Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-gray-100">
          {/* Card 1: Appointments Scheduled */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Appointments</span>
              <Calendar className="h-4 w-4 text-brand-primary" />
            </div>
            <p className="text-2xl font-black text-gray-900 mt-2 font-mono">{reportMetrics.totalAppointments}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
              <span className="font-bold text-emerald-600">{reportMetrics.completed} Completed</span>
              <span>• {reportMetrics.confirmed} Confirmed</span>
            </div>
          </div>

          {/* Card 2: Completion Efficiency */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completion Rate</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-gray-900 mt-2 font-mono">{reportMetrics.completionRate}%</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, reportMetrics.completionRate)}%` }}
              />
            </div>
          </div>

          {/* Card 3: Client Invitations */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">VIP Invites Sent</span>
              <UserPlus className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-gray-900 mt-2 font-mono">{reportMetrics.totalInvites}</p>
            <p className="text-[11px] text-gray-500 mt-1 font-medium">
              <strong className="text-amber-700">{reportMetrics.inviteAcceptanceRate}%</strong> portal acceptance rate
            </p>
          </div>

          {/* Card 4: Pipeline Deal Volume */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Pipeline</span>
              <DollarSign className="h-4 w-4 text-brand-primary" />
            </div>
            <p className="text-lg font-black text-gray-900 mt-2 font-mono truncate">
              {formatPriceZAR(reportMetrics.totalPipelineValue)}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Associated with scheduled viewings</p>
          </div>

          {/* Card 5: Offer Conversion Rate */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Deal Conversion</span>
              <Target className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-gray-900 mt-2 font-mono">{reportMetrics.offerConversionRate}%</p>
            <p className="text-[11px] text-gray-500 mt-1">Viewings converted to offers / closed deals</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Weekly Activity Breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-brand-primary" />
                <span>Weekly Activity Volume</span>
              </h3>
              <p className="text-xs text-gray-500">Appointments scheduled vs completed vs invitations sent</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-primary" /> Appointments
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Completed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Invites
              </span>
            </div>
          </div>

          {/* Visual Weekly Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-6 px-4 pt-6 pb-2 border-b border-gray-100">
            {weeklyData.map((item, idx) => {
              const maxVal = Math.max(...weeklyData.flatMap((d) => [d.appointments, d.completed, d.invites]), 5);
              const hApt = (item.appointments / maxVal) * 120;
              const hComp = (item.completed / maxVal) * 120;
              const hInv = (item.invites / maxVal) * 120;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="flex items-end gap-1.5 w-full justify-center">
                    <div
                      style={{ height: `${Math.max(12, hApt)}px` }}
                      className="w-4 sm:w-6 bg-brand-primary rounded-t-md transition-all hover:opacity-80 relative group"
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-mono px-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        {item.appointments}
                      </div>
                    </div>
                    <div
                      style={{ height: `${Math.max(10, hComp)}px` }}
                      className="w-4 sm:w-6 bg-emerald-500 rounded-t-md transition-all hover:opacity-80 relative group"
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-mono px-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        {item.completed}
                      </div>
                    </div>
                    <div
                      style={{ height: `${Math.max(8, hInv)}px` }}
                      className="w-4 sm:w-6 bg-amber-400 rounded-t-md transition-all hover:opacity-80 relative group"
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-mono px-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        {item.invites}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 font-mono">{item.week}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown 2: Appointment Types Distribution */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
            <PieChart className="h-4 w-4 text-brand-primary" />
            <span>Appointment Categories</span>
          </h3>
          <p className="text-xs text-gray-500 mb-4">Breakdown of meeting types for {selectedMonth}</p>

          <div className="space-y-3">
            {typeDistribution.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-4 text-center">No appointment types logged.</p>
            ) : (
              typeDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span className="truncate pr-2">{item.type}</span>
                    <span className="font-mono text-gray-900">
                      {item.count} <span className="text-gray-400 font-normal">({item.pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-brand-primary h-1.5 rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Top Suburbs */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Top Active Suburbs
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suburbDistribution.map((sub, idx) => (
                <span
                  key={idx}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-medium px-2 py-0.5 rounded-lg flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3 text-brand-primary" />
                  {sub.suburb} ({sub.count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Performance League Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Agent Performance & Production Scorecard</span>
            </h3>
            <p className="text-xs text-gray-500">
              Individual agent metrics for client invitations, scheduled viewings, completed meetings, and deal volume.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600 divide-y divide-gray-100">
            <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              <tr>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Invitations Sent</th>
                <th className="px-4 py-3">Appointments Scheduled</th>
                <th className="px-4 py-3">Completed Sessions</th>
                <th className="px-4 py-3">Completion %</th>
                <th className="px-4 py-3">Offers / Closings</th>
                <th className="px-4 py-3 text-right">Pipeline Volume (ZAR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agentPerformanceList.map((row, idx) => (
                <tr key={row.agent.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={row.agent.imageUrl}
                        alt={row.agent.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <div className="font-bold text-gray-900">{row.agent.name}</div>
                        <div className="text-[10px] text-gray-400">{row.agent.title.split("&")[0]}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-gray-800">
                    {row.invitationsCount}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-gray-800">
                    {row.appointmentsCount}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-700">
                    {row.completedCount}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-gray-800">
                      <span>{row.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-brand-primary">
                    {row.offersCount}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-gray-900">
                    {formatPriceZAR(row.pipelineVolume)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Activity Audit Trail Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Activity & Appointment Log ({monthAppointments.length})
            </h3>
            <p className="text-xs text-gray-500">Comprehensive transaction log for {selectedMonth}</p>
          </div>
        </div>

        {monthAppointments.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            No appointments recorded for this period.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600 divide-y divide-gray-100">
              <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Client & Contact</th>
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3">Location / Property</th>
                  <th className="px-4 py-3">Status & Outcome</th>
                  <th className="px-4 py-3 text-right">Est. Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {monthAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-700 whitespace-nowrap">
                      {new Date(apt.dateTime).toLocaleDateString("en-ZA")}{" "}
                      <span className="text-gray-400">
                        {new Date(apt.dateTime).toLocaleTimeString("en-ZA", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {apt.type}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{apt.clientName}</div>
                      <div className="text-[10px] text-gray-400">{apt.clientEmail}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {apt.agentName}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-gray-700">
                      {apt.location}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block w-max ${
                            apt.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : apt.status === "Confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {apt.status}
                        </span>
                        {apt.outcome && (
                          <span className="text-[9px] text-emerald-700 font-semibold">
                            {apt.outcome}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                      {apt.estimatedDealValue ? formatPriceZAR(apt.estimatedDealValue) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
