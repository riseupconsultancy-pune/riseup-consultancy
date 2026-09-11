"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MapPin, ChevronDown, Check, Globe } from "lucide-react";

interface LocationOption {
  country: string;
  code: string;
  flagComponent: React.ReactNode;
  cities: string[];
}

const LOCATIONS: LocationOption[] = [
  {
    country: "India",
    code: "IN",
    flagComponent: (
      <div className="w-4 h-4 rounded-xs overflow-hidden flex flex-col shadow-xs border border-slate-200 shrink-0">
        <div className="h-1/3 bg-[#FF9933]" />
        <div className="h-1/3 bg-white flex items-center justify-center">
          <div className="w-1 h-1 rounded-full border-[0.5px] border-[#000080]" />
        </div>
        <div className="h-1/3 bg-[#138808]" />
      </div>
    ),
    cities: ["Pune", "Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad"],
  },
  {
    country: "Nigeria",
    code: "NG",
    flagComponent: (
      <div className="w-4 h-4 rounded-xs overflow-hidden flex shadow-xs border border-slate-200 shrink-0">
        <div className="w-1/3 bg-[#008751]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#008751]" />
      </div>
    ),
    cities: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<LocationOption>(LOCATIONS[0]);
  const [selectedCity, setSelectedCity] = useState("Pune");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountryChange = (loc: LocationOption) => {
    setSelectedCountry(loc);
    setSelectedCity(loc.cities[0]);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo & Short Name */}
        <Link href="/" className="group flex items-center gap-3 focus:outline-none">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            {/* Minimalist Geometric Monogram "R" with Upward Arrow */}
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 20V4h7a4 4 0 0 1 4 4c0 2.2-1.8 4-4 4H7" />
              <path d="m13 12 5 8" />
              <path d="M15 4l4 4-4 4" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center tracking-tight">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">Rise</span>
              <span className="text-xl font-extrabold text-blue-600 tracking-tight">Up</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">
              Consultancy • Careers
            </span>
          </div>
        </Link>

        {/* Right: Interactive Country & City Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-50/90 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {selectedCountry.flagComponent}
            <div className="flex items-center gap-1 text-xs">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-800">{selectedCity}</span>
              <span className="text-slate-400 font-normal hidden sm:inline">, {selectedCountry.code}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Location Dropdown Modal */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl p-4 z-50 animate-fadeIn">
              
              {/* Step 1: Select Country */}
              <div className="mb-3.5">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Country
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {LOCATIONS.map((loc) => {
                    const isCountryActive = selectedCountry.country === loc.country;
                    return (
                      <button
                        key={loc.country}
                        type="button"
                        onClick={() => handleCountryChange(loc)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border transition-all ${
                          isCountryActive
                            ? "bg-blue-50/80 border-blue-300 text-blue-700 shadow-2xs"
                            : "bg-slate-50/60 border-slate-200/70 text-slate-700 hover:bg-slate-100/80"
                        }`}
                      >
                        {loc.flagComponent}
                        <span>{loc.country}</span>
                        {isCountryActive && <Check className="w-3 h-3 text-blue-600 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select City */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select City in {selectedCountry.country}
                </span>
                <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                  {selectedCountry.cities.map((city) => {
                    const isCityActive = selectedCity === city;
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                          isCityActive
                            ? "bg-blue-600 text-white font-semibold shadow-xs"
                            : "text-slate-700 hover:bg-slate-100 font-medium"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 ${isCityActive ? "text-white" : "text-slate-400"}`} />
                          {city}
                        </span>
                        {isCityActive && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-blue-500" /> Operating in 2 Regions
                </span>
                <span className="font-semibold text-blue-600">Active Network</span>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}