import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { ease } from "@/lib/motion";

const AUTHOR_URL = "https://szymonbludnik.dev/";

export default function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-3 px-5 text-[14px] text-muted-foreground sm:flex-row sm:justify-between md:px-10">
        <span>Fan-made. Not affiliated with Rockstar Games.</span>
        <a
          href={AUTHOR_URL}
          target="_blank"
          rel="noopener"
          className="group inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          Made with
          <Heart className="size-3.5 fill-primary text-primary transition-transform group-hover:scale-125" />
          by
          <span className="text-foreground underline decoration-rule underline-offset-4 transition-colors group-hover:decoration-primary">
            Simciutoja
          </span>
          <PolishFlag />
        </a>
      </div>
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease }}
        className="mt-8 -mb-[0.2em] bg-gradient-to-b from-[#2b2925] to-transparent bg-clip-text text-center text-[12.5vw] leading-none font-semibold tracking-[-0.05em] whitespace-nowrap text-transparent select-none xl:text-[150px]"
      >
        Trust Your Instinct
      </motion.div>
    </footer>
  );
}

function PolishFlag() {
  return (
    <svg
      viewBox="0 0 16 10"
      className="h-2.5 w-4 rounded-[2px] ring-1 ring-white/10"
      role="img"
      aria-label="Poland"
    >
      <rect width="16" height="5" fill="#fff" />
      <rect y="5" width="16" height="5" fill="#dc143c" />
    </svg>
  );
}
