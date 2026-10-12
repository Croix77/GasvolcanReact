# React + Vite

## Catálogo Gas El Volcán

Los productos de 5, 11 y 15 kg se definen en `src/data/productos.js`, reutilizando las imágenes existentes. `App` los renderiza con `map` y `ProductCard` recibe los datos mediante props.

El precio original de 15 kg se conserva ($25.990). Los precios de 5 y 11 kg están pendientes de confirmación (`null`). Cuando hay precios pendientes, el carrito muestra un subtotal confirmado y avisa que el importe final no está completo.

Para iniciar: `npm ci` y `npm run dev`. Para verificar: `npm test`, `npm run lint` y `npm run build`. Para pruebas en modo continuo: `npm run test:watch`.

## Carrito y pruebas

El carrito permite agregar cilindros, agrupar los repetidos, cambiar su cantidad (1 a 99), eliminar productos y vaciarlo. Se guarda en `localStorage` bajo `gas-el-volcan-carrito`, con identificador y cantidad; las imágenes y los precios se obtienen siempre del catálogo actual. Si el almacenamiento está bloqueado, funciona durante la sesión. Los registros corruptos o inválidos se descartan.

Las pruebas usan Vitest, React Testing Library y jsdom. Verifican catálogo, operaciones, totales, precios pendientes, persistencia, límite de cantidades y almacenamiento inválido o bloqueado. Aún no hay proceso de pago o envío de pedidos.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
