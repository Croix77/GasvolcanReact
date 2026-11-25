import { vi } from "vitest";
import { productos as productosPrueba } from "../data/productos";

const cuentas = {
  "vendedor@example.com": { rol: "VENDEDOR", interno: "vendedor", nombre: "Vendedor", clave: "VendedorDemo123!" },
  "admin@example.com": { rol: "ADMIN", interno: "administrador", nombre: "Administrador", clave: "VolcanDemo123!" },
  "cliente@example.com": { rol: "CLIENTE", interno: "cliente", nombre: "Cliente de prueba", clave: "ClienteDemo123!" },
};

const jwtPrueba = (vence) => `cabecera.${btoa(JSON.stringify({ exp: Math.ceil(vence / 1000) }))}.firma`;
export const claveCarritoCliente = "gas-el-volcan-carrito:cliente@example.com";

export function iniciarSesionPrueba(correo = "cliente@example.com") {
  const cuenta = cuentas[correo];
  const vence = Date.now() + 3_600_000;
  sessionStorage.setItem("gas-volcan-sesion-fullstack", JSON.stringify({
    token: jwtPrueba(vence), vence, rol: cuenta.interno, nombre: cuenta.nombre, correo,
  }));
}

export function simularApis({ productos = productosPrueba, errorCompra, errorContacto, paginasContacto = [], pedidosIniciales = [] } = {}) {
  const categorias = [...new Set(productos.map((producto) => producto.categoria))]
    .map((nombre, i) => ({ id: i + 1, nombre }));
  const pedidos = [...pedidosIniciales];
  const json = (datos, status = 200) =>
    new Response(JSON.stringify(datos), { status, headers: { "Content-Type": "application/json" } });

  return vi.spyOn(globalThis, "fetch").mockImplementation(async (url, opciones = {}) => {
    const direccion = new URL(url, "http://localhost");
    const ruta = direccion.pathname;
    const datos = opciones.body && JSON.parse(opciones.body);
    if (ruta === "/api/auth/login") {
      const cuenta = cuentas[datos.correo];
      if (!cuenta || cuenta.clave !== datos.password)
        return json({ mensaje: "Correo o contraseña incorrectos." }, 401);
      return json({ nombre: cuenta.nombre, correo: datos.correo, rol: cuenta.rol, token: jwtPrueba(Date.now() + 3_600_000) });
    }

    if (!opciones.headers?.Authorization) return json({ mensaje: "Token requerido." }, 401);
    if (ruta === "/api/v1/contacto/mensajes") {
      if (opciones.method === "POST") {
        const fallo = errorContacto?.(datos);
        if (fallo) return json({ mensaje: fallo }, 503);
        return json({ id: 1, fechaCreacion: new Date().toISOString() }, 201);
      }
      const pagina = Number(direccion.searchParams.get("pagina"));
      return json({ mensajes: paginasContacto[pagina] ?? [], pagina, haySiguiente: pagina < paginasContacto.length - 1 });
    }
    if (ruta === "/api/v1/productos") {
      return json(productos.map((producto) => {
        const ficha = { ...producto, categoriaId: categorias.find(({ nombre }) => nombre === producto.categoria).id };
        delete ficha.stock;
        return ficha;
      }));
    }
    if (ruta === "/api/v1/stock") return json(productos.map(({ id, stock }) => ({ id, stock, version: 0 })));
    if (ruta === "/api/v1/categorias") return json(categorias);
    if (ruta === "/api/auth/usuarios" || ruta === "/api/v1/zonas") return json([]);
    if (ruta === "/api/v1/pedidos" && opciones.method === "POST") {
      const conflicto = typeof errorCompra === "function" ? errorCompra(datos) : errorCompra;
      if (conflicto) return json({ mensaje: conflicto }, 409);
      const items = datos.items.map(({ id, cantidad }) => {
        const producto = productos.find((item) => item.id === id);
        return { id, nombre: producto.nombre, precioUnitario: producto.precio, cantidad };
      });
      const pedido = {
        id: 1, fechaCreacion: new Date().toISOString(), estado: "PENDIENTE", items,
        comuna: datos.comuna, total: items.reduce((suma, item) => suma + item.cantidad * item.precioUnitario, 0),
      };
      pedidos.push(pedido);
      return json(pedido, 201);
    }
    if (ruta === "/api/v1/pedidos") return json(pedidos);
    if (/^\/api\/v1\/pedidos\/\d+$/.test(ruta)) {
      const pedido = pedidos.find(({ id }) => String(id) === ruta.split("/").at(-1));
      return pedido ? json(pedido) : json({ mensaje: "No existe el pedido." }, 404);
    }
    return json({ mensaje: "Ruta de prueba desconocida." }, 404);
  });
}
