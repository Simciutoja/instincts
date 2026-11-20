import { motion } from "framer-motion";

import { fadeUp } from "@/lib/motion";

export default function Hero() {
  return (
    <motion.section initial="hidden" animate="show" className="pt-14 pb-10 md:pt-20 md:pb-12">
      <motion.h1
        variants={fadeUp}
        custom={0}
        className="mb-4 max-w-[680px] text-[34px] leading-[1.08] font-medium tracking-[-0.03em] md:text-[48px]"
      >
        Make your own <span className="text-primary">Trust Your Instinct</span> message
      </motion.h1>
      <motion.p
        variants={fadeUp}
        custom={1}
        className="max-w-[540px] text-[17px] text-muted-foreground"
      >
        Lucia appreciates a lot of things. Type yours, then grab the PNG or copy it and send it to
        someone who needs to hear it.
      </motion.p>
    </motion.section>
  );
}
