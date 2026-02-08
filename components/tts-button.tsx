"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTTS } from "@/hooks/use-tts";

interface TTSButtonProps {
  text: string;
  lang: "en" | "ca";
  size?: "sm" | "default";
}

export function TTSButton({ text, lang, size = "sm" }: TTSButtonProps) {
  const { speak, speaking } = useTTS();

  const label = lang === "en" ? "Pronounce in English" : "Pronunciar en Valencià";

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`${size === "sm" ? "h-7 w-7" : "h-8 w-8"} text-muted-foreground hover:text-foreground transition-colors cursor-pointer`}
            onClick={(e) => {
              e.stopPropagation();
              speak(text, lang);
            }}
          >
            {speaking ? (
              <VolumeX className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
            ) : (
              <Volume2 className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
