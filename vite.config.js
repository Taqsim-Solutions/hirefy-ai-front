import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@services": path.resolve(__dirname, "./services"), // external folder alias
    },
  },
  server: {
    fs: {
      allow: [
        ".", // current root
        path.resolve(__dirname, "services"), // allow access to external folder
      ],
    },
  },
});
