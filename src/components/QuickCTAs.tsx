/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ClipboardList, BellRing, Compass, Calculator, X, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PropertyType, PropertyStatus, ListPropertySubmission, EmailAlertSubscription, PropertyFinderRequest } from "../types";

interface QuickCTAsProps {
  onAddListProperty: (submission: ListPropertySubmission) => void;
  onAddEmailAlert: (subscription: EmailAlertSubscription) => void;
  onAddPropertyFinder: (request: PropertyFinderRequest) => void;
  onOpenCalculator: () => void;
}

export default function QuickCTAs({
  onAddListProperty,
  onAddEmailAlert,
  onAddPropertyFinder,
  onOpenCalculator,
}: QuickCTAsProps) {
  const [activeModal, setActiveModal] = useState<"list" | "alert" | "finder" | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form States - List Property
  const [listOwnerName, setListOwnerName] = useState("");
  const [listOwnerEmail, setListOwnerEmail] = useState("");
  const [listOwnerPhone, setListOwnerPhone] = useState("");
  const [listTitle, setListTitle] = useState("");
  const [listType, setListType] = useState<PropertyType>("House");
  const [listStatus, setListStatus] = useState<PropertyStatus>("For Sale");
  const [listPrice, setListPrice] = useState("");
  const [listLocation, setListLocation] = useState("");
  const [listBedrooms, setListBedrooms] = useState("");
  const [listBathrooms, setListBathrooms] = useState("");
  const [listDesc, setListDesc] = useState("");

  // Form States - Email Alerts
  const [alertName, setAlertName] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertType, setAlertType] = useState<PropertyType | "Any">("Any");
  const [alertStatus, setAlertStatus] = useState<PropertyStatus | "Any">("Any");
  const [alertMaxPrice, setAlertMaxPrice] = useState("");
  const [alertLocation, setAlertLocation] = useState("");

  // Form States - Property Finder
  const [finderName, setFinderName] = useState("");
  const [finderEmail, setFinderEmail] = useState("");
  const [finderPhone, setFinderPhone] = useState("");
  const [finderMinPrice, setFinderMinPrice] = useState("");
  const [finderMaxPrice, setFinderMaxPrice] = useState("");
  const [finderBedrooms, setFinderBedrooms] = useState("3");
  const [finderAreas, setFinderAreas] = useState("");
  const [finderNotes, setFinderNotes] = useState("");

  const resetForms = () => {
    setActiveModal(null);
    setIsSuccess(false);

    // List Property Reset
    setListOwnerName("");
    setListOwnerEmail("");
    setListOwnerPhone("");
    setListTitle("");
    setListPrice("");
    setListLocation("");
    setListBedrooms("");
    setListBathrooms("");
    setListDesc("");

    // Email Alerts Reset
    setAlertName("");
    setAlertEmail("");
    setAlertMaxPrice("");
    setAlertLocation("");

    // Property Finder Reset
    setFinderName("");
    setFinderEmail("");
    setFinderPhone("");
    setFinderMinPrice("");
    setFinderMaxPrice("");
    setFinderAreas("");
    setFinderNotes("");
  };

  const handleListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submission: ListPropertySubmission = {
      id: `LIST-${Date.now().toString().slice(-4)}`,
      ownerName: listOwnerName,
      ownerEmail: listOwnerEmail,
      ownerPhone: listOwnerPhone,
      propertyTitle: listTitle,
      propertyType: listType,
      status: listStatus,
      expectedPrice: Number(listPrice) || 0,
      location: listLocation,
      bedrooms: listBedrooms ? Number(listBedrooms) : undefined,
      bathrooms: listBathrooms ? Number(listBathrooms) : undefined,
      description: listDesc,
      submittedAt: new Date().toISOString(),
    };
    onAddListProperty(submission);
    setIsSuccess(true);
  };

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subscription: EmailAlertSubscription = {
      id: `ALRT-${Date.now().toString().slice(-4)}`,
      name: alertName,
      email: alertEmail,
      preferredType: alertType,
      preferredStatus: alertStatus,
      maxPrice: Number(alertMaxPrice) || 99999999,
      location: alertLocation,
      submittedAt: new Date().toISOString(),
    };
    onAddEmailAlert(subscription);
    setIsSuccess(true);
  };

  const handleFinderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request: PropertyFinderRequest = {
      id: `FNDR-${Date.now().toString().slice(-4)}`,
      name: finderName,
      email: finderEmail,
      phone: finderPhone,
      minPrice: Number(finderMinPrice) || 0,
      maxPrice: Number(finderMaxPrice) || 99999999,
      bedrooms: Number(finderBedrooms) || 3,
      specificAreas: finderAreas,
      additionalNotes: finderNotes,
      submittedAt: new Date().toISOString(),
    };
    onAddPropertyFinder(request);
    setIsSuccess(true);
  };

  return (
    <div className="w-full mt-10 mb-16" id="quick-action-ctas-container">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="ctas-grid">
        {/* Tile 1: List Your Property */}
        <button
          id="cta-tile-list"
          onClick={() => setActiveModal("list")}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl hover:border-brand-secondary/40 hover:shadow-lg transition-all duration-300 text-center group cursor-pointer shadow-sm"
        >
          <div className="p-4 bg-brand-secondary/10 rounded-xl text-brand-secondary mb-4 group-hover:bg-brand-secondary group-hover:text-white transition-all">
            <ClipboardList className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 tracking-wide uppercase">List Your Property</h4>
          <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">Sell or lease with Beno Professionals</p>
        </button>

        {/* Tile 2: Email Alerts */}
        <button
          id="cta-tile-alerts"
          onClick={() => setActiveModal("alert")}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl hover:border-brand-primary/40 hover:shadow-lg transition-all duration-300 text-center group cursor-pointer shadow-sm"
        >
          <div className="p-4 bg-brand-primary/10 rounded-xl text-brand-primary mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all">
            <BellRing className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Email Alerts</h4>
          <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">Get real-time matches straight to your inbox</p>
        </button>

        {/* Tile 3: Property Finder */}
        <button
          id="cta-tile-finder"
          onClick={() => setActiveModal("finder")}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl hover:border-brand-primary/40 hover:shadow-lg transition-all duration-300 text-center group cursor-pointer shadow-sm"
        >
          <div className="p-4 bg-brand-primary/10 rounded-xl text-brand-primary mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all">
            <Compass className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Property Finder</h4>
          <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">Describe what you need, we'll locate it</p>
        </button>

        {/* Tile 4: Bond Calculator */}
        <button
          id="cta-tile-calculator"
          onClick={onOpenCalculator}
          className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl hover:border-brand-secondary/40 hover:shadow-lg transition-all duration-300 text-center group cursor-pointer shadow-sm"
        >
          <div className="p-4 bg-brand-secondary/10 rounded-xl text-brand-secondary mb-4 group-hover:bg-brand-secondary group-hover:text-white transition-all">
            <Calculator className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Bond Calculator</h4>
          <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">Calculate interest rates & monthly repayments</p>
        </button>
      </div>

      {/* Modals Container */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-gray-200 w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
              id="active-cta-modal"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-primary animate-pulse" />
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    {activeModal === "list" && "List Your Property"}
                    {activeModal === "alert" && "Subscribe to Email Alerts"}
                    {activeModal === "finder" && "Personalized Property Finder"}
                  </h3>
                </div>
                <button
                  id="close-modal-btn"
                  onClick={resetForms}
                  className="p-1.5 bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto flex-1 bg-white">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center py-12"
                    id="success-submission-state"
                  >
                    <div className="bg-brand-primary/10 text-brand-primary p-4 rounded-full mb-4">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Submission Successful!</h3>
                    <p className="text-gray-500 text-sm mt-2 max-w-md">
                      Thank you for contacting Beno Properties. One of our specialist area consultants will review your submission and contact you within the next 24 business hours.
                    </p>
                    <button
                      onClick={resetForms}
                      className="mt-6 px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-full text-sm uppercase tracking-wide cursor-pointer transition-colors shadow-sm"
                    >
                      Done
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* MODAL FORM 1: List Property */}
                    {activeModal === "list" && (
                      <form onSubmit={handleListSubmit} className="space-y-4" id="form-list-property">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Your Name *</label>
                            <input
                              type="text"
                              required
                              value={listOwnerName}
                              onChange={(e) => setListOwnerName(e.target.value)}
                              placeholder="e.g. Sipho Khumalo"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address *</label>
                            <input
                              type="email"
                              required
                              value={listOwnerEmail}
                              onChange={(e) => setListOwnerEmail(e.target.value)}
                              placeholder="e.g. sipho@gmail.com"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Contact Phone *</label>
                            <input
                              type="tel"
                              required
                              value={listOwnerPhone}
                              onChange={(e) => setListOwnerPhone(e.target.value)}
                              placeholder="e.g. 082 123 4567"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <hr className="border-gray-200 my-2" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Property Headline / Title *</label>
                            <input
                              type="text"
                              required
                              value={listTitle}
                              onChange={(e) => setListTitle(e.target.value)}
                              placeholder="e.g. Modern Double Storey House"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Suburban Location *</label>
                            <input
                              type="text"
                              required
                              value={listLocation}
                              onChange={(e) => setListLocation(e.target.value)}
                              placeholder="e.g. Sandton, Johannesburg"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Property Type</label>
                            <select
                              value={listType}
                              onChange={(e) => setListType(e.target.value as PropertyType)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all cursor-pointer"
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
                              value={listStatus}
                              onChange={(e) => setListStatus(e.target.value as PropertyStatus)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all cursor-pointer"
                            >
                              <option value="For Sale">For Sale</option>
                              <option value="To Rent">To Rent</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Expected Price (ZAR) *</label>
                            <input
                              type="number"
                              required
                              value={listPrice}
                              onChange={(e) => setListPrice(e.target.value)}
                              placeholder="Expected Rands"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Beds</label>
                              <input
                                type="number"
                                value={listBedrooms}
                                onChange={(e) => setListBedrooms(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Baths</label>
                              <input
                                type="number"
                                value={listBathrooms}
                                onChange={(e) => setListBathrooms(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Key Features & Description *</label>
                          <textarea
                            rows={3}
                            required
                            value={listDesc}
                            onChange={(e) => setListDesc(e.target.value)}
                            placeholder="Describe your property (e.g. double garage, solar system, garden size...)"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-extrabold rounded-full text-sm uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Send className="h-4 w-4" />
                            Submit Listing Request
                          </button>
                        </div>
                      </form>
                    )}

                    {/* MODAL FORM 2: Email Alerts */}
                    {activeModal === "alert" && (
                      <form onSubmit={handleAlertSubmit} className="space-y-4" id="form-email-alerts">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Your Name *</label>
                            <input
                              type="text"
                              required
                              value={alertName}
                              onChange={(e) => setAlertName(e.target.value)}
                              placeholder="e.g. Amanda Zuma"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address *</label>
                            <input
                              type="email"
                              required
                              value={alertEmail}
                              onChange={(e) => setAlertEmail(e.target.value)}
                              placeholder="e.g. amanda@domain.co.za"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Target Area / Suburb *</label>
                            <input
                              type="text"
                              required
                              value={alertLocation}
                              onChange={(e) => setAlertLocation(e.target.value)}
                              placeholder="e.g. Rosebank"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Max Price Budget (ZAR) *</label>
                            <input
                              type="number"
                              required
                              value={alertMaxPrice}
                              onChange={(e) => setAlertMaxPrice(e.target.value)}
                              placeholder="e.g. R5,000,000"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Preferred Type</label>
                            <select
                              value={alertType}
                              onChange={(e) => setAlertType(e.target.value as any)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all cursor-pointer"
                            >
                              <option value="Any">Any Type</option>
                              <option value="House">House</option>
                              <option value="Apartment">Apartment</option>
                              <option value="Townhouse">Townhouse</option>
                              <option value="Commercial">Commercial</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Preferred Status</label>
                            <select
                              value={alertStatus}
                              onChange={(e) => setAlertStatus(e.target.value as any)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all cursor-pointer"
                            >
                              <option value="Any">Any Option</option>
                              <option value="For Sale">For Sale</option>
                              <option value="To Rent">To Rent</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-extrabold rounded-full text-sm uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <BellRing className="h-4 w-4" />
                            Create Free Property Alert
                          </button>
                        </div>
                      </form>
                    )}

                    {/* MODAL FORM 3: Property Finder */}
                    {activeModal === "finder" && (
                      <form onSubmit={handleFinderSubmit} className="space-y-4" id="form-property-finder">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Your Name *</label>
                            <input
                              type="text"
                              required
                              value={finderName}
                              onChange={(e) => setFinderName(e.target.value)}
                              placeholder="e.g. Johan de Wet"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address *</label>
                            <input
                              type="email"
                              required
                              value={finderEmail}
                              onChange={(e) => setFinderEmail(e.target.value)}
                              placeholder="e.g. johan@dw-law.co.za"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mobile Phone *</label>
                            <input
                              type="tel"
                              required
                              value={finderPhone}
                              onChange={(e) => setFinderPhone(e.target.value)}
                              placeholder="e.g. 081 234 5678"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Min Price Range (ZAR)</label>
                            <input
                              type="number"
                              value={finderMinPrice}
                              onChange={(e) => setFinderMinPrice(e.target.value)}
                              placeholder="Min Rands"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Max Price Range (ZAR)</label>
                            <input
                              type="number"
                              value={finderMaxPrice}
                              onChange={(e) => setFinderMaxPrice(e.target.value)}
                              placeholder="Max Rands"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Min Bedrooms</label>
                            <select
                              value={finderBedrooms}
                              onChange={(e) => setFinderBedrooms(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all cursor-pointer"
                            >
                              <option value="1">1+ Bedrooms</option>
                              <option value="2">2+ Bedrooms</option>
                              <option value="3">3+ Bedrooms</option>
                              <option value="4">4+ Bedrooms</option>
                              <option value="5">5+ Bedrooms</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Specific Suburbs / Areas *</label>
                          <input
                            type="text"
                            required
                            value={finderAreas}
                            onChange={(e) => setFinderAreas(e.target.value)}
                            placeholder="e.g. Centurion, Pretoria East, Midrand"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Additional Requirements / Notes</label>
                          <textarea
                            rows={3}
                            value={finderNotes}
                            onChange={(e) => setFinderNotes(e.target.value)}
                            placeholder="Explain any custom needs (e.g. single story only, must be pet friendly, close to high school, solar panels, borehole...)"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-extrabold rounded-full text-sm uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Compass className="h-4 w-4" />
                            Submit Finder Request
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
