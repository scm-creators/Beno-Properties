/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BedDouble, Bath, Car, Maximize2, Tag, ArrowUpRight, Heart } from "lucide-react";
import { Property } from "../types";

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  key?: string | number;
  isFavorited?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
}

export const formatPriceZAR = (price: number, status: string) => {
  const formatted = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(price);

  return status === "To Rent" ? `${formatted} / month` : formatted;
};

export default function PropertyCard({
  property,
  onViewDetails,
  isFavorited = false,
  onToggleFavorite,
}: PropertyCardProps) {
  return (
    <div
      id={`property-card-${property.id}`}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col h-full"
    >
      {/* Property Image & Badges */}
      <div className="relative aspect-video overflow-hidden bg-gray-100" id={`property-img-container-${property.id}`}>
        <img
          src={property.imageUrl}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          id={`property-img-${property.id}`}
        />

        {/* Transaction Status Tag */}
        <span
          id={`property-status-badge-${property.id}`}
          className={`absolute top-4 left-4 z-10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg shadow-md text-white ${
            property.status === "For Sale"
              ? "bg-brand-primary"
              : "bg-brand-secondary"
          }`}
        >
          {property.status}
        </span>

        {/* Property Type Badge */}
        <span
          id={`property-type-badge-${property.id}`}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 text-xs font-semibold tracking-wide rounded-lg border border-gray-200 shadow-sm"
        >
          {property.type}
        </span>

        {/* Web Reference ID bottom overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-brand-primary font-bold border border-gray-200 shadow-sm">
          REF: {property.id}
        </div>

        {/* Heart/Favorite Button */}
        {onToggleFavorite && (
          <button
            id={`favorite-btn-${property.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className={`absolute bottom-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm shadow-md border cursor-pointer transition-all duration-300 ${
              isFavorited
                ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100 scale-105"
                : "bg-white/90 text-gray-400 border-gray-200 hover:text-red-500 hover:bg-white hover:scale-105"
            }`}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-current text-red-500" : ""}`} />
          </button>
        )}
      </div>

      {/* Property Content */}
      <div className="p-5 flex-1 flex flex-col justify-between" id={`property-body-${property.id}`}>
        <div>
          {/* Suburb / Area */}
          <div className="text-xs font-mono text-brand-secondary uppercase tracking-widest mb-1.5 flex items-center gap-1 font-semibold">
            <Tag className="h-3 w-3" />
            {property.location}, {property.city}
          </div>

          {/* Title */}
          <h3
            id={`property-title-${property.id}`}
            className="text-base font-bold text-gray-800 group-hover:text-brand-primary transition-colors line-clamp-1 mb-2.5"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Description Snippet */}
          <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
            {property.description}
          </p>
        </div>

        <div>
          {/* Core Badges Row */}
          <div
            id={`property-specs-${property.id}`}
            className="grid grid-cols-4 gap-2 py-3 border-y border-gray-200 mb-4 text-gray-600 font-mono text-xs"
          >
            {/* Bedrooms */}
            <div className="flex flex-col items-center justify-center p-1.5 bg-gray-50 rounded-lg border border-gray-200" title="Bedrooms">
              <BedDouble className="h-4 w-4 text-gray-400 mb-1" />
              <span className="font-semibold text-[11px] text-gray-700">{property.bedrooms ?? "—"}</span>
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col items-center justify-center p-1.5 bg-gray-50 rounded-lg border border-gray-200" title="Bathrooms">
              <Bath className="h-4 w-4 text-gray-400 mb-1" />
              <span className="font-semibold text-[11px] text-gray-700">{property.bathrooms ?? "—"}</span>
            </div>

            {/* Parking */}
            <div className="flex flex-col items-center justify-center p-1.5 bg-gray-50 rounded-lg border border-gray-200" title="Garages/Parking">
              <Car className="h-4 w-4 text-gray-400 mb-1" />
              <span className="font-semibold text-[11px] text-gray-700">{property.parkingSpaces ?? "—"}</span>
            </div>

            {/* Size SqM */}
            <div className="flex flex-col items-center justify-center p-1.5 bg-gray-50 rounded-lg border border-gray-200" title="Floor Size">
              <Maximize2 className="h-4 w-4 text-gray-400 mb-1" />
              <span className="font-semibold text-[11px] text-gray-700 font-mono">
                {property.sizeSqM ? `${property.sizeSqM} m²` : "—"}
              </span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between pt-1" id={`property-footer-${property.id}`}>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Pricing</span>
              <span className="text-base font-extrabold text-brand-primary tracking-tight">
                {formatPriceZAR(property.price, property.status)}
              </span>
            </div>

            <button
              id={`view-details-btn-${property.id}`}
              onClick={() => onViewDetails(property)}
              className="bg-gray-50 hover:bg-brand-primary text-gray-500 hover:text-white p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center group/btn border border-gray-200 hover:border-brand-primary"
              title="View Complete Property Details"
            >
              <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
