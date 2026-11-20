import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { swap } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FILE_NAME = "trust-your-instinct.png";
const STATUS_RESET_MS = 2200;

type CopyState = "idle" | "copied" | "error";

interface ExportActionsProps {
  disabled: boolean;
  toBlob: () => Promise<Blob>;
}

export function ExportActions({ disabled, toBlob }: ExportActionsProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const timeout = setTimeout(() => setCopyState("idle"), STATUS_RESET_MS);
    return () => clearTimeout(timeout);
  }, [copyState]);

  const download = async () => {
    const url = URL.createObjectURL(await toBlob());
    const link = document.createElement("a");
    link.href = url;
    link.download = FILE_NAME;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": toBlob() })]);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  const copied = copyState === "copied";

  return (
    <>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button onClick={download} disabled={disabled} className="h-10 rounded-xl px-4">
            <Download />
            Download PNG
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            onClick={copy}
            disabled={disabled}
            className="h-10 min-w-36 rounded-xl border-line-2 bg-gradient-to-b from-[#24221f] to-[#1c1b18] px-4 shadow-[inset_0_1px_0_#ffffff0d] hover:border-rule dark:bg-transparent"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "copied" : "copy"}
                {...swap}
                className={cn("inline-flex items-center gap-2", copied && "text-ok")}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy image"}
              </motion.span>
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
      <AnimatePresence>
        {copyState === "error" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="-mt-2 text-[13px] text-destructive"
          >
            Couldn't copy the image. Use “Download PNG” instead.
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
