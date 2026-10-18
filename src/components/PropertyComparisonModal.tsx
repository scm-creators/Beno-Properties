/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  X,
  Scale,
  Plus,
  Trash2,
  Check,
  Minus,
  Sparkles,
  BedDouble,
  Bath,
  Car,
  Maximize2,
  Tag,
  MapPin,
  ExternalLink,
  Phone,
  Mail,
  Zap,
  ShieldCheck,
  Trees,
  Sun,
  Home,
  Wifi,
  Wind,
  Flame,
  PawPrint,
  Compass,
  ArrowRight
} from "lucide-react";
import { Property, Agent } from "../types";
import { formatPriceZAR } from "./PropertyCard";

interface PropertyComparisonModalProps {
  comparedProperties: Property[];
  allProperties: Property[];
  agents: Agent[];
  onClose: () => void;
  onRemoveProperty: (propertyId: string) => void;
  onAddProperty: (property: Property) => void;
  onClearAll: () => void;
  onViewPropertyDetails: (property: Property) => void;
  onInquireProperty?: (property: Property) => void;
}

// Amenity definitions with icon and keyword detection
interface AmenityDefinition {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
}

const AMENITY_DEFINITIONS: AmenityDefinition[] = [
  {
    id: "solar",
    label: "Solar / Inverter / Backup Power",
    icon: Sun,
    keywords: ["solar", "inverter", "backup power", "generator", "battery", "backup"],
  },
  {
    id: "pool",
    label: "Swimming Pool",
    icon: Zap,
    keywords: ["pool", "swimming pool", "splash pool", "infinity pool", "heated pool"],
  },
  {
    id: "security",
    label: "24h Guard / Security Estate",
    icon: ShieldCheck,
    keywords: ["security", "guard", "estate", "patrol", "enclave", "biometric", "gated"],
  },
  {
    id: "garden",
    label: "Private Garden / Borehole",
    icon: Trees,
    keywords: ["garden", "lawn", "borehole", "irrigation", "landscaped"],
  },
  {
    id: "staff",
    label: "Staff Quarters / Flatlet",
    icon: Home,
    keywords: ["staff", "flatlet", "domestic", "cottage", "quarters"],
  },
  {
    id: "smart_home",
    label: "Smart Home & Fibre",
    icon: Wifi,
    keywords: ["smart", "automation", "fibre", "cinema", "sound", "app-controlled"],
  },
  {
    id: "aircon",
    label: "Air Conditioning",
    icon: Wind,
    keywords: ["aircon", "air conditioning", "climate", "hvac", "cooling"],
  },
  {
    id: "braai",
    label: "Covered Patio & Braai",
    icon: Flame,
    keywords: ["patio", "braai", "deck", "entertainment", "outdoor entertainment", "terrace"],
  },
  {
    id: "pet_friendly",
    label: "Pet Friendly",
    icon: PawPrint,
    keywords: ["pet", "pets allowed", "pet-friendly", "garden", "townhouse", "house"],
  },
  {
    id: "views",
    label: "Scenic / City Views",
    icon: Compass,
    keywords: ["views", "view", "panoramic", "rooftop", "penthouse", "balcony"],
  },
];

// Helper to check if property has an amenity
function hasAmenity(prop: Property, amenity: AmenityDefinition): boolean {
  // Check explicit features / amenities arrays if present
  if (prop.features && prop.features.some((f) => f.toLowerCase().includes(amenity.id) || amenity.keywords.some((k) => f.toLowerCase().includes(k)))) {
    return true;
  }
  if (prop.amenities && prop.amenities.some((a) => a.toLowerCase().includes(amenity.id) || amenity.keywords.some((k) => a.toLowerCase().includes(k)))) {
    return true;
  }

  // Fallback: check title and description
  const text = `${prop.title} ${prop.description}`.toLowerCase();
  return amenity.keywords.some((k) => text.includes(k));
}

