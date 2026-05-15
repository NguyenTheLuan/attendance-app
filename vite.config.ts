import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import zaloMiniApp from "zmp-vite-plugin";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  const isZma = mode === "zma";

  return {
    plugins: [react(), isZma && zaloMiniApp()].filter(Boolean),
    // ZMA: relative path for Mini App, GitHub: absolute path for hosting
    base: env.BASE_PATH || (isZma ? "./" : "/attendance-app/"),
    build: {
      // ZMA: output to www/ (required by Zalo platform), GitHub: output to dist/
      outDir: isZma ? "www" : "dist",
      // ZMA: merge all JS into one chunk to avoid missing dependencies
      // (zmp-vite-plugin only injects 1 file into listSyncJS in app-config.json)
      rollupOptions: isZma
        ? {
            output: {
              manualChunks: undefined,
              inlineDynamicImports: true,
            },
          }
        : undefined,
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
