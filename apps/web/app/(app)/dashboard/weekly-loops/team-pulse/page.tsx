"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeamPulseRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/team-loop/pulse"); }, [router]);
  return <div className="p-6 text-center text-muted-foreground">Redirecting to Team Pulse...</div>;
}
