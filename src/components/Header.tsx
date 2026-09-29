"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ChevronDown, Check, Globe } from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import { getActiveLocationsAction } from "@/app/actions/location-actions";

interface LocationOption {
  country: string;
  code: string;
  flagComponent: React.ReactNode;
  cities: string[];
}

const DEFAULT_LOCATIONS: LocationOption[] = [
  {
    country: "India",
    code: "IN",
    flagComponent: (
      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 overflow-hidden flex flex-col border border-slate-300 shrink-0">
        <div className="h-1/3 bg-[#FF9933]" />
        <div className="h-1/3 bg-white flex items-center justify-center">
          <div className="w-1 h-1 rounded-full border-[0.5px] border-[#000080]" />
        </div>
        <div className="h-1/3 bg-[#138808]" />
      </div>
    ),
    cities: ["Pune", "Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Chennai", "Kolkata", "Coimbatore"],
  },
  {
    country: "Nigeria",
    code: "NG",
    flagComponent: (
      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 overflow-hidden flex border border-slate-300 shrink-0">
        <div className="w-1/3 bg-[#008751]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#008751]" />
      </div>
    ),
    cities: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
  },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<LocationOption[]>(DEFAULT_LOCATIONS);
  const [selectedCountry, setSelectedCountry] = useState<LocationOption>(DEFAULT_LOCATIONS[0]);
  const [selectedCity, setSelectedCity] = useState("Pune");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Load dynamically registered serving cities from Client Profiles & Vacancies
    getActiveLocationsAction().then((data) => {
      if (data && data.citiesByCountry) {
        setLocations((prev) => {
          const updated = prev.map((loc) => ({
            ...loc,
            cities: data.citiesByCountry[loc.country] || loc.cities,
          }));
          return updated;
        });
      }
    }).catch(() => {
      // safe fallback to defaults
    });
  }, []);

  useEffect(() => {
    // Keep selectedCountry in sync with updated locations list
    const current = locations.find((l) => l.country === selectedCountry.country);
    if (current) {
      setSelectedCountry(current);
    }
  }, [locations, selectedCountry.country]);

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
    router.push(`/jobs?city=${encodeURIComponent(city)}`);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 pointer-events-none ${
        isHomePage ? "md:-mb-[72px]" : ""
      } ${
        isScrolled
          ? "md:pt-3 md:px-4 lg:px-8"
          : "md:pt-4 md:px-4 lg:px-8"
      }`}
    >
      <div
        className={`w-full transition-all duration-300 pointer-events-auto ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 md:border md:border-slate-200/80 md:liquid-glass md:max-w-7xl md:mx-auto md:rounded-full md:shadow-lg md:shadow-slate-900/5 md:h-16 md:px-6"
            : isHomePage
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 md:bg-transparent md:border-transparent md:shadow-none md:max-w-7xl md:mx-auto md:rounded-full md:h-16 md:px-6"
            : "bg-white/95 backdrop-blur-md border-b border-slate-200/80 md:border md:border-slate-200/80 md:bg-white/90 md:max-w-7xl md:mx-auto md:rounded-full md:shadow-xs md:h-16 md:px-6"
        } h-16 sm:h-20 md:h-16 flex items-center justify-between gap-2 px-3 sm:px-6`}
      >
        
        {/* Left: Official Brand Logo & Name (Borderless Logo as-is) */}
        <Link href="/" className="group flex items-center gap-2 sm:gap-3 focus:outline-none min-w-0">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/images/rise_up_consultancy_pune_logo.png"
              alt="Rise Up Consultancy Logo"
              fill
              className="object-contain select-none"
              priority
            />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-[13px] sm:text-base lg:text-lg font-black text-slate-900 tracking-tight uppercase font-heading whitespace-nowrap">
              RISE UP CONSULTANCY
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold text-blue-600 tracking-wider uppercase whitespace-nowrap">
              Staffing &amp; Recruiting Services
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Link href="/services" className="hover:text-blue-600 transition-colors">
            Services
          </Link>
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">
            Jobs
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right Actions: LinkedIn + Direct HR Call Badge + Location Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Official LinkedIn Link */}
          <a
            href="https://www.linkedin.com/company/rise-up-consultancy-pune"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 transition-all rounded-xl shadow-2xs ${
              isScrolled || !isHomePage
                ? "bg-gradient-to-b from-white to-slate-50 border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700"
                : "bg-white/70 backdrop-blur-xs border border-slate-200/80 hover:bg-white hover:text-blue-600 text-slate-700"
            }`}
            title="Rise Up Consultancy on LinkedIn"
          >
            <span className="font-extrabold text-xs">in</span>
          </a>

          {/* Direct HR Call Button (Desktop & Tablet) */}
          <a
            href="tel:+919359892819"
            className={`hidden md:inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-800 transition-all rounded-xl shadow-2xs ${
              isScrolled || !isHomePage
                ? "bg-gradient-to-b from-white to-slate-50 border border-slate-200 hover:border-slate-900 hover:bg-white"
                : "bg-white/70 backdrop-blur-xs border border-slate-200/80 hover:bg-white hover:border-slate-900"
            }`}
            title="Call Meenakshi Patel (HR Manager)"
          >
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0" />
            <span className="text-slate-500 font-normal">HR Desk:</span>
            <span className="font-bold text-slate-900">+91 93598 92819</span>
          </a>

          {/* Location Selector Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`group flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 sm:py-2 text-left focus:outline-none rounded-xl shadow-2xs transition-all ${
                isScrolled || !isHomePage
                  ? "bg-gradient-to-b from-white to-slate-50 border border-slate-200 hover:border-slate-900"
                  : "bg-white/70 backdrop-blur-xs border border-slate-200/80 hover:bg-white hover:border-slate-900"
              }`}
            >
              {selectedCountry.flagComponent}
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                <span className="text-[11px] sm:text-xs whitespace-nowrap">{selectedCity}</span>
                <span className="text-slate-400 font-normal text-[10px] sm:text-xs hidden min-[480px]:inline">({selectedCountry.code})</span>
              </div>
              <ChevronDown
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 group-hover:text-slate-900 transition-transform duration-200 shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

          {/* Location Dropdown Modal (Constrained strictly to mobile viewport boundaries) */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-[320px] bg-white border border-slate-300 shadow-2xl p-3.5 sm:p-4 z-50 animate-fadeIn rounded-2xl">
              
              {/* Step 1: Select Country */}
              <div className="mb-3.5">
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Country
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {locations.map((loc) => {
                    const isCountryActive = selectedCountry.country === loc.country;
                    return (
                      <button
                        key={loc.country}
                        type="button"
                        onClick={() => handleCountryChange(loc)}
                        className={`flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 text-xs font-semibold border transition-all rounded-xl ${
                          isCountryActive
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {loc.flagComponent}
                        <span className="text-[11px] sm:text-xs">{loc.country}</span>
                        {isCountryActive && <Check className="w-3 h-3 text-white ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select City */}
              <div>
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select City in {selectedCountry.country}
                </span>
                <div className="space-y-1 max-h-40 sm:max-h-44 overflow-y-auto pr-1">
                  {selectedCountry.cities.map((city) => {
                    const isCityActive = selectedCity === city;
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 sm:py-2 text-xs transition-colors rounded-lg ${
                          isCityActive
                            ? "bg-slate-900 text-white font-semibold"
                            : "text-slate-700 hover:bg-slate-100 font-medium"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-[11px] sm:text-xs">
                          <MapPin className={`w-3.5 h-3.5 ${isCityActive ? "text-white" : "text-slate-400"}`} />
                          {city}
                        </span>
                        {isCityActive && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-blue-600" /> Active Placement Network
                </span>
                <span className="font-bold text-slate-900">Direct Sourcing</span>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  </header>
  );
}