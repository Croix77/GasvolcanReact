# Gas El Volcán · React

Tienda y gestión de despacho. React pide los datos a seis servicios REST mediante rutas del mismo origen.

| Servicio | Puerto local | Rutas |
| --- | --- | --- |
| [ms-auth](https://github.com/Croix77/GasVolcanBackend/tree/main/ms-auth) | 8081 | `/api/auth/` |
| [ms-categorias](https://github.com/Croix77/GasVolcanBackend/tree/main/ms-categorias) | 8082 | `/api/v1/categorias` |
| [ms-productos](https://github.com/Croix77/GasVolcanBackend/tree/main/ms-productos) | 8083 | `/api/v1/productos` |
| [ms-pedidos](https://github.com/Croix77/GasVolcanBackend/tree/main/ms-pedidos) | 8084 | `/api/v1/pedidos`, `/api/v1/stock`, `/api/v1/zonas` |
| [ms-despacho](https://github.com/Croix77/GasVolcanBackend/tree/main/ms-despacho) | 8085 | `/api/v1/despacho` |
| `ms-contacto` | 8086 | `/api/v1/contacto` |

## Ejecutar en local

Inicia los servicios con el mismo emisor y secreto JWT según sus README. En la carpeta de React, con Node.js 24, ejecuta:

```powershell
npm ci
npm run dev
```

Abre [Vite en local](http://localhost:5173). El proxy de Vite reenvía las rutas a los puertos del cuadro. Si usas otros puertos, copia `.env.example` a `.env.local` y ajusta los destinos. El primer administrador se crea en Auth, y desde su panel puedes dar de alta cuentas de cliente, vendedor, operadora y repartidor.

## Probar el flujo

1. Como **administrador**, crea una ficha en Productos. En Inventario, registra sus unidades disponibles. El ajuste usa la versión de las existencias que consultaste. Si otra compra cambia esa cantidad, debes revisar la cantidad actual antes de guardar.
2. Como **cliente**, abre el catálogo, agrega hasta tres unidades de un producto y confirma con la dirección y el punto de entrega. React envía el precio mostrado y una referencia de compra. Si cambia el precio o el stock, conserva el carrito y te permite revisar los datos antes de confirmar otra vez.
3. Como **operadora**, filtra el día en `/despacho`, revisa el mapa y asigna un repartidor activo.
4. Como **repartidor**, abre tus pedidos asignados, inicia el recorrido, actualiza la ubicación y registra la entrega. El mapa usa Leaflet y OpenStreetMap. Puedes marcar un punto manualmente o usar GPS con HTTPS o localhost.
5. Como **cliente**, consulta la entrega en Historial de pedidos. La vista actualiza los datos cada 15 segundos mientras la pestaña está visible. El **vendedor** consulta catálogo y pedidos en modo de lectura.

6. Como **cliente**, envía una consulta. El correo aparece en solo lectura porque el servidor lo toma de la sesión. Como **administrador**, abre Consultas de contacto para leer los mensajes recibidos.

## Pruebas y despliegue

```powershell
npm test
npm run lint
npm run build
```

`src/services/api.js` agrega el JWT a las peticiones protegidas. `src/hooks/useCatalogo.js` combina las fichas de Productos, los nombres de Categorías y las existencias de Pedidos. El carrito local conserva identificadores y cantidades por cuenta.

Publica `dist/` en Nginx. Redirige las rutas de navegación a `index.html` y configura un destino por API pública según la tabla. Las rutas internas entre servicios quedan fuera del proxy público. [Guía de despliegue](https://github.com/Croix77/GasVolcanBackend/blob/main/deploy/despliegue-ec2.md)
