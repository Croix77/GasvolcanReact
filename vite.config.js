import { cwd } from "node:process";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), "VITE_");
  const pedidos = env.VITE_PEDIDOS_URL || "http://127.0.0.1:8084";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/auth": env.VITE_AUTH_URL || "http://127.0.0.1:8081",
        "/api/v1/categorias": env.VITE_CATEGORIAS_URL || "http://127.0.0.1:8082",
        "/api/v1/productos": env.VITE_PRODUCTOS_URL || "http://127.0.0.1:8083",
        "/api/v1/pedidos": pedidos,
        "/api/v1/stock": pedidos,
        "/api/v1/zonas": pedidos,
        "/api/v1/despacho": env.VITE_DESPACHO_URL || "http://127.0.0.1:8085",
        "/api/v1/contacto": env.VITE_CONTACTO_URL || "http://127.0.0.1:8086",
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
  };
});
