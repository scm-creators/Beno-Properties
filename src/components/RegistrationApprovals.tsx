/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Search,
  Filter,
  AlertTriangle,
  Mail,
  Phone,
  Briefcase,
  Home,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Calendar,
  MessageSquare
} from "lucide-react";
import { UserProfile, ApprovalStatus, UserRole } from "../types";

interface RegistrationApprovalsProps {
  users: UserProfile[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string, reason?: string) => void;
  onRevertPendingUser: (userId: string) => void;
}

export default function RegistrationApprovals({
  users,
  onApproveUser,
  onRejectUser,
  onRevertPendingUser,
}: RegistrationApprovalsProps) {
  const [filterTab, setFilterTab] = useState<"pending" | "all" | "agents" | "landlords" | "approved" | "rejected">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectingUserId, setRejectingUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionFeedback, setActionFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setActionFeedback({ text, type });
    setTimeout(() => {
      setActionFeedback(null);
    }, 4000);
  };

  // Only consider Agent and Landlord users for approval workflows
  const approvalEligibleUsers = users.filter((u) => u.role === "agent" || u.role === "landlord");

  // Summary Metrics
  const pendingCount = approvalEligibleUsers.filter(
    (u) => u.approvalStatus === "pending"
  ).length;

  const approvedAgentsCount = approvalEligibleUsers.filter(
    (u) => u.role === "agent" && (u.approvalStatus === "approved" || !u.approvalStatus)
  ).length;

  const approvedLandlordsCount = approvalEligibleUsers.filter(
    (u) => u.role === "landlord" && (u.approvalStatus === "approved" || !u.approvalStatus)
  ).length;

  const rejectedCount = approvalEligibleUsers.filter(
    (u) => u.approvalStatus === "rejected"
  ).length;

  // Filtered List
  const filteredUsers = approvalEligibleUsers.filter((u) => {
    const status: ApprovalStatus = u.approvalStatus || "approved";

    // Tab filter
    if (filterTab === "pending" && status !== "pending") return false;
    if (filterTab === "approved" && status !== "approved") return false;
    if (filterTab === "rejected" && status !== "rejected") return false;
    if (filterTab === "agents" && u.role !== "agent") return false;
    if (filterTab === "landlords" && u.role !== "landlord") return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = (u.phone || "").toLowerCase().includes(q);
      const matchTitle = (u.title || "").toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchTitle;
    }

    return true;
  });

  const handleApprove = (userId: string, userName: string) => {
    onApproveUser(userId);
    showFeedback(`${userName} was successfully approved and full platform permissions are now active.`);
  };

  const handleConfirmReject = (userId: string, userName: string) => {
    onRejectUser(userId, rejectionReason.trim() || "Does not meet current verification standards.");
    setRejectingUserId(null);
    setRejectionReason("");
    showFeedback(`Registration for ${userName} was declined.`, "error");
  };

  const handleRevert = (userId: string, userName: string) => {
    onRevertPendingUser(userId);
    showFeedback(`${userName} has been reverted to Pending Review.`);
  };

  return (
    <div className="space-y-6" id="registration-approvals-panel">
      {/* Top Banner / Headline */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/60 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs font-mono text-amber-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              PPRA Regulatory Compliance & Quality Control
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-tight font-bold">
              Agent & Landlord Registration Approvals
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Review and vet newly registered agents and landlords before granting full property listing authority, public directory visibility, and tenant vetting permissions.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[100px] flex-1 md:flex-initial">
              <span className={`block text-2xl font-bold font-mono ${pendingCount > 0 ? "text-amber-400 animate-pulse" : "text-slate-300"}`}>
                {pendingCount}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Pending Review
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[100px] flex-1 md:flex-initial">
              <span className="block text-2xl font-bold font-mono text-emerald-400">
                {approvedAgentsCount}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Active Agents
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[100px] flex-1 md:flex-initial">
              <span className="block text-2xl font-bold font-mono text-blue-400">
                {approvedLandlordsCount}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Landlords
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center justify-between border shadow-sm transition-all ${
            actionFeedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-rose-50 text-rose-900 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionFeedback.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0" />
            )}
            <span className="font-semibold text-xs sm:text-sm">{actionFeedback.text}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Controls: Search & Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Filter Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-1.5" id="approval-filter-tabs">
            <button
              onClick={() => setFilterTab("pending")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                filterTab === "pending"
                  ? "bg-amber-500 text-slate-950 font-extrabold shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Pending Review ({pendingCount})
            </button>
            <button
              onClick={() => setFilterTab("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                filterTab === "all"
                  ? "bg-brand-primary text-white font-extrabold shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({approvalEligibleUsers.length})
            </button>
            <button
              onClick={() => setFilterTab("agents")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                filterTab === "agents"
                  ? "bg-brand-primary text-white font-extrabold shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              Agents
            </button>
            <button
              onClick={() => setFilterTab("landlords")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                filterTab === "landlords"
                  ? "bg-brand-primary text-white font-extrabold shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              Landlords
            </button>
            <button
              onClick={() => setFilterTab("approved")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                filterTab === "approved"
                  ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              Approved
            </button>
            <button
              onClick={() => setFilterTab("rejected")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                filterTab === "rejected"
                  ? "bg-rose-600 text-white font-extrabold shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <X className="h-3.5 w-3.5" />
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name, email, phone..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-brand-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Registrations List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-4">
          <div className="mx-auto w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircle className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight">
              {filterTab === "pending"
                ? "No Registrations Pending Approval"
                : "No Registrations Match Filter"}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {filterTab === "pending"
                ? "All registered Agents and Landlords have been processed. New applicant submissions will appear here automatically for review."
                : "Try selecting another status tab or clear the search filter above."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4" id="registrations-cards-container">
          {filteredUsers.map((user) => {
            const status: ApprovalStatus = user.approvalStatus || "approved";
            const isPending = status === "pending";
            const isApproved = status === "approved";
            const isRejected = status === "rejected";

            return (
              <div
                key={user.id}
                id={`approval-card-${user.id}`}
                className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 space-y-4 shadow-sm hover:shadow-md ${
                  isPending
                    ? "border-amber-300 bg-gradient-to-r from-amber-50/40 via-white to-white"
                    : isRejected
                    ? "border-rose-200 bg-rose-50/20"
                    : "border-gray-200"
                }`}
              >
                {/* Header Row: User Info & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-start gap-3.5">
                    {/* User Avatar / Initials */}
                    <div className="relative">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                            user.role === "agent"
                              ? "bg-brand-primary text-white"
                              : "bg-purple-700 text-white"
                          }`}
                        >
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      {isPending && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 border-2 border-white rounded-full animate-ping" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-gray-900 tracking-tight">
                          {user.name}
                        </h4>
                        {/* Role pill */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.role === "agent"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {user.role === "agent" ? "👔 Agent Applicant" : "🏡 Landlord"}
                        </span>
                      </div>

                      {user.title && (
                        <p className="text-xs text-gray-500 font-mono font-medium">
                          {user.title}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="flex items-center gap-2">
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wide">
                        <Clock className="h-3.5 w-3.5 text-amber-600 animate-spin" />
                        Pending Admin Approval
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wide">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        Approved & Active
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-900 border border-rose-300 rounded-full text-xs font-bold uppercase tracking-wide">
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        Registration Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Details: Contact, Dates, Bio */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <a href={`mailto:${user.email}`} className="text-brand-primary hover:underline font-mono">
                        {user.email}
                      </a>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span>Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    {user.reviewedAt && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Reviewed: {new Date(user.reviewedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Specializations / Role Notes */}
                  <div>
                    {user.specialization && user.specialization.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.specialization.map((spec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-md text-[10px]"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No specializations specified</span>
                    )}
                  </div>
                </div>

                {/* Agent Bio / Notes */}
                {user.bio && (
                  <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed border border-gray-150">
                    <p className="font-bold text-[10px] uppercase text-gray-500 tracking-wider mb-1">
                      Applicant Bio & Qualifications:
                    </p>
                    <p>{user.bio}</p>
                  </div>
                )}

                {/* Rejection Note if exists */}
                {isRejected && user.approvalNotes && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                    <p className="font-bold text-[10px] uppercase text-rose-600 tracking-wider mb-0.5">
                      Admin Rejection Notes:
                    </p>
                    <p>{user.approvalNotes}</p>
                  </div>
                )}

                {/* Rejection Form Input Modal/Box */}
                {rejectingUserId === user.id && (
                  <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-rose-900 uppercase">
                        Reason for Declining {user.name}
                      </h5>
                      <button
                        onClick={() => setRejectingUserId(null)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Incomplete FICA documentation or invalid PPRA candidate fidelity certificate."
                      className="w-full bg-white border border-rose-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setRejectingUserId(null)}
                        className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmReject(user.id, user.name)}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

                {/* Admin Actions Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                  {isPending && (
                    <>
                      <button
                        onClick={() => setRejectingUserId(user.id)}
                        className="px-4 py-2 border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="h-4 w-4 text-rose-600" />
                        Reject Application
                      </button>
                      <button
                        onClick={() => handleApprove(user.id, user.name)}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md flex items-center gap-1.5"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve {user.role === "agent" ? "Agent" : "Landlord"}
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <button
                      onClick={() => handleRevert(user.id, user.name)}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5"
                      title="Revert status back to pending"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-gray-500" />
                      Revert to Pending
                    </button>
                  )}

                  {isRejected && (
                    <button
                      onClick={() => handleApprove(user.id, user.name)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4" />
                      Re-Approve Registration
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
