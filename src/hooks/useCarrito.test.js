import { act, renderHook } from "@testing-library/react";
import { expect, it } from "vitest";
import { useCarrito } from "./useCarrito";

const catalogo = [
  { id: "gas", stock: 20, precio: 1000 },
  { id: "accesorio", stock: 2, precio: 500 },
];

it("permite hasta tres unidades de un producto y respeta un stock menor", () => {
  // Preparar: usar un catalogo con dos productos.
  const { result } = renderHook(() => useCarrito(catalogo));

  // Actuar: intentar agregar cuatro unidades del primero y tres del segundo.
  act(() => {
    result.current.agregar("gas");
    result.current.agregar("gas");
    result.current.agregar("gas");
    result.current.agregar("gas");
    result.current.agregar("accesorio");
    result.current.agregar("accesorio");
    result.current.agregar("accesorio");
  });

  // Comprobar: el limite es tres, pero el accesorio solo tiene dos de stock.
  expect(result.current.items[0].cantidad).toBe(3);
  expect(result.current.items[1].cantidad).toBe(2);
});

it("rechaza cantidades invalidas y permite cambiar a tres unidades", () => {
  const { result } = renderHook(() => useCarrito(catalogo));
  act(() => result.current.agregar("gas"));

  // Cada intento invalido debe conservar la cantidad anterior.
  act(() => result.current.cambiarCantidad("gas", 4));
  expect(result.current.items[0].cantidad).toBe(1);

  act(() => result.current.cambiarCantidad("gas", 0));
  expect(result.current.items[0].cantidad).toBe(1);

  act(() => result.current.cambiarCantidad("gas", -1));
  expect(result.current.items[0].cantidad).toBe(1);

  act(() => result.current.cambiarCantidad("gas", 1.5));
  expect(result.current.items[0].cantidad).toBe(1);

  act(() => result.current.cambiarCantidad("gas", 3));
  expect(result.current.items[0].cantidad).toBe(3);
});

it("recupera un carrito antiguo con un maximo de tres unidades", () => {
  // Preparar: simular datos guardados antes del limite actual.
  localStorage.setItem("gas-el-volcan-carrito", JSON.stringify([
    { id: "gas", cantidad: 90 },
  ]));

  // Actuar: cargar el carrito.
  const { result } = renderHook(() => useCarrito(catalogo));

  // Comprobar: tambien se guarda la cantidad corregida.
  expect(result.current.items[0].cantidad).toBe(3);
  const guardado = JSON.parse(localStorage.getItem("gas-el-volcan-carrito"));
  expect(guardado).toEqual([{ id: "gas", cantidad: 3 }]);
});
