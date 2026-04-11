import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--cream)" }}>
      <div className="text-center max-w-2xl px-6">
        {/* CHRIS Avatar */}
        <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-gradient-to-br from-[#1B4332] to-[#D4A017] flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl font-bold">C</span>
        </div>

        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: "var(--forest)", fontFamily: "'Source Serif 4', serif" }}
        >
          CHRIS
        </h1>
        <p className="text-lg mb-2" style={{ color: "var(--forest-light)" }}>
          Culture Habit Reinforcement Intelligence System
        </p>
        <p className="text-sm mb-8" style={{ color: "#6b6b6b" }}>
          Operational intelligence for Australian aged care providers
        </p>

        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            style={{ background: "var(--forest)" }}
          >
            Open Dashboard
          </Link>
          <Link
            href="/comply"
            className="inline-block px-8 py-3 rounded-xl font-medium border-2 hover:bg-[#E8F5EE] transition-colors"
            style={{ borderColor: "var(--forest)", color: "var(--forest)" }}
          >
            Free Compliance Audit
          </Link>
        </div>
      </div>
    </div>
  );
}
