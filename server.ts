/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI SDK strictly per guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Coordinate dictionary for major Gauteng suburbs to feed Google Maps retrievalConfig
const GAUTENG_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  sandton: { latitude: -26.1076, longitude: 28.0567 },
  rosebank: { latitude: -26.1458, longitude: 28.0436 },
  midrand: { latitude: -25.9992, longitude: 28.1263 },
  waterfall: { latitude: -26.0142, longitude: 28.0988 },
  bryanston: { latitude: -26.0561, longitude: 28.0244 },
  fourways: { latitude: -26.0152, longitude: 28.0125 },
  centurion: { latitude: -25.8603, longitude: 28.1895 },
  "pretoria east": { latitude: -25.7831, longitude: 28.2753 },
  waterkloof: { latitude: -25.7816, longitude: 28.2397 },
  bedfordview: { latitude: -26.1789, longitude: 28.1362 },
  houghton: { latitude: -26.1706, longitude: 28.0592 },
  morningside: { latitude: -26.0886, longitude: 28.0597 },
  hyde_park: { latitude: -26.1264, longitude: 28.0366 },
  johannesburg: { latitude: -26.2041, longitude: 28.0473 },
  pretoria: { latitude: -25.7479, longitude: 28.2293 },
};

function formatGeminiErrorMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429")) {
    return "API rate limit reached. Selecting a billing-enabled key in Settings > Secrets provides higher quota limits.";
  }
  if (msg.includes("API_KEY_INVALID") || msg.includes("403") || msg.includes("PERMISSION_DENIED")) {
    return "Please verify your Gemini API key in Settings > Secrets.";
  }
  return msg;
}

function getCoordinatesForLocation(location?: string): { latitude: number; longitude: number } | undefined {
  if (!location) return GAUTENG_COORDINATES["sandton"];
  const lower = location.toLowerCase();
  for (const [key, coords] of Object.entries(GAUTENG_COORDINATES)) {
    if (lower.includes(key)) {
      return coords;
    }
  }
  // Default to Sandton central if in Gauteng
  return GAUTENG_COORDINATES["sandton"];
}

// Health Check API
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "Beno Properties Full-Stack API",
    backend: "Express + Vite + Gemini 3.5 Flash",
    grounding: ["googleMaps", "googleSearch"],
    timestamp: new Date().toISOString(),
  });
});

/**
 * 1. Neighborhood Guide API (Google Maps Grounding)
 * Uses gemini-3.5-flash with { googleMaps: {} }
 * Extracts all maps grounding chunks and URIs to display as interactive links
 */
app.post("/api/neighborhood-guide", async (req: Request, res: Response) => {
  try {
    const { location, propertyTitle, queryType = "general", customQuery, userCoordinates } = req.body;

    if (!location && !customQuery) {
      return res.status(400).json({ error: "Location or query is required" });
    }

    const coords = userCoordinates || getCoordinatesForLocation(location);

    let prompt = "";
    if (customQuery) {
      prompt = `Using Google Maps, provide accurate, real-world place details in and around ${location || "Gauteng, South Africa"}: ${customQuery}`;
    } else {
      switch (queryType) {
        case "schools":
          prompt = `Using Google Maps, find and detail the top leading private and public schools, pre-primaries, and academies situated within 5-10km of ${location}, Gauteng. Include school names, approximate distance, reputation, and key facilities.`;
          break;
        case "amenities":
          prompt = `Using Google Maps, identify premier shopping centres, upscale restaurants, medical clinics, fitness clubs (like Virgin Active or Planet Fitness), and grocery stores (Woolworths Food, Checkers Hyper) near ${location}, Gauteng.`;
          break;
        case "transport":
          prompt = `Using Google Maps, assess the transportation connectivity for ${location}, Gauteng. Detail proximity to Gautrain stations, major arterial routes (N1, M1, N3 highway on-ramps), airports (OR Tambo, Lanseria), and commuter hubs.`;
          break;
        case "lifestyle":
          prompt = `Using Google Maps, highlight parks, golf estates, nature reserves, entertainment precincts, and recreation spots near ${location}, Gauteng.`;
          break;
        default:
          prompt = `Using Google Maps, provide a comprehensive local neighborhood intelligence briefing for a prospective property buyer or tenant looking at ${propertyTitle ? `"${propertyTitle}" in ` : ""}${location}, Gauteng, South Africa. Detail nearby top schools, shopping malls, Gautrain stations/highways, hospitals, and lifestyle attractions with exact places.`;
          break;
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: coords
          ? {
              retrievalConfig: {
                latLng: {
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                },
              },
            }
          : undefined,
        systemInstruction:
          "You are the Beno Properties Elite Area Specialist. Deliver up-to-date, geographically precise South African neighborhood recommendations. Highlight real venues, streets, distances, and landmarks. Format with clear Markdown headings, bullet points, and highlight badges.",
      },
    });

    const text = response.text || "";
    const rawGroundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract Google Maps URLs and place sources per skill specification
    const mapsLinks: Array<{ title: string; uri: string; address?: string }> = [];
    rawGroundingChunks.forEach((chunk: any) => {
      if (chunk.maps) {
        const title = chunk.maps.title || chunk.maps.name || "View on Google Maps";
        const uri = chunk.maps.uri || chunk.maps.placeUri || "";
        if (uri) {
          mapsLinks.push({
            title,
            uri,
            address: chunk.maps.placeAnswerSources?.address || chunk.maps.address,
          });
        }
      }
    });

    return res.json({
      success: true,
      text,
      mapsLinks,
      groundingChunks: rawGroundingChunks,
      location,
      coordinates: coords,
    });
  } catch (err: unknown) {
    console.error("Neighborhood guide API error:", err);
    return res.status(500).json({
      error: "Failed to generate neighborhood insights.",
      details: formatGeminiErrorMessage(err),
    });
  }
});

