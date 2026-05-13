import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: "/attendance-app/",
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },
});
