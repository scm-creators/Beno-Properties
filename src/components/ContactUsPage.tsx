/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck, Globe, Share2 } from "lucide-react";
import { ContactMessage } from "../types";

interface ContactUsPageProps {
  onSubmitMessage: (msg: ContactMessage) => void;
}

export default function ContactUsPage({ onSubmitMessage }: ContactUsPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contactMsg: ContactMessage = {
      id: `CON-${Date.now().toString().slice(-4)}`,
      name,
      email,
      phone,
      message,
      submittedAt: new Date().toISOString(),
    };
    onSubmitMessage(contactMsg);
    setIsSuccess(true);

    // reset
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");

    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <div className="w-full space-y-12" id="contact-us-page">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto" id="contact-intro">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
          Connect With Beno Properties(SA)
        </h2>
        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
          At Beno Properties(SA), we believe every property is an opportunity to build a better future. We are committed to delivering quality service, expert advice, and lasting value — helping our clients make informed real estate decisions with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10" id="contact-grid">
        {/* Contact Info (Left Column) */}
        <div className="lg:col-span-5 space-y-6" id="contact-info-col">
          {/* Office details */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-sm font-mono text-brand-primary uppercase tracking-widest border-b border-gray-200 pb-2 flex items-center gap-2 font-bold">
              Corporate Headquarters
            </h3>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl mt-1 flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Physical Address</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1 font-sans">
                    No 1 Casino Road, Foundershill,<br />
                    Modderfontein, Johannesburg, 1609
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl mt-1 flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900">Telephone Lines</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-mono">
                    Office: <a href="tel:+27101410720" className="text-gray-700 hover:text-brand-secondary transition-colors font-semibold">010 141 0720</a>
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed font-mono">
                    Mobile: <a href="tel:+27812652533" className="text-gray-700 hover:text-brand-secondary transition-colors font-semibold">081 265 2533</a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl mt-1 flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Email Address</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1 font-mono">
                    <a href="mailto:nolithazwane@benopropertiessa.com" className="text-gray-700 hover:text-brand-secondary transition-colors">nolithazwane@benopropertiessa.com</a>
                  </p>
                </div>
              </div>

              {/* Website */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl mt-1 flex-shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Website</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1 font-mono">
                    <span className="text-gray-400 italic">Coming soon</span>
                  </p>
                </div>
              </div>

              {/* Social */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl mt-1 flex-shrink-0">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Social Connections</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1 font-medium text-gray-600">
                    Facebook · Instagram · LinkedIn <span className="text-gray-400 italic">(coming soon)</span>
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl mt-1 flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Operational Hours</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">
                    Monday – Friday: 08:00 – 17:00<br />
                    Saturdays: 09:00 – 13:00 (Viewings only)<br />
                    Sundays & Public Holidays: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="bg-white border border-gray-200 p-5 rounded-2xl flex items-center gap-3 shadow-sm">
            <ShieldCheck className="h-8 w-8 text-brand-primary flex-shrink-0" />
            <div className="text-xs text-gray-500 font-mono">
              Beno Properties(SA) is fully registered with the <strong className="text-gray-800">Property Practitioners Regulatory Authority (PPRA)</strong> of South Africa.
            </div>
          </div>
        </div>

        {/* Contact Form (Right Column) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm" id="contact-form-col">
          <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 font-bold">
            Direct Office Message
          </h3>

          {isSuccess ? (
            <div className="py-12 text-center space-y-3" id="message-success-wrapper">
              <div className="mx-auto bg-brand-primary/15 text-brand-primary p-4 rounded-full w-16 h-16 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Message Dispatched Successfully!</h4>
              <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed">
                Thank you for your message. Your inquiry has been routed to our front-desk coordinators. We will reply to your email or call you back shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" id="form-direct-contact">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sindi Ndlovu"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sindi@domain.co.za"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 083 456 7890"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Your Message *</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you are looking for, or ask about our residential/commercial management packages..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-brand-primary hover:bg-brand-hover text-white font-extrabold rounded-full text-sm uppercase tracking-wider cursor-pointer shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Dispatch Inquiry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
