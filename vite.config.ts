import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const siteUrl = process.env.VITE_SITE_URL?.replace(/\/$/, "") ?? "";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "html-og-url",
      transformIndexHtml(html) {
        const ogImageUrl = siteUrl ? `${siteUrl}/assets/og-image.png` : "/assets/og-image.png";
        return html.replace(
          /content="__OG_IMAGE_URL__"/g,
          `content="${ogImageUrl}"`
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8081,
    strictPort: true,
    hmr: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
