import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/user": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/^\/api\/user/, "");
        },
      },
      "/api/exam": {
        target: "http://localhost:3002",
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/^\/api\/exam/, "");
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
