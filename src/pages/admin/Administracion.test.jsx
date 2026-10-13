import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import App from "../../App";
function abrir(ruta) {
  sessionStorage.setItem(
    "gas-volcan-sesion-demo",
    JSON.stringify({ rol: "administrador", vence: Date.now() + 1800000 }),
  );
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
}
it("crea categorías sin duplicados y las ofrece en el formulario de productos", async () => {
  const user = userEvent.setup();
  abrir("/admin/categorias");
  await user.click(screen.getByRole("button", { name: "Guardar categoría" }));
  expect(screen.getByText(/Escribe una categoría/)).toBeInTheDocument();
  await user.type(
    screen.getByLabelText("Nombre de la categoría"),
    "Accesorios",
  );
  await user.click(screen.getByRole("button", { name: "Guardar categoría" }));
  expect(screen.getByText("La categoría ya existe.")).toBeInTheDocument();
  await user.clear(screen.getByLabelText("Nombre de la categoría"));
  await user.type(screen.getByLabelText("Nombre de la categoría"), "Pruebas");
  await user.click(screen.getByRole("button", { name: "Guardar categoría" }));
  await user.click(
    within(
      screen.getByRole("navigation", { name: "Menú administrativo" }),
    ).getByRole("link", { name: "Productos", exact: true }),
  );
  expect(screen.getByRole("option", { name: "Pruebas" })).toBeInTheDocument();
});
it("renombra una categoría y actualiza los productos y el filtro público", async () => {
  const user = userEvent.setup();
  abrir("/admin/categorias");
  await user.click(
    screen.getByRole("button", { name: "Editar categoría Reguladores" }),
  );
  await user.clear(screen.getByLabelText("Nombre de la categoría"));
  await user.type(
    screen.getByLabelText("Nombre de la categoría"),
    "Reguladores de prueba",
  );
  await user.click(screen.getByRole("button", { name: "Guardar categoría" }));
  await user.click(screen.getByRole("link", { name: "Catálogo", exact: true }));
  await user.selectOptions(
    screen.getByLabelText("Categoría"),
    "Reguladores de prueba",
  );
  expect(screen.getAllByRole("article")).toHaveLength(3);
  const estado = JSON.parse(localStorage.getItem("gas-volcan-catalogo-v2"));
  expect(
    estado.productos.filter(
      (producto) => producto.categoria === "Reguladores de prueba",
    ),
  ).toHaveLength(3);
});
it("impide eliminar categorías usadas y permite eliminar las vacías con confirmación", async () => {
  const user = userEvent.setup();
  abrir("/admin/categorias");
  const confirmar = vi.spyOn(window, "confirm").mockReturnValue(true);
  try {
    await user.click(
      screen.getByRole("button", { name: "Eliminar categoría Accesorios" }),
    );
    expect(screen.getByText(/tiene productos asignados/)).toBeInTheDocument();
    await user.type(
      screen.getByLabelText("Nombre de la categoría"),
      "Temporal",
    );
    await user.click(screen.getByRole("button", { name: "Guardar categoría" }));
    confirmar.mockReturnValue(false);
    await user.click(
      screen.getByRole("button", { name: "Eliminar categoría Temporal" }),
    );
    expect(
      screen.getByRole("button", { name: "Editar categoría Temporal" }),
    ).toBeInTheDocument();
    confirmar.mockReturnValue(true);
    await user.click(
      screen.getByRole("button", { name: "Eliminar categoría Temporal" }),
    );
    expect(
      screen.queryByRole("button", { name: "Editar categoría Temporal" }),
    ).not.toBeInTheDocument();
  } finally {
    confirmar.mockRestore();
  }
});
it("recupera categorías después de recargar y cancela la edición", async () => {
  const user = userEvent.setup();
  const vista = abrir("/admin/categorias");
  await user.type(
    screen.getByLabelText("Nombre de la categoría"),
    "Nueva prueba",
  );
  await user.click(screen.getByRole("button", { name: "Guardar categoría" }));
  vista.unmount();
  abrir("/admin/categorias");
  await user.click(
    screen.getByRole("button", { name: "Editar categoría Nueva prueba" }),
  );
  await user.click(
    screen.getByRole("button", { name: "Cancelar edición de categoría" }),
  );
  expect(screen.getByLabelText("Nombre de la categoría")).toHaveValue("");
});
it("crea, edita, asigna roles, desactiva y reactiva usuarios ficticios", async () => {
  const user = userEvent.setup();
  abrir("/admin/usuarios");
  await user.click(screen.getByRole("button", { name: "Guardar usuario" }));
  expect(screen.getByText(/nombre válido/)).toBeInTheDocument();
  await user.type(
    screen.getByLabelText("Nombre ficticio"),
    "Operadora de prueba",
  );
  await user.type(
    screen.getByLabelText("Correo ficticio"),
    "operadora@example.com",
  );
  await user.selectOptions(
    screen.getByLabelText("Rol"),
    "Operadora / Despachadora",
  );
  await user.click(screen.getByRole("button", { name: "Guardar usuario" }));
  await user.click(
    screen.getByRole("button", { name: "Editar usuario Operadora de prueba" }),
  );
  await user.selectOptions(screen.getByLabelText("Rol"), "Repartidor");
  await user.click(screen.getByRole("button", { name: "Guardar usuario" }));
  expect(screen.getByText("Usuario actualizado.")).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", {
      name: "Desactivar usuario Operadora de prueba",
    }),
  );
  expect(screen.getByText("Inactivo")).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "Activar usuario Operadora de prueba" }),
  );
  expect(
    JSON.parse(localStorage.getItem("gas-volcan-usuarios-demo-v1")).find(
      (u) => u.correo === "operadora@example.com",
    ),
  ).toMatchObject({ rol: "Repartidor", activo: true });
});
it("rechaza correos reales y duplicados y conserva el registro al cancelar", async () => {
  const user = userEvent.setup();
  abrir("/admin/usuarios");
  await user.type(
    screen.getByLabelText("Nombre ficticio"),
    "Persona de prueba",
  );
  await user.type(screen.getByLabelText("Correo ficticio"), "prueba@gmail.com");
  await user.selectOptions(screen.getByLabelText("Rol"), "Cliente");
  await user.click(screen.getByRole("button", { name: "Guardar usuario" }));
  expect(screen.getByText(/Usa un correo ficticio/)).toBeInTheDocument();
  await user.clear(screen.getByLabelText("Correo ficticio"));
  await user.type(
    screen.getByLabelText("Correo ficticio"),
    "ADMIN@example.com",
  );
  await user.click(screen.getByRole("button", { name: "Guardar usuario" }));
  expect(screen.getByText("El correo ya está registrado.")).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", {
      name: "Editar usuario Administrador de ejemplo",
    }),
  );
  await user.click(
    screen.getByRole("button", { name: "Cancelar edición de usuario" }),
  );
  expect(screen.getByLabelText("Nombre ficticio")).toHaveValue("");
});
it("recupera los usuarios y su estado después de recargar", async () => {
  const user = userEvent.setup();
  const vista = abrir("/admin/usuarios");
  await user.click(
    screen.getByRole("button", {
      name: "Desactivar usuario Administrador de ejemplo",
    }),
  );
  vista.unmount();
  abrir("/admin/usuarios");
  expect(
    screen.getByRole("button", {
      name: "Activar usuario Administrador de ejemplo",
    }),
  ).toBeInTheDocument();
});
