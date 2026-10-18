/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { TrendingUp, Globe, Search, ExternalLink, Loader2, RefreshCw, AlertCircle, Sparkles, Building, Landmark } from "lucide-react";

interface SearchSource {
  title: string;
  uri: string;
}

interface MarketIntelligenceProps {
  suburb?: string;
  propertyType?: string;
}

export default function MarketIntelligence({
  suburb = "Gauteng",
  propertyType,
}: MarketIntelligenceProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("trends");
  const [customQuery, setCustomQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<{
    text: string;
    searchSources: SearchSource[];
  } | null>(null);

  const PRESETS: Record<string, string> = {
    trends: `Current property price trends, average sales prices, and rental returns in ${suburb}, Gauteng South Africa in 2026.`,
    interest_rate: `South African Reserve Bank (SARB) repo rate and prime lending rate impact on home loan repayments and buyer sentiment in ${suburb}.`,
    transfer_duty: `SARS transfer duty exemption rates and property buying tax considerations in South Africa.`,
    investors: `Investment yields, tenant demand, and high-capital-growth areas in ${suburb} and Gauteng.`,
  };

  const fetchMarketData = async (queryToUse?: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = queryToUse || PRESETS[selectedTopic] || PRESETS.trends;
      const res = await fetch("/api/market-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          suburb,
          propertyType,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.details || errJson.error || "Failed to retrieve Google Search market data");
      }

      const data = await res.json();
      setMarketData({
        text: data.text || "No insights returned.",
        searchSources: data.searchSources || [],
      });
    } catch (err: unknown) {
      console.error("Market fetch error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData(PRESETS[selectedTopic]);
  }, [suburb, selectedTopic]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuery.trim()) {
      fetchMarketData(customQuery.trim());
    }
  };

  return (
    <div className="space-y-5" id="market-intelligence-container">
      {/* Topic Switcher */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mr-1 flex items-center gap-1">
          <Globe className="h-3.5 w-3.5 text-brand-primary" />
          Search Focus:
        </span>
        <button
          onClick={() => { setSelectedTopic("trends"); setCustomQuery(""); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedTopic === "trends"
              ? "bg-brand-primary text-white shadow-sm"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Price & Rental Trends
        </button>
        <button
          onClick={() => { setSelectedTopic("interest_rate"); setCustomQuery(""); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedTopic === "interest_rate"
              ? "bg-brand-primary text-white shadow-sm"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <Landmark className="h-3.5 w-3.5" />
          SARB Interest Rates
        </button>
        <button
          onClick={() => { setSelectedTopic("transfer_duty"); setCustomQuery(""); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedTopic === "transfer_duty"
              ? "bg-brand-primary text-white shadow-sm"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <Building className="h-3.5 w-3.5" />
          SARS Transfer Duty
        </button>
        <button
          onClick={() => { setSelectedTopic("investors"); setCustomQuery(""); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedTopic === "investors"
              ? "bg-brand-primary text-white shadow-sm"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Investor Yields
        </button>
      </div>

      {/* Custom Search Prompt */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder={`Ask a custom market question about ${suburb}...`}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-xs text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !customQuery.trim()}
          className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
        >
          <Search className="h-3.5 w-3.5" /> Search
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-gray-50 rounded-2xl border border-gray-200">
          <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
          <p className="text-xs font-bold text-gray-600">
            Querying Google Search Grounding via gemini-3.5-flash...
          </p>
          <p className="text-[10px] text-gray-400">
            Retrieving live web data, SARB announcements, and South African market stats.
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
          <div className="space-y-1">
            <p className="font-bold">Failed to load market intelligence</p>
            <p className="text-[11px]">{error}</p>
            <button
              onClick={() => fetchMarketData()}
              className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </div>
        </div>
      )}

      {/* Market Content */}
      {!loading && !error && marketData && (
        <div className="space-y-6">
          {/* Extracted Google Search Sources (MANDATORY per skill instructions) */}
          {marketData.searchSources && marketData.searchSources.length > 0 && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Verified Google Search Web Sources ({marketData.searchSources.length})
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Live Grounded Data
                </span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Data synthesized from verified live publications and market feeds:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {marketData.searchSources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold text-gray-800 hover:text-emerald-700 shadow-2xs group"
                  >
                    <span className="truncate max-w-[220px]">{src.title}</span>
                    <ExternalLink className="h-3 w-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Formatted Text Content */}
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp className="h-3.5 w-3.5 text-brand-primary" />
                Market Intelligence Report: {suburb}
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                Grounded via Google Search
              </span>
            </div>
            <div className="text-xs text-gray-800 leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
              {marketData.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
