import { motion } from "framer-motion";

import { DEFAULT_TEXT } from "@/lib/render-message";
import { cn } from "@/lib/utils";

const PRESETS = [
  DEFAULT_TEXT,
  "Stop rewriting it in Rust",
  "Read the error message before googling it",
  "Text her back, it has been three days",
  "Call your mom, she misses you",
];

interface PresetsProps {
  value: string;
  onSelect: (preset: string) => void;
}

export function Presets({ value, onSelect }: PresetsProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] text-muted-foreground">Presets</span>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <motion.button
            key={preset}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(preset)}
            className={cn(
              "max-w-full truncate rounded-lg border px-2.5 py-1 text-left text-[13px] transition-colors",
              preset === value
                ? "border-primary/50 bg-pink-soft text-foreground"
                : "text-muted-foreground hover:border-line-2 hover:text-foreground",
            )}
          >
            {preset}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
