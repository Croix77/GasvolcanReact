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
