"use client";

import { useState, useRef, useEffect } from "react";

interface OverflowAction {
  label: string;
  icon: string;
  action: () => void;
  destructive?: boolean;
}

export function ActionCardOverflow({ actions }: { actions: OverflowAction[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted text-lg">•••</button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-card rounded-xl border border-border shadow-lg z-20 min-w-[180px] py-1">
          {actions.map((a, i) => (
            <button key={i} onClick={() => { a.action(); setOpen(false); }} className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors ${a.destructive ? "text-[#C4704A]" : "text-foreground"}`}>
              <span>{a.icon}</span><span>{a.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
