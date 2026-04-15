"use client";

import { useState, useRef, useCallback } from "react";

export interface STTConfig {
  apiKey: string;
  onInterimTranscript?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  endpointing?: number; // ms of silence before end-of-utterance (default 500)
}

export function useDeepgramSTT(config: STTConfig) {
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);

  const start = useCallback(async () => {
    try {
      // Request microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });
      mediaStreamRef.current = stream;

      // Connect to Deepgram WebSocket
      const endpointing = config.endpointing ?? 500;
      const wsUrl = `wss://api.deepgram.com/v1/listen?model=nova-3&language=en-AU&smart_format=true&interim_results=true&endpointing=${endpointing}&encoding=linear16&sample_rate=16000`;

      const ws = new WebSocket(wsUrl, ["token", config.apiKey]);
      wsRef.current = ws;

      ws.onopen = () => {
        setListening(true);

        // Set up audio processing
        const audioContext = new AudioContext({ sampleRate: 16000 });
        contextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              pcm16[i] = Math.max(-32768, Math.min(32767, Math.round(inputData[i] * 32768)));
            }
            ws.send(pcm16.buffer);
          }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "Results" && data.channel?.alternatives?.[0]) {
            const transcript = data.channel.alternatives[0].transcript;
            if (!transcript) return;

            if (data.is_final) {
              setInterimText("");
              config.onFinalTranscript?.(transcript);
            } else {
              setInterimText(transcript);
              config.onInterimTranscript?.(transcript);
            }
          }
        } catch {
          // Ignore parse errors
        }
      };

      ws.onerror = () => {
        config.onError?.("Voice connection failed. Please try again.");
        stop();
      };

      ws.onclose = () => {
        setListening(false);
      };
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        config.onError?.("Microphone access denied. Please allow microphone permission to use voice.");
      } else {
        config.onError?.("Could not start voice input. Please try again.");
      }
    }
  }, [config]);

  const stop = useCallback(() => {
    // Close WebSocket
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "CloseStream" }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    // Stop audio processing
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (contextRef.current) {
      contextRef.current.close();
      contextRef.current = null;
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    setListening(false);
    setInterimText("");
  }, []);

  return { listening, interimText, start, stop };
}
