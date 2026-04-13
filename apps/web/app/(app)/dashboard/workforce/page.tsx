"use client";

import { useMobile } from "@/lib/hooks/useMobile";
import { MobileDomainScreen } from "@/components/mobile/MobileDomainScreen";
import { WorkforceControlCentre } from "@/components/workforce/WorkforceControlCentre";

export default function WorkforcePage() {
  const mobile = useMobile();
  if (mobile) return <MobileDomainScreen domain="workforce" />;
  return <WorkforceControlCentre />;
}
