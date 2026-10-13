import { rolesDemo, usuariosIniciales } from "../data/usuariosDemo";
export function validarUsuario(usuario, lista, id) {
  const errores = {};
  if (
    typeof usuario.nombre !== "string" ||
    !/^[\p{L}\p{M}\s.'’-]{2,100}$/u.test(usuario.nombre.trim()) ||
    !/\p{L}/u.test(usuario.nombre)
  )
    errores.nombre = "Escribe un nombre válido de 2 a 100 caracteres.";
  if (
    typeof usuario.correo !== "string" ||
    usuario.correo.trim().length > 150 ||
    !/^[^\s@]+@example\.(com|org|net)$/i.test(usuario.correo.trim())
  )
    errores.correo =
      "Usa un correo ficticio @example.com, @example.org o @example.net.";
  else if (
    lista.some(
      (item) =>
        item.id !== id &&
        item.correo.toLowerCase() === usuario.correo.trim().toLowerCase(),
    )
  )
    errores.correo = "El correo ya está registrado.";
  if (!rolesDemo.includes(usuario.rol))
    errores.rol = "Selecciona un rol válido.";
  return errores;
}
export function guardarUsuario(lista, usuario, id) {
  if (Object.keys(validarUsuario(usuario, lista, id)).length)
    throw new Error("Usuario inválido.");
  const datos = {
    id: id || crypto.randomUUID(),
    nombre: usuario.nombre.trim(),
    correo: usuario.correo.trim().toLowerCase(),
    rol: usuario.rol,
    activo: usuario.activo !== false,
  };
  return id
    ? lista.map((item) => (item.id === id ? datos : item))
    : [...lista, datos];
}
export function recuperarUsuarios() {
  try {
    const datos = JSON.parse(
      localStorage.getItem("gas-volcan-usuarios-demo-v1") || "null",
    );
    if (!Array.isArray(datos)) return usuariosIniciales;
    const ids = new Set();
    for (const item of datos) {
      if (!item || typeof item.id !== "string" || ids.has(item.id))
        return usuariosIniciales;
      if (Object.keys(validarUsuario(item, datos, item.id)).length > 0)
        return usuariosIniciales;
      ids.add(item.id);
    }
    return datos.map(({ id, nombre, correo, rol, activo }) => ({
      id,
      nombre,
      correo,
      rol,
      activo: activo !== false,
    }));
  } catch {
    return usuariosIniciales;
  }
}
