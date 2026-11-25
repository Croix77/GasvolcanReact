import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import App from "../App";
import { iniciarSesionPrueba, simularApis } from "../test/apiPrueba";

function abrir(ruta) {
  iniciarSesionPrueba("vendedor@example.com");
  const fetch = simularApis({ pedidosIniciales: [{
    id: 5, estado: "PENDIENTE", total: 6500,
    items: [{ id: "gas-5kg", nombre: "Cilindro de Gas 5 Kg", cantidad: 1 }],
  }] });
  render(<MemoryRouter initialEntries={[ruta]}><App /></MemoryRouter>);
  return fetch;
}

it("muestra solo Productos y Pedidos en el menú del vendedor y abre el detalle sin acciones", async () => {
  const usuario = userEvent.setup();
  const fetch = abrir("/despacho");
  expect(screen.getByRole("link", { name: "Productos" })).toHaveAttribute("href", "/catalogo");
  expect(screen.getByRole("link", { name: "Pedidos", exact: true })).toHaveAttribute("href", "/despacho");
  expect(screen.queryByRole("link", { name: /^(Inicio|Categorías|Ofertas|Nosotros|Contacto|Administración|Carrito)$/ }))
    .not.toBeInTheDocument();
  await usuario.click(await screen.findByRole("link", { name: "Ver detalle del pedido 5" }));
  expect(screen.getByRole("heading", { name: "Detalle del pedido" })).toBeInTheDocument();
  expect(await screen.findByText("Cilindro de Gas 5 Kg × 1")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /asignar|marcar|entrega|mapa/i })).not.toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith("/api/v1/pedidos/5", expect.objectContaining({ method: "GET" }));
});

it.each(["/categorias", "/ofertas", "/nosotros", "/carrito"])(
  "reserva %s a los perfiles correspondientes", async (ruta) => {
    abrir(ruta);
    expect(await screen.findByRole("heading", { name: "Acceso restringido" })).toBeInTheDocument();
  },
);

it("informa si el pedido solicitado no existe", async () => {
  abrir("/pedidos/99");
  expect(await screen.findByRole("alert")).toHaveTextContent("El pedido no existe.");
});
