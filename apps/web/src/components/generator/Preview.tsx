import type { RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useElementWidth } from "@/hooks/use-element-width";
import { ease } from "@/lib/motion";
import { BASE_ASPECT_RATIO } from "@/lib/render-message";

interface PreviewProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  ready: boolean;
  aspectRatio: number | null;
}

export function Preview({ canvasRef, ready, aspectRatio }: PreviewProps) {
  const [frameRef, frameWidth] = useElementWidth<HTMLDivElement>();
  const ratio = aspectRatio ?? BASE_ASPECT_RATIO;

  return (
    <div className="relative flex items-center border-t bg-[radial-gradient(520px_300px_at_70%_0%,var(--glow),transparent)] p-5 md:p-6 lg:border-t-0 lg:border-l">
      <div
        ref={frameRef}
        className="relative w-full overflow-hidden rounded-xl ring-1 ring-line-2 transition-[height] duration-[450ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
        style={frameWidth ? { height: frameWidth * ratio } : { aspectRatio: String(1 / ratio) }}
      >
        <motion.canvas
          ref={canvasRef}
          aria-label="Generated notification preview"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.5, ease }}
          className="absolute top-0 left-0 block h-auto w-full"
        />
        <AnimatePresence>
          {!ready && (
            <motion.div
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center rounded-xl border border-dashed border-line-2 text-[13px] text-muted-foreground"
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                Loading preview…
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
