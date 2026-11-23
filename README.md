# Gas El Volcán · React

Tienda y gestión de despacho de Gas El Volcán. React y Bootstrap usan las APIs REST de `ms-auth` y `ms-negocio`. Cada servicio tiene su propio repositorio y esquema MySQL.

- [ms-auth · autenticación y usuarios](https://github.com/Croix77/GasVolcanAuth/tree/feat/ms-auth-parcial-3)
- [ms-negocio · catálogo, inventario y pedidos](https://github.com/Croix77/GasVolcanBackend/tree/feat/completar-gas-volcan)

## Ejecutar

1. Inicia ambos servicios según sus README. En local Auth escucha en 8081 y Negocio en 8080.
2. Activa la carga inicial del catálogo en Negocio si usas una base vacía de prueba.
3. Con Node.js 24 y PowerShell en la carpeta del frontend, ejecuta:

```powershell
npm ci
npm run dev
```

Abre [Vite en local](http://localhost:5173). Para puertos distintos, copia `.env.example` a `.env.local` y edita las dos URL. El primer usuario administrador se crea en Auth. Desde su panel puedes crear las cuentas de cliente, vendedor, operadora y repartidor.

## Flujo para la presentación

1. Entra como **cliente**. Abre el catálogo, agrega hasta tres unidades de un producto y confirma con la dirección y un punto en el mapa.
2. Entra como **operadora**. En `/despacho` filtra el día, revisa el mapa y asigna el pedido a un repartidor activo.
3. Entra como **repartidor**. Abre únicamente tus pedidos, inicia el recorrido y comparte la ubicación. Puedes usar GPS con HTTPS o localhost, o marcarla manualmente. Registra la entrega.
4. Vuelve como cliente y consulta el estado en **Historial de pedidos**. La vista vuelve a consultar cada 15 segundos mientras la pestaña está visible.
5. Entra como **administrador**. Revisa categorías, productos, usuarios, stock y efectivo de entregas. El vendedor consulta el catálogo y los pedidos en modo de lectura.

El mapa utiliza Leaflet con teselas de OpenStreetMap y atribución visible. Los marcadores se cargan al abrir el mapa. La geolocalización se activa solo cuando el repartidor la solicita.

## Pruebas y organización

```powershell
npm test
npm run lint
npm run build
```

- `src/services` contiene las llamadas HTTP y las validaciones reutilizadas.
- `src/contexts` conserva la sesión JWT en la pestaña y la renueva antes del vencimiento.
- `src/hooks` mantiene el catálogo, el carrito y los pedidos. El carrito local guarda identificadores y cantidades separados por cuenta.
- `src/pages` y `src/components` agrupan las vistas de venta, administración y despacho. `src/test` contiene respuestas simuladas usadas por las pruebas.

Nginx debe dirigir las rutas del navegador a `index.html` y enrutar `/api/auth/` y `/api/v1/` al servicio correspondiente. El build de producción usa rutas del mismo origen. La [guía de despliegue](https://github.com/Croix77/GasVolcanBackend/blob/feat/completar-gas-volcan/deploy/despliegue-ec2.md) incluye la configuración de ejemplo.
