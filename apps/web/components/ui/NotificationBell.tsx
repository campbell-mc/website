"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

const NOTIFICATIONS = [
  { id: "1", severity: "immediate", title: "SIRS Cat 1 — 6h remaining", body: "Chronicler draft ready for review", time: "2h ago", route: "/dashboard/sirs/draft", read: false },
  { id: "2", severity: "urgent", title: "Board Pack approval needed", body: "Meeting in 8 days — CHRIS draft ready", time: "4h ago", route: "/dashboard/governance/board-pack", read: false },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const count = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
        <Bell className="w-5 h-5 text-foreground" />
        {count > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[hsl(var(--brand-amber))] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{count}</span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-xl border border-border shadow-xl z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              <button onClick={() => { router.push("/don/queue"); setOpen(false); }} className="text-xs text-[hsl(var(--brand-teal))] font-medium">View all →</button>
            </div>
            <div className="py-1">
              {NOTIFICATIONS.map((n) => (
                <button key={n.id} onClick={() => { router.push(n.route); setOpen(false); }} className="w-full flex gap-3 px-4 py-3 hover:bg-muted text-left">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.severity === "immediate" ? "bg-[#EF4444]" : "bg-[#D4A017]"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{n.body}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[#2D7D73] mt-1.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
