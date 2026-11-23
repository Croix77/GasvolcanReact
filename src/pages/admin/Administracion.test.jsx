import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import App from "../../App";
import { productos as datosCatalogo } from "../../data/productos";

const token = "token-admin";

function json(datos, status = 200) {
  return new Response(datos === null ? null : JSON.stringify(datos), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function simularApi() {
  let categorias = [...new Set(datosCatalogo.map((producto) => producto.categoria))]
    .map((nombre, indice) => ({ id: indice + 1, nombre }));
  let productos = datosCatalogo.map((producto) => ({
    ...producto,
    categoriaId: categorias.find(({ nombre }) => nombre === producto.categoria).id,
  }));
  let usuarios = [];
  let proximaCategoria = categorias.length + 1;
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (url, { method, headers, body }) => {
    expect(headers.Authorization).toBe(`Bearer ${token}`);
    const [, api, servicio, recurso, id, accion] = new URL(url, window.location.origin).pathname.split("/");
    const datos = body ? JSON.parse(body) : {};
    if (api === "api" && servicio === "v1" && recurso === "categorias") {
      if (method === "GET") return json(categorias);
      if (method === "POST") {
        const nueva = { id: proximaCategoria++, nombre: datos.nombre };
        categorias = [...categorias, nueva];
        return json(nueva, 201);
      }
      if (method === "PUT") {
        const actualizada = { id: Number(id), nombre: datos.nombre };
        categorias = categorias.map((categoria) => categoria.id === actualizada.id ? actualizada : categoria);
        productos = productos.map((producto) => producto.categoriaId === actualizada.id
          ? { ...producto, categoria: actualizada.nombre }
          : producto);
        return json(actualizada);
      }
      if (productos.some((producto) => producto.categoriaId === Number(id)))
        return json({ error: "La categoría tiene productos asignados." }, 409);
      categorias = categorias.filter((categoria) => categoria.id !== Number(id));
      return json(null, 204);
    }
    if (servicio === "v1" && recurso === "productos") {
      if (method === "GET") return json(productos);
      if (method === "POST") {
        const nuevo = {
          ...datos,
          id: datos.codigo.toLowerCase(),
          categoria: categorias.find((categoria) => categoria.id === datos.categoriaId).nombre,
        };
        productos = [...productos, nuevo];
        return json(nuevo, 201);
      }
    }
    if (servicio === "v1" && recurso === "pedidos" && method === "GET") return json([]);
    if (servicio === "auth" && recurso === "usuarios") {
      if (method === "GET") return json(usuarios);
      if (method === "POST") {
        const nuevo = { id: usuarios.length + 1, nombre: datos.nombre, correo: datos.correo, rol: datos.rol, activo: true };
        usuarios = [...usuarios, nuevo];
        return json(nuevo, 201);
      }
      const anterior = usuarios.find((usuario) => usuario.id === Number(id));
      if (!anterior) return json({ mensaje: "Usuario inexistente." }, 404);
      const actualizado = accion === "estado"
        ? { ...anterior, activo: datos.activo }
        : { ...anterior, nombre: datos.nombre, rol: datos.rol };
      usuarios = usuarios.map((usuario) => usuario.id === actualizado.id ? actualizado : usuario);
      return json(actualizado);
    }
    throw new Error(`Solicitud inesperada: ${method} ${url}`);
  });
}

function abrir(ruta) {
  sessionStorage.setItem(
    "gas-volcan-sesion-fullstack",
    JSON.stringify({
      token, correo: "admin@example.test", nombre: "Admin",
      rol: "administrador", vence: Date.now() + 3_600_000,
    }),
  );
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
}

it("crea categorías sin duplicados y las ofrece en el formulario de productos", async () => {
  const user = userEvent.setup();
  const fetch = simularApi();
  abrir("/admin/categorias");
  const guardar = await screen.findByRole("button", { name: "Guardar categoría" });
  await user.click(guardar);
  expect(screen.getByText(/Escribe una categoría/)).toBeInTheDocument();
  const nombre = screen.getByLabelText("Nombre de la categoría");
  await user.type(nombre, "Accesorios");
  await user.click(guardar);
  expect(screen.getByText("La categoría ya existe.")).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalledWith(expect.stringContaining("/categorias"), expect.objectContaining({ method: "POST" }));
  await user.clear(nombre);
  await user.type(nombre, "Pruebas");
  await user.click(guardar);
  expect(await screen.findByText("Categoría creada.")).toBeInTheDocument();
  await user.click(within(screen.getByRole("navigation", { name: "Menú administrativo" }))
    .getByRole("link", { name: "Productos", exact: true }));
  expect(screen.getByRole("option", { name: "Pruebas" })).toBeInTheDocument();
});

it("renombra una categoría y filtra los productos después de volver a consultar la API", async () => {
  const user = userEvent.setup();
  const fetch = simularApi();
  const vista = abrir("/admin/categorias");
  await user.click(await screen.findByRole("button", { name: "Editar categoría Reguladores" }));
  await user.clear(screen.getByLabelText("Nombre de la categoría"));
  await user.type(screen.getByLabelText("Nombre de la categoría"), "Reguladores de prueba");
  await user.click(screen.getByRole("button", { name: "Guardar categoría" }));
  expect(await screen.findByText("Categoría actualizada.")).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/categorias\/\d+$/), expect.objectContaining({
    method: "PUT",
    body: JSON.stringify({ nombre: "Reguladores de prueba" }),
  }));
  vista.unmount();
  abrir("/catalogo");
  await user.selectOptions(await screen.findByLabelText("Categoría"), "Reguladores de prueba");
  expect(screen.getAllByRole("article")).toHaveLength(3);
  expect(localStorage.getItem("gas-volcan-catalogo-v2")).toBeNull();
});

