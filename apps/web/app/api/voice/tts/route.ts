import { NextRequest } from "next/server";

// TTS proxy — keeps Deepgram API key server-side
export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text || typeof text !== "string") {
    return new Response(JSON.stringify({ error: "Text required" }), { status: 400 });
  }

  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "TTS not configured" }), { status: 503 });
  }

  try {
    const res = await fetch("https://api.deepgram.com/v1/speak?model=aura-2-en-au", {
      method: "POST",
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "TTS failed" }), { status: 502 });
    }

    // Stream the audio back
    return new Response(res.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "TTS error" }), { status: 500 });
  }
}
