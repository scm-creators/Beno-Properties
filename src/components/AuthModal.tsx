/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Lock, Mail, User, Phone, Briefcase, Key, Shield, UserCheck, AlertCircle, Loader2 } from "lucide-react";
import { UserProfile, UserRole } from "../types";
import BenoLogo from "./BenoLogo";
import { signInWithGoogle, updateUserProfileInFirestore } from "../firebase";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  existingUsers: UserProfile[];
  onRegisterUser: (user: UserProfile) => void;
  prompt?: string;
}

export default function AuthModal({
  onClose,
  onLoginSuccess,
  existingUsers,
  onRegisterUser,
  prompt,
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
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const handleGoogleAuth = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      setSuccess(`Signed in with Google as ${user.name} (${user.role.toUpperCase()})`);
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
      }, 700);
    } catch (err: unknown) {
      console.error("Google authentication error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("popup-closed-by-user")) {
        setError("Sign-in window was closed before finishing.");
      } else if (msg.includes("network-request-failed")) {
        setError("Network connection issue. Please check your internet connection.");
      } else {
        setError("Google authentication failed. " + (msg.length < 100 ? msg : "Please try again."));
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

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
      setError("Invalid email address. Try Google Sign-In or use a Quick Demo Login below.");
      return;
    }

    setSuccess(`Welcome back, ${matchedUser.name}!`);
    setTimeout(() => {
      onLoginSuccess(matchedUser);
      onClose();
    }, 600);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName || !regEmail || !regPassword) {
      setError("Name, Email, and Password are required.");
      return;
    }

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

    try {
      await updateUserProfileInFirestore(newUser);
    } catch (e) {
      console.warn("Could not sync registration to Firestore immediately:", e);
    }

    onRegisterUser(newUser);
    setSuccess("Registration successful! Logging you in...");
    
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 800);
  };

  const triggerDemoLogin = (role: UserRole, email: string) => {
    setError(null);
    const matched = existingUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setSuccess(`Logged in as ${matched.name} (${matched.role.toUpperCase()})`);
      setTimeout(() => {
        onLoginSuccess(matched);
        onClose();
      }, 500);
    } else {
      const demoUser: UserProfile = {
        id: role === "admin" ? "BENO-ADM-001" : role === "agent" ? "BENO-AGT-1" : role === "landlord" ? "BENO-LL-1" : "BENO-USR-999",
        name: role === "admin" ? "Beno Admin" : role === "agent" ? "David Beno" : role === "landlord" ? "Thabo Landlord" : "Sipho Khumalo",
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
              Beno Portal & Cloud Database
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
          <div className="pb-3 flex justify-center border-b border-gray-100" id="auth-modal-logo-wrapper">
            <BenoLogo variant="full" size="md" />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <UserCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {prompt && !error && !success && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-850 rounded-xl text-xs font-bold flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{prompt}</span>
            </div>
          )}

          {/* Primary Google Sign-In Button */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-800 transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isGoogleLoading ? "Connecting to Firebase..." : "Sign in with Google (Firebase Auth)"}</span>
            </button>
            <p className="text-[10px] text-gray-500 text-center">
              Securely verifies your identity with Google & persists your real-time records in Firestore.
            </p>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Or with email password
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5" id="form-portal-login">
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
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5" id="form-portal-register">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole("client")}
                    className={`p-2 border rounded-xl text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all text-center ${
                      regRole === "client"
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-extrabold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole("agent")}
                    className={`p-2 border rounded-xl text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all text-center ${
                      regRole === "agent"
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-extrabold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    Agent
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole("admin")}
                    className={`p-2 border rounded-xl text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all text-center ${
                      regRole === "admin"
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-extrabold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole("landlord")}
                    className={`p-2 border rounded-xl text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all text-center ${
                      regRole === "landlord"
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-extrabold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    Landlord
                  </button>
                </div>
              </div>

              {regRole === "agent" && (
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
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
              Quick Role Switcher & Demo Accounts
            </h4>
            <div className="grid grid-cols-2 gap-2">
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
              <button
                onClick={() => triggerDemoLogin("landlord", "landlord@benoproperties.co.za")}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-[10px] text-gray-700 font-bold uppercase rounded-lg cursor-pointer transition-colors text-center truncate"
              >
                🏡 Thabo (Landlord)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
