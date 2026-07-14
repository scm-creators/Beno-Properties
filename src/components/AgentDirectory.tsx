/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Phone, Mail, Award, CheckCircle, ArrowRight } from "lucide-react";
import { Agent } from "../types";

interface AgentDirectoryProps {
  agents: Agent[];
  onContactClick: (agent: Agent) => void;
}

export default function AgentDirectory({ agents, onContactClick }: AgentDirectoryProps) {
  return (
    <div className="w-full space-y-10" id="agent-directory">
      <div className="text-center max-w-2xl mx-auto" id="agents-intro">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
          Meet Our Team of Professionals
        </h2>
        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
          At Beno Properties, our specialist advisors pair extensive local area insights (Gauteng markets) with a deep, uncompromising focus on client advocacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="agents-grid">
        {agents.map((agent) => (
          <div
            key={agent.id}
            id={`agent-card-${agent.id}`}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start"
          >
            {/* Agent Photo */}
            <div className="relative w-full sm:w-40 aspect-square sm:h-40 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0" id={`agent-photo-container-${agent.id}`}>
              <img
                src={agent.imageUrl}
                alt={agent.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                id={`agent-photo-${agent.id}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
            </div>

            {/* Agent Body Info */}
            <div className="flex-1 flex flex-col justify-between h-full" id={`agent-info-${agent.id}`}>
              <div className="space-y-3">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-brand-secondary uppercase font-bold block mb-0.5">
                    Consultant Profile
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium font-mono">
                    {agent.title}
                  </p>
                </div>

                {/* Specializations list */}
                <div className="flex flex-wrap gap-1.5 pt-1" id={`agent-specialties-${agent.id}`}>
                  {agent.specialization.map((spec) => (
                    <span
                      key={spec}
                      className="text-[10px] font-semibold text-brand-primary bg-brand-primary/10 border border-brand-primary/10 rounded-md px-2 py-0.5"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <p className="text-gray-500 text-xs leading-relaxed whitespace-pre-wrap break-words pt-1">
                  {agent.bio}
                </p>
              </div>

              {/* Contacts Block */}
              <div className="pt-4 border-t border-gray-250 mt-4 space-y-2.5" id={`agent-contacts-${agent.id}`}>
                <a
                  href={`tel:${agent.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2 text-xs font-mono text-gray-600 hover:text-brand-secondary transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  <span>{agent.phone}</span>
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center gap-2 text-xs font-mono text-gray-600 hover:text-brand-secondary transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <span>{agent.email}</span>
                </a>
              </div>
            </div>
          </div>
        ))}
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
