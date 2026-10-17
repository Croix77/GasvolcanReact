import { act, renderHook } from "@testing-library/react";
import { expect, it } from "vitest";
import { useCarrito } from "./useCarrito";

const catalogo = [{ id: "a", stock: 20, precio: 1000 }, { id: "b", stock: 2, precio: 500 }];

it("limita cada producto a tres unidades y respeta stocks menores", () => {
  const { result } = renderHook(() => useCarrito(catalogo));
  act(() => {
    for (let i = 0; i < 5; i++) {
      result.current.agregar("a");
      result.current.agregar("b");
    }
  });
  expect(result.current.items.map((item) => item.cantidad)).toEqual([3, 2]);
});

it("rechaza cantidades mayores a tres, negativas y decimales al editar", () => {
  const { result } = renderHook(() => useCarrito(catalogo));
  act(() => result.current.agregar("a"));
  for (const cantidad of [4, 0, -1, 1.5]) {
    act(() => result.current.cambiarCantidad("a", cantidad));
    expect(result.current.items[0].cantidad).toBe(1);
  }
  act(() => result.current.cambiarCantidad("a", 3));
  expect(result.current.items[0].cantidad).toBe(3);
});

it("ajusta cantidades antiguas a tres y guarda el valor corregido", () => {
  localStorage.setItem("gas-el-volcan-carrito", JSON.stringify([{ id: "a", cantidad: 90 }]));
  const { result } = renderHook(() => useCarrito(catalogo));
  expect(result.current.items[0].cantidad).toBe(3);
  expect(JSON.parse(localStorage.getItem("gas-el-volcan-carrito"))).toEqual([{ id: "a", cantidad: 3 }]);
});
