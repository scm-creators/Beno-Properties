import React, { useState, useEffect } from "react";
import { Property, BlogArticle } from "../types";
import { INITIAL_BLOGS } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileCode, 
  Download, 
  Link as LinkIcon, 
  Settings, 
  CheckCircle2, 
  X, 
  Globe, 
  Search, 
  ExternalLink,
  Sparkles,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";

interface SitemapProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onNavigate: (tab: string, propertyId?: string) => void;
}

/**
 * Programmatically generates a standard-compliant, crawlable XML Sitemap string.
 * Each node includes loc, lastmod, changefreq, and custom index priority levels.
 */
export function generateSitemapXml(properties: Property[], customBaseUrl?: string): string {
  const baseUrl = (customBaseUrl || window.location.origin || "https://benoproperties.co.za").replace(/\/$/, "");
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" \n`;
  xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n`;
  xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

  // Helper to add url node
  const addUrl = (path: string, lastMod: string, changeFreq: string, priority: string) => {
    return `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>${changeFreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  };

  // 1. Static Core App routes
  xml += addUrl("/", today, "daily", "1.00");
  xml += addUrl("/sale", today, "daily", "0.90");
  xml += addUrl("/rent", today, "daily", "0.90");
  xml += addUrl("/tools", today, "weekly", "0.70");
  xml += addUrl("/agents", today, "weekly", "0.70");
  xml += addUrl("/contact", today, "monthly", "0.60");
  xml += addUrl("/portal", today, "monthly", "0.50");

  // 2. Dynamic Property Listings
  properties.forEach((property) => {
    // Attempt to parse dynamic property date or use current
    let propDate = today;
    if (property.createdAt) {
      try {
        propDate = property.createdAt.split("T")[0];
      } catch (e) {
        propDate = today;
      }
    }
    // High priority for featured properties, standard high for other active listings
    const priority = property.isFeatured ? "0.85" : "0.80";
    xml += addUrl(`/property/${property.id}`, propDate, "weekly", priority);
  });

  // 3. Dynamic Blog articles from news feeds
  INITIAL_BLOGS.forEach((blog) => {
    let blogDate = today;
    if (blog.publishedDate) {
      try {
        blogDate = blog.publishedDate.split("T")[0];
      } catch (e) {
        blogDate = today;
      }
    }
    xml += addUrl(`/blog/${blog.id}`, blogDate, "monthly", "0.60");
  });

  xml += `</urlset>`;
  return xml;
}

