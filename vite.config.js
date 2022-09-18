import { defineConfig } from "vite";
import crossOriginIsolation from "vite-plugin-cross-origin-isolation";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/browser-screen-recorder/",
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  plugins: [
    crossOriginIsolation(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Screen Recorder",
        short_name: "browser-screen-recorder",
        description: "A Web Screen Recorder.",
        theme_color: "#102a43",
        background_color: "#102a43",
        icons: [
          {
            src: "javascript.svg",
            sizes: "144x144",
            type: "image/svg+xml",
          },
        ],
        lang: "en",
      },
    }),
  ],
});
