"use client";

import { useMobile } from "@/lib/hooks/useMobile";
import MobileLeaveCalendar from "@/components/mobile/MobileLeaveCalendar";
import { DesktopLeaveCalendar } from "@/components/operations/DesktopLeaveCalendar";

export default function LeavePage() {
  const mobile = useMobile();
  if (mobile) return <MobileLeaveCalendar />;
  return <DesktopLeaveCalendar />;
}
