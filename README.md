# Gas El Volcán

Frontend académico en React con Vite, React Router, Bootstrap y Vitest.

## Ejecutar

Requiere Node.js compatible con Vite 8 (se verificó con Node 24).

```sh
npm ci
npm run dev
```

## Verificar

```sh
npm test
npm run test:coverage
npm run lint
npm run build
```

La cobertura se genera en `coverage/`, excluida de Git. `npm run test:watch` ejecuta las pruebas durante el desarrollo.

## Funciones

- Catálogo de 14 productos con precios residenciales y stock del catálogo Forma C. Los cilindros de 5, 11 y 15 kg reutilizan las imágenes originales; el resto no tiene fotografías disponibles.
- Búsqueda, filtro por categoría, detalle por identificador y vista de ofertas.
- Carrito con cantidades, eliminación, vaciado, límite de stock y persistencia local.
- Formulario de contacto controlado con validación. No envía correos.
- Checkout de demostración con entrega, resultado exitoso o fallido y resumen. No cobra ni envía pedidos reales. Solo los pedidos exitosos aparecen en el panel durante la sesión.
- Administración local del catálogo con crear, leer, actualizar y eliminar; edición de precio, stock y destacados en ofertas.
- Cobertura de despacho para Chillán y comunas del caso. Navegación SPA y página 404.

## Alcance de los datos

`src/data/productos.js` y `src/data/zonas.js` contienen los datos del caso. `src/data/catalogo.js` reúne validación y funciones CRUD. Los cambios del catálogo y el carrito se guardan en el navegador. Esta persistencia no comparte datos entre dispositivos ni sustituye una API.

El panel administrativo es una demostración sin autenticación. No debe usarse con información real. Los datos de contacto y dirección no se guardan en almacenamiento persistente. No se recopilan contraseñas o tarjetas. El checkout usa precios residenciales y no incluye una tarifa de despacho; no existe una tarifa verificada en los documentos.

No se implementaron aún backend Spring Boot, cuentas y roles reales, mapas de reparto, base de datos o despliegue AWS. Los informes de evaluación se entregan por separado.

## Rutas

`/`, `/catalogo`, `/categorias`, `/ofertas`, `/productos/:id`, `/carrito`, `/nosotros`, `/contacto`, `/checkout`, `/compra/:resultado`, `/admin`.

Al publicar con BrowserRouter, el servidor debe dirigir las rutas internas a `index.html`. Vite permite comprobar las URL directas en desarrollo. El entorno de producción debe configurar esa regla.

## Fuera del repositorio y del ZIP

`node_modules`, `dist`, `coverage`, archivos temporales, ZIP, PDFs de clase, rúbricas, informes de entrega, claves `.pem`/`.key`, archivos `.env` con secretos y datos personales reales. Las pruebas y la configuración de Vitest sí forman parte del código fuente. No se utilizan Jasmine ni Karma, conforme a la instrucción del usuario.
