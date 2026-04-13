"use client";

import { useState } from "react";

const SERVICES = [
  { id: "combined", label: "All services", clients: 247, workers: 89 },
  { id: "camelot-hc-001", label: "Camelot — Inner West", clients: 134, workers: 48 },
  { id: "avalon-hc-001", label: "Avalon — Northern Beaches", clients: 113, workers: 41 },
];

export function ServiceSwitcher({ activeService, onServiceChange }: { activeService: string; onServiceChange: (id: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {SERVICES.map((s) => (
        <button key={s.id} onClick={() => onServiceChange(s.id)}
          className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeService === s.id ? "bg-[#1B4332] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#2D7D73]"}`}>
          <span>{s.label}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeService === s.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>{s.clients}</span>
        </button>
      ))}
    </div>
  );
}