/**
 * 2. Market Intelligence API (Google Search Grounding)
 * Uses gemini-3.5-flash with { googleSearch: {} }
 * Extracts all web search grounding chunks (URIs and titles)
 */
app.post("/api/market-intelligence", async (req: Request, res: Response) => {
  try {
    const { query, suburb, propertyType } = req.body;

    const targetQuery =
      query ||
      `Current real estate market property price trends, rental yields, and SARB interest rate impact for ${suburb || "Gauteng"}, South Africa ${propertyType ? `for ${propertyType} properties` : ""}`;

    const prompt = `Using Google Search, provide up-to-date South African property market intelligence:
${targetQuery}

Cover:
1. Current average sales or rental prices and capital appreciation in this Gauteng area.
2. South African Reserve Bank (SARB) interest rate climate & prime lending rate dynamics.
3. Buyer & tenant demand patterns, municipal rates considerations, and infrastructure developments.
4. Strategic advice for Beno Properties clients and property investors.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction:
          "You are the Chief Market Analyst at Beno Properties (South Africa). Provide authoritative, timely market research grounded in live web data. Include exact stats, financial indicators, and date references where appropriate. Format with clean, structured Markdown.",
      },
    });

    const text = response.text || "";
    const rawGroundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract web search sources per skill specification
    const searchSources: Array<{ title: string; uri: string }> = [];
    rawGroundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        searchSources.push({
          title: chunk.web.title || "Web Source",
          uri: chunk.web.uri || "",
        });
      }
    });

    return res.json({
      success: true,
      text,
      searchSources,
      groundingChunks: rawGroundingChunks,
      query: targetQuery,
    });
  } catch (err: unknown) {
    console.error("Market intelligence API error:", err);
    return res.status(500).json({
      error: "Failed to retrieve market intelligence.",
      details: formatGeminiErrorMessage(err),
    });
  }
});

/**
 * 3. Smart Property Concierge API (Toggleable Maps or Search Grounding)
 * Combines either tool based on mode: 'maps' | 'search' using gemini-3.5-flash
 */
app.post("/api/concierge", async (req: Request, res: Response) => {
  try {
    const { prompt, mode = "maps", location = "Sandton", propertyContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const coords = getCoordinatesForLocation(location);

    if (mode === "maps") {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${prompt} (Context location: ${location}, Gauteng, South Africa. Property: ${propertyContext?.title || "Luxury Gauteng Property"})`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: coords
            ? {
                retrievalConfig: {
                  latLng: {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                  },
                },
              }
            : undefined,
          systemInstruction:
            "You are the Beno Properties AI Concierge with live Google Maps grounding. Help buyers, sellers, and tenants explore local points of interest, nearby venues, road networks, and suburbs in Gauteng.",
        },
      });

      const text = response.text || "";
      const rawGroundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapsLinks: Array<{ title: string; uri: string }> = [];
      rawGroundingChunks.forEach((chunk: any) => {
        if (chunk.maps?.uri) {
          mapsLinks.push({
            title: chunk.maps.title || "Google Maps Location",
            uri: chunk.maps.uri,
          });
        }
      });

      return res.json({
        success: true,
        mode: "maps",
        text,
        mapsLinks,
        groundingChunks: rawGroundingChunks,
      });
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${prompt} (Context: Real estate market in Gauteng, South Africa)`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction:
            "You are the Beno Properties AI Market Concierge with live Google Search grounding. Provide verified, up-to-date South African property market intelligence, economic data, and real estate guidance.",
        },
      });

      const text = response.text || "";
      const rawGroundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const searchSources: Array<{ title: string; uri: string }> = [];
      rawGroundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          searchSources.push({
            title: chunk.web.title || "Source Reference",
            uri: chunk.web.uri,
          });
        }
      });

      return res.json({
        success: true,
        mode: "search",
        text,
        searchSources,
        groundingChunks: rawGroundingChunks,
      });
    }
  } catch (err: unknown) {
    console.error("Concierge API error:", err);
    return res.status(500).json({
      error: "Concierge request failed.",
      details: formatGeminiErrorMessage(err),
    });
  }
});

// Vite Middleware for Development / Static Hosting for Production
async function setupViteOrStatic() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted on Express");
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Serving production build from ${distPath}`);
  }
}

setupViteOrStatic().then(() => {
  app.listen(PORT, () => {
    console.log(`Beno Properties Full-Stack Server running on port ${PORT}`);
  });
});
