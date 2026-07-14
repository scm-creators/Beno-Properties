import React from "react";

interface BenoLogoProps {
  className?: string;
  variant?: "full" | "horizontal" | "icon";
  size?: "sm" | "md" | "lg" | "xl";
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
    sm: {
      svg: "h-10 w-10",
      container: "gap-2",
      textTitle: "text-md",
      textSub: "text-[8px]",
    },
    md: {
      svg: "h-16 w-16",
      container: "gap-3",
      textTitle: "text-xl",
      textSub: "text-[10px]",
    },
    lg: {
      svg: "h-28 w-28",
      container: "gap-4",
      textTitle: "text-3xl",
      textSub: "text-xs",
    },
    xl: {
      svg: "h-48 w-48",
      container: "gap-6",
      textTitle: "text-5xl",
      textSub: "text-base",
    },
  };

  const selectedSize = sizeClasses[size];

  // Colors
  const charcoal = "#111827"; // Deep luxurious near-black/slate from the B logo
  const gold = "#C5A85C"; // Rich metallic gold matching the building accents

  // SVG Logo Mark Component
  const LogoMark = () => (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${selectedSize.svg} ${className}`}
      id="beno-logo-mark-svg"
    >
      {/* LEFT ARCHITECTURAL COLUMNS */}
      {/* 1st Column: Deep Charcoal */}
      <path
        d="M 185 272 L 185 190 L 200 172 L 200 258 Z"
        fill={charcoal}
      />
      {/* 2nd Column: Premium Gold */}
      <path
        d="M 206 254 L 206 155 L 221 138 L 221 240 Z"
        fill={gold}
      />

      {/* THE CAPITAL 'B' & MAIN ARCHITECTURE */}
      {/* Main B path including top serif, stem, loops, and elegant curves */}
      <path
        d="M 232 232 
           L 232 108 
           L 204 108 
           V 100 
           H 265 
           C 290 100, 315 105, 330 118 
           C 345 130, 355 148, 355 168 
           C 355 192, 335 210, 305 218 
           C 342 225, 368 245, 368 275 
           C 368 302, 348 322, 320 330 
           C 305 334, 285 335, 260 335
           H 232
           V 250"
        fill={charcoal}
      />

      {/* Counter space (inside negative spaces) of the 'B' loops */}
      {/* Upper loop negative space */}
      <path
        d="M 248 116 
           V 195 
           H 265 
           C 285 195, 305 190, 315 180 
           C 325 170, 330 158, 330 148 
           C 330 135, 324 125, 312 120 
           C 302 116, 285 116, 265 116 
           Z"
        fill="#FFFFFF"
      />
      
      {/* Lower loop negative space */}
      <path
        d="M 248 211 
           V 319 
           H 268 
           C 290 319, 312 318, 324 310 
           C 336 302, 342 290, 342 275 
           C 342 258, 334 245, 322 238 
           C 310 231, 290 230, 268 230 
           Z"
        fill="#FFFFFF"
      />

      {/* ROOF CHEVRON (Gable House Outline in Gold) */}
      <path
        d="M 152 305 L 235 240 L 318 305"
        stroke={gold}
        strokeWidth="10"
        strokeLinecap="miter"
        strokeLinejoin="miter"
        fill="none"
      />

      {/* 2x2 WINDOW PANES BELOW CHEVRON */}
      {/* Pane 1: Top-Left */}
      <rect x="225" y="271" width="9" height="9" fill={charcoal} />
      {/* Pane 2: Top-Right */}
      <rect x="237" y="271" width="9" height="9" fill={charcoal} />
      {/* Pane 3: Bottom-Left */}
      <rect x="225" y="283" width="9" height="9" fill={charcoal} />
      {/* Pane 4: Bottom-Right */}
      <rect x="237" y="283" width="9" height="9" fill={charcoal} />
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
          <span className={`font-serif font-semibold tracking-[0.15em] uppercase leading-none ${light ? "text-white" : "text-slate-900"}`}>
            BENO <span className="text-[#C5A85C] font-normal">PROPERTIES(SA)</span>
          </span>
          <span className={`font-sans tracking-[0.3em] uppercase mt-1.5 font-medium text-[8px] sm:text-[10px] ${light ? "text-slate-300" : "text-slate-500"}`}>
            Premium Real Estate
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
      <h1 className={`font-serif font-light tracking-[0.2em] uppercase leading-snug mt-2 ${selectedSize.textTitle} ${light ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "'Playfair Display', 'Didot', 'Georgia', serif" }}>
        BENO PROPERTIES(SA)
      </h1>

      {/* Accent Separator Line */}
      <div className="w-24 h-[1px] bg-[#C5A85C] my-1" />

      {/* Slogan */}
      <p className={`font-serif italic tracking-[0.05em] font-medium text-[#C5A85C] ${selectedSize.textSub}`} style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
        Grounded in trust. Built for the future.
      </p>
    </div>
  );
}
