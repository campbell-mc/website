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

        <div
          className="inline-block px-6 py-3 rounded-lg text-white font-medium"
          style={{ background: "var(--forest)" }}
        >
          Platform launching soon
        </div>
      </div>
    </div>
  );
}
