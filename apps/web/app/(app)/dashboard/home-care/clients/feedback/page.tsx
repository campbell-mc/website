"use client";
import { useRouter } from "next/navigation";
export default function ComingSoonPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-96 text-center p-8">
      <div className="w-12 h-12 rounded-full bg-[#F0F7F4] flex items-center justify-center mb-4"><span className="text-[#2D7D73] text-xl">✦</span></div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">Coming soon</h2>
      <p className="text-sm text-gray-500 mb-6">CHRIS is building this screen. Full implementation in progress.</p>
      <button onClick={() => router.back()} className="px-6 py-3 border border-[#1B4332] text-[#1B4332] rounded-xl text-sm font-semibold">← Back</button>
    </div>
  );
}
