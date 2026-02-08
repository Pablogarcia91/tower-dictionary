"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadVoices = () => {
      voicesRef.current = speechSynthesis.getVoices();
    };
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () =>
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speak = useCallback((text: string, lang: "en" | "ca") => {
    if (typeof window === "undefined") return;

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = voicesRef.current;

    if (lang === "en") {
      utterance.lang = "en-US";
      const voice = voices.find((v) => v.lang.startsWith("en") && v.localService);
      if (voice) utterance.voice = voice;
    } else {
      // Try Catalan/Valencian first, then fall back to Spanish
      utterance.lang = "ca-ES";
      const caVoice = voices.find((v) => v.lang.startsWith("ca") && v.localService);
      if (caVoice) {
        utterance.voice = caVoice;
      } else {
        utterance.lang = "es-ES";
        const esVoice = voices.find((v) => v.lang.startsWith("es") && v.localService);
        if (esVoice) utterance.voice = esVoice;
      }
    }

    utterance.rate = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}
