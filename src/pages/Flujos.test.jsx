import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import { perfilClienteDemo } from "../data/perfilClienteDemo";

function abrir(ruta) {
  if (ruta === "/admin") {
    sessionStorage.setItem(
      "gas-volcan-sesion-demo",
      JSON.stringify({ rol: "administrador", vence: Date.now() + 1800000 }),
    );
    ruta = "/admin/productos";
  }
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
}
async function entrega(user) {
  await user.clear(screen.getByLabelText("Nombre de quien recibe"));
  await user.clear(screen.getByLabelText("Teléfono"));
  await user.clear(screen.getByLabelText("Dirección"));
  await user.type(
    screen.getByLabelText("Nombre de quien recibe"),
    "Cliente ficticio",
  );
  await user.type(screen.getByLabelText("Teléfono"), "912345678");
  await user.type(screen.getByLabelText("Dirección"), "Dirección ficticia 123");
  await user.selectOptions(screen.getByLabelText("Comuna"), "Chillán");
}
function prepararCarrito() {
  localStorage.setItem(
    "gas-el-volcan-carrito",
    JSON.stringify([{ id: "gas-15kg", cantidad: 1 }]),
  );
}

describe("Navegación y formularios", () => {
  it("bloquea el checkout si el stock cambió después de agregar al carrito", () => {
    prepararCarrito();
    localStorage.setItem(
      "gas-el-volcan-catalogo-v1",
      JSON.stringify([
        {
          id: "gas-15kg",
          nombre: "Cilindro de Gas 15 Kg",
          descripcion: "Cilindro",
          categoria: "Cilindros de Gas",
          precio: 16000,
          stock: 0,
        },
      ]),
    );
    abrir("/checkout");
    expect(
      screen.getByRole("button", { name: "Confirmar compra" }),
    ).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("stock insuficiente");
    const guardado = JSON.parse(localStorage.getItem("gas-volcan-catalogo-v2"));
    expect(guardado.productos[0].stock).toBe(0);
    expect(guardado.productos[0].imagen).toMatch(/^\/img\//);
  });
  it("filtra por búsqueda y categoría y muestra el estado vacío", async () => {
    const user = userEvent.setup();
    abrir("/categorias");
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Ver productos de Reguladores" }));
    expect(screen.getByRole("combobox")).toHaveValue("Reguladores");
    expect(screen.getAllByRole("article")).toHaveLength(3);
    await user.selectOptions(screen.getByRole("combobox"), "");
    expect(screen.getAllByRole("article")).toHaveLength(14);
    await user.selectOptions(screen.getByLabelText("Categoría"), "Reguladores");
    expect(screen.getAllByRole("article")).toHaveLength(3);
    await user.type(screen.getByLabelText("Buscar productos"), "inexistente");
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(
      screen.getByText(/No hay productos disponibles/),
    ).toBeInTheDocument();
  });
  it("navega al detalle desde una tarjeta", async () => {
    const user = userEvent.setup();
    abrir("/catalogo");
    const card = screen
      .getByRole("heading", { name: "Cilindro de Gas 5 Kg" })
      .closest("article");
    await user.click(within(card).getByRole("link", { name: "Ver detalle" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Cilindro de Gas 5 Kg" }),
    ).toBeInTheDocument();
  });

  it("valida contacto y no anuncia un envío real", async () => {
    const user = userEvent.setup();
    abrir("/contacto");
    await user.click(screen.getByRole("button", { name: "Validar consulta" }));
    expect(screen.getByText("Escribe un correo válido.")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre").form).toHaveAttribute("novalidate");
    expect(screen.getByLabelText("Nombre")).toHaveFocus();
    await user.type(screen.getByLabelText("Nombre"), "Cliente ficticio");
    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "demo@example.com",
    );
    await user.type(
      screen.getByLabelText("Mensaje"),
      "Consulta de demostración sobre un cilindro.",
    );
    await user.click(screen.getByRole("button", { name: "Validar consulta" }));
    expect(
      screen.getByText("Consulta validada. No se ha enviado ningún mensaje."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Escribe un correo válido."),
    ).not.toBeInTheDocument();
  });
  it("rechaza checkout vacío y datos de entrega inválidos", async () => {
    const vista = abrir("/checkout");
    expect(
      screen.getByText("Agrega productos antes de continuar."),
    ).toBeInTheDocument();
    vista.unmount();
    prepararCarrito();
    abrir("/checkout");
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Confirmar compra" }));
    expect(
      screen.getByText("Escribe la dirección de entrega."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre de quien recibe")).toHaveFocus();
    expect(
      screen.getByLabelText("Nombre de quien recibe").form,
    ).toHaveAttribute("novalidate");
  });
  it("autocompleta datos del cliente, permite editarlos y completa la compra sin persistir datos personales", async () => {
    prepararCarrito();
    sessionStorage.setItem(
      "gas-volcan-sesion-demo",
      JSON.stringify({ rol: "cliente", vence: Date.now() + 60000 }),
    );
    const user = userEvent.setup();
    abrir("/checkout");
    expect(
      screen.queryByRole("combobox", { name: /Resultado/ }),
    ).not.toBeInTheDocument();
    for (const [etiqueta, campo] of [
      ["Nombre de quien recibe", "nombre"],
      ["Teléfono", "telefono"],
      ["Dirección", "direccion"],
      ["Comuna", "comuna"],
    ]) {
      expect(screen.getByLabelText(etiqueta)).toHaveValue(
        perfilClienteDemo[campo],
      );
    }
    await entrega(user);
    expect(screen.getByLabelText("Nombre de quien recibe")).toHaveValue(
      "Cliente ficticio",
    );
    await user.click(screen.getByRole("button", { name: "Confirmar compra" }));
    expect(
      screen.getByRole("heading", { name: "Compra confirmada" }),
    ).toBeInTheDocument();
    expect(localStorage.getItem("gas-el-volcan-carrito")).toBe("[]");
    expect(JSON.stringify(localStorage)).not.toContain("Dirección ficticia");
    expect(JSON.stringify(sessionStorage)).not.toContain(
      perfilClienteDemo.direccion,
    );
    await user.click(screen.getByRole("link", { name: "Mis pedidos" }));
    expect(
      screen.getByRole("heading", { name: "Mis pedidos", exact: true }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Confirmado/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    await user.click(screen.getByRole("link", { name: "Iniciar sesión" }));
    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "admin@example.com",
    );
    await user.type(
      screen.getByLabelText("Contraseña", { exact: true }),
      "VolcanDemo123!",
    );
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    await user.click(
      screen.getByRole("link", { name: "Pedidos", exact: true }),
    );
    expect(screen.getByText(/Confirmado/)).toBeInTheDocument();
  });
  it("conserva el carrito al simular una compra fallida", async () => {
    prepararCarrito();
    const user = userEvent.setup();
    sessionStorage.setItem("gas-volcan-resultado-compra", "error");
    abrir("/checkout");
    await entrega(user);
    await user.click(screen.getByRole("button", { name: "Confirmar compra" }));
    expect(
      screen.getByRole("heading", {
        name: "No se pudo completar la compra",
      }),
    ).toBeInTheDocument();
    expect(
      JSON.parse(localStorage.getItem("gas-el-volcan-carrito")),
    ).toHaveLength(1);
    await user.click(screen.getByRole("link", { name: "Intentar nuevamente" }));
    expect(
      screen.getByRole("heading", { name: "Datos de entrega" }),
    ).toBeInTheDocument();
  });

  it("crea, edita, publica una oferta y elimina un producto desde administración", async () => {
    const user = userEvent.setup();
    abrir("/admin");
    await user.click(screen.getByRole("button", { name: "Guardar producto" }));
    expect(
      screen.getByText("Escribe el nombre del producto."),
    ).toBeInTheDocument();
    await user.type(
      screen.getByLabelText("Nombre del producto"),
      "Accesorio de prueba",
    );
    await user.type(
      screen.getByLabelText("Descripción"),
      "Descripción del accesorio ficticio",
    );
    await user.selectOptions(
      screen.getByLabelText("Categoría del producto"),
      "Accesorios",
    );
    await user.type(screen.getByLabelText("Precio residencial (CLP)"), "1000");
    await user.type(screen.getByLabelText("Stock"), "4");
    await user.click(screen.getByLabelText("Destacar en ofertas"));
    await user.click(screen.getByRole("button", { name: "Guardar producto" }));
    expect(screen.getByText("Producto creado.")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Editar Accesorio de prueba" }),
    );
    await user.clear(screen.getByLabelText("Precio residencial (CLP)"));
    await user.type(screen.getByLabelText("Precio residencial (CLP)"), "1500");
    await user.click(screen.getByRole("button", { name: "Guardar producto" }));
    expect(screen.getByText("Producto actualizado.")).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Ofertas" }));
    expect(
      screen.getByRole("heading", { name: "Accesorio de prueba" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Administración" }));
    await user.click(screen.getByRole("link", { name: "Gestionar productos" }));
    const confirmar = vi.spyOn(window, "confirm").mockReturnValue(true);
    try {
      await user.click(
        screen.getByRole("button", { name: "Eliminar Accesorio de prueba" }),
      );
    } finally {
      confirmar.mockRestore();
    }
    expect(
      screen.queryByRole("button", { name: "Editar Accesorio de prueba" }),
    ).not.toBeInTheDocument();
    expect(
      JSON.parse(localStorage.getItem("gas-volcan-catalogo-v2")).productos.some(
        (item) => item.nombre === "Accesorio de prueba",
      ),
    ).toBe(false);
  });
});

it("muestra producto inexistente y página 404 sin romper la navegación", () => {
  const vista = abrir("/productos/no-existe");
  expect(
    screen.getByRole("heading", { level: 1, name: "Producto no encontrado" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Volver al catálogo" }),
  ).toHaveAttribute("href", "/catalogo");
  vista.unmount();
  abrir("/ruta-no-existe");
  expect(
    screen.getByRole("heading", { level: 1, name: "Página no encontrada" }),
  ).toBeInTheDocument();
});