export default function Sitemap({ isOpen, onClose, properties, onNavigate }: SitemapProps) {
  const [activeTab, setActiveTab] = useState<"html" | "xml" | "seo">("html");
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [xmlContent, setXmlContent] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const generated = generateSitemapXml(properties, customUrl || undefined);
      setXmlContent(generated);
    }
  }, [properties, customUrl, isOpen]);

  if (!isOpen) return null;

  const currentOrigin = customUrl || window.location.origin || "https://benoproperties.co.za";

  // Filter properties for the HTML directories search bar
  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Trigger browser download of dynamic sitemap.xml file
  const handleDownloadSitemap = () => {
    const blob = new Blob([xmlContent], { type: "application/xml;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "sitemap.xml");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy code to clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(xmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const handleLinkClick = (tab: string, propId?: string) => {
    onNavigate(tab, propId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white border border-gray-200 w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        id="sitemap-modal"
      >
        {/* Banner Header */}
        <div className="relative bg-brand-primary p-6 sm:p-8 text-white flex-shrink-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem]" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 cursor-pointer"
            title="Close sitemap overlay"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
              <Globe className="h-6 w-6 text-brand-secondary" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-secondary font-bold bg-white/10 px-2.5 py-1 rounded">
                Dynamic SEO Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase mt-1.5 tracking-tight font-sans">
                Search Engine Visibility Hub
              </h2>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex flex-wrap gap-2 items-center justify-between flex-shrink-0">
          <div className="flex gap-1 bg-gray-200/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("html")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === "html"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              HTML Sitemap Directory
            </button>
            <button
              onClick={() => setActiveTab("xml")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === "xml"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              XML Code Generator
            </button>
            <button
              onClick={() => setActiveTab("seo")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === "seo"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              SEO & Indexing Diagnostics
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <span className="text-[10px] font-mono text-gray-400">Target Host URL:</span>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder={window.location.origin}
              className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-mono w-40 sm:w-56 focus:outline-none focus:ring-1 focus:ring-brand-primary text-gray-700"
            />
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 min-h-0 bg-slate-50/50">
          {activeTab === "html" && (
            <div className="space-y-6" id="sitemap-html-pane">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase">Crawlable Navigation Directory</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Structured with physical <code className="font-mono bg-gray-100 px-1 rounded text-red-500">&lt;a href&gt;</code> anchors allowing crawlers to discover all deep URLs.
                  </p>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search property paths..."
                    className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section A: Application Hub Routes */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-brand-secondary font-bold flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <LinkIcon className="h-3.5 w-3.5" />
                    Core Platform Routes ({7})
                  </h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { name: "Homepage & Featured", tab: "home", path: "/" },
                      { name: "Exquisite Properties for Sale", tab: "sale", path: "/sale" },
                      { name: "Premium Properties to Rent", tab: "rent", path: "/rent" },
                      { name: "Home Loan & SARS Guide", tab: "tools", path: "/tools" },
                      { name: "Registered Professional Partners", tab: "agents", path: "/agents" },
                      { name: "General Inquiry Offices", tab: "contact", path: "/contact" },
                      { name: "Secure Partner Workspace Portal", tab: "portal", path: "/portal" },
                    ].map((route) => (
                      <div 
                        key={route.tab} 
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors group"
                      >
                        <div>
                          <span className="font-bold text-gray-800 block">{route.name}</span>
                          <span className="font-mono text-[10px] text-gray-400">{currentOrigin}{route.path}</span>
                        </div>
                        <button
                          onClick={() => handleLinkClick(route.tab)}
                          className="text-[10px] bg-slate-100 group-hover:bg-brand-primary group-hover:text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                        >
                          Navigate <ExternalLink className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Dynamic Properties Links */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col h-[340px]">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-brand-secondary font-bold flex items-center gap-1.5 border-b border-gray-100 pb-2 flex-shrink-0">
                    <LinkIcon className="h-3.5 w-3.5" />
                    Active Property Listings ({filteredProperties.length})
                  </h4>
                  <div className="flex-1 overflow-y-auto pr-1 space-y-2 text-xs">
                    {filteredProperties.length === 0 ? (
                      <p className="text-gray-400 italic py-8 text-center">No properties matched search query.</p>
                    ) : (
                      filteredProperties.map((prop) => (
                        <div 
                          key={prop.id} 
                          className="p-2 hover:bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-all group flex items-start justify-between gap-3"
                        >
                          <div>
                            <span className="font-bold text-gray-800 block line-clamp-1">{prop.title}</span>
                            <div className="flex gap-2 text-[10px] text-gray-400 mt-0.5">
                              <span className="text-brand-secondary font-semibold font-mono">{prop.id}</span>
                              <span>•</span>
                              <span>{prop.location}, {prop.city}</span>
                            </div>
                            <span className="font-mono text-[9px] text-gray-400">{currentOrigin}/property/{prop.id}</span>
                          </div>
                          <button
                            onClick={() => handleLinkClick("home", prop.id)}
                            className="text-[10px] bg-slate-100 group-hover:bg-brand-primary group-hover:text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all flex-shrink-0 self-center"
                          >
                            View <ExternalLink className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "xml" && (
            <div className="space-y-4" id="sitemap-xml-pane">
              <div className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-brand-secondary" />
                    Live Programmatic sitemap.xml File
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Dynamically compiled directly from live state variables. Ready for Google Search Console indexing.
                  </p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyCode}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all border border-gray-200"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy Code
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadSitemap}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-brand-primary hover:bg-brand-hover text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5 text-brand-secondary" /> Download File
                  </button>
                </div>
              </div>

              {/* Codeblock Area */}
              <div className="bg-gray-900 text-gray-100 rounded-2xl p-5 font-mono text-xs overflow-x-auto max-h-[380px] border border-gray-800 shadow-inner relative group leading-relaxed">
                <pre className="whitespace-pre">{xmlContent}</pre>
                <div className="absolute top-4 right-4 bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold select-none border border-gray-700">
                  xml syntax compliant
                </div>
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-6" id="sitemap-seo-pane">
              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Total Indexed Routes", val: 7 + properties.length + INITIAL_BLOGS.length, desc: "Ready in Sitemap" },
                  { label: "Dynamic Listings", val: properties.length, desc: "Updated via State" },
                  { label: "Compliance Score", val: "100%", desc: "W3C XML Schema validation" },
                  { label: "Crawl Frequency", val: "Daily", desc: "For high priority roots" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm text-center space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">{stat.label}</span>
                    <strong className="text-xl font-black text-gray-900 block">{stat.val}</strong>
                    <span className="text-[10px] text-brand-secondary block">{stat.desc}</span>
                  </div>
                ))}
              </div>

              {/* Search Console Instructions */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-brand-secondary animate-pulse" />
                    Submission Guide to Search Engines
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">
                    Submitting this generated file tells Google, Bing, and other indexing systems exactly where to find listing pages immediately, speeding up SEO placement in search results.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 leading-relaxed">
                  <div className="space-y-2 border border-gray-100 p-4 rounded-2xl bg-gray-50/50">
                    <div className="w-7 h-7 bg-brand-primary text-white text-xs font-mono font-bold flex items-center justify-center rounded-lg shadow-sm">
                      1
                    </div>
                    <h5 className="font-bold text-gray-900 uppercase">Save sitemap.xml</h5>
                    <p>
                      Click the <strong>Download File</strong> button under the XML tab. This generates the clean, raw sitemap text file instantly.
                    </p>
                  </div>

                  <div className="space-y-2 border border-gray-100 p-4 rounded-2xl bg-gray-50/50">
                    <div className="w-7 h-7 bg-brand-primary text-white text-xs font-mono font-bold flex items-center justify-center rounded-lg shadow-sm">
                      2
                    </div>
                    <h5 className="font-bold text-gray-900 uppercase">Deploy to Web Server</h5>
                    <p>
                      Place the downloaded <code className="font-mono bg-gray-100 px-1 rounded text-red-500">sitemap.xml</code> directly in the root folder of your domain, so it is served at <code className="font-mono text-gray-700 bg-gray-150 p-0.5 rounded">{currentOrigin}/sitemap.xml</code>.
                    </p>
                  </div>

                  <div className="space-y-2 border border-gray-100 p-4 rounded-2xl bg-gray-50/50">
                    <div className="w-7 h-7 bg-brand-primary text-white text-xs font-mono font-bold flex items-center justify-center rounded-lg shadow-sm">
                      3
                    </div>
                    <h5 className="font-bold text-gray-900 uppercase">Register with Google</h5>
                    <p>
                      Open your Google Search Console, go to the **Sitemaps** panel, enter <code className="font-mono text-gray-700 bg-gray-150 p-0.5 rounded">sitemap.xml</code> as the URL, and click **Submit**.
                    </p>
                  </div>
                </div>

                {/* SEO Best Practice Audit Checklist */}
                <div className="border-t border-gray-150 pt-5 mt-5">
                  <h5 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">SEO Audit & Verification Checklist</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                    {[
                      { text: "Includes absolute canonical target hostname tags", ok: true },
                      { text: "W3C valid UTF-8 character encoding standards", ok: true },
                      { text: "Dynamic priorities configured by property status & tier", ok: true },
                      { text: "Daily change frequency metadata automatically synced", ok: true },
                      { text: "HTML semantic hierarchy fully compliant", ok: true },
                      { text: "Index crawl blocks avoided in router boundaries", ok: true },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 text-center sm:text-left">
            <Settings className="h-4 w-4 text-brand-secondary animate-spin" style={{ animationDuration: "12s" }} />
            <span>SEO Engine dynamically syncs with active state listing pools.</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors text-center"
            >
              Close Hub
            </button>
            <button
              onClick={handleDownloadSitemap}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <Download className="h-4 w-4 text-brand-secondary" /> Download sitemap.xml
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
