import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { MAX_CHARS, MAX_LINES, countChars } from "@/lib/render-message";
import { cn } from "@/lib/utils";

interface MessageFieldProps {
  value: string;
  atLimit: boolean;
  onChange: (value: string) => void;
  onReset: () => void;
}

export function MessageField({ value, atLimit, onChange, onReset }: MessageFieldProps) {
  const chars = countChars(value);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </button>
      </div>
      <Textarea
        id="message"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        aria-describedby="message-limit"
        placeholder="Text her back, it has been three days"
        className="min-h-28 resize-none rounded-xl border-line-2 bg-background text-[15px] md:text-[15px] dark:bg-background"
      />
      <div
        id="message-limit"
        className="flex items-center justify-between text-[12.5px] text-muted-foreground"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={atLimit ? "full" : "hint"}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.15 }}
            className={cn(atLimit && "text-primary")}
          >
            {atLimit ? "That's all that fits" : `Up to ${MAX_LINES} lines`}
          </motion.span>
        </AnimatePresence>
        <span className={cn(chars >= MAX_CHARS && "text-primary")}>
          {chars}/{MAX_CHARS} letters
        </span>
      </div>
    </div>
  );
}
