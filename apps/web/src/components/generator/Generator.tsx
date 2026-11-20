import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useMessageCanvas } from "@/hooks/use-message-canvas";
import { ease } from "@/lib/motion";
import {
  DEFAULT_TEXT,
  MAX_CHARS,
  MAX_LINES,
  countChars,
  countLines,
  fitText,
} from "@/lib/render-message";

import { ExportActions } from "./ExportActions";
import { MessageField } from "./MessageField";
import { Presets } from "./Presets";
import { Preview } from "./Preview";

const LIMIT_HINT_MS = 1800;

export default function Generator() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [atLimit, setAtLimit] = useState(false);
  const { canvasRef, ready, aspectRatio, toBlob } = useMessageCanvas(text);

  useEffect(() => {
    if (!atLimit) return;
    const timeout = setTimeout(() => setAtLimit(false), LIMIT_HINT_MS);
    return () => clearTimeout(timeout);
  }, [atLimit]);

  const fits = (value: string) =>
    countChars(value) <= MAX_CHARS && (!ready || countLines(value) <= MAX_LINES);

  const handleChange = (value: string) => {
    if (fits(value)) {
      setText(value);
      return;
    }
    setAtLimit(true);
    const isPaste = value.length - text.length > 1;
    if (isPaste && ready) setText(fitText(value));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay: 0.15 }}
      className="grid overflow-hidden rounded-2xl border bg-card lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)]"
    >
      <div className="flex flex-col gap-5 p-5 md:p-6">
        <MessageField
          value={text}
          atLimit={atLimit}
          onChange={handleChange}
          onReset={() => setText(DEFAULT_TEXT)}
        />
        <Presets value={text} onSelect={setText} />
        <ExportActions disabled={!ready} toBlob={toBlob} />
      </div>
      <Preview canvasRef={canvasRef} ready={ready} aspectRatio={aspectRatio} />
    </motion.section>
  );
}
