import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/favicon-32-v4.png", "icons/apple-touch-icon-v4.png"],
      manifest: {
        name: "Bud — daily affirmations",
        short_name: "Bud",
        description: "A tiny plant that grows with your daily affirmation.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#f8f7f4",
        theme_color: "#98ac9f",
        icons: [
          { src: "/icons/icon-192-v4.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512-v4.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-maskable-512-v4.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // App shell + all data is local-only (localStorage), so a simple
        // precache of the build output gives full offline support.
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
      },
    }),
  ],
});
