/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MapPin, Navigation, School, ShoppingBag, Train, Trees, ExternalLink, Loader2, RefreshCw, AlertCircle, Sparkles } from "lucide-react";

interface MapsLink {
  title: string;
  uri: string;
  address?: string;
}

interface NeighborhoodGuideProps {
  location: string;
  propertyTitle?: string;
  suburbCoordinates?: { latitude: number; longitude: number };
}

export default function NeighborhoodGuide({
  location,
  propertyTitle,
  suburbCoordinates,
}: NeighborhoodGuideProps) {
  const [activeCategory, setActiveCategory] = useState<"general" | "schools" | "amenities" | "transport" | "lifestyle">("general");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [guideData, setGuideData] = useState<{
    text: string;
    mapsLinks: MapsLink[];
  } | null>(null);

  const fetchNeighborhoodInfo = async (queryType: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/neighborhood-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          propertyTitle,
          queryType,
          userCoordinates: suburbCoordinates,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.details || errJson.error || "Failed to load Google Maps intelligence");
      }

      const data = await res.json();
      setGuideData({
        text: data.text || "No details returned.",
        mapsLinks: data.mapsLinks || [],
      });
    } catch (err: unknown) {
      console.error("Neighborhood fetch error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeighborhoodInfo(activeCategory);
  }, [location, activeCategory]);

  return (
    <div className="space-y-5" id="neighborhood-guide-container">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mr-1 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-brand-primary" />
          Maps Focus:
        </span>
        <button
          onClick={() => setActiveCategory("general")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === "general"
              ? "bg-brand-primary text-white shadow-sm"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Full Overview
        </button>
        <button
          onClick={() => setActiveCategory("schools")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === "schools"
              ? "bg-brand-primary text-white shadow-sm"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <School className="h-3.5 w-3.5" />
          Top Schools
        </button>
        <button
          onClick={() => setActiveCategory("amenities")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === "amenities"
              ? "bg-brand-primary text-white shadow-sm"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Shopping & Dining
        </button>
        <button
          onClick={() => setActiveCategory("transport")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === "transport"
              ? "bg-brand-primary text-white shadow-sm"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <Train className="h-3.5 w-3.5" />
          Gautrain & Highways
        </button>
        <button
          onClick={() => setActiveCategory("lifestyle")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === "lifestyle"
              ? "bg-brand-primary text-white shadow-sm"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <Trees className="h-3.5 w-3.5" />
          Parks & Recreation
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-gray-50 rounded-2xl border border-gray-200">
          <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
          <p className="text-xs font-bold text-gray-600">
            Querying Google Maps Grounding via gemini-3.5-flash for {location}...
          </p>
          <p className="text-[10px] text-gray-400">
            Verifying accurate local points of interest, nearby venues, and road networks.
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
          <div className="space-y-1">
            <p className="font-bold">Failed to load Google Maps intelligence</p>
            <p className="text-[11px]">{error}</p>
            <button
              onClick={() => fetchNeighborhoodInfo(activeCategory)}
              className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </div>
        </div>
      )}

      {/* Guide Content */}
      {!loading && !error && guideData && (
        <div className="space-y-6">
          {/* Extracted Google Maps Links Box (MANDATORY per skill instructions) */}
          {guideData.mapsLinks && guideData.mapsLinks.length > 0 && (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Verified Google Maps Locations ({guideData.mapsLinks.length})
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  Live Grounded Places
                </span>
              </div>
              <p className="text-[11px] text-blue-800">
                Click any place below to inspect exact navigation, ratings, and Street View on Google Maps:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {guideData.mapsLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white hover:bg-blue-50 border border-blue-150 hover:border-blue-300 rounded-xl transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 truncate">
                        {link.title}
                      </p>
                      {link.address && (
                        <p className="text-[10px] text-gray-500 truncate">{link.address}</p>
                      )}
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-blue-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Formatted Text Content */}
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Navigation className="h-3.5 w-3.5 text-brand-primary" />
                Neighborhood Dossier: {location}
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                Grounded via Google Maps
              </span>
            </div>
            <div className="text-xs text-gray-800 leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
              {guideData.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
