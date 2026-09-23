"use server";

import prisma from "@/lib/prisma";

const DEFAULT_LOCATIONS: Record<string, string[]> = {
  India: ["Pune", "Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Chennai", "Kolkata", "Coimbatore"],
  Nigeria: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
};

export interface ActiveLocationsData {
  countries: string[];
  citiesByCountry: Record<string, string[]>;
  allCities: string[];
}

export async function getActiveLocationsAction(): Promise<ActiveLocationsData> {
  try {
    // 1. Fetch distinct cities from Client Profiles
    const clientProfiles = await prisma.clientProfile.findMany({
      select: {
        country: true,
        city: true,
      },
      distinct: ["country", "city"],
    });

    // 2. Fetch distinct cities from Active Vacancies
    const vacancies = await prisma.vacancy.findMany({
      where: {
        status: { in: ["ACTIVE", "APPROVED"] },
      },
      select: {
        country: true,
        city: true,
      },
      distinct: ["country", "city"],
    });

    const citiesByCountry: Record<string, Set<string>> = {
      India: new Set(DEFAULT_LOCATIONS.India),
      Nigeria: new Set(DEFAULT_LOCATIONS.Nigeria),
    };

    // Helper to normalize and add
    const addLocation = (countryRaw?: string | null, cityRaw?: string | null) => {
      if (!cityRaw) return;
      const city = cityRaw.trim();
      if (!city) return;

      const country = countryRaw?.toLowerCase().includes("nigeria") ? "Nigeria" : "India";
      if (!citiesByCountry[country]) {
        citiesByCountry[country] = new Set();
      }
      citiesByCountry[country].add(city);
    };

    clientProfiles.forEach((cp) => addLocation(cp.country, cp.city));
    vacancies.forEach((v) => addLocation(v.country, v.city));

    const finalCitiesByCountry: Record<string, string[]> = {};
    const allCitiesSet = new Set<string>();

    Object.keys(citiesByCountry).forEach((country) => {
      const cityList = Array.from(citiesByCountry[country]).sort();
      finalCitiesByCountry[country] = cityList;
      cityList.forEach((c) => allCitiesSet.add(c));
    });

    return {
      countries: Object.keys(finalCitiesByCountry),
      citiesByCountry: finalCitiesByCountry,
      allCities: Array.from(allCitiesSet).sort(),
    };
  } catch (error) {
    console.error("getActiveLocationsAction error:", error);
    return {
      countries: ["India", "Nigeria"],
      citiesByCountry: DEFAULT_LOCATIONS,
      allCities: [...DEFAULT_LOCATIONS.India, ...DEFAULT_LOCATIONS.Nigeria],
    };
  }
}
