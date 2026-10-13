import { renderHook } from "@testing-library/react";
import { expect, it } from "vitest";
import { useCatalogo } from "./useCatalogo";
it("normaliza los números del catálogo guardado y conserva metadatos iniciales", () => {
  localStorage.setItem(
    "gas-volcan-catalogo-v2",
    JSON.stringify({
      categorias: [{ id: "gas", nombre: "Cilindros de Gas" }],
      productos: [
        {
          id: "gas-15kg",
          nombre: "Cilindro",
          descripcion: "Gas",
          categoria: "Cilindros de Gas",
          precio: "16000",
          stock: "90",
        },
      ],
    }),
  );
  const { result } = renderHook(() => useCatalogo());
  expect(result.current.productos[0]).toMatchObject({
    precio: 16000,
    stock: 90,
    stockCritico: 15,
  });
});
it("recupera la versión anterior si el nuevo catálogo está corrupto o inconsistente", () => {
  localStorage.setItem("gas-volcan-catalogo-v2", "{");
  const primera = renderHook(() => useCatalogo());
  expect(primera.result.current.categorias).toHaveLength(4);
  primera.unmount();
  localStorage.setItem(
    "gas-volcan-catalogo-v2",
    JSON.stringify({
      categorias: [],
      productos: [
        {
          id: "x",
          nombre: "X",
          descripcion: "X",
          categoria: "Inexistente",
          precio: 1,
          stock: 1,
        },
      ],
    }),
  );
  const segunda = renderHook(() => useCatalogo());
  expect(segunda.result.current.productos).toHaveLength(14);
});
