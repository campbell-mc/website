"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { queue_summary } from "@/lib/seed-data";

const tabs = [
  {
    label: "Home",
    path: "/dashboard",
    icon: (active: boolean) => (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={active ? "#2D7D73" : "#9CA3AF"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
  },
  {
    label: "Queue",
    path: "/don/queue",
    icon: (active: boolean) => (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={active ? "#2D7D73" : "#9CA3AF"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
        />
      </svg>
    ),
  },
  {
    label: "CHRIS",
    path: "/dashboard/coach",
    icon: (active: boolean) => (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={active ? "#2D7D73" : "#9CA3AF"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
        />
      </svg>
    ),
  },
  {
    label: "Briefing",
    path: "/dashboard/briefing",
    icon: (active: boolean) => (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={active ? "#2D7D73" : "#9CA3AF"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
        />
      </svg>
    ),
  },
  {
    label: "More",
    path: "/dashboard/more",
    icon: (active: boolean) => (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={active ? "#2D7D73" : "#9CA3AF"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    ),
  },
];

function getBadgeInfo() {
  const summary = queue_summary.don;
  if (!summary || summary.count === 0) return null;
  return {
    count: summary.count,
    severity: summary.highestSeverity,
  };
}

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const badge = getBadgeInfo();

  const isActive = (tabPath: string) => {
    if (tabPath === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(tabPath);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-gray-100 pb-safe md:hidden">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <button
              key={tab.path}
              data-has-handler="true"
              onClick={() => router.push(tab.path)}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] relative gap-0.5"
            >
              {/* Active dot */}
              {active && (
                <span className="absolute -top-1 w-1 h-1 rounded-full bg-[#2D7D73]" />
              )}

              {/* Icon with optional badge */}
              <span className="relative">
                {tab.icon(active)}
                {tab.label === "Queue" && badge && (
                  <span
                    className={`absolute -top-1.5 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-semibold text-white px-1 ${
                      badge.severity === "immediate"
                        ? "bg-red-500 animate-pulse"
                        : badge.severity === "urgent"
                          ? "bg-[#D4A017]"
                          : "bg-gray-400"
                    }`}
                  >
                    {badge.count}
                  </span>
                )}
              </span>

              {/* Label */}
              <span
                className={`text-[10px] leading-tight ${
                  active
                    ? "text-[#2D7D73] font-medium"
                    : "text-gray-400 font-normal"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
