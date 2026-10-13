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
    oferta: Boolean(producto.oferta),
  };
}

export function crearProducto(lista, producto) {
  const nuevo = normalizarProducto(producto);
  if (!nuevo.id || lista.some((item) => item.id === nuevo.id))
    throw new Error("Identificador duplicado o vacío");
  return [...lista, nuevo];
}

export function leerProducto(lista, id) {
  return lista.find((item) => item.id === id);
}

export function actualizarProducto(lista, id, cambios) {
  const anterior = leerProducto(lista, id);
  if (!anterior) throw new Error("Producto inexistente");
  const actualizado = normalizarProducto({ ...anterior, ...cambios, id });
  return lista.map((item) => (item.id === id ? actualizado : item));
}

export function eliminarProducto(lista, id) {
  return lista.filter((item) => item.id !== id);
}
