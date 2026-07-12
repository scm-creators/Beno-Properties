/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PlusCircle, ListCollapse, UserCheck, Inbox, Trash2, Edit2, ShieldAlert, Check, Sparkles, Image, Eye } from "lucide-react";
import { Property, PropertyType, PropertyStatus, ListPropertySubmission, EmailAlertSubscription, PropertyFinderRequest, ContactMessage } from "../types";
import { formatPriceZAR } from "./PropertyCard";
import { GAUTENG_SUBURBS } from "../data";

interface AdminPanelProps {
  properties: Property[];
  onAddProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onUpdateProperty: (property: Property) => void;
  listSubmissions: ListPropertySubmission[];
  alertSubscriptions: EmailAlertSubscription[];
  finderRequests: PropertyFinderRequest[];
  contactMessages: ContactMessage[];
}

// Pre-defined high quality unsplash images for easy selection
const OPTIONAL_IMAGES = [
  { name: "Modern Estate", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
  { name: "Luxury Penthouse", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" },
  { name: "Suburban Residence", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" },
  { name: "Executive Townhouse", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" },
  { name: "Glass Office Suite", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
  { name: "High-Volume Warehouse", url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" },
];

export default function AdminPanel({
  properties,
  onAddProperty,
  onDeleteProperty,
  onUpdateProperty,
  listSubmissions,
  alertSubscriptions,
  finderRequests,
  contactMessages,
}: AdminPanelProps) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<"manage" | "add" | "leads">("manage");

  // Add Property Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PropertyType>("House");
  const [status, setStatus] = useState<PropertyStatus>("For Sale");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState(GAUTENG_SUBURBS[0]);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState("");
  const [sizeSqM, setSizeSqM] = useState("");
  const [imageUrl, setImageUrl] = useState(OPTIONAL_IMAGES[0].url);
  const [customImage, setCustomImage] = useState(false);
  const [customImageUrlInput, setCustomImageUrlInput] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  // Edit Inline States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStatus, setEditStatus] = useState<PropertyStatus>("For Sale");

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = customImage ? customImageUrlInput || OPTIONAL_IMAGES[0].url : imageUrl;
    const refId = `BENO-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProp: Property = {
      id: refId,
      title,
      description,
      type,
      status,
      price: Number(price) || 0,
      location,
      city: "Johannesburg", // default
      province: "Gauteng",
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      parkingSpaces: parkingSpaces ? Number(parkingSpaces) : undefined,
      sizeSqM: sizeSqM ? Number(sizeSqM) : undefined,
      imageUrl: finalImage,
      agentId: "BENO-AGT-1", // default to admin/founder
      isFeatured: true,
      createdAt: new Date().toISOString(),
    };

    onAddProperty(newProp);
    setIsSuccess(true);

    // reset Form
    setTitle("");
    setDescription("");
    setPrice("");
    setBedrooms("");
    setBathrooms("");
    setParkingSpaces("");
    setSizeSqM("");
    setCustomImageUrlInput("");
    setCustomImage(false);

    setTimeout(() => {
      setIsSuccess(false);
      setActiveAdminSubTab("manage");
    }, 2500);
  };

  const handleStartEditing = (property: Property) => {
    setEditingId(property.id);
    setEditPrice(property.price.toString());
    setEditStatus(property.status);
  };

  const handleSaveInline = (property: Property) => {
    onUpdateProperty({
      ...property,
      price: Number(editPrice) || property.price,
      status: editStatus,
    });
    setEditingId(null);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl" id="admin-panel">
      {/* Admin Title banner */}
      <div className="p-6 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-brand-primary rounded-full animate-ping" />
            <h2 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
              Beno Back-Office Console
            </h2>
          </div>
          <p className="text-gray-500 text-xs mt-0.5">
            Admin sandbox workspace: Upload, edit real estate catalogs, and manage inbound leads instantly.
          </p>
        </div>

        {/* Sub-tabs toggling */}
        <div className="flex bg-white border border-gray-200 p-1 rounded-xl" id="admin-sub-tabs">
          <button
            onClick={() => setActiveAdminSubTab("manage")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
              activeAdminSubTab === "manage"
                ? "bg-brand-primary text-white font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <ListCollapse className="h-3.5 w-3.5" />
            Manage Listings
          </button>
          <button
            onClick={() => setActiveAdminSubTab("add")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
              activeAdminSubTab === "add"
                ? "bg-brand-primary text-white font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add Property
          </button>
          <button
            onClick={() => setActiveAdminSubTab("leads")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
              activeAdminSubTab === "leads"
                ? "bg-brand-primary text-white font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Inbox className="h-3.5 w-3.5" />
            Client Leads ({listSubmissions.length + alertSubscriptions.length + finderRequests.length + contactMessages.length})
          </button>
        </div>
      </div>

      {/* Admin Panel Body content */}
      <div className="p-6 sm:p-8" id="admin-workspace-pane">
        {/* TAB 1: MANAGE LISTINGS */}
        {activeAdminSubTab === "manage" && (
          <div className="space-y-6" id="admin-manage-listings">
            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2 font-bold">
              Current Property Catalog ({properties.length} Active Listings)
            </h3>

            <div className="overflow-x-auto border border-gray-200 rounded-xl" id="listings-table-container">
              <table className="w-full text-left border-collapse text-sm text-gray-750">
                <thead className="bg-gray-50 text-gray-500 font-mono text-xs uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="p-4">Reference / Image</th>
                    <th className="p-4">Property Title</th>
                    <th className="p-4">Location & Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Image / Ref ID */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.imageUrl}
                            alt={prop.id}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200"
                          />
                          <span className="font-mono text-xs text-brand-secondary font-semibold">{prop.id}</span>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="p-4 font-semibold text-gray-900 max-w-xs truncate" title={prop.title}>
                        {prop.title}
                      </td>

                      {/* Location & Type */}
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-medium">{prop.location}</span>
                          <span className="text-[10px] font-mono text-gray-400 uppercase">{prop.type}</span>
                        </div>
                      </td>

                      {/* Status (inline editable) */}
                      <td className="p-4 font-mono text-xs">
                        {editingId === prop.id ? (
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as PropertyStatus)}
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-800"
                          >
                            <option value="For Sale">For Sale</option>
                            <option value="To Rent">To Rent</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                              prop.status === "For Sale"
                                ? "bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20"
                                : "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                            }`}
                          >
                            {prop.status}
                          </span>
                        )}
                      </td>

                      {/* Price (inline editable) */}
                      <td className="p-4 text-right font-mono font-bold text-gray-800">
                        {editingId === prop.id ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-right text-gray-800 w-28"
                          />
                        ) : (
                          formatPriceZAR(prop.price, prop.status)
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {editingId === prop.id ? (
                            <button
                              onClick={() => handleSaveInline(prop)}
                              className="p-1.5 bg-brand-primary text-white rounded hover:bg-brand-hover transition-colors cursor-pointer"
                              title="Save Changes"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEditing(prop)}
                              className="p-1.5 bg-gray-100 text-gray-500 hover:text-gray-900 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                              title="Quick Edit Status/Price"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${prop.id}?`)) {
                                onDeleteProperty(prop.id);
                              }
                            }}
                            className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 hover:text-red-750 transition-colors border border-red-200 cursor-pointer"
                            title="Delete Listing"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ADD NEW PROPERTY */}
        {activeAdminSubTab === "add" && (
          <div className="space-y-6" id="admin-add-property">
            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2 flex items-center gap-1.5 font-bold">
              <PlusCircle className="h-4 w-4 text-brand-primary animate-pulse" />
              Upload & Publish New Listing
            </h3>

            {isSuccess ? (
              <div className="py-12 bg-gray-55/50 rounded-2xl border border-gray-200 text-center space-y-3" id="admin-add-success">
                <div className="mx-auto bg-brand-primary/10 text-brand-primary p-4 rounded-full w-16 h-16 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 animate-spin" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Listing Published Successfully!</h4>
                <p className="text-gray-500 text-xs">
                  Your new real estate listing is immediately live in the client catalog for filtering and search queries.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateProperty} className="space-y-5" id="form-admin-add-listing">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Listing Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Elegant 3 Bedroom Midrand Cluster"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Gauteng Suburb *</label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all cursor-pointer"
                    >
                      {GAUTENG_SUBURBS.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Property Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as PropertyType)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Vacant Land">Vacant Land</option>
                      <option value="Farm">Farm</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Listing Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="For Sale">For Sale</option>
                      <option value="To Rent">To Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Asking Price (ZAR) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 2400000"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Total Size (m²)</label>
                    <input
                      type="number"
                      value={sizeSqM}
                      onChange={(e) => setSizeSqM(e.target.value)}
                      placeholder="Floor size m²"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Bedrooms</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      placeholder="e.g. 3"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Bathrooms</label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      placeholder="e.g. 2"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Parking Bays / Garages</label>
                    <input
                      type="number"
                      value={parkingSpaces}
                      onChange={(e) => setParkingSpaces(e.target.value)}
                      placeholder="e.g. 2"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Cover Image Selector */}
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase font-mono">
                      <Image className="h-4 w-4 text-brand-primary" />
                      Property Cover Image
                    </span>
                    <button
                      type="button"
                      onClick={() => setCustomImage(!customImage)}
                      className="text-xs text-brand-primary hover:underline cursor-pointer font-semibold"
                    >
                      {customImage ? "Select Pre-defined Image" : "Paste Custom URL"}
                    </button>
                  </div>

                  {customImage ? (
                    <div>
                      <input
                        type="url"
                        value={customImageUrlInput}
                        onChange={(e) => setCustomImageUrlInput(e.target.value)}
                        placeholder="Paste full public image link (https://...)"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary font-mono"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {OPTIONAL_IMAGES.map((img) => (
                        <button
                          key={img.name}
                          type="button"
                          onClick={() => setImageUrl(img.url)}
                          className={`relative aspect-video rounded-lg overflow-hidden bg-white border cursor-pointer transition-all ${
                            imageUrl === img.url ? "border-brand-primary ring-2 ring-brand-primary/20 scale-[1.02]" : "border-gray-200"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 right-1 text-[8px] bg-gray-900/80 backdrop-blur-md py-0.5 px-1 font-mono text-white rounded text-center truncate">
                            {img.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Property Description & Key Amenities *</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a comprehensive description detailing layout, security, back-up solar, gardens, proximity to malls or highways..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-brand-primary hover:bg-brand-hover text-white font-extrabold rounded-full text-sm uppercase tracking-wider cursor-pointer shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="h-5 w-5" />
                    Publish Real Estate Listing
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: CLIENT LEADS & REQUESTS */}
        {activeAdminSubTab === "leads" && (
          <div className="space-y-8" id="admin-leads-manager">
            {/* Lead Section 1: Property Finder */}
            <div className="space-y-3" id="finder-leads-section">
              <h3 className="text-xs font-mono text-brand-primary uppercase tracking-widest border-b border-gray-200 pb-1.5 flex items-center gap-1.5 font-bold">
                <Sparkles className="h-4 w-4" />
                Property Finder Inquiries ({finderRequests.length})
              </h3>

              {finderRequests.length === 0 ? (
                <p className="text-gray-400 text-xs py-3 font-mono">No property finder requests received yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {finderRequests.map((req) => (
                    <div key={req.id} className="bg-white border border-gray-200 p-5 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-xs font-extrabold text-gray-900">{req.name}</span>
                        <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded border border-brand-secondary/15">
                          {req.id}
                        </span>
                      </div>
                      <div className="text-xs space-y-1 text-gray-600 font-mono">
                        <div><strong className="text-gray-400">Email:</strong> {req.email}</div>
                        <div><strong className="text-gray-400">Phone:</strong> {req.phone}</div>
                        <div><strong className="text-gray-400">Target Suburbs:</strong> {req.specificAreas}</div>
                        <div><strong className="text-gray-400">Budget Range:</strong> {formatPriceZAR(req.minPrice, "For Sale")} to {formatPriceZAR(req.maxPrice, "For Sale")}</div>
                        <div><strong className="text-gray-400">Beds Required:</strong> {req.bedrooms}+ Beds</div>
                      </div>
                      {req.additionalNotes && (
                        <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-xs text-gray-500 leading-relaxed italic">
                          "{req.additionalNotes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lead Section 2: Sell Your Property */}
            <div className="space-y-3" id="sell-leads-section">
              <h3 className="text-xs font-mono text-brand-primary uppercase tracking-widest border-b border-gray-200 pb-1.5 flex items-center gap-1.5 font-bold">
                <UserCheck className="h-4 w-4" />
                Sellers & Landlords Listing Requests ({listSubmissions.length})
              </h3>

              {listSubmissions.length === 0 ? (
                <p className="text-gray-400 text-xs py-3 font-mono">No landlord listing requests received yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listSubmissions.map((req) => (
                    <div key={req.id} className="bg-white border border-gray-200 p-5 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-xs font-extrabold text-gray-900">{req.ownerName}</span>
                        <span className="font-mono text-[9px] text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/15">
                          {req.id}
                        </span>
                      </div>
                      <div className="text-xs space-y-1 text-gray-600 font-mono">
                        <div><strong className="text-gray-400">Email:</strong> {req.ownerEmail}</div>
                        <div><strong className="text-gray-400">Phone:</strong> {req.ownerPhone}</div>
                        <div><strong className="text-gray-400">Property Title:</strong> {req.propertyTitle}</div>
                        <div><strong className="text-gray-400">Type / Status:</strong> {req.propertyType} ({req.status})</div>
                        <div><strong className="text-gray-400">Expected Value:</strong> {formatPriceZAR(req.expectedPrice, req.status)}</div>
                        <div><strong className="text-gray-400">Location:</strong> {req.location}</div>
                        <div><strong className="text-gray-400">Beds / Baths:</strong> {req.bedrooms ?? "—"} Beds / {req.bathrooms ?? "—"} Baths</div>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-xs text-gray-500 leading-relaxed italic">
                        "{req.description}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lead Section 3: Contact Inquiries */}
            <div className="space-y-3" id="contact-leads-section">
              <h3 className="text-xs font-mono text-brand-primary uppercase tracking-widest border-b border-gray-200 pb-1.5 flex items-center gap-1.5 font-bold">
                <Inbox className="h-4 w-4" />
                Property Inquiries & General Messages ({contactMessages.length})
              </h3>

              {contactMessages.length === 0 ? (
                <p className="text-gray-400 text-xs py-3 font-mono">No public contact inquiries received yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactMessages.map((req) => (
                    <div key={req.id} className="bg-white border border-gray-200 p-5 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-xs font-extrabold text-gray-900">{req.name}</span>
                        <div className="flex gap-1">
                          {req.propertyRefId && (
                            <span className="font-mono text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                              REF: {req.propertyRefId}
                            </span>
                          )}
                          <span className="font-mono text-[9px] text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded border border-brand-secondary/15">
                            {req.id}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs space-y-1 text-gray-600 font-mono">
                        <div><strong className="text-gray-400">Email:</strong> {req.email}</div>
                        <div><strong className="text-gray-400">Phone:</strong> {req.phone}</div>
                        <div><strong className="text-gray-400">Submitted:</strong> {new Date(req.submittedAt).toLocaleTimeString()} {new Date(req.submittedAt).toLocaleDateString()}</div>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-xs text-gray-500 leading-relaxed italic">
                        "{req.message}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lead Section 4: Email Alerts subscriptions */}
            <div className="space-y-3" id="alert-leads-section">
              <h3 className="text-xs font-mono text-brand-primary uppercase tracking-widest border-b border-gray-200 pb-1.5 flex items-center gap-1.5 font-bold">
                <ShieldAlert className="h-4 w-4" />
                Email Subscriptions ({alertSubscriptions.length})
              </h3>

              {alertSubscriptions.length === 0 ? (
                <p className="text-gray-400 text-xs py-3 font-mono">No active email subscribers yet.</p>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-4 overflow-x-auto shadow-sm">
                  <table className="w-full text-left text-xs font-mono text-gray-600">
                    <thead className="text-gray-450 border-b border-gray-250">
                      <tr>
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Email Address</th>
                        <th className="pb-2">Target Suburb</th>
                        <th className="pb-2">Budget</th>
                        <th className="pb-2">Filter preference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {alertSubscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="py-2.5 text-gray-900 font-bold">{sub.name}</td>
                          <td className="py-2.5">{sub.email}</td>
                          <td className="py-2.5">{sub.location}</td>
                          <td className="py-2.5 text-gray-500">{formatPriceZAR(sub.maxPrice, "For Sale")}</td>
                          <td className="py-2.5 text-brand-secondary font-bold">
                            {sub.preferredType} ({sub.preferredStatus})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
