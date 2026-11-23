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
