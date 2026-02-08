"use client";

import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { metaKey?: boolean } = { metaKey: true }
) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const metaMatch = options.metaKey ? e.metaKey || e.ctrlKey : true;
      if (metaMatch && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback();
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [key, callback, options.metaKey]);
}
