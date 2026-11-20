import { useCallback, useEffect, useRef, useState } from "react";

import {
  BASE_IMAGE_URL,
  FONT_FAMILY,
  FONT_SAMPLE,
  FONT_WEIGHT,
  renderMessage,
} from "@/lib/render-message";

export function useMessageCanvas(text: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseRef = useRef<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    const base = new Image();
    base.src = BASE_IMAGE_URL;
    let cancelled = false;

    Promise.all([
      base.decode(),
      document.fonts.load(`${FONT_WEIGHT} 100px "${FONT_FAMILY}"`, FONT_SAMPLE),
    ]).then(() => {
      if (cancelled) return;
      baseRef.current = base;
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const base = baseRef.current;
    if (!canvas || !base) return;
    renderMessage(canvas, base, text);
    setAspectRatio(canvas.height / canvas.width);
  }, [text]);

  useEffect(() => {
    if (!ready) return;
    draw();
    document.fonts.addEventListener("loadingdone", draw);
    return () => document.fonts.removeEventListener("loadingdone", draw);
  }, [ready, draw]);

  const toBlob = useCallback(
    () =>
      new Promise<Blob>((resolve, reject) => {
        const canvas = canvasRef.current;
        if (!canvas) return reject(new Error("Canvas is not mounted"));
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Could not export the image"))),
          "image/png",
        );
      }),
    [],
  );

  return { canvasRef, ready, aspectRatio, toBlob };
}
