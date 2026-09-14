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
        // Hashed JS/CSS/asset filenames are immutable, so precaching them is
        // safe and gives full offline support. index.html is deliberately
        // NOT precached — it's served network-first below so every real
        // app open picks up the latest deploy instead of an old cached
        // shell (which previously only cleared on re-adding to homescreen).
        globPatterns: ["**/*.{js,css,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: { cacheName: "bud-pages", networkTimeoutSeconds: 3 },
          },
        ],
      },
    }),
  ],
});
