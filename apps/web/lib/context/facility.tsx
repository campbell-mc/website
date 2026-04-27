"use client";

import { createContext, useContext } from "react";
import type { CareType } from "@/lib/types";

interface FacilityContextValue {
  facilityId: string;
  facilityName: string;
  careType: CareType;
  providerName: string;
}

const FacilityContext = createContext<FacilityContextValue>({
  facilityId: "FAC-001",
  facilityName: "Mt Gib Gardens Bowral",
  careType: "residential",
  providerName: "Mt Gib Gardens",
});

export const useFacility = () => useContext(FacilityContext);
export const FacilityProvider = FacilityContext.Provider;
