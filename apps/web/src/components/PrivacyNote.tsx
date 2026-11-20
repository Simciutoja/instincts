import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import { ease } from "@/lib/motion";

export default function PrivacyNote() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease }}
      className="mx-auto mt-24 flex max-w-[560px] flex-col items-center px-5 text-center md:mt-28"
    >
      <span className="mb-4 grid size-11 place-items-center rounded-full bg-pink-soft text-primary ring-1 ring-primary/20">
        <ShieldCheck className="size-5" />
      </span>
      <h2 className="mb-2 text-2xl font-medium tracking-[-0.02em]">What you type stays with you</h2>
      <p className="text-[15px] text-muted-foreground">
        The picture is drawn in your browser, so your text never leaves your device. I count visits
        with a simple analytics script, but it has no idea what you wrote.
      </p>
    </motion.section>
  );
}
