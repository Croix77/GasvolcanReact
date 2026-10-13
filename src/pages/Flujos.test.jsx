import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../App";

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
  it("cancela una edición y una eliminación sin modificar el producto", async () => {
    const user = userEvent.setup();
    abrir("/admin");
    await user.click(
      screen.getByRole("button", { name: "Editar Cilindro de Gas 5 Kg" }),
    );
    await user.clear(screen.getByLabelText("Nombre del producto"));
    await user.type(
      screen.getByLabelText("Nombre del producto"),
      "Nombre temporal",
    );
    await user.click(screen.getByRole("button", { name: "Cancelar edición" }));
    expect(screen.getByLabelText("Nombre del producto")).toHaveValue("");
    expect(screen.getByText("Edición cancelada.")).toBeInTheDocument();
    const confirmar = vi.spyOn(window, "confirm").mockReturnValue(false);
    try {
      await user.click(
        screen.getByRole("button", { name: "Eliminar Cilindro de Gas 5 Kg" }),
      );
    } finally {
      confirmar.mockRestore();
    }
    expect(
      screen.getByRole("button", { name: "Editar Cilindro de Gas 5 Kg" }),
    ).toBeInTheDocument();
  });
  it("recupera Mis pedidos y permite eliminar el registro", async () => {
    localStorage.setItem(
      "gas-volcan-pedidos-demo-v1",
      JSON.stringify([
        {
          id: "demo-123",
          fecha: "2026-10-12",
          items: [{ id: "gas", nombre: "Gas", precio: 1000, cantidad: 1 }],
        },
      ]),
    );
    const user = userEvent.setup();
    abrir("/mis-pedidos");
    expect(
      screen.getByRole("heading", { name: "Pedido demo-123" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Eliminar pedido demo-123" }),
    );
    expect(
      screen.getByText("No hay pedidos de demostración registrados."),
    ).toBeInTheDocument();
  });
  it("abre y cierra el menú móvil con su botón", async () => {
    const user = userEvent.setup();
    abrir("/");
    const boton = screen.getByRole("button", { name: "Abrir menú" });
    expect(boton).toHaveAttribute("aria-expanded", "false");
    await user.click(boton);
    expect(boton).toHaveAttribute("aria-expanded", "true");
    await user.click(boton);
    expect(boton).toHaveAttribute("aria-expanded", "false");
  });
  it("agrega desde el detalle y conserva el producto al cambiar de vista", async () => {
    const user = userEvent.setup();
    abrir("/productos/gas-5kg");
    await user.click(screen.getByRole("button", { name: "Añadir al Carrito" }));
    await user.click(
      screen.getByRole("link", { name: "Carrito", exact: true }),
    );
    expect(screen.getByText("Total: $6.500")).toBeInTheDocument();
  });

  it("permite crear después de vaciar por completo el catálogo", () => {
    localStorage.setItem("gas-el-volcan-catalogo-v1", "[]");
    abrir("/admin");
    expect(screen.getByLabelText("Categoría del producto")).toContainHTML(
      "Accesorios",
    );
  });

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
      screen.getByRole("button", { name: "Confirmar compra simulada" }),
    ).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("stock insuficiente");
  });
  it("filtra por búsqueda y categoría y muestra el estado vacío", async () => {
    const user = userEvent.setup();
    abrir("/catalogo");
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
  it("maneja producto inexistente y una ruta desconocida", () => {
    const vista = abrir("/productos/no-existe");
    expect(
      screen.getByRole("heading", { name: "Producto no encontrado" }),
    ).toBeInTheDocument();
    vista.unmount();
    abrir("/no-existe");
    expect(
      screen.getByRole("heading", { name: "Página no encontrada" }),
    ).toBeInTheDocument();
  });
  it("muestra cobertura y ofertas vacías sin inventar descuentos", () => {
    const vista = abrir("/nosotros");
    expect(screen.getByText("Zona Rural")).toBeInTheDocument();
    vista.unmount();
    abrir("/ofertas");
    expect(screen.getByText("0 productos encontrados")).toBeInTheDocument();
  });
  it("valida contacto y no anuncia un envío real", async () => {
    const user = userEvent.setup();
    abrir("/contacto");
    await user.click(screen.getByRole("button", { name: "Validar consulta" }));
    expect(screen.getByText("Escribe un correo válido.")).toBeInTheDocument();
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
      .click(screen.getByRole("button", { name: "Confirmar compra simulada" }));
    expect(
      screen.getByText("Escribe la dirección de entrega."),
    ).toBeInTheDocument();
  });
  it("completa una compra simulada y vacía el carrito sin almacenar datos personales", async () => {
    prepararCarrito();
    const user = userEvent.setup();
    abrir("/checkout");
    await entrega(user);
    await user.click(
      screen.getByRole("button", { name: "Confirmar compra simulada" }),
    );
    expect(
      screen.getByRole("heading", { name: "Compra simulada confirmada" }),
    ).toBeInTheDocument();
    expect(localStorage.getItem("gas-el-volcan-carrito")).toBe("[]");
    expect(JSON.stringify(localStorage)).not.toContain("Dirección ficticia");
    await user.click(screen.getByRole("link", { name: "Administración" }));
    await user.type(
      screen.getByLabelText("Correo del administrador"),
      "admin@example.com",
    );
    await user.type(
      screen.getByLabelText("Contraseña", { exact: true }),
      "VolcanDemo123!",
    );
    await user.click(
      screen.getByRole("button", { name: "Iniciar sesión de demostración" }),
    );
    await user.click(
      screen.getByRole("link", { name: "Pedidos", exact: true }),
    );
    expect(screen.getByText(/Confirmado \(simulación\)/)).toBeInTheDocument();
  });
  it("conserva el carrito al simular una compra fallida", async () => {
    prepararCarrito();
    const user = userEvent.setup();
    abrir("/checkout");
    await entrega(user);
    await user.selectOptions(
      screen.getByLabelText("Resultado de la compra de demostración"),
      "error",
    );
    await user.click(
      screen.getByRole("button", { name: "Confirmar compra simulada" }),
    );
    expect(
      screen.getByRole("heading", {
        name: "No se pudo completar la compra simulada",
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
  it("no inventa un resumen cuando se abre la URL de resultado directamente", () => {
    abrir("/compra/exito");
    expect(
      screen.getByRole("heading", {
        name: "No hay un resumen de compra disponible",
      }),
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
      JSON.parse(localStorage.getItem("gas-el-volcan-catalogo-v1")).some(
        (item) => item.nombre === "Accesorio de prueba",
      ),
    ).toBe(false);
  });
});
