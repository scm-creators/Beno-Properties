/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Lock, Mail, User, Phone, Briefcase, Key, Shield, UserCheck, AlertCircle } from "lucide-react";
import { UserProfile, UserRole } from "../types";
import BenoLogo from "./BenoLogo";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  existingUsers: UserProfile[];
  onRegisterUser: (user: UserProfile) => void;
}

export default function AuthModal({
  onClose,
  onLoginSuccess,
  existingUsers,
  onRegisterUser,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("client");
  const [regTitle, setRegTitle] = useState("");
  const [regBio, setRegBio] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail || !loginPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Check existing users (which include default preloaded demo users)
    const matchedUser = existingUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase()
    );

    if (!matchedUser) {
      setError("Invalid email address. Try registering or use a Quick Demo Login below.");
      return;
    }

    // For a sandbox, we accept any password as long as the user exists,
    // but we can check if it matches simple rules if we want to.
    setSuccess(`Welcome back, ${matchedUser.name}!`);
    setTimeout(() => {
      onLoginSuccess(matchedUser);
      onClose();
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName || !regEmail || !regPassword) {
      setError("Name, Email, and Password are required.");
      return;
    }

    // Check if email already registered
    const emailExists = existingUsers.some(
      (u) => u.email.toLowerCase() === regEmail.toLowerCase()
    );

    if (emailExists) {
      setError("This email address is already registered.");
      return;
    }

    const newUserId = regRole === "agent" 
      ? `BENO-AGT-${Math.floor(100 + Math.random() * 900)}`
      : `BENO-USR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: UserProfile = {
      id: newUserId,
      name: regName,
      email: regEmail,
      phone: regPhone || undefined,
      role: regRole,
      favorites: [],
      bio: regRole === "agent" ? regBio || "Experienced real estate area specialist." : undefined,
      title: regRole === "agent" ? regTitle || "Associate Property Consultant" : undefined,
      specialization: regRole === "agent" ? ["Residential Sales", "Valuations"] : undefined,
      imageUrl: regRole === "agent" ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" : undefined,
      createdAt: new Date().toISOString(),
    };

    onRegisterUser(newUser);
    setSuccess("Registration successful! Logging you in...");
    
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 1000);
  };

  const triggerDemoLogin = (role: UserRole, email: string) => {
    setError(null);
    const matched = existingUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setSuccess(`Logged in as ${matched.name} (${matched.role.toUpperCase()})`);
      setTimeout(() => {
        onLoginSuccess(matched);
        onClose();
      }, 600);
    } else {
      // If not present in stored state, let's create a quick demo fallback
      const demoUser: UserProfile = {
        id: role === "admin" ? "BENO-ADM-001" : role === "agent" ? "BENO-AGT-1" : "BENO-USR-999",
        name: role === "admin" ? "Beno Admin" : role === "agent" ? "David Beno" : "Sipho Khumalo",
        email: email,
        role: role,
        favorites: [],
        createdAt: new Date().toISOString()
      };
      onRegisterUser(demoUser);
      onLoginSuccess(demoUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4" id="auth-modal-overlay">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col relative" id="auth-modal-card">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-primary" />
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">
              Beno Portal Login
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-150 bg-gray-50/50 p-1">
          <button
            onClick={() => { setActiveTab("login"); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center transition-all rounded-lg cursor-pointer ${
              activeTab === "login"
                ? "bg-white text-brand-primary shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setActiveTab("register"); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center transition-all rounded-lg cursor-pointer ${
              activeTab === "register"
                ? "bg-white text-brand-primary shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
          <div className="pb-4 flex justify-center border-b border-gray-100" id="auth-modal-logo-wrapper">
            <BenoLogo variant="full" size="md" />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl text-xs font-bold flex items-center gap-2">
              <UserCheck className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4" id="form-portal-login">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. sipho@gmail.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-850 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-850 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-extrabold rounded-full text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Key className="h-4 w-4" />
                Sign In to Portal
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4" id="form-portal-register">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Sipho Khumalo"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-850 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. sipho@gmail.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-850 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. 082 555 1234"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-850 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Register As (Role) *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole("client")}
                    className={`p-2.5 border rounded-xl text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all text-center ${
                      regRole === "client"
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-extrabold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    Client / Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole("agent")}
                    className={`p-2.5 border rounded-xl text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all text-center ${
                      regRole === "agent"
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-extrabold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    Agency Agent
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole("admin")}
                    className={`p-2.5 border rounded-xl text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all text-center ${
                      regRole === "admin"
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-extrabold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    Administrator
                  </button>
                </div>
              </div>

              {regRole === "agent" && (
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={regTitle}
                      onChange={(e) => setRegTitle(e.target.value)}
                      placeholder="e.g. Senior Area Consultant"
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-850 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Professional Biography</label>
                    <textarea
                      rows={2}
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      placeholder="e.g. Specializing in high-end estates in Sandton with 5+ years experience..."
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-850 focus:outline-none focus:border-brand-primary leading-relaxed"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Choose Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 4 characters"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-850 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-extrabold rounded-full text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Briefcase className="h-4 w-4" />
                Register & Sign In
              </button>
            </form>
          )}

          {/* Quick Demo Login Section */}
          <div className="pt-3 border-t border-gray-150">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5 text-center">
              Quick Sandbox Demo Accounts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => triggerDemoLogin("client", "sipho@gmail.com")}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-700 font-bold uppercase rounded-lg cursor-pointer transition-colors text-center truncate"
              >
                👤 Sipho (Client)
              </button>
              <button
                onClick={() => triggerDemoLogin("agent", "david@benoproperties.co.za")}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-700 font-bold uppercase rounded-lg cursor-pointer transition-colors text-center truncate"
              >
                👔 David (Agent)
              </button>
              <button
                onClick={() => triggerDemoLogin("admin", "admin@benoproperties.co.za")}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-700 font-bold uppercase rounded-lg cursor-pointer transition-colors text-center truncate"
              >
                ⚙️ Agency Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
