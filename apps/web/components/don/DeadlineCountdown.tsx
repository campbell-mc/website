"use client";

import { useEffect, useState } from "react";

interface DeadlineCountdownProps {
  deadline: string | null;
}

export function DeadlineCountdown({ deadline }: DeadlineCountdownProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [urgencyColor, setUrgencyColor] = useState("text-[#2D7D73]"); // teal = healthy

  useEffect(() => {
    if (!deadline) return;

    function update() {
      const now = new Date();
      const dl = new Date(deadline!);
      const diffMs = dl.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft("OVERDUE");
        setUrgencyColor("text-red-600 animate-pulse");
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h remaining`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m remaining`);
      }

      // Color coding: >8h green, 4-8h amber, <4h red+pulse, <1h red bold
      if (hours >= 8) {
        setUrgencyColor("text-[#2D7D73]"); // teal
      } else if (hours >= 4) {
        setUrgencyColor("text-[#D4A017]"); // amber
      } else if (hours >= 1) {
        setUrgencyColor("text-[#C4704A] animate-pulse"); // terracotta + pulse
      } else {
        setUrgencyColor("text-red-600 font-bold animate-pulse");
      }
    }

    update();
    const interval = setInterval(update, 60_000); // Update every 60s
    return () => clearInterval(interval);
  }, [deadline]);

  if (!deadline) return null;

  return <span className={`text-sm font-medium ${urgencyColor}`}>{timeLeft}</span>;
}
