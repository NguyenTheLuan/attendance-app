import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    // GitHub Pages: absolute path for hosting
    base: env.BASE_PATH || "/attendance-app/",
    build: {
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split recharts (large library) into its own chunk
            if (id.includes("node_modules/recharts")) {
              return "recharts-vendor";
            }
            // Split firebase into its own chunk
            if (
              id.includes("node_modules/firebase") ||
              id.includes("node_modules/@firebase")
            ) {
              return "firebase-vendor";
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        "~": resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        "/firebase-storage": {
          target: "https://firebasestorage.googleapis.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/firebase-storage/, ""),
          configure: (proxy) => {
            proxy.on("error", (err) => {
              console.error("Proxy error:", err);
            });
          },
        },
      },
    },
  };
});
