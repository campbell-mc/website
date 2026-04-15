"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useDeepgramSTT } from "@/hooks/useDeepgramSTT";

interface VoiceCHRISProps {
  facilityId?: string;
  userRole?: string;
  facilityName?: string;
  onTranscriptSent?: (text: string) => void;
  onResponseReceived?: (text: string) => void;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1");
}

export function VoiceCHRIS({
  facilityId = "FAC-001",
  userRole = "don",
  facilityName = "The Holy Grail Bowral",
  onTranscriptSent,
  onResponseReceived,
}: VoiceCHRISProps) {
  const [state, setState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const accumulatedRef = useRef("");

  const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ?? "";

  // TTS playback
  const speak = useCallback(async (text: string) => {
    setState("speaking");
    try {
      const res = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: stripMarkdown(text) }),
      });

      if (!res.ok) {
        setState("idle");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setState("idle");
      };

      audio.play();
    } catch {
      setState("idle");
    }
  }, []);

  // Send transcript to CHRIS Coach
  const sendToCoach = useCallback(async (text: string) => {
    setState("thinking");
    setTranscript(text);
    onTranscriptSent?.(text);
    accumulatedRef.current = "";

    try {
      const res = await fetch("/api/conversations/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          stream: true,
          facility_id: facilityId,
          facility_name: facilityName,
          user_role: userRole,
          context_type: "voice",
        }),
      });

      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("text/plain")) {
        // Streaming
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;
            setResponse(stripMarkdown(fullText));
          }
        }

        onResponseReceived?.(fullText);
        speak(fullText);
      } else {
        // JSON fallback
        const data = await res.json();
        const text = data.content ?? "";
        setResponse(stripMarkdown(text));
        onResponseReceived?.(text);
        speak(text);
      }
    } catch {
      setError("Could not reach CHRIS. Please try again.");
      setState("idle");
    }
  }, [facilityId, facilityName, userRole, onTranscriptSent, onResponseReceived, speak]);

  const stt = useDeepgramSTT({
    apiKey,
    endpointing: 500,
    onInterimTranscript: (text) => {
      accumulatedRef.current = text;
      setTranscript(text);
    },
    onFinalTranscript: (text) => {
      if (text.trim().length > 2) {
        stt.stop();
        sendToCoach(text.trim());
      }
    },
    onError: (err) => {
      setError(err);
      setState("idle");
    },
  });

  const toggle = useCallback(() => {
    setError(null);

    if (state === "speaking") {
      // Stop audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setState("idle");
      return;
    }

    if (stt.listening) {
      stt.stop();
      setState("idle");
    } else {
      setTranscript("");
      setResponse("");
      stt.start();
      setState("listening");
    }
  }, [state, stt]);

  const buttonColor =
    state === "listening" ? "bg-emerald-500 hover:bg-emerald-600" :
    state === "thinking" ? "bg-amber-500" :
    state === "speaking" ? "bg-[#2D7D73] hover:bg-[#2D7D73]/90" :
    "bg-[#1B4332] hover:bg-[#1B4332]/90";

  const buttonIcon =
    state === "speaking" ? <Volume2 className="w-5 h-5 text-white" /> :
    state === "listening" || state === "thinking" ? <Mic className="w-5 h-5 text-white" /> :
    <Mic className="w-5 h-5 text-white" />;

  return (
    <div className="relative">
      {/* Floating transcript/response */}
      {(transcript || response) && state !== "idle" && (
        <div className="absolute bottom-16 right-0 w-72 bg-white border border-[#1B4332]/12 rounded-xl shadow-lg p-4 z-50">
          {state === "listening" && transcript && (
            <div>
              <p className="text-[9px] text-emerald-600 uppercase tracking-wider font-medium mb-1">Listening</p>
              <p className="text-sm text-stone-700 italic">{transcript}</p>
            </div>
          )}
          {state === "thinking" && (
            <div>
              <p className="text-[9px] text-amber-600 uppercase tracking-wider font-medium mb-1">Thinking</p>
              <p className="text-sm text-stone-500 italic">{transcript}</p>
              <div className="flex gap-1 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          {state === "speaking" && response && (
            <div>
              <p className="text-[9px] text-[#2D7D73] uppercase tracking-wider font-medium mb-1">CHRIS</p>
              <p className="text-xs text-stone-600 leading-relaxed max-h-32 overflow-y-auto">{response}</p>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute bottom-16 right-0 w-64 bg-red-50 border border-red-200 rounded-xl p-3 z-50">
          <p className="text-xs text-red-600">{error}</p>
          <button onClick={() => setError(null)} className="text-[10px] text-red-400 mt-1 hover:text-red-600">Dismiss</button>
        </div>
      )}

      {/* Mic button */}
      <button
        onClick={toggle}
        disabled={state === "thinking" && !apiKey}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${buttonColor} ${
          state === "listening" ? "animate-pulse ring-4 ring-emerald-200" : ""
        } ${state === "thinking" ? "cursor-wait" : "cursor-pointer"}`}
        title={
          state === "idle" ? "Press to speak to CHRIS" :
          state === "listening" ? "Listening... press to stop" :
          state === "thinking" ? "CHRIS is thinking..." :
          "CHRIS is speaking... press to stop"
        }
      >
        {buttonIcon}
      </button>

      {/* No API key fallback */}
      {!apiKey && state === "idle" && (
        <p className="absolute bottom-[-20px] right-0 text-[9px] text-stone-400 whitespace-nowrap">
          Voice requires Deepgram API key
        </p>
      )}
    </div>
  );
}
