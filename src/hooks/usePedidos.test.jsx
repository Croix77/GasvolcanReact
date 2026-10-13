import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePedidos } from "./usePedidos";
const pedido = {
  id: "demo-123",
  fecha: "2026-10-12T12:00:00Z",
  items: [{ id: "gas", nombre: "Gas", precio: 1000, cantidad: 2 }],
  total: 1,
  nombre: "Dato ficticio privado",
  telefono: "123",
  direccion: "Dirección ficticia",
  comuna: "Chillán",
};
describe("Historial de pedidos de demostración", () => {
  it("no duplica identificadores y almacena solo el resumen sin datos personales", () => {
    const { result } = renderHook(() => usePedidos());
    act(() => result.current.agregar(pedido));
    act(() => result.current.agregar(pedido));
    expect(result.current.pedidos).toHaveLength(1);
    expect(result.current.pedidos[0].total).toBe(2000);
    expect(localStorage.getItem("gas-volcan-pedidos-demo-v1")).not.toContain(
      "Dirección ficticia",
    );
  });
  it("recupera después de recargar y permite eliminar", () => {
    localStorage.setItem(
      "gas-volcan-pedidos-demo-v1",
      JSON.stringify([pedido]),
    );
    const { result } = renderHook(() => usePedidos());
    expect(result.current.pedidos).toHaveLength(1);
    act(() => result.current.eliminar(pedido.id));
    expect(result.current.pedidos).toEqual([]);
  });
  it("tolera un historial corrupto", () => {
    localStorage.setItem("gas-volcan-pedidos-demo-v1", "{");
    const { result } = renderHook(() => usePedidos());
    expect(result.current.pedidos).toEqual([]);
  });
});
