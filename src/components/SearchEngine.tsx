/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, MapPin, Home, Banknote, BedDouble, ArrowRight, RotateCcw } from "lucide-react";
import { Property, PropertyStatus, PropertyType, SearchFilters } from "../types";
import { GAUTENG_SUBURBS } from "../data";

interface SearchEngineProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onSearch: (appliedFilters: SearchFilters) => void;
  properties?: Property[];
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
  properties = [],
}: SearchEngineProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>({ ...filters });
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const locationContainerRef = useRef<HTMLDivElement>(null);

  // Sync with prop filter changes
  useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters]);

  // Build a unique catalog of suburbs from current properties and preset GAUTENG_SUBURBS with counts
  const suburbCatalog = useMemo(() => {
    const map = new Map<string, number>();

    if (properties && properties.length > 0) {
      properties.forEach((p) => {
        if (p.location) {
          const loc = p.location.trim();
          map.set(loc, (map.get(loc) || 0) + 1);
        }
      });
    }

    GAUTENG_SUBURBS.forEach((suburb) => {
      if (!map.has(suburb)) {
        map.set(suburb, 0);
      }
    });

    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [properties]);

  // Compute matched auto-complete suggestions based on user input
  const query = localFilters.location.trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!query) return [];

    return suburbCatalog
      .filter((item) => item.name.toLowerCase().includes(query))
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(query);
        const bStarts = b.name.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        // Sort by property count in catalog descending
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  }, [suburbCatalog, query]);

  // Close auto-complete dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationContainerRef.current &&
        !locationContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectSuburb = (suburbName: string) => {
    const updated = { ...localFilters, location: suburbName };
    setLocalFilters(updated);
    setShowSuggestions(false);
    onSearch(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuburb(suggestions[highlightedIndex].name);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const renderHighlightedMatch = (text: string, searchPhrase: string) => {
    if (!searchPhrase) return text;
    const index = text.toLowerCase().indexOf(searchPhrase);
    if (index === -1) return text;
    const before = text.slice(0, index);
    const match = text.slice(index, index + searchPhrase.length);
    const after = text.slice(index + searchPhrase.length);
    return (
      <>
        {before}
        <span className="bg-amber-100 text-brand-primary font-black px-0.5 rounded">{match}</span>
        {after}
      </>
    );
  };

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
    setShowSuggestions(false);
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
    setShowSuggestions(false);
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
          {/* Location Search Input with Auto-complete */}
          <div className="flex flex-col gap-1.5" id="filter-col-location">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-brand-primary" />
              LOCATION / REF ID
            </label>
            <div className="relative" ref={locationContainerRef}>
              <input
                type="text"
                value={localFilters.location}
                onChange={(e) => {
                  handleFieldChange("location", e.target.value);
                  setShowSuggestions(true);
                  setHighlightedIndex(-1);
                }}
                onFocus={() => {
                  if (localFilters.location.trim().length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Suburb, City or BENO-XXX"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                id="search-input-location"
                autoComplete="off"
              />
              <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />

              {/* Suburb Auto-complete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto animate-fadeIn"
                  id="suburb-autocomplete-dropdown"
                >
                  <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                      Suburbs Catalog Suggestions ({suggestions.length})
                    </span>
                    <span className="text-[9px] text-gray-400 hidden sm:inline font-mono">
                      ↑↓ Navigate • Enter Select
                    </span>
                  </div>
                  <ul className="divide-y divide-gray-50">
                    {suggestions.map((suburb, index) => (
                      <li
                        key={suburb.name}
                        onClick={() => handleSelectSuburb(suburb.name)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`px-4 py-2.5 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                          index === highlightedIndex
                            ? "bg-brand-primary/10 text-brand-primary font-bold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        id={`autocomplete-item-${index}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin
                            className={`h-3.5 w-3.5 shrink-0 ${
                              index === highlightedIndex ? "text-brand-primary" : "text-gray-400"
                            }`}
                          />
                          <span className="truncate">{renderHighlightedMatch(suburb.name, query)}</span>
                        </div>
                        {suburb.count > 0 ? (
                          <span className="text-[10px] font-bold bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full shrink-0 ml-2 font-mono">
                            {suburb.count} {suburb.count === 1 ? "property" : "properties"}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-normal shrink-0 ml-2">
                            Gauteng suburb
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
