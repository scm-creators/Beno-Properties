/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Building2, Mail, Phone, MapPin, Newspaper, Clock, X, ArrowUpRight, Globe } from "lucide-react";
import { GAUTENG_SUBURBS, INITIAL_BLOGS } from "../data";
import { BlogArticle } from "../types";
import { motion, AnimatePresence } from "motion/react";
import BenoLogo from "./BenoLogo";

interface FooterProps {
  onBlogClick: (blog: BlogArticle) => void;
  onPopularAreaClick: (area: string) => void;
  onSitemapClick?: () => void;
}

export default function Footer({ onBlogClick, onPopularAreaClick, onSitemapClick }: FooterProps) {
  const [activeBlog, setActiveBlog] = useState<BlogArticle | null>(null);

  const handleOpenBlog = (blog: BlogArticle) => {
    setActiveBlog(blog);
    onBlogClick(blog);
  };

  return (
    <footer className="bg-[#1A1A1A] border-t border-gray-800 text-gray-300 pt-16 pb-8" id="footer-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4" id="footer-col-brand">
            <div className="flex items-center">
              <BenoLogo variant="horizontal" size="sm" light={true} />
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              At Beno Properties, we believe every property is an opportunity to build a better future. We are committed to delivering quality service, expert advice, and lasting value — helping our clients make informed real estate decisions with confidence.
            </p>
            <div className="space-y-2 text-xs font-mono text-gray-400 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <span>3840 Hlakula Street, Orlando East, Soweto, Johannesburg, Gauteng 1804</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <a href="tel:+27812652533" className="hover:text-brand-secondary transition-colors">081 265 2533</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <a href="mailto:benopropertiess@gmail.com" className="hover:text-brand-secondary transition-colors">benopropertiess@gmail.com</a>
              </div>
              <div className="text-[10px] text-gray-500 pt-2 border-t border-gray-800 mt-2 space-y-1">
                <div>Website: <span className="italic text-gray-400">Coming soon</span></div>
                <div>Social: <span className="text-gray-400 font-sans">Facebook · Instagram · LinkedIn (coming soon)</span></div>
              </div>
            </div>
          </div>

          {/* Col 2: Popular Areas / SEO Links */}
          <div className="space-y-4" id="footer-col-areas">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white border-b border-gray-800 pb-2">
              Gauteng Suburbs
            </h4>
            <p className="text-gray-400 text-xs">Explore prime properties in high-demand areas:</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              {GAUTENG_SUBURBS.slice(0, 10).map((sub) => (
                <button
                  key={sub}
                  onClick={() => onPopularAreaClick(sub)}
                  className="text-left py-1 text-gray-400 hover:text-brand-secondary transition-colors flex items-center gap-1 cursor-pointer"
                  id={`footer-area-${sub.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <ArrowUpRight className="h-3 w-3 text-gray-600 flex-shrink-0" />
                  <span className="truncate">{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Col 3 & 4: News & Articles / Blog Section */}
          <div className="lg:col-span-2 space-y-4" id="footer-col-blogs">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white border-b border-gray-800 pb-2 flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-brand-secondary" />
              Latest News & Property Insights
            </h4>
            <div className="space-y-4">
              {INITIAL_BLOGS.map((blog) => (
                <div
                  key={blog.id}
                  id={`footer-blog-card-${blog.id}`}
                  onClick={() => handleOpenBlog(blog)}
                  className="flex gap-4 items-start p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all cursor-pointer group"
                >
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-gray-900 border border-gray-800"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                      <span className="text-brand-secondary font-medium">{blog.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {blog.readTime}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-gray-200 group-hover:text-brand-secondary transition-colors line-clamp-1">
                      {blog.title}
                    </h5>
                    <p className="text-[11px] text-gray-400 line-clamp-1">
                      {blog.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright & certification */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 gap-4" id="footer-bottom">
          <p>© 2026 Beno Properties (Pty) Ltd. All Rights Reserved. ZAR / South African Local Market.</p>
          <div className="flex flex-wrap items-center gap-4 font-mono">
            {onSitemapClick && (
              <button
                onClick={onSitemapClick}
                className="text-gray-400 hover:text-brand-secondary transition-all cursor-pointer text-[11px] font-sans flex items-center gap-1.5 bg-gray-800/40 hover:bg-gray-800/80 px-2.5 py-1 rounded border border-gray-800 hover:border-brand-secondary/30"
                id="footer-sitemap-btn"
              >
                <Globe className="h-3.5 w-3.5 text-brand-secondary" />
                <span>Dynamic Sitemap & SEO Hub</span>
              </button>
            )}
            <span className="border border-gray-800 px-2 py-0.5 rounded">PPRA Registered Firm</span>
            <span className="border border-gray-800 px-2 py-0.5 rounded">FFC: 2026112933</span>
          </div>
        </div>
      </div>

      {/* Interactive Blog Reader Drawer/Modal */}
      <AnimatePresence>
        {activeBlog && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-gray-200 w-full max-w-3xl rounded-2xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl"
              id="active-blog-modal"
            >
              {/* Image banner */}
              <div className="relative h-48 sm:h-64 bg-gray-100">
                <img
                  src={activeBlog.imageUrl}
                  alt={activeBlog.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                <button
                  onClick={() => setActiveBlog(null)}
                  className="absolute top-4 right-4 p-2 bg-white/95 text-gray-700 hover:text-brand-primary rounded-full border border-gray-200 shadow-md cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-[10px] font-mono uppercase bg-brand-primary text-white px-2.5 py-1 rounded font-bold">
                    {activeBlog.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-2">
                    {activeBlog.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable text */}
              <div className="p-6 overflow-y-auto flex-1 text-gray-700 space-y-4">
                <div className="flex items-center gap-4 text-xs font-mono text-gray-400 border-b border-gray-200 pb-3">
                  <span>Published: {new Date(activeBlog.publishedDate).toLocaleDateString("en-ZA")}</span>
                  <span>•</span>
                  <span>{activeBlog.readTime}</span>
                </div>

                <div className="prose prose-slate max-w-none text-gray-600 text-sm leading-relaxed space-y-4">
                  {activeBlog.content.split("\n\n").map((para, i) => {
                    if (para.startsWith("### ")) {
                      return (
                        <h4 key={i} className="text-base font-extrabold text-gray-900 pt-2">
                          {para.replace("### ", "")}
                        </h4>
                      );
                    }
                    if (para.startsWith("- ")) {
                      return (
                        <ul key={i} className="list-disc pl-5 space-y-1">
                          {para.split("\n").map((bullet, idx) => (
                            <li key={idx}>{bullet.replace("- ", "")}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={i}>{para}</p>;
                  })}
                </div>
              </div>

              {/* Footer action */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setActiveBlog(null)}
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
