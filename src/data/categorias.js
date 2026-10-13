export function validarCategoria(nombre, categorias, id) {
  if (typeof nombre !== "string" || !nombre.trim() || nombre.trim().length > 80)
    return "Escribe una categoría de 1 a 80 caracteres.";
  if (
    categorias.some(
      (categoria) =>
        categoria.id !== id &&
        categoria.nombre.toLocaleLowerCase("es") ===
          nombre.trim().toLocaleLowerCase("es"),
    )
  )
    return "La categoría ya existe.";
  return "";
}
export function agregarCategoria(estado, categoria) {
  const error = validarCategoria(categoria.nombre, estado.categorias);
  if (error) throw new Error(error);
  return {
    ...estado,
    categorias: [
      ...estado.categorias,
      { id: categoria.id, nombre: categoria.nombre.trim() },
    ],
  };
}
export function editarCategoria(estado, id, nombre) {
  const anterior = estado.categorias.find((categoria) => categoria.id === id);
  if (!anterior) throw new Error("Categoría inexistente.");
  const error = validarCategoria(nombre, estado.categorias, id);
  if (error) throw new Error(error);
  return {
    categorias: estado.categorias.map((categoria) =>
      categoria.id === id ? { ...categoria, nombre: nombre.trim() } : categoria,
    ),
    productos: estado.productos.map((producto) =>
      producto.categoria === anterior.nombre
        ? { ...producto, categoria: nombre.trim() }
        : producto,
    ),
  };
}
export function borrarCategoria(estado, id) {
  const categoria = estado.categorias.find((item) => item.id === id);
  if (
    estado.productos.some(
      (producto) => producto.categoria === categoria?.nombre,
    )
  )
    throw new Error(
      "La categoría tiene productos asignados. Reasígnalos antes de eliminarla.",
    );
  return {
    ...estado,
    categorias: estado.categorias.filter((item) => item.id !== id),
  };
}
