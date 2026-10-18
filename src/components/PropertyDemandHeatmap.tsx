/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import {
  Flame,
  TrendingUp,
  MapPin,
  Building,
  Filter,
  Download,
  Search,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  ExternalLink,
  Users,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import {
  Property,
  Lead,
  ContactMessage,
  PropertyFinderRequest,
  EmailAlertSubscription,
  ListPropertySubmission,
  Appointment,
  SuburbDemandData
} from "../types";
import { GAUTENG_SUBURB_DEMAND_DATA } from "../data";
import { formatPriceZAR } from "./PropertyCard";

interface PropertyDemandHeatmapProps {
  properties: Property[];
  leads?: Lead[];
  contactMessages?: ContactMessage[];
  finderRequests?: PropertyFinderRequest[];
  alertSubscriptions?: EmailAlertSubscription[];
  listSubmissions?: ListPropertySubmission[];
  appointments?: Appointment[];
  onSelectProperty?: (property: Property) => void;
}

type ViewMode = "matrix" | "spatial" | "ranking";
type CategoryFilter = "All" | "Buying" | "Renting";

export default function PropertyDemandHeatmap({
  properties = [],
  leads = [],
  contactMessages = [],
  finderRequests = [],
  alertSubscriptions = [],
  listSubmissions = [],
  appointments = [],
  onSelectProperty,
}: PropertyDemandHeatmapProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("matrix");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbDemandData | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    x: number;
    y: number;
    title: string;
    value: string;
    secondary: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    title: "",
    value: "",
    secondary: ""
  });

  const matrixSvgRef = useRef<SVGSVGElement | null>(null);
  const spatialSvgRef = useRef<SVGSVGElement | null>(null);

  // Synthesize real app inquiries with baseline demand data
  const dynamicSuburbsData = useMemo(() => {
    return GAUTENG_SUBURB_DEMAND_DATA.map((base) => {
      const suburbKeywords = [base.suburb.toLowerCase(), ...base.suburb.toLowerCase().split(/[&,]/).map(s => s.trim())];

      const matchesSuburb = (locText?: string) => {
        if (!locText) return false;
        const lower = locText.toLowerCase();
        return suburbKeywords.some(kw => kw.length > 2 && lower.includes(kw));
      };

      // Real live inquiry counts from props
      const liveFinder = (finderRequests || []).filter(r => matchesSuburb(r.specificAreas)).length;
      const liveContact = (contactMessages || []).filter(c => {
        const prop = properties.find(p => p.id === c.propertyRefId);
        return matchesSuburb(prop?.location) || matchesSuburb(c.message);
      }).length;
      const liveAlerts = (alertSubscriptions || []).filter(a => matchesSuburb(a.location)).length;
      const liveSubmissions = (listSubmissions || []).filter(s => matchesSuburb(s.location)).length;
      const liveAppointments = (appointments || []).filter(a => matchesSuburb(a.propertyLocation) || matchesSuburb(a.location)).length;
      const liveLeads = (leads || []).filter(l => matchesSuburb(l.notes) || matchesSuburb(l.details)).length;

      const liveTotal = liveFinder + liveContact + liveAlerts + liveSubmissions + liveAppointments + liveLeads;
      const totalInquiries = base.inquiryCount + (liveTotal * 8); // weighted with live activity

      // Matching properties listed in this suburb
      const matchedPropsCount = properties.filter(p => matchesSuburb(p.location)).length;

      return {
        ...base,
        inquiryCount: totalInquiries,
        activePropertiesCount: Math.max(base.activePropertiesCount, matchedPropsCount),
        liveActivityCount: liveTotal
      };
    });
  }, [properties, finderRequests, contactMessages, alertSubscriptions, listSubmissions, appointments, leads]);

  // Filtered dataset
  const filteredSuburbs = useMemo(() => {
    return dynamicSuburbsData.filter((item) => {
      if (selectedRegion !== "All" && item.region !== selectedRegion) {
        return false;
      }
      if (categoryFilter === "Buying" && item.primaryPurpose === "Renting") {
        return false;
      }
      if (categoryFilter === "Renting" && item.primaryPurpose === "Buying") {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.suburb.toLowerCase().includes(q);
        const matchesRegion = item.region.toLowerCase().includes(q);
        const matchesDrivers = item.keyDemandDrivers.some(d => d.toLowerCase().includes(q));
        if (!matchesName && !matchesRegion && !matchesDrivers) return false;
      }
      return true;
    });
  }, [dynamicSuburbsData, selectedRegion, categoryFilter, searchQuery]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalInquiries = filteredSuburbs.reduce((acc, s) => acc + s.inquiryCount, 0);
    const avgScore = filteredSuburbs.length > 0
      ? Math.round(filteredSuburbs.reduce((acc, s) => acc + s.demandScore, 0) / filteredSuburbs.length)
      : 0;
    const hotSpotCount = filteredSuburbs.filter(s => s.intensityLevel === "Very High").length;
    const avgBudget = filteredSuburbs.length > 0
      ? Math.round(filteredSuburbs.reduce((acc, s) => acc + s.averageBudget, 0) / filteredSuburbs.length)
      : 0;

    return {
      totalInquiries,
      avgScore,
      hotSpotCount,
      avgBudget
    };
  }, [filteredSuburbs]);

  const uniqueRegions = useMemo(() => {
    return Array.from(new Set(GAUTENG_SUBURB_DEMAND_DATA.map(d => d.region)));
  }, []);

  // -------------------------------------------------------------
  // D3 MATRIX HEATMAP RENDER
  // -------------------------------------------------------------
  useEffect(() => {
    if (viewMode !== "matrix" || !matrixSvgRef.current) return;

    const svg = d3.select(matrixSvgRef.current);
    svg.selectAll("*").remove(); // Clean slate

    const width = 880;
    const height = Math.max(380, filteredSuburbs.length * 36 + 80);
    const margin = { top: 60, right: 120, bottom: 40, left: 220 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Dimension Columns
    const columns = [
      { id: "inquiries", label: "Inquiry Density", getValue: (d: SuburbDemandData) => d.inquiryCount },
      { id: "score", label: "Demand Score", getValue: (d: SuburbDemandData) => d.demandScore },
      { id: "viewings", label: "Viewings & Tours", getValue: (d: SuburbDemandData) => d.viewingCount },
      { id: "growth", label: "30D Growth (%)", getValue: (d: SuburbDemandData) => d.growthRatePct },
      { id: "budget", label: "Avg Budget Index", getValue: (d: SuburbDemandData) => Math.round(d.averageBudget / 100000) }
    ];

    // Scales
    const xScale = d3.scaleBand()
      .domain(columns.map(c => c.label))
      .range([0, innerWidth])
      .padding(0.08);

    const yScale = d3.scaleBand()
      .domain(filteredSuburbs.map(d => d.suburb))
      .range([0, innerHeight])
      .padding(0.12);

    // Color Scales
    const maxInquiries: number = Number(d3.max(filteredSuburbs, (d: SuburbDemandData) => d.inquiryCount) ?? 400);
    const colorScale = d3.scaleSequential()
      .domain([0, maxInquiries])
      .interpolator(d3.interpolateYlOrRd);

    // Draw Column Headers (X Axis)
    g.selectAll(".col-header")
      .data(columns)
      .enter()
      .append("text")
      .attr("class", "col-header")
      .attr("x", (d: any) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr("y", -18)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "700")
      .attr("fill", "#334155")
      .text((d: any) => d.label);

    // Draw Suburb Row Headers (Y Axis)
    g.selectAll(".row-header")
      .data(filteredSuburbs)
      .enter()
      .append("text")
      .attr("class", "row-header")
      .attr("x", -14)
      .attr("y", (d: any) => (yScale(d.suburb) || 0) + yScale.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("fill", "#1e293b")
      .text((d: any) => d.suburb)
      .style("cursor", "pointer")
      .on("click", (_: any, d: any) => setSelectedSuburb(d));

    // Draw Heatmap Cells
    filteredSuburbs.forEach(suburb => {
      columns.forEach(col => {
        const val = col.getValue(suburb);
        const cellX = xScale(col.label) || 0;
        const cellY = yScale(suburb.suburb) || 0;
        const cellW = xScale.bandwidth();
        const cellH = yScale.bandwidth();

        // Calculate normalized color intensity
        let intensityVal: number = suburb.inquiryCount;
        if (col.id === "score") intensityVal = (suburb.demandScore / 100) * maxInquiries;
        if (col.id === "growth") intensityVal = (suburb.growthRatePct / 50) * maxInquiries;

        const cellColor = colorScale(intensityVal);

        const rect = g.append("rect")
          .attr("x", cellX)
          .attr("y", cellY)
          .attr("width", cellW)
          .attr("height", cellH)
          .attr("rx", 6)
          .attr("ry", 6)
          .attr("fill", cellColor)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 1.5)
          .style("cursor", "pointer")
          .style("transition", "transform 0.15s ease, filter 0.15s ease");

        // Cell Text Label
        let displayVal = `${val}`;
        if (col.id === "score") displayVal = `${val}/100`;
        if (col.id === "growth") displayVal = `+${val}%`;
        if (col.id === "budget") displayVal = `R${(suburb.averageBudget / 1000000).toFixed(1)}M`;

        g.append("text")
          .attr("x", cellX + cellW / 2)
          .attr("y", cellY + cellH / 2 + 4)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("font-weight", "700")
          .attr("fill", intensityVal > maxInquiries * 0.5 ? "#ffffff" : "#1e293b")
          .attr("pointer-events", "none")
          .text(displayVal);

        // Tooltip & Click Handlers
        rect
          .on("mouseenter", (event) => {
            rect.attr("stroke", "#1e293b").attr("stroke-width", 2.5);
            const [mouseX, mouseY] = d3.pointer(event, matrixSvgRef.current);
            setTooltipData({
              visible: true,
              x: mouseX + 15,
              y: mouseY + 10,
              title: `${suburb.suburb} — ${col.label}`,
              value: displayVal,
              secondary: `Region: ${suburb.region} | Status: ${suburb.intensityLevel}`
            });
          })
          .on("mouseleave", () => {
            rect.attr("stroke", "#ffffff").attr("stroke-width", 1.5);
            setTooltipData(prev => ({ ...prev, visible: false }));
          })
          .on("click", () => {
            setSelectedSuburb(suburb);
          });
      });
    });

    // Legend
    const legendWidth = 140;
    const legendHeight = 10;
    const legendX = innerWidth - legendWidth;
    const legendY = -35;

    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "heatmap-legend-grad");

    linearGradient.selectAll("stop")
      .data([
        { offset: "0%", color: d3.interpolateYlOrRd(0.1) },
        { offset: "50%", color: d3.interpolateYlOrRd(0.5) },
        { offset: "100%", color: d3.interpolateYlOrRd(0.95) }
      ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    const legendG = g.append("g").attr("transform", `translate(${legendX}, ${legendY})`);
    legendG.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("rx", 3)
      .style("fill", "url(#heatmap-legend-grad)");

    legendG.append("text")
      .attr("x", 0)
      .attr("y", -4)
      .attr("font-size", "9px")
      .attr("fill", "#64748b")
      .text("Lower");

    legendG.append("text")
      .attr("x", legendWidth)
      .attr("y", -4)
      .attr("text-anchor", "end")
      .attr("font-size", "9px")
      .attr("font-weight", "bold")
      .attr("fill", "#b91c1c")
      .text("Very High Density");

  }, [viewMode, filteredSuburbs]);

  // -------------------------------------------------------------
  // D3 SPATIAL BUBBLE MAP RENDER
  // -------------------------------------------------------------
  useEffect(() => {
    if (viewMode !== "spatial" || !spatialSvgRef.current) return;

    const svg = d3.select(spatialSvgRef.current);
    svg.selectAll("*").remove();

    const width = 880;
    const height = 540;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g");

    // Background Gauteng Region Guide Circles
    const regions = [
      { name: "Pretoria & Tshwane Node", cx: 500, cy: 110, r: 90, color: "#e2e8f0" },
      { name: "Midrand & Centurion Corridor", cx: 460, cy: 190, r: 100, color: "#f1f5f9" },
      { name: "Sandton Financial Hub", cx: 370, cy: 300, r: 120, color: "#f8fafc" },
      { name: "East Rand / Modderfontein", cx: 480, cy: 330, r: 90, color: "#f1f5f9" },
      { name: "West Rand & Soweto", cx: 260, cy: 440, r: 95, color: "#f8fafc" }
    ];

    regions.forEach(reg => {
      g.append("circle")
        .attr("cx", reg.cx)
        .attr("cy", reg.cy)
        .attr("r", reg.r)
        .attr("fill", reg.color)
        .attr("stroke", "#cbd5e1")
        .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.7);

      g.append("text")
        .attr("x", reg.cx)
        .attr("y", reg.cy - reg.r + 14)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "600")
        .attr("fill", "#94a3b8")
        .text(reg.name);
    });

    // Connecting Highway Links (N1 corridor representation)
    const links = [
      { x1: 530, y1: 100, x2: 480, y2: 150 }, // Pretoria to Centurion
      { x1: 480, y1: 150, x2: 440, y2: 220 }, // Centurion to Midrand
      { x1: 440, y1: 220, x2: 390, y2: 310 }, // Midrand to Sandton
      { x1: 390, y1: 310, x2: 380, y2: 360 }, // Sandton to Rosebank
      { x1: 390, y1: 310, x2: 470, y2: 310 }, // Sandton to Modderfontein
      { x1: 380, y1: 360, x2: 250, y2: 450 }  // Rosebank to Soweto
    ];

    links.forEach(l => {
      g.append("line")
        .attr("x1", l.x1)
        .attr("y1", l.y1)
        .attr("x2", l.x2)
        .attr("y2", l.y2)
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.6);
    });

    const maxInq: number = Number(d3.max(filteredSuburbs, (d: SuburbDemandData) => d.inquiryCount) ?? 400);
    const rScale = d3.scaleSqrt().domain([0, maxInq]).range([14, 42]);
    const colorScale = d3.scaleSequential()
      .domain([0, maxInq])
      .interpolator(d3.interpolateYlOrRd);

    // Draw Density Bubbles for each Suburb
    filteredSuburbs.forEach(suburb => {
      const radius = rScale(suburb.inquiryCount);
      const cx = suburb.coordinates.x;
      const cy = suburb.coordinates.y;
      const color = colorScale(suburb.inquiryCount);

      // Outer Heat Halo Ring
      g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", radius + 10)
        .attr("fill", color)
        .attr("opacity", 0.22)
        .attr("class", "animate-pulse");

      // Main Node Circle
      const node = g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", radius)
        .attr("fill", color)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2.5)
        .style("cursor", "pointer")
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.15))");

      // Inquiry Number Label in Center
      g.append("text")
        .attr("x", cx)
        .attr("y", cy + 4)
        .attr("text-anchor", "middle")
        .attr("font-size", radius > 22 ? "12px" : "9px")
        .attr("font-weight", "800")
        .attr("fill", suburb.inquiryCount > maxInq * 0.4 ? "#ffffff" : "#1e293b")
        .attr("pointer-events", "none")
        .text(suburb.inquiryCount);

      // Suburb Name Tag beneath Node
      g.append("text")
        .attr("x", cx)
        .attr("y", cy + radius + 14)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "700")
        .attr("fill", "#1e293b")
        .style("text-shadow", "0 1px 2px rgba(255,255,255,0.8)")
        .text(suburb.suburb.split("&")[0].trim());

      // Handlers
      node
        .on("mouseenter", (event) => {
          node.attr("stroke", "#0f172a").attr("stroke-width", 3.5);
          const [mx, my] = d3.pointer(event, spatialSvgRef.current);
          setTooltipData({
            visible: true,
            x: mx + 15,
            y: my + 10,
            title: suburb.suburb,
            value: `${suburb.inquiryCount} active inquiries (${suburb.intensityLevel})`,
            secondary: `Avg Budget: ${formatPriceZAR(suburb.averageBudget, "For Sale")} • +${suburb.growthRatePct}% 30D growth`
          });
        })
        .on("mouseleave", () => {
          node.attr("stroke", "#ffffff").attr("stroke-width", 2.5);
          setTooltipData(prev => ({ ...prev, visible: false }));
        })
        .on("click", () => {
          setSelectedSuburb(suburb);
        });
    });

  }, [viewMode, filteredSuburbs]);

  // Export CSV Data
  const handleExportCSV = () => {
    const headers = [
      "Suburb",
      "Region",
      "Inquiry Density Count",
      "Demand Score (100)",
      "Intensity Level",
      "Average Client Budget (ZAR)",
      "Primary Purpose",
      "Top Inquired Property Type",
      "30-Day Growth (%)",
      "Key Demand Drivers"
    ];

    const rows = filteredSuburbs.map(s => [
      `"${s.suburb}"`,
      `"${s.region}"`,
      s.inquiryCount,
      s.demandScore,
      `"${s.intensityLevel}"`,
      s.averageBudget,
      `"${s.primaryPurpose}"`,
      `"${s.topPropertyType}"`,
      `${s.growthRatePct}%`,
      `"${s.keyDemandDrivers.join("; ")}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `gauteng_property_demand_heatmap_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden space-y-6 p-6" id="property-demand-heatmap-root">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
                Gauteng Property Demand Heatmap
              </h2>
              <p className="text-xs text-gray-500">
                Interactive D3 spatial density analysis tracking client inquiry velocity, buyer budgets, and high-interest nodes.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode & Export Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center border border-gray-200">
            <button
              onClick={() => setViewMode("matrix")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "matrix" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-rose-600" />
              Density Matrix
            </button>
            <button
              onClick={() => setViewMode("spatial")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "spatial" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-amber-600" />
              Gauteng Spatial Map
            </button>
            <button
              onClick={() => setViewMode("ranking")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "ranking" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              Demand Ranking
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Download full suburb demand telemetry as CSV"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-rose-50/60 to-white border border-rose-100 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-rose-700 font-semibold mb-1">
            <span>Total Inquiry Density</span>
            <Flame className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{stats.totalInquiries.toLocaleString()}</div>
          <div className="text-[10px] text-rose-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Real-time Gauteng buyer & tenant signals
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50/60 to-white border border-amber-100 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-amber-700 font-semibold mb-1">
            <span>Average Demand Index</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{stats.avgScore} <span className="text-sm font-normal text-gray-500">/ 100</span></div>
          <div className="text-[10px] text-amber-700 font-medium mt-1">
            {stats.hotSpotCount} suburbs in high-traction tier
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
            <span>Average Buyer Budget</span>
            <Building className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">R{(stats.avgBudget / 1000000).toFixed(1)}M</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">
            Weighted across active inquiries
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50/60 to-white border border-indigo-100 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-indigo-700 font-semibold mb-1">
            <span>Fastest Velocity Node</span>
            <ArrowUpRight className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate mt-1">Midrand & Waterfall</div>
          <div className="text-[10px] text-indigo-600 font-medium mt-1">
            +41% inquiries MoM growth
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Suburb */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search suburb, estate, driver..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-rose-500 w-52"
            />
          </div>

          {/* Region Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-800 font-semibold focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="All">All Gauteng Regions</option>
              {uniqueRegions.map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>

          {/* Purpose Filter */}
          <div className="flex bg-white border border-gray-200 p-0.5 rounded-xl text-xs">
            {(["All", "Buying", "Renting"] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  categoryFilter === cat ? "bg-rose-600 text-white" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Info className="h-3.5 w-3.5 text-gray-400" />
          Click any suburb to view active inquiries & listed inventory
        </div>
      </div>

      {/* Main D3 Heatmap Canvas / Views */}
      <div className="relative bg-slate-50/50 border border-gray-200 rounded-2xl p-4 overflow-x-auto min-h-[420px] flex items-center justify-center">
        {/* Floating Tooltip */}
        {tooltipData.visible && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-950 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-800 max-w-xs transition-opacity duration-150"
            style={{ left: `${tooltipData.x}px`, top: `${tooltipData.y}px` }}
          >
            <div className="font-bold text-amber-400 text-xs">{tooltipData.title}</div>
            <div className="font-semibold text-white mt-0.5 text-sm font-mono">{tooltipData.value}</div>
            <div className="text-[10px] text-slate-400 mt-1">{tooltipData.secondary}</div>
          </div>
        )}

        {/* View 1: D3 Matrix Heatmap */}
        {viewMode === "matrix" && (
          <div className="w-full flex justify-center py-2">
            <svg
              ref={matrixSvgRef}
              className="w-full max-w-4xl h-auto"
              style={{ overflow: "visible" }}
            />
          </div>
        )}

        {/* View 2: D3 Spatial Bubble Topological Map */}
        {viewMode === "spatial" && (
          <div className="w-full flex justify-center py-2">
            <svg
              ref={spatialSvgRef}
              className="w-full max-w-4xl h-auto"
              style={{ overflow: "visible" }}
            />
          </div>
        )}

        {/* View 3: Demand Ranking Table */}
        {viewMode === "ranking" && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase font-mono text-[10px] bg-white">
                  <th className="py-3 px-4">Rank & Suburb</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Inquiry Density</th>
                  <th className="py-3 px-4">Demand Score</th>
                  <th className="py-3 px-4">Intensity</th>
                  <th className="py-3 px-4">Avg Budget</th>
                  <th className="py-3 px-4">30D Velocity</th>
                  <th className="py-3 px-4">Top Asset Type</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredSuburbs
                  .sort((a, b) => b.inquiryCount - a.inquiryCount)
                  .map((suburb, idx) => (
                    <tr
                      key={suburb.id}
                      onClick={() => setSelectedSuburb(suburb)}
                      className="hover:bg-rose-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          idx < 3 ? "bg-amber-400 text-slate-950 font-mono shadow-sm" : "bg-gray-100 text-gray-600"
                        }`}>
                          {idx + 1}
                        </span>
                        {suburb.suburb}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">{suburb.region}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-600">
                        {suburb.inquiryCount} leads
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-rose-600 h-full rounded-full"
                              style={{ width: `${suburb.demandScore}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-semibold">{suburb.demandScore}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          suburb.intensityLevel === "Very High"
                            ? "bg-rose-100 text-rose-700 border border-rose-200"
                            : suburb.intensityLevel === "High"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}>
                          {suburb.intensityLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-gray-800">
                        {formatPriceZAR(suburb.averageBudget, "For Sale")}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">
                        +{suburb.growthRatePct}%
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 text-[11px] truncate max-w-xs">
                        {suburb.topPropertyType}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 bg-gray-100 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Suburb Detail Modal / Slide-out */}
      {selectedSuburb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden space-y-6 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200">
                  <Flame className="h-6 w-6" />
                </span>
                <div>
                  <div className="text-[10px] font-mono font-bold text-rose-600 uppercase tracking-widest">
                    {selectedSuburb.region} Node
                  </div>
                  <h3 className="text-xl font-black text-gray-900">{selectedSuburb.suburb}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedSuburb(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Demand Score</span>
                <div className="text-xl font-black text-rose-600 font-mono mt-0.5">
                  {selectedSuburb.demandScore} / 100
                </div>
                <span className="text-[9px] font-bold text-gray-600">{selectedSuburb.intensityLevel} Density</span>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Inquiries / Velocity</span>
                <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                  {selectedSuburb.inquiryCount}
                </div>
                <span className="text-[9px] font-bold text-emerald-600">+{selectedSuburb.growthRatePct}% 30-Day Growth</span>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Average Client Budget</span>
                <div className="text-xl font-black text-amber-700 font-mono mt-0.5">
                  R{(selectedSuburb.averageBudget / 1000000).toFixed(1)}M
                </div>
                <span className="text-[9px] font-bold text-gray-600">{selectedSuburb.primaryPurpose} Orientation</span>
              </div>
            </div>

            {/* Key Catalysts & Drivers */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5 font-mono">
                <Zap className="h-4 w-4 text-amber-500" />
                Key Demand Catalysts in {selectedSuburb.suburb}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedSuburb.keyDemandDrivers.map((driver, i) => (
                  <div key={i} className="flex items-start gap-2 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl text-xs text-gray-700">
                    <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Listed Properties in this Suburb */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-mono flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-rose-600" />
                  Currently Listed Properties in {selectedSuburb.suburb.split("&")[0].trim()}
                </h4>
                <span className="text-xs text-gray-500 font-mono">
                  {properties.filter(p => p.location.toLowerCase().includes(selectedSuburb.suburb.split("&")[0].trim().toLowerCase())).length} active
                </span>
              </div>

              {properties.filter(p => p.location.toLowerCase().includes(selectedSuburb.suburb.split("&")[0].trim().toLowerCase())).length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500">No active listings matching this suburb directly in the catalog.</p>
                  <p className="text-[10px] text-gray-400 mt-1">High tenant/buyer demand presents a prime opportunity to sign new mandates here!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {properties
                    .filter(p => p.location.toLowerCase().includes(selectedSuburb.suburb.split("&")[0].trim().toLowerCase()))
                    .map(prop => (
                      <div
                        key={prop.id}
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.imageUrl}
                            alt={prop.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-gray-900">{prop.title}</div>
                            <div className="text-[10px] text-gray-500">{prop.location} • {prop.type}</div>
                            <div className="text-xs font-mono font-bold text-brand-primary">
                              {formatPriceZAR(prop.price, prop.status)}
                            </div>
                          </div>
                        </div>

                        {onSelectProperty && (
                          <button
                            onClick={() => {
                              onSelectProperty(prop);
                              setSelectedSuburb(null);
                            }}
                            className="px-3 py-1.5 bg-brand-primary text-white text-[10px] font-bold uppercase rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-1"
                          >
                            View
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSuburb(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Close Suburb Drilldown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
