/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Calendar, User, Tag, Phone, Mail, FileText, Send, CheckCircle, Calculator, Video } from "lucide-react";
import { Property, Agent, ContactMessage } from "../types";
import { formatPriceZAR } from "./PropertyCard";
import BondCalculator from "./BondCalculator";

interface PropertyDetailsModalProps {
  property: Property;
  agent: Agent;
  onClose: () => void;
  onSubmitContactMessage: (msg: ContactMessage) => void;
  onSubmitVirtualTourRequest?: (tourRequest: { name: string; email: string; phone: string; propertyId: string }) => void;
}

export default function PropertyDetailsModal({
  property,
  agent,
  onClose,
  onSubmitContactMessage,
  onSubmitVirtualTourRequest,
}: PropertyDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "calculator">("overview");

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Hi ${agent.name.split(" ")[0]}, I am highly interested in "${property.title}" (Ref: ${property.id}). Please send me more details.`);
  const [isSent, setIsSent] = useState(false);
  const [isTourSent, setIsTourSent] = useState(false);
  const [submitType, setSubmitType] = useState<"inquiry" | "tour" | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitType === "tour") {
      if (onSubmitVirtualTourRequest) {
        onSubmitVirtualTourRequest({
          name,
          email,
          phone,
          propertyId: property.id
        });
      }
      setIsTourSent(true);
      setIsSent(true);
    } else {
      const contactMsg: ContactMessage = {
        id: `MSG-${Date.now().toString().slice(-4)}`,
        name,
        email,
        phone,
        message,
        propertyRefId: property.id,
        submittedAt: new Date().toISOString(),
      };
      onSubmitContactMessage(contactMsg);
      setIsTourSent(false);
      setIsSent(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        id="property-details-modal"
        className="bg-white border border-gray-200 w-full max-w-5xl rounded-3xl overflow-hidden max-h-[92vh] flex flex-col shadow-2xl"
      >
        {/* Modal Header Banner */}
        <div className="relative h-44 sm:h-64 bg-gray-100">
          <img
            src={property.imageUrl}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30" />

          {/* Close button */}
          <button
            id="close-details-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-brand-primary hover:text-white text-gray-700 rounded-full transition-all cursor-pointer border border-gray-200 shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title & Price overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className="bg-brand-secondary text-white text-[10px] font-bold px-3 py-1.5 uppercase rounded-md shadow-sm mr-3">
              {property.status}
            </span>
            <span className="bg-brand-primary text-white text-[10px] font-semibold px-3 py-1.5 uppercase rounded-md shadow-sm">
              {property.type}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-3 line-clamp-1">
              {property.title}
            </h2>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-250 bg-gray-50 px-6 pt-2" id="modal-tab-row">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "overview"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Overview & Inquire
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "calculator"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Bond Repayments
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white" id="modal-scrollable-body">
          {activeTab === "overview" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-xs font-mono text-brand-primary uppercase tracking-widest mb-1 font-bold">
                    Location Description
                  </h3>
                  <div className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-gray-400" />
                    {property.location}, {property.city}, {property.province}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">
                    Asking Price
                  </span>
                  <span className="text-2xl font-extrabold text-brand-secondary">
                    {formatPriceZAR(property.price, property.status)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Ref ID: {property.id} | Listed: {new Date(property.createdAt).toLocaleDateString("en-ZA")}
                  </span>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 border border-gray-200 rounded-2xl">
                  <div className="text-center p-2.5 bg-white border border-gray-250 rounded-xl">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Bedrooms</span>
                    <span className="text-sm font-extrabold text-gray-950">{property.bedrooms ?? "—"}</span>
                  </div>
                  <div className="text-center p-2.5 bg-white border border-gray-250 rounded-xl">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Bathrooms</span>
                    <span className="text-sm font-extrabold text-gray-950">{property.bathrooms ?? "—"}</span>
                  </div>
                  <div className="text-center p-2.5 bg-white border border-gray-250 rounded-xl">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Garages</span>
                    <span className="text-sm font-extrabold text-gray-950">{property.parkingSpaces ?? "—"}</span>
                  </div>
                  <div className="text-center p-2.5 bg-white border border-gray-250 rounded-xl">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Size</span>
                    <span className="text-sm font-extrabold text-gray-950">
                      {property.sizeSqM ? `${property.sizeSqM} m²` : "—"}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-2 mb-3">
                    Detailed Property Description
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {property.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Agent & Inquiry */}
              <div className="lg:col-span-5 space-y-6">
                {/* Agent Card */}
                <div className="bg-gray-50 border border-gray-250 p-5 rounded-2xl flex items-center gap-4">
                  <img
                    src={agent.imageUrl}
                    alt={agent.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{agent.name}</h4>
                    <p className="text-xs text-brand-secondary font-bold">{agent.title}</p>
                    <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" /> {agent.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" /> {agent.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inquiry Form */}
                <div className="bg-gray-50 border border-gray-250 p-5 rounded-2xl">
                  {isSent ? (
                    <div className="text-center py-8" id="inquiry-success-wrapper">
                      <div className="mx-auto bg-brand-primary/10 text-brand-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {isTourSent ? "Virtual Tour Requested!" : "Inquiry Forwarded"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto">
                        {isTourSent 
                          ? `Your request for a virtual tour of "${property.title}" (Ref: ${property.id}) has been captured. A "Virtual Tour Requested" tag has been added to your lead record, and ${agent.name.split(" ")[0]} will contact you to schedule.`
                          : `Your request has been delivered to ${agent.name.split(" ")[0]}. They will contact you shortly using your provided details.`
                        }
                      </p>
                      <button
                        onClick={() => setIsSent(false)}
                        className="mt-4 text-xs font-semibold text-brand-primary hover:underline cursor-pointer"
                      >
                        {isTourSent ? "Send another request" : "Send another message"}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3" id="form-property-inquiry">
                      <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-1.5 mb-2.5 flex items-center gap-1 font-bold">
                        <FileText className="h-4 w-4 text-brand-primary" />
                        Inquire About Property
                      </h4>

                      <div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name *"
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email *"
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary"
                        />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone *"
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary"
                        />
                      </div>

                      <div>
                        <textarea
                          rows={3}
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-brand-primary"
                        />
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          type="submit"
                          onClick={() => setSubmitType("inquiry")}
                          className="w-full py-2.5 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-full text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Send Agent Inquiry
                        </button>
                        <button
                          type="submit"
                          onClick={() => setSubmitType("tour")}
                          className="w-full py-2.5 bg-brand-secondary hover:bg-opacity-95 text-white font-bold rounded-full text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Video className="h-3.5 w-3.5" />
                          Request Virtual Tour
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4" id="modal-calculator-pane">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-brand-primary" />
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest font-bold">
                  Custom Purchase Repayments
                </span>
              </div>
              <BondCalculator initialPrice={property.price} inlineLayout={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
