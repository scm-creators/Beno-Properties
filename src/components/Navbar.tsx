/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserProfile } from "../types";
import { Building2, Menu, X, ShieldCheck, UserCheck, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import BenoLogo from "./BenoLogo";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  isAdmin,
  setIsAdmin,
  currentUser,
  onOpenAuth,
  onLogout,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "sale", label: "For Sale" },
    { id: "rent", label: "To Rent" },
    { id: "tools", label: "Tools" },
    { id: "agents", label: "Our Agents" },
    { id: "contact", label: "Contact Us" },
  ];

  // If logged in, add portal tab dynamically so they have easy desktop menu nav
  const activeMenuItems = currentUser 
    ? [...menuItems, { id: "portal", label: "My Workspace" }]
    : menuItems;

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 text-gray-800 shadow-sm shrink-0" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick("home")} id="logo-container">
            <BenoLogo variant="horizontal" size="md" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" id="desktop-menu">
            {activeMenuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  currentTab === item.id
                    ? "text-brand-primary font-bold"
                    : "text-gray-500 hover:text-brand-primary hover:bg-gray-50"
                }`}
              >
                {item.label}
                {currentTab === item.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* User Auth controls / Partner Portal */}
          <div className="hidden md:flex items-center gap-3" id="auth-actions-wrapper">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {/* User avatar preview and quick portal shortcut */}
                <button
                  onClick={() => handleNavClick("portal")}
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all cursor-pointer hover:bg-gray-50 ${
                    currentTab === "portal" ? "border-brand-primary bg-brand-primary/5" : "border-gray-200"
                  }`}
                >
                  <div className="h-6 w-6 rounded-full overflow-hidden bg-brand-primary/10 flex items-center justify-center border border-gray-250">
                    {currentUser.imageUrl ? (
                      <img src={currentUser.imageUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-3 w-3 text-brand-primary" />
                    )}
                  </div>
                  <span className="text-xs font-extrabold text-gray-800 tracking-tight">{currentUser.name.split(" ")[0]}</span>
                </button>

                {/* Direct quick logout */}
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors cursor-pointer"
                  title="Sign Out of Portal"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white hover:bg-brand-hover rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                <UserCheck className="h-4 w-4 text-white" />
                Partner Portal Login
              </button>
            )}
          </div>

          {/* Mobile menu action controls */}
          <div className="flex md:hidden items-center gap-2" id="mobile-menu-actions">
            {currentUser && (
              <button
                onClick={() => handleNavClick("portal")}
                className={`p-2 rounded-lg ${
                  currentTab === "portal" ? "text-brand-primary bg-brand-primary/10" : "text-gray-500 bg-gray-100"
                }`}
                title="Go to My Workspace"
              >
                <User className="h-5 w-5" />
              </button>
            )}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-brand-primary hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden shadow-lg"
            id="mobile-nav-panel"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {activeMenuItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-semibold ${
                    currentTab === item.id
                      ? "bg-gray-50 text-brand-primary border-l-4 border-brand-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-brand-primary"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 pb-2 border-t border-gray-200 px-4">
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-2 py-1.5">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-brand-primary/10 flex items-center justify-center">
                        {currentUser.imageUrl ? (
                          <img src={currentUser.imageUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-brand-primary" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-800 block leading-tight">{currentUser.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{currentUser.role} Account</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full text-sm font-bold uppercase tracking-wider bg-brand-primary text-white hover:bg-brand-hover transition-all cursor-pointer"
                  >
                    <UserCheck className="h-4 w-4" />
                    Partner Portal Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