it("muestra el conflicto al eliminar una categoría usada y confirma la eliminación de una vacía", async () => {
  const user = userEvent.setup();
  simularApi();
  abrir("/admin/categorias");
  const confirmar = vi.spyOn(window, "confirm").mockReturnValue(true);
  await user.click(await screen.findByRole("button", { name: "Eliminar categoría Accesorios" }));
  expect(await screen.findByText(/tiene productos asignados/)).toBeInTheDocument();
  await user.type(screen.getByLabelText("Nombre de la categoría"), "Temporal");
  await user.click(screen.getByRole("button", { name: "Guardar categoría" }));
  const eliminar = await screen.findByRole("button", { name: "Eliminar categoría Temporal" });
  confirmar.mockReturnValue(false);
  await user.click(eliminar);
  expect(screen.getByRole("button", { name: "Editar categoría Temporal" })).toBeInTheDocument();
  confirmar.mockReturnValue(true);
  await user.click(eliminar);
  await waitFor(() => expect(screen.queryByRole("button", { name: "Editar categoría Temporal" })).not.toBeInTheDocument());
});

it("crea un producto con el identificador de la categoría y valores numéricos en el JSON", async () => {
  const user = userEvent.setup();
  const fetch = simularApi();
  abrir("/admin/productos");
  await user.type(await screen.findByLabelText("Código del producto"), "AC-99");
  await user.type(screen.getByLabelText("Nombre del producto"), "Accesorio de prueba");
  await user.type(screen.getByLabelText("Descripción", { exact: true }), "Producto de prueba");
  await user.selectOptions(screen.getByLabelText("Categoría del producto"), "Accesorios");
  await user.type(screen.getByLabelText("Precio residencial (CLP)"), "0");
  await user.type(screen.getByLabelText("Stock", { exact: true }), "3");
  await user.click(screen.getByRole("button", { name: "Guardar producto" }));
  expect(await screen.findByText("Producto creado.")).toBeInTheDocument();
  const peticion = fetch.mock.calls.find(([ruta, opciones]) => ruta.endsWith("/productos") && opciones.method === "POST");
  expect(JSON.parse(peticion[1].body)).toMatchObject({
    codigo: "AC-99", nombre: "Accesorio de prueba", categoriaId: 4, precio: 0, stock: 3, unidad: "Unidad",
  });
});

it("crea y edita usuarios en Auth y les cambia el rol y el estado", async () => {
  const user = userEvent.setup();
  const fetch = simularApi();
  abrir("/admin/usuarios");
  const guardar = await screen.findByRole("button", { name: "Guardar usuario" });
  await user.click(guardar);
  expect(screen.getByText(/nombre válido/)).toBeInTheDocument();
  await user.type(screen.getByLabelText("Nombre", { exact: true }), "Operadora de prueba");
  await user.type(screen.getByLabelText("Correo electrónico"), "operadora@example.test");
  await user.type(screen.getByLabelText("Contraseña inicial"), "Ejemplo123");
  await user.selectOptions(screen.getByLabelText("Rol"), "Operadora / Despachadora");
  await user.click(guardar);
  await user.click(await screen.findByRole("button", { name: "Editar usuario Operadora de prueba" }));
  expect(screen.getByLabelText("Correo electrónico")).toHaveAttribute("readonly");
  await user.selectOptions(screen.getByLabelText("Rol"), "Repartidor");
  await user.click(guardar);
  expect(await screen.findByText("Usuario actualizado.")).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/usuarios\/1$/), expect.objectContaining({
    method: "PUT",
    body: JSON.stringify({ nombre: "Operadora de prueba", rol: "REPARTIDOR" }),
  }));
  await user.click(screen.getByRole("button", { name: "Desactivar usuario Operadora de prueba" }));
  expect(await screen.findByText("Inactivo", { exact: true })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Activar usuario Operadora de prueba" }));
  expect(await screen.findByText("Activo", { exact: true })).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/usuarios\/1\/estado$/), expect.objectContaining({
    method: "PATCH",
    body: JSON.stringify({ activo: true }),
  }));
});
