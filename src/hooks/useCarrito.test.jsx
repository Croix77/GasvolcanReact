import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCarrito } from "./useCarrito";

describe("Carrito con catálogo administrable", () => {
  it("migra pedidos del avance remoto sin crear duplicados", () => {
    localStorage.setItem(
      "pedidosGas",
      JSON.stringify([{ codigo: "CL001" }, { codigo: "CL001" }]),
    );
    const { result } = renderHook(() =>
      useCarrito([{ id: "gas-5kg", codigo: "CL001", precio: 6500, stock: 80 }]),
    );
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(1);
  });
  const lista = [{ id: "nuevo", nombre: "Nuevo", precio: 1000, stock: 2 }];
  it("recupera un producto creado en administración y rechaza cantidades inválidas", () => {
    localStorage.setItem(
      "gas-el-volcan-carrito",
      JSON.stringify([{ id: "nuevo", cantidad: 1 }]),
    );
    const { result } = renderHook(() => useCarrito(lista));
    expect(result.current.items[0].nombre).toBe("Nuevo");
    act(() => result.current.cambiarCantidad("nuevo", 3));
    act(() => result.current.cambiarCantidad("nuevo", -1));
    expect(result.current.items[0].cantidad).toBe(1);
    act(() => result.current.cambiarCantidad("nuevo", 2));
    expect(result.current.items[0].cantidad).toBe(2);
  });
  it("no agrega productos desconocidos o agotados", () => {
    const { result } = renderHook(() =>
      useCarrito([{ ...lista[0], stock: 0 }]),
    );
    act(() => result.current.agregar("nuevo"));
    act(() => result.current.agregar("no-existe"));
    expect(result.current.items).toEqual([]);
  });
  it("oculta un producto eliminado del catálogo sin perder otros productos", () => {
    const { result, rerender } = renderHook(
      ({ catalogo }) => useCarrito(catalogo),
      { initialProps: { catalogo: lista } },
    );
    act(() => result.current.agregar("nuevo"));
    rerender({ catalogo: [] });
    expect(result.current.items).toEqual([]);
  });
});
