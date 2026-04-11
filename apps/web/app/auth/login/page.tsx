"use client";

import { useState } from "react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/auth/send-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--cream, #FAF7F2)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <ChrisAvatar size="large" showGlow className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1B4332]" style={{ fontFamily: "'Source Serif 4', serif" }}>
            CHRIS
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Culture Habit Reinforcement Intelligence System
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-[#1B4332] mb-2">
                Your mobile number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0412 345 678"
                className="w-full p-4 border border-gray-200 rounded-xl text-lg tracking-wider focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10"
                autoFocus
                autoComplete="tel"
              />
              <p className="text-xs text-gray-400 mt-2">
                We'll send you a sign-in link via iMessage
              </p>

              <button
                type="submit"
                disabled={phone.length < 8 || loading}
                className="w-full mt-4 py-4 rounded-xl text-white font-medium text-base disabled:opacity-40 transition-opacity"
                style={{ background: "var(--forest, #1B4332)" }}
              >
                {loading ? "Sending..." : "Send sign-in link"}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E8F5EE] flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <h2 className="text-lg font-semibold text-[#1B4332] mb-2">
              Check your iMessage
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              We've sent a sign-in link to <strong>{phone}</strong>
            </p>
            <p className="text-xs text-gray-400">
              Tap the link to sign in. It expires in 15 minutes.
            </p>

            <button
              onClick={() => { setSent(false); setPhone(""); }}
              className="mt-6 text-sm text-[#1B4332] underline"
            >
              Use a different number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
