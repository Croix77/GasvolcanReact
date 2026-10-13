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
- Checkout de demostración con entrega, resultado exitoso o fallido y resumen. No cobra ni envía pedidos reales. Solo los pedidos exitosos aparecen en el panel y en Mis pedidos; sus resúmenes sin datos personales se conservan en este navegador.
- Administración local del catálogo con crear, leer, actualizar y eliminar; edición de precio, stock y destacados en ofertas.
- Cobertura de despacho para Chillán y comunas del caso. Navegación SPA y página 404.

## Alcance de los datos

`src/data/productos.js` y `src/data/zonas.js` contienen los datos del caso. `src/data/catalogo.js` reúne validación y funciones CRUD. Los cambios del catálogo y el carrito se guardan en el navegador. Esta persistencia no comparte datos entre dispositivos ni sustituye una API.

El panel administrativo requiere una sesión de demostración. Este control vive en el navegador y no constituye autenticación real de servidor. No debe usarse con información real. Los datos de contacto y dirección no se guardan en almacenamiento persistente. No se recopilan contraseñas o tarjetas. El checkout usa precios residenciales y no incluye una tarifa de despacho; no existe una tarifa verificada en los documentos.

No se implementaron aún backend Spring Boot, cuentas y roles reales, mapas de reparto, base de datos o despliegue AWS. El login actual está identificado como demostración. Los informes de evaluación se entregan por separado.

## Rutas

`/`, `/catalogo`, `/categorias`, `/ofertas`, `/productos/:id`, `/carrito`, `/nosotros`, `/contacto`, `/checkout`, `/compra/:resultado`, `/mis-pedidos`, `/login`, `/admin`, `/admin/productos`, `/admin/pedidos`, `/admin/reportes`, `/admin/perfil`.

Al publicar con BrowserRouter, el servidor debe dirigir las rutas internas a `index.html`. Vite permite comprobar las URL directas en desarrollo. El entorno de producción debe configurar esa regla.

## Fuera del repositorio y del ZIP

`node_modules`, `dist`, `coverage`, archivos temporales, ZIP, PDFs de clase, rúbricas, informes de entrega, claves `.pem`/`.key`, archivos `.env` con secretos y datos personales reales. Las pruebas y la configuración de Vitest sí forman parte del código fuente. No se utilizan Jasmine ni Karma, conforme a la instrucción del usuario.

## Login de demostración

En `/login`, usar `admin@example.com` y `VolcanDemo123!`. Son credenciales públicas y ficticias destinadas a esta entrega frontend. No introducir contraseñas reales. La sesión dura 30 minutos, se conserva en sessionStorage sin la contraseña y termina con Cerrar sesión. Las rutas administrativas redirigen al login si no hay sesión. Este mecanismo es manipulable por el usuario del navegador y debe reemplazarse por autorización de servidor antes de producción.

## Distribución de carpetas

- `public/img`: única ubicación de las imágenes originales; conserva las rutas aportadas en GitHub.
- `src/components`: elementos compartidos; `admin`, `auth` y `pedidos` agrupan piezas del panel, control de rutas e historial.
- `src/pages`: vistas públicas; `src/pages/admin` contiene vistas del panel con menú lateral.
- `src/contexts`: estado de sesión compartido.
- `src/services`: servicio de autenticación de demostración, reemplazable en la etapa de backend.
- `src/hooks`: lógica reutilizable de catálogo, carrito, sesión y pedidos.
- `src/data`: catálogo inicial, zonas y operaciones CRUD simuladas.
- `src/utils`: validación y presentación de moneda.
- `src/test`: preparación compartida del entorno; las pruebas se colocan junto a la función o vista que verifican.

Los precios y stocks se validan como enteros no negativos; un precio cero se presenta como Gratis. El catálogo del caso conserva sus tarifas originales. El historial de Mis pedidos elimina datos personales y evita duplicar identificadores. No se deben usar datos reales en la demostración.

## Categorías y usuarios ficticios

El panel incorpora `/admin/categorias` y `/admin/usuarios` dentro de las rutas de demostración restringidas.

Las categorías tienen persistencia y nombre único (sin distinguir mayúsculas). Renombrarlas actualiza los productos asignados en el mismo estado. Solo se pueden eliminar categorías sin productos. El registro administrable alimenta los filtros públicos y el formulario de productos, incluidos nombres nuevos y categorías vacías.

Los usuarios se pueden crear, editar, asignar a roles y activar o desactivar. Se admiten únicamente correos ficticios de los dominios reservados example.com, example.org y example.net. No se recopilan contraseñas. Estos registros no crean cuentas de acceso ni cambian el login fijo de demostración; la autenticación y autorización de servidor se dejan para la futura integración con backend.

El catálogo y sus categorías se guardan juntos en `gas-volcan-catalogo-v2`. Se conserva lectura y escritura compatible con el catálogo anterior. Los números recuperados se normalizan, y un registro inconsistente recupera los datos anteriores. Los usuarios ficticios se guardan en `gas-volcan-usuarios-demo-v1`.