export default function PropertyComparisonModal({
  comparedProperties,
  allProperties,
  agents,
  onClose,
  onRemoveProperty,
  onAddProperty,
  onClearAll,
  onViewPropertyDetails,
  onInquireProperty,
}: PropertyComparisonModalProps) {
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [searchAddQuery, setSearchAddQuery] = useState("");

  const MAX_COMPARE = 4;
  const canAddMore = comparedProperties.length < MAX_COMPARE;

  // Available properties to add (not yet in comparison)
  const availableToAdd = allProperties.filter(
    (p) => !comparedProperties.some((cp) => cp.id === p.id)
  );

  const filteredAvailableToAdd = availableToAdd.filter((p) => {
    if (!searchAddQuery.trim()) return true;
    const q = searchAddQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q)
    );
  });

  // Calculate Best Price & Best Price per m2
  const prices = comparedProperties.map((p) => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  const pricesPerM2 = comparedProperties.map((p) =>
    p.sizeSqM && p.sizeSqM > 0 ? Math.round(p.price / p.sizeSqM) : null
  );
  const validPricesPerM2 = pricesPerM2.filter((v): v is number => v !== null);
  const minPricePerM2 = validPricesPerM2.length > 0 ? Math.min(...validPricesPerM2) : null;

  // Utility to determine if a row has differences
  const hasDiff = (extractor: (p: Property) => any): boolean => {
    if (comparedProperties.length <= 1) return false;
    const firstVal = extractor(comparedProperties[0]);
    return comparedProperties.some((p) => extractor(p) !== firstVal);
  };

  return (
    <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto" id="property-comparison-modal-backdrop">
      <div
        className="bg-white border border-gray-200 w-full max-w-7xl rounded-3xl shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden"
        id="property-comparison-modal"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-900 via-gray-850 to-brand-primary text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-white">
                  Side-by-Side Property Comparison
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-mono font-extrabold">
                  {comparedProperties.length} / {MAX_COMPARE} Selected
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Analyze price, dimensions, layout specifications, and luxury amenities across shortlisted Gauteng residences.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Highlight Differences Switch */}
            {comparedProperties.length > 1 && (
              <button
                type="button"
                onClick={() => setHighlightDifferences(!highlightDifferences)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  highlightDifferences
                    ? "bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-sm"
                    : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-750"
                }`}
                title="Toggle highlighting of differing specifications"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Highlight Differences</span>
              </button>
            )}

            {comparedProperties.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-750 border border-gray-700 transition-colors cursor-pointer"
                title="Clear all compared properties"
              >
                Clear All
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white border border-gray-700 transition-colors cursor-pointer"
              title="Close Comparison"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Workspace */}
        <div className="overflow-x-auto overflow-y-auto flex-1 p-4 sm:p-6" id="comparison-table-scroll">
          {comparedProperties.length === 0 ? (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <Scale className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 uppercase tracking-tight">
                  No Properties Shortlisted for Comparison
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Click the "Compare" checkbox or button on any property card to view side-by-side pricing, floor sizes, and amenities.
                </p>
              </div>
              {allProperties.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      // Select first 2 properties as a quick helpful default
                      allProperties.slice(0, 2).forEach(onAddProperty);
                    }}
                    className="px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-brand-hover cursor-pointer shadow-sm transition-all"
                  >
                    Compare First 2 Listings
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="min-w-[640px] divide-y divide-gray-200">
              
              {/* PROPERTY HERO ROW (Images, Titles, Price, Remove) */}
              <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 pb-6 items-stretch">
                <div className="flex flex-col justify-end pb-2 font-mono text-xs uppercase text-gray-400 font-bold">
                  <span>Selected Listings</span>
                </div>

                {comparedProperties.map((prop) => {
                  const agent = agents.find((a) => a.id === prop.agentId) || agents[0];
                  return (
                    <div
                      key={prop.id}
                      className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col justify-between relative group hover:border-brand-primary/40 transition-all shadow-sm"
                    >
                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveProperty(prop.id)}
                        className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200 shadow-sm transition-colors cursor-pointer"
                        title="Remove from comparison"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Image Thumbnail */}
                      <div className="aspect-[16/10] relative overflow-hidden bg-gray-200">
                        <img
                          src={prop.imageUrl}
                          alt={prop.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span
                          className={`absolute bottom-2 left-2 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow ${
                            prop.status === "For Sale" ? "bg-brand-primary" : "bg-brand-secondary"
                          }`}
                        >
                          {prop.status}
                        </span>
                        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono font-bold text-gray-700 border border-gray-200">
                          {prop.id}
                        </span>
                      </div>

                      {/* Header Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-[11px] font-mono font-semibold text-brand-secondary uppercase flex items-center gap-1 mb-1">
                            <MapPin className="h-3 w-3" />
                            {prop.location}, {prop.city}
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-2" title={prop.title}>
                            {prop.title}
                          </h4>
                        </div>

                        <div>
                          <div className="text-xs font-mono text-gray-400 uppercase">Listed Price</div>
                          <div className="text-base sm:text-lg font-black text-brand-primary">
                            {formatPriceZAR(prop.price, prop.status)}
                          </div>
                          {prop.price === minPrice && comparedProperties.length > 1 && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                              Lowest Price
                            </span>
                          )}
                        </div>

                        <div className="pt-2 flex flex-col gap-1.5">
                          <button
                            onClick={() => onViewPropertyDetails(prop)}
                            className="w-full py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <span>Full Details</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Slot if < 4 */}
                {canAddMore && (
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 hover:border-brand-primary/50 transition-colors bg-gray-50/50 relative">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase">Add Listing</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Compare up to {MAX_COMPARE} properties</p>
                    </div>

                    <div className="w-full relative">
                      <button
                        onClick={() => setShowAddDropdown(!showAddDropdown)}
                        className="w-full py-2 px-3 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:text-brand-primary transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Select Property</span>
                      </button>

                      {/* Dropdown Menu */}
                      {showAddDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 p-2 max-h-60 overflow-y-auto text-left">
                          <input
                            type="text"
                            placeholder="Filter by suburb, title, ID..."
                            value={searchAddQuery}
                            onChange={(e) => setSearchAddQuery(e.target.value)}
                            className="w-full text-xs p-2 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-brand-primary"
                          />
                          {filteredAvailableToAdd.length === 0 ? (
                            <p className="text-[11px] text-gray-400 p-2 text-center">No more listings found.</p>
                          ) : (
                            <div className="space-y-1">
                              {filteredAvailableToAdd.map((p) => (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    onAddProperty(p);
                                    setShowAddDropdown(false);
                                    setSearchAddQuery("");
                                  }}
                                  className="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-xs transition-colors cursor-pointer"
                                >
                                  <img src={p.imageUrl} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-gray-900 truncate">{p.title}</div>
                                    <div className="text-[10px] text-gray-500 font-mono">
                                      {p.location} • {formatPriceZAR(p.price, p.status)}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: FINANCIALS & VALUE */}
              <div className="py-4">
                <h5 className="text-xs font-mono font-bold text-brand-primary uppercase tracking-widest mb-3">
                  1. Financials & Pricing Analysis
                </h5>
                
                {/* Row: Property Status */}
                <div
                  className={`grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 py-2.5 px-3 rounded-xl items-center text-xs ${
                    highlightDifferences && hasDiff((p) => p.status) ? "bg-amber-50/70 border border-amber-200/50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-gray-600">Listing Status</span>
                  {comparedProperties.map((p) => (
                    <div key={p.id} className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${p.status === "For Sale" ? "bg-brand-primary" : "bg-brand-secondary"}`} />
                      {p.status}
                    </div>
                  ))}
                  {canAddMore && <div />}
                </div>

                {/* Row: Property Type */}
                <div
                  className={`grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 py-2.5 px-3 rounded-xl items-center text-xs ${
                    highlightDifferences && hasDiff((p) => p.type) ? "bg-amber-50/70 border border-amber-200/50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-gray-600">Property Category</span>
                  {comparedProperties.map((p) => (
                    <div key={p.id} className="font-bold text-gray-800 font-mono">
                      {p.type}
                    </div>
                  ))}
                  {canAddMore && <div />}
                </div>

                {/* Row: Total Price */}
                <div
                  className={`grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 py-2.5 px-3 rounded-xl items-center text-xs ${
                    highlightDifferences && hasDiff((p) => p.price) ? "bg-amber-50/70 border border-amber-200/50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-gray-600">Price (ZAR)</span>
                  {comparedProperties.map((p) => (
                    <div key={p.id} className="font-black text-brand-primary text-sm">
                      {formatPriceZAR(p.price, p.status)}
                    </div>
                  ))}
                  {canAddMore && <div />}
                </div>

                {/* Row: Price per m2 */}
                <div
                  className={`grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 py-2.5 px-3 rounded-xl items-center text-xs ${
                    highlightDifferences && hasDiff((p) => (p.sizeSqM ? Math.round(p.price / p.sizeSqM) : null))
                      ? "bg-amber-50/70 border border-amber-200/50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-gray-600">Price / Floor Area</span>
                  {comparedProperties.map((p) => {
                    const pricePerM2 = p.sizeSqM && p.sizeSqM > 0 ? Math.round(p.price / p.sizeSqM) : null;
                    return (
                      <div key={p.id} className="font-mono text-xs text-gray-700">
                        {pricePerM2 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold">R {pricePerM2.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-400">/ m²</span>
                            {pricePerM2 === minPricePerM2 && comparedProperties.length > 1 && (
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded">
                                Best Value
                              </span>
                            )}
                          </div>
                        ) : (
                          "—"
                        )}
                      </div>
                    );
                  })}
                  {canAddMore && <div />}
                </div>
              </div>

              {/* SECTION: DIMENSIONS & SPECIFICATIONS */}
              <div className="py-4">
                <h5 className="text-xs font-mono font-bold text-brand-primary uppercase tracking-widest mb-3">
                  2. Dimensions & Spatial Layout
                </h5>

                {/* Row: Floor Area (sizeSqM) */}
                <div
                  className={`grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 py-2.5 px-3 rounded-xl items-center text-xs ${
                    highlightDifferences && hasDiff((p) => p.sizeSqM) ? "bg-amber-50/70 border border-amber-200/50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-gray-600 flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5 text-gray-400" />
                    Floor Size
                  </span>
                  {comparedProperties.map((p) => (
                    <div key={p.id} className="font-mono text-gray-900 font-bold">
                      {p.sizeSqM ? `${p.sizeSqM} m²` : "—"}
                    </div>
                  ))}
                  {canAddMore && <div />}
                </div>

                {/* Row: Bedrooms */}
                <div
                  className={`grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 py-2.5 px-3 rounded-xl items-center text-xs ${
                    highlightDifferences && hasDiff((p) => p.bedrooms) ? "bg-amber-50/70 border border-amber-200/50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-gray-600 flex items-center gap-1.5">
                    <BedDouble className="h-3.5 w-3.5 text-gray-400" />
                    Bedrooms
                  </span>
                  {comparedProperties.map((p) => (
                    <div key={p.id} className="font-bold text-gray-900 flex items-center gap-1">
                      {p.bedrooms !== undefined ? (
                        <>
                          <span>{p.bedrooms}</span>
                          <span className="text-gray-400 font-normal">Beds</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </div>
                  ))}
                  {canAddMore && <div />}
                </div>

                {/* Row: Bathrooms */}
                <div
                  className={`grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 py-2.5 px-3 rounded-xl items-center text-xs ${
                    highlightDifferences && hasDiff((p) => p.bathrooms) ? "bg-amber-50/70 border border-amber-200/50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-gray-600 flex items-center gap-1.5">
                    <Bath className="h-3.5 w-3.5 text-gray-400" />
                    Bathrooms
                  </span>
                  {comparedProperties.map((p) => (
                    <div key={p.id} className="font-bold text-gray-900 flex items-center gap-1">
                      {p.bathrooms !== undefined ? (
                        <>
                          <span>{p.bathrooms}</span>
                          <span className="text-gray-400 font-normal">Baths</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </div>
                  ))}
                  {canAddMore && <div />}
                </div>

                {/* Row: Garages / Parking */}
                <div
                  className={`grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 py-2.5 px-3 rounded-xl items-center text-xs ${
                    highlightDifferences && hasDiff((p) => p.parkingSpaces) ? "bg-amber-50/70 border border-amber-200/50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-gray-600 flex items-center gap-1.5">
                    <Car className="h-3.5 w-3.5 text-gray-400" />
                    Parking / Garages
                  </span>
                  {comparedProperties.map((p) => (
                    <div key={p.id} className="font-bold text-gray-900 flex items-center gap-1">
                      {p.parkingSpaces !== undefined ? (
                        <>
                          <span>{p.parkingSpaces}</span>
                          <span className="text-gray-400 font-normal">Bays</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </div>
                  ))}
                  {canAddMore && <div />}
                </div>
              </div>

              {/* SECTION: AMENITIES & FEATURES MATRIX */}
              <div className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-xs font-mono font-bold text-brand-primary uppercase tracking-widest">
                    3. Key Amenities & Lifestyle Features
                  </h5>
                  <span className="text-[11px] text-gray-400 font-mono">
                    Green tick indicates feature verification
                  </span>
                </div>

                <div className="space-y-1">
                  {AMENITY_DEFINITIONS.map((amenity) => {
                    const differs = highlightDifferences && hasDiff((p) => hasAmenity(p, amenity));
                    const IconComponent = amenity.icon;

                    return (
                      <div
                        key={amenity.id}
                        className={`grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 py-2.5 px-3 rounded-xl items-center text-xs ${
                          differs ? "bg-amber-50/70 border border-amber-200/50" : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-medium text-gray-700 flex items-center gap-2">
                          <IconComponent className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{amenity.label}</span>
                        </span>

                        {comparedProperties.map((p) => {
                          const present = hasAmenity(p, amenity);
                          return (
                            <div key={p.id} className="flex items-center gap-1.5">
                              {present ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                                  <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                                  <span>Included</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-400 text-xs font-medium">
                                  <Minus className="h-3 w-3" />
                                  <span>Not Listed</span>
                                </span>
                              )}
                            </div>
                          );
                        })}
                        {canAddMore && <div />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: SUMMARY & ASSIGNED AGENT */}
              <div className="py-4">
                <h5 className="text-xs font-mono font-bold text-brand-primary uppercase tracking-widest mb-3">
                  4. Listing Brief & Managing Agent
                </h5>

                {/* Description snippet */}
                <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 py-3 px-3 rounded-xl items-start text-xs">
                  <span className="font-semibold text-gray-600">Executive Brief</span>
                  {comparedProperties.map((p) => (
                    <div key={p.id} className="text-gray-600 leading-relaxed text-xs italic bg-gray-50 p-3 rounded-xl border border-gray-200 line-clamp-4">
                      "{p.description}"
                    </div>
                  ))}
                  {canAddMore && <div />}
                </div>

                {/* Assigned Agent Card */}
                <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 py-3 px-3 rounded-xl items-start text-xs">
                  <span className="font-semibold text-gray-600">Property Consultant</span>
                  {comparedProperties.map((p) => {
                    const agent = agents.find((a) => a.id === propAgentId(p)) || agents[0];
                    return (
                      <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm space-y-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={agent.imageUrl}
                            alt={agent.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-amber-300"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 truncate text-xs">{agent.name}</div>
                            <div className="text-[10px] text-brand-secondary font-mono truncate">{agent.title}</div>
                          </div>
                        </div>

                        <div className="text-[11px] space-y-1 text-gray-500 font-mono">
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>{agent.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="truncate">{agent.email}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {canAddMore && <div />}
                </div>

                {/* Bottom CTA Actions */}
                <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] gap-4 pt-4 px-3 items-center">
                  <span className="font-semibold text-gray-600 text-xs">Action</span>
                  {comparedProperties.map((p) => (
                    <div key={p.id} className="space-y-1.5">
                      <button
                        onClick={() => onViewPropertyDetails(p)}
                        className="w-full py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>Schedule Viewing</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {canAddMore && <div />}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Prices quoted in South African Rands (ZAR). PPRA registered transactions.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold uppercase rounded-xl transition-colors cursor-pointer text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function propAgentId(p: Property): string {
  return p.agentId || "BENO-AGT-1";
}
