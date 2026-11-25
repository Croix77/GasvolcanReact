import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/auth": {
        target: "http://127.0.0.1:8081",
        changeOrigin: true,
      },
      "/api/v1/categorias": {
        target: "http://127.0.0.1:8082",
        changeOrigin: true,
      },
      "/api/v1/productos": {
        target: "http://127.0.0.1:8083",
        changeOrigin: true,
      },
      "/api/v1/pedidos": {
        target: "http://127.0.0.1:8084",
        changeOrigin: true,
      },
      "/api/v1/stock": {
        target: "http://127.0.0.1:8084",
        changeOrigin: true,
      },
      "/api/v1/zonas": {
        target: "http://127.0.0.1:8084",
        changeOrigin: true,
      },
      "/api/v1/interno/pedidos": {
        target: "http://127.0.0.1:8084",
        changeOrigin: true,
      },
      "/api/v1/despacho": {
        target: "http://127.0.0.1:8085",
        changeOrigin: true,
      },
      "/api/v1/contacto": {
        target: "http://127.0.0.1:8086",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/main.jsx",
        "src/test/**",
        "src/**/*.test.{js,jsx}",
        "src/data/productos.js",
        "src/data/zonas.js",
      ],
    },
  },
});
