// @ts-check
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://instinct.szymonbludnik.dev",
  output: "server",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
