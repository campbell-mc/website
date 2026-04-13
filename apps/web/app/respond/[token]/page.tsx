"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface ResponsePayload {
  type: string;
  facility_name: string;
  message: string;
  options?: { id: string; label: string; value: string; style: string }[];
  scale?: { min: number; max: number; min_label: string; max_label: string };
  text_prompt?: string;
  expires_at: string;
  already_responded: boolean;
}

export default function RespondPage() {
  const params = useParams();
  const [payload, setPayload] = useState<ResponsePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [scaleValue, setScaleValue] = useState<number | null>(null);
  const [textInput, setTextInput] = useState("");
  const [done, setDone] = useState(false);
  const [expired, setExpired] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState("");

  useEffect(() => {
    fetch(`/api/respond/${params.token}`)
      .then((r) => { if (!r.ok) { setExpired(true); setLoading(false); return null; } return r.json(); })
      .then((data) => {
        if (!data) return;
        if (new Date(data.expires_at) < new Date()) setExpired(true);
        else if (data.already_responded) setDone(true);
        setPayload(data);
        setLoading(false);
      })
      .catch(() => { setExpired(true); setLoading(false); });
  }, [params.token]);

  async function submit(value: string) {
    setResponding(true);
    try {
      await fetch(`/api/respond/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: value, scale_value: scaleValue, text_input: textInput }),
      });
      setSelectedResponse(value);
      setDone(true);
    } finally { setResponding(false); }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-[#1B4332] flex items-center justify-center mx-auto mb-3"><span className="text-white font-bold">C</span></div>
        <div className="flex gap-1 justify-center">{[0, 1, 2].map((i) => <div key={i} className="w-2 h-2 rounded-full bg-[#2D7D73] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>
      </div>
    </div>
  );

  if (expired) return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">⏱</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">This request has expired</h2>
        <p className="text-sm text-gray-500">This response window has closed. If this was urgent, contact your manager directly.</p>
      </div>
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-[#F0F7F4] flex items-center justify-center mx-auto mb-4"><span className="text-3xl">✓</span></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Response received</h2>
        <p className="text-sm text-gray-500 mb-4">Thank you — your response has been recorded.</p>
        {selectedResponse && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">You responded</p>
            <p className="text-sm font-semibold text-gray-900">{selectedResponse}</p>
          </div>
        )}
        {(payload?.type === "leader_loop" || payload?.type === "pulse_response") && <p className="text-xs text-gray-400">Your response is completely anonymous.</p>}
        <p className="text-xs text-gray-300 mt-4">You can close this window.</p>
      </div>
    </div>
  );

  if (!payload) return null;
  const hoursRemaining = (new Date(payload.expires_at).getTime() - Date.now()) / (1000 * 60 * 60);

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Header */}
      <div className="bg-[#1B4332] px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><span className="text-white text-sm font-bold">C</span></div>
          <div><p className="text-white text-sm font-semibold">CHRIS</p><p className="text-white/60 text-xs">{payload.facility_name}</p></div>
        </div>
        <p className="text-white text-[17px] leading-relaxed">{payload.message}</p>
        {hoursRemaining < 2 && <div className="mt-3 flex items-center gap-2"><span className="text-amber-300 text-sm">⚠</span><p className="text-amber-300 text-sm font-semibold">Expires in {Math.round(hoursRemaining * 60)} minutes</p></div>}
      </div>

      <div className="p-5 space-y-3">
        {/* Options */}
        {payload.options?.map((o) => (
          <button key={o.id} onClick={() => submit(o.value)} disabled={responding}
            className={`w-full py-4 rounded-2xl text-[17px] font-semibold transition-opacity ${responding ? "opacity-50" : ""} ${o.style === "primary" ? "bg-[#1B4332] text-white" : o.style === "destructive" ? "bg-[#FEF7F0] text-[#C4704A] border border-[#C4704A]" : "bg-white text-gray-700 border border-gray-200"}`}>
            {responding ? "..." : o.label}
          </button>
        ))}

        {/* Scale */}
        {payload.scale && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex justify-between text-xs text-gray-500 mb-4"><span>{payload.scale.min_label}</span><span>{payload.scale.max_label}</span></div>
            <div className="flex gap-2 mb-4">
              {Array.from({ length: payload.scale.max - payload.scale.min + 1 }, (_, i) => i + payload.scale!.min).map((n) => (
                <button key={n} onClick={() => setScaleValue(n)} className={`flex-1 h-14 rounded-xl text-lg font-bold transition-all ${scaleValue === n ? "bg-[#1B4332] text-white" : "bg-gray-100 text-gray-700"}`}>{n}</button>
              ))}
            </div>
            {scaleValue !== null && <button onClick={() => submit(scaleValue.toString())} disabled={responding} className="w-full py-4 bg-[#1B4332] text-white rounded-2xl text-[17px] font-semibold">{responding ? "..." : "Submit →"}</button>}
          </div>
        )}

        {/* Text */}
        {payload.text_prompt && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-[15px] font-medium text-gray-700 mb-3">{payload.text_prompt}</p>
            <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Type your response..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[17px] outline-none focus:border-[#2D7D73] resize-none mb-3" />
            <button onClick={() => submit(textInput)} disabled={!textInput.trim() || responding} className={`w-full py-4 rounded-2xl text-[17px] font-semibold ${textInput.trim() ? "bg-[#1B4332] text-white" : "bg-gray-200 text-gray-400"}`}>{responding ? "..." : "Submit →"}</button>
          </div>
        )}

        {(payload.type === "leader_loop" || payload.type === "pulse_response") && <p className="text-sm text-gray-400 text-center px-4">Your response is completely anonymous.</p>}
        <p className="text-xs text-gray-300 text-center pb-8">CHRIS · {payload.facility_name}</p>
      </div>
    </div>
  );
}
