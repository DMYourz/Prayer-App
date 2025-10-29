import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import { visualizer } from "rollup-plugin-visualizer";


const basePlugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginManusRuntime(),
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, "");
  const defaults = {
    VITE_APP_TITLE: "Prayer Circle",
    VITE_APP_LOGO: "/logo.png",
    VITE_ANALYTICS_ENDPOINT: "",
    VITE_ANALYTICS_WEBSITE_ID: "",
    VITE_DEMO_MODE: "true",
  };

  for (const [key, value] of Object.entries(defaults)) {
    if (process.env[key] === undefined && env[key] === undefined) {
      process.env[key] = value;
    }
  }

  const analyzeFlag = env.ANALYZE ?? process.env.ANALYZE;
  const plugins = [...basePlugins];

  if (analyzeFlag === "true") {
    plugins.push(
      visualizer({
        filename: path.resolve(import.meta.dirname, "dist", "bundle-analysis.html"),
        template: "treemap",
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    publicDir: path.resolve(import.meta.dirname, "client", "public"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      host: true,
      allowedHosts: [
        ".manuspre.computer",
        ".manus.computer",
        ".manus-asia.computer",
        ".manuscomputer.ai",
        ".manusvm.computer",
        "localhost",
        "127.0.0.1",
      ],
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
