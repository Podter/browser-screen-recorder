import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/browser-screen-recorder/", // remove this if you build and host it local
  plugins: [react()],
});
