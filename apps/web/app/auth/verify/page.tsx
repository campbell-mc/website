"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setError("No token provided");
      return;
    }

    async function verify() {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("chris-user", JSON.stringify(data.user));
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        const data = await res.json();
        setStatus("error");
        setError(
          data.error === "invalid_or_expired"
            ? "This link has expired or already been used."
            : "Sign-in failed. Please try again."
        );
      }
    }

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--cream, #FAF7F2)" }}>
      <div className="w-full max-w-sm text-center">
        <ChrisAvatar size="large" showGlow={status === "verifying"} className="mx-auto mb-6" />

        {status === "verifying" && (
          <>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-2">Signing you in...</h2>
            <p className="text-sm text-gray-500">Just a moment</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E8F5EE] flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-2">You&apos;re in</h2>
            <p className="text-sm text-gray-500">Taking you to your dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-xl font-semibold text-[#C4704A] mb-2">Couldn&apos;t sign in</h2>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="px-6 py-3 rounded-xl text-white font-medium"
              style={{ background: "var(--forest, #1B4332)" }}
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--cream, #FAF7F2)" }}>
        <ChrisAvatar size="large" showGlow className="mx-auto mb-6" />
        <p className="text-sm text-gray-500">Verifying...</p>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
