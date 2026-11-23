export function validarProducto(producto) {
  const errores = {};
  if (
    typeof producto.nombre !== "string" ||
    !producto.nombre.trim() ||
    producto.nombre.trim().length > 100
  )
    errores.nombre = "Escribe el nombre del producto.";
  if (
    typeof producto.descripcion !== "string" ||
    !producto.descripcion.trim() ||
    producto.descripcion.trim().length > 500
  )
    errores.descripcion = "Escribe una descripción.";
  if (
    typeof producto.categoria !== "string" ||
    !producto.categoria.trim() ||
    producto.categoria.trim().length > 80
  )
    errores.categoria = "Selecciona una categoría.";
  if (!enteroNoNegativo(producto.precio))
    errores.precio = "El precio debe ser un entero desde cero.";
  if (!enteroNoNegativo(producto.stock))
    errores.stock = "El stock debe ser un entero desde cero.";
  if (producto.precioAnterior != null && producto.precioAnterior !== "") {
    if (!enteroNoNegativo(producto.precioAnterior) ||
        (producto.oferta && Number(producto.precioAnterior) <= Number(producto.precio)))
      errores.precioAnterior = "El precio anterior debe ser un entero y mayor que el precio de oferta.";
  }
  return errores;
}

function enteroNoNegativo(valor) {
  return (
    (typeof valor === "number" ||
      (typeof valor === "string" && /^\d+$/.test(valor.trim()))) &&
    Number.isSafeInteger(Number(valor)) &&
    Number(valor) >= 0
  );
}

export function normalizarProducto(producto) {
  if (Object.keys(validarProducto(producto)).length)
    throw new Error("Producto inválido");
  return {
    ...producto,
    nombre: producto.nombre.trim(),
    descripcion: producto.descripcion.trim(),
    categoria: producto.categoria.trim(),
    precio: Number(producto.precio),
    stock: Number(producto.stock),
    precioAnterior: producto.precioAnterior == null || producto.precioAnterior === "" ? null : Number(producto.precioAnterior),
    oferta: Boolean(producto.oferta),
  };
}
