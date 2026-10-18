/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface BenoLogoProps {
  className?: string;
  variant?: "full" | "horizontal" | "icon";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  light?: boolean;
}

export default function BenoLogo({
  className = "",
  variant = "full",
  size = "md",
  light = false,
}: BenoLogoProps) {
  // Size mappings
  const sizeClasses = {
    xs: {
      svg: "h-8 w-8",
      container: "gap-1.5",
      textTitle: "text-xs tracking-[0.2em]",
      textSub: "text-[7px]",
      lineWidth: "w-12",
    },
    sm: {
      svg: "h-11 w-11",
      container: "gap-2",
      textTitle: "text-sm tracking-[0.22em]",
      textSub: "text-[9px]",
      lineWidth: "w-16",
    },
    md: {
      svg: "h-16 w-16",
      container: "gap-2.5",
      textTitle: "text-lg sm:text-xl tracking-[0.25em]",
      textSub: "text-[10px] sm:text-[11px]",
      lineWidth: "w-24",
    },
    lg: {
      svg: "h-28 w-28",
      container: "gap-3.5",
      textTitle: "text-2xl sm:text-3xl tracking-[0.26em]",
      textSub: "text-xs sm:text-sm",
      lineWidth: "w-32",
    },
    xl: {
      svg: "h-40 w-40",
      container: "gap-5",
      textTitle: "text-4xl sm:text-5xl tracking-[0.28em]",
      textSub: "text-base",
      lineWidth: "w-44",
    },
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  // Exact Brand Palette from Official Logo
  const black = light ? "#FFFFFF" : "#1A1A1A";
  const gold = "#C5A85C"; // Rich architectural gold
  const textMotto = light ? "#CBD5E1" : "#737373";

  // SVG Logo Mark Component replicating Beno-logo(300x300)v2.png
  const LogoMark = () => (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${selectedSize.svg} ${className}`}
      id="beno-logo-mark-svg"
    >
      {/* 1. Left Architectural Column (Black Skyscraper) */}
      <path
        d="M 136 210 L 136 122 L 152 104 L 152 198 Z"
        fill={black}
      />

      {/* 2. Middle Architectural Column (Gold Skyscraper Accent) */}
      <path
        d="M 158 193 L 158 84 L 174 66 L 174 182 Z"
        fill={gold}
      />

      {/* 3. The Grand Serif 'B' */}
      {/* Top Left Bracketed Serif */}
      <path
        d="M 142 38 L 194 38 L 194 48 L 180 48 L 180 205 L 174 205 L 174 48 L 142 48 Z"
        fill={black}
      />

      {/* Main B Stem and Dual Bowls with high-contrast curvature */}
      <path
        d="M 174 42
           H 232
           C 264 42, 292 48, 308 64
           C 324 80, 332 100, 332 124
           C 332 148, 316 170, 288 180
           C 324 188, 344 212, 344 246
           C 344 282, 320 310, 286 322
           C 268 328, 244 330, 218 330
           C 188 330, 168 322, 148 308
           L 156 298
           C 174 312, 192 318, 218 318
           C 240 318, 260 316, 276 310
           C 304 300, 324 278, 324 246
           C 324 216, 304 196, 272 190
           H 228
           V 180
           H 238
           C 264 180, 286 174, 298 160
           C 310 146, 314 130, 314 122
           C 314 102, 306 86, 294 74
           C 280 62, 258 56, 230 56
           H 194
           V 210
           H 174
           Z"
        fill={black}
      />

      {/* 4. Roof Gable (Symmetrical Gold Chevron Structure) */}
      {/* Left Roof Slant */}
      <path
        d="M 104 266 L 184 196 L 190 202 L 114 270 Z"
        fill={gold}
      />
      {/* Right Roof Slant */}
      <path
        d="M 264 266 L 184 196 L 178 202 L 254 270 Z"
        fill={gold}
      />

      {/* 5. Central 4-Pane Window Grid under Roof Gable Apex */}
      {/* Top-Left Pane */}
      <rect x="174" y="222" width="8.5" height="8.5" rx="0.5" fill={black} />
      {/* Top-Right Pane */}
      <rect x="187.5" y="222" width="8.5" height="8.5" rx="0.5" fill={black} />
      {/* Bottom-Left Pane */}
      <rect x="174" y="235.5" width="8.5" height="8.5" rx="0.5" fill={black} />
      {/* Bottom-Right Pane */}
      <rect x="187.5" y="235.5" width="8.5" height="8.5" rx="0.5" fill={black} />
    </svg>
  );

  if (variant === "icon") {
    return <LogoMark />;
  }

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center ${selectedSize.container} ${className}`} id="beno-logo-horizontal">
        <LogoMark />
        <div className="flex flex-col select-none">
          <span
            className={`font-serif font-bold uppercase leading-none tracking-[0.2em] ${light ? "text-white" : "text-gray-900"}`}
            style={{ fontFamily: "'Cinzel', 'Playfair Display', 'Didot', 'Times New Roman', serif" }}
          >
            BENO <span className="text-[#C5A85C]">PROPERTIES</span>
          </span>
          <span className={`font-sans tracking-[0.22em] uppercase mt-1 font-semibold text-[8px] sm:text-[9px] ${light ? "text-gray-300" : "text-gray-500"}`}>
            Grounded in trust
          </span>
        </div>
      </div>
    );
  }

  // Full identity layout matching the uploaded logo image (mark, name, horizontal bar, and motto)
  return (
    <div className={`flex flex-col items-center text-center ${selectedSize.container} ${className}`} id="beno-logo-full">
      <LogoMark />
      
      {/* BENO PROPERTIES typography */}
      <h1
        className={`font-serif font-bold uppercase leading-none mt-2.5 ${selectedSize.textTitle} ${light ? "text-white" : "text-gray-900"}`}
        style={{ fontFamily: "'Cinzel', 'Playfair Display', 'Didot', 'Times New Roman', serif" }}
      >
        BENO PROPERTIES
      </h1>

      {/* Accent Gold Separator Line */}
      <div className={`${selectedSize.lineWidth} h-[1.5px] bg-[#C5A85C] my-1.5`} />

      {/* Slogan */}
      <p className={`font-sans font-medium tracking-[0.04em] ${textMotto} ${selectedSize.textSub}`}>
        Grounded in trust. Built for the future
      </p>
    </div>
  );
}
