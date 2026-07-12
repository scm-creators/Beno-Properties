/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, MapPin, Home, Banknote, BedDouble, ArrowRight, RotateCcw } from "lucide-react";
import { PropertyStatus, PropertyType, SearchFilters } from "../types";
import { GAUTENG_SUBURBS } from "../data";

interface SearchEngineProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onSearch: (appliedFilters: SearchFilters) => void;
}

const PROPERTY_TYPES: (PropertyType | "All")[] = [
  "All",
  "House",
  "Apartment",
  "Townhouse",
  "Vacant Land",
  "Farm",
  "Commercial",
  "Industrial",
];

const PRICE_RANGES_FOR_SALE = [
  { value: "", label: "Any Price" },
  { value: "1000000", label: "R1.0M" },
  { value: "2500000", label: "R2.5M" },
  { value: "5000000", label: "R5.0M" },
  { value: "7500000", label: "R7.5M" },
  { value: "10000000", label: "R10M" },
  { value: "15000000", label: "R15M" },
  { value: "25000000", label: "R25M+" },
];

const PRICE_RANGES_FOR_RENT = [
  { value: "", label: "Any Rent" },
  { value: "10000", label: "R10,000/mo" },
  { value: "15000", label: "R15,000/mo" },
  { value: "25000", label: "R25,000/mo" },
  { value: "40000", label: "R40,000/mo" },
  { value: "60000", label: "R60,000/mo" },
  { value: "100000", label: "R100,000/mo+" },
];

export default function SearchEngine({
  filters,
  setFilters,
  onSearch,
}: SearchEngineProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>({ ...filters });

  const handleStatusChange = (status: PropertyStatus | "All") => {
    const updated = {
      ...localFilters,
      status,
      // Clear price filters when switching transaction type to prevent mismatched caps
      minPrice: "",
      maxPrice: "",
    };
    setLocalFilters(updated);
    onSearch(updated);
  };

  const handleFieldChange = (key: keyof SearchFilters, value: string) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localFilters);
  };

  const handleReset = () => {
    const resetValues: SearchFilters = {
      location: "",
      status: "All",
      type: "All",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
    };
    setLocalFilters(resetValues);
    onSearch(resetValues);
  };

  const pricesToRender =
    localFilters.status === "To Rent" ? PRICE_RANGES_FOR_RENT : PRICE_RANGES_FOR_SALE;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl relative -mt-16 sm:-mt-24 z-10" id="search-engine">
      <form onSubmit={handleSearchSubmit}>
        {/* Toggle between Buy/Rent/All */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5 mb-6" id="search-mode-tabs">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            {(["All", "For Sale", "To Rent"] as const).map((status) => (
              <button
                key={status}
                type="button"
                id={`status-toggle-${status.replace(" ", "-").toLowerCase()}`}
                onClick={() => handleStatusChange(status)}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                  localFilters.status === status
                    ? "bg-brand-primary text-white font-bold shadow-sm"
                    : "text-gray-500 hover:text-brand-primary"
                }`}
              >
                {status === "All" ? "All Offers" : status}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-primary font-mono transition-colors cursor-pointer"
            id="reset-search-btn"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6" id="search-inputs-grid">
          {/* Location Search Input */}
          <div className="flex flex-col gap-1.5" id="filter-col-location">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-brand-primary" />
              LOCATION / REF ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={localFilters.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                placeholder="Suburb, City or BENO-XXX"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                id="search-input-location"
              />
              <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Property Type Dropdown */}
          <div className="flex flex-col gap-1.5" id="filter-col-type">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1">
              <Home className="h-3.5 w-3.5 text-brand-primary" />
              PROPERTY TYPE
            </label>
            <select
              value={localFilters.type}
              onChange={(e) => handleFieldChange("type", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors cursor-pointer appearance-none"
              id="search-select-type"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type} className="bg-white text-gray-800">
                  {type === "All" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price Dropdown */}
          <div className="flex flex-col gap-1.5" id="filter-col-min-price">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1">
              <Banknote className="h-3.5 w-3.5 text-brand-primary" />
              MIN PRICE (ZAR)
            </label>
            <select
              value={localFilters.minPrice}
              onChange={(e) => handleFieldChange("minPrice", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors cursor-pointer"
              id="search-select-min-price"
            >
              <option value="">Min Price</option>
              {pricesToRender
                .filter((p) => p.value !== "")
                .map((price) => (
                  <option key={`min-${price.value}`} value={price.value}>
                    {price.label}
                  </option>
                ))}
            </select>
          </div>

          {/* Max Price Dropdown */}
          <div className="flex flex-col gap-1.5" id="filter-col-max-price">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1">
              <Banknote className="h-3.5 w-3.5 text-brand-primary" />
              MAX PRICE (ZAR)
            </label>
            <select
              value={localFilters.maxPrice}
              onChange={(e) => handleFieldChange("maxPrice", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors cursor-pointer"
              id="search-select-max-price"
            >
              <option value="">Max Price</option>
              {pricesToRender
                .filter((p) => p.value !== "")
                .map((price) => (
                  <option key={`max-${price.value}`} value={price.value}>
                    {price.label}
                  </option>
                ))}
            </select>
          </div>

          {/* Bedrooms Dropdown */}
          <div className="flex flex-col gap-1.5" id="filter-col-bedrooms">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-brand-primary" />
              BEDROOMS
            </label>
            <select
              value={localFilters.bedrooms}
              onChange={(e) => handleFieldChange("bedrooms", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors cursor-pointer"
              id="search-select-bedrooms"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1+ Bedrooms</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end" id="search-action-row">
          <button
            type="submit"
            id="search-submit-btn"
            className="w-full lg:w-auto bg-brand-secondary hover:bg-brand-accent-hover text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            Find Properties
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Suggested Gauteng Suburbs quick chips */}
      <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-2" id="popular-suburbs-suggestion">
        <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mr-1">Popular Areas:</span>
        {GAUTENG_SUBURBS.slice(0, 6).map((suburb) => (
          <button
            key={suburb}
            type="button"
            id={`suggested-suburb-${suburb.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => {
              const updated = { ...localFilters, location: suburb };
              setLocalFilters(updated);
              onSearch(updated);
            }}
            className="text-xs text-gray-600 hover:text-brand-primary bg-gray-100 hover:bg-gray-200/80 border border-gray-200 rounded-lg px-2.5 py-1 transition-all cursor-pointer"
          >
            {suburb}
          </button>
        ))}
      </div>
    </div>
  );
}
