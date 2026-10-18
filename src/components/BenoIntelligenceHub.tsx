/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MapPin, Globe, Sparkles, Navigation, Building2, Search, ArrowRight } from "lucide-react";
import NeighborhoodGuide from "./NeighborhoodGuide";
import MarketIntelligence from "./MarketIntelligence";
import { GAUTENG_SUBURBS } from "../data";

export default function BenoIntelligenceHub() {
  const [activeTab, setActiveTab] = useState<"maps" | "search">("maps");
  const [selectedSuburb, setSelectedSuburb] = useState<string>("Sandton");

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6" id="beno-intelligence-hub">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="h-3 w-3" />
            Backend AI Grounding Engine (gemini-3.5-flash)
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase">
            Gauteng Location & Market Intelligence
          </h3>
          <p className="text-gray-500 text-xs mt-1">
            Real-time neighborhood analysis grounded in Google Maps, combined with market trend data grounded in Google Search.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-center">
          <button
            onClick={() => setActiveTab("maps")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "maps"
                ? "bg-white text-brand-primary shadow-xs font-extrabold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-brand-primary" />
            Google Maps Grounding
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "search"
                ? "bg-white text-emerald-700 shadow-xs font-extrabold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-emerald-600" />
            Google Search Grounding
          </button>
        </div>
      </div>

      {/* Suburb Selector Pill Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Select Gauteng Suburb to Inspect:
          </label>
          <span className="text-[10px] font-mono text-brand-primary font-bold">
            Active: {selectedSuburb}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Sandton", "Rosebank", "Midrand", "Waterfall", "Bryanston", "Fourways", "Centurion", "Pretoria East", "Waterkloof", "Bedfordview"].map((suburb) => (
            <button
              key={suburb}
              onClick={() => setSelectedSuburb(suburb)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedSuburb === suburb
                  ? "bg-gray-900 text-white font-bold shadow-xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {suburb}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grounded View */}
      <div className="pt-2">
        {activeTab === "maps" ? (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50/60 border border-blue-150 rounded-xl flex items-center justify-between text-xs text-blue-900">
              <span className="font-semibold flex items-center gap-2">
                <Navigation className="h-4 w-4 text-blue-600" />
                Querying Google Maps place data for {selectedSuburb}, Gauteng:
              </span>
              <span className="text-[10px] bg-blue-100 font-bold px-2 py-0.5 rounded-full text-blue-800">
                Maps API Grounded
              </span>
            </div>
            <NeighborhoodGuide location={selectedSuburb} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50/60 border border-emerald-150 rounded-xl flex items-center justify-between text-xs text-emerald-900">
              <span className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-600" />
                Querying Google Search live web feeds for {selectedSuburb}, Gauteng:
              </span>
              <span className="text-[10px] bg-emerald-100 font-bold px-2 py-0.5 rounded-full text-emerald-800">
                Search API Grounded
              </span>
            </div>
            <MarketIntelligence suburb={selectedSuburb} />
          </div>
        )}
      </div>
    </div>
  );
}
