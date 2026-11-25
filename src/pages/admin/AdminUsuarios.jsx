import { useEffect, useState } from "react";
import CampoFormulario from "../../components/CampoFormulario";
import { enfocarPrimerError } from "../../utils/validacion";
import { useUsuariosApi } from "../../services/usuariosApi";

const inicial = { nombre: "", correo: "", rol: "CLIENTE", password: "", activo: true };
const roles = ["ADMIN", "CLIENTE", "VENDEDOR", "OPERADORA", "REPARTIDOR"];

function validar(datos, edicion) {
  const errores = {};
  if (!datos.nombre?.trim() || datos.nombre.trim().length < 2) errores.nombre = "Escribe un nombre válido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo || "")) errores.correo = "Escribe un correo válido.";
  if (!roles.includes(datos.rol)) errores.rol = "Selecciona un rol válido.";
  if (!edicion && (!datos.password || datos.password.length < 8)) errores.password = "La contraseña debe tener al menos 8 caracteres.";
  return errores;
}

function AdminUsuarios() {
  const api = useUsuariosApi();
  const [usuarios, setUsuarios] = useState([]);
  const [datos, setDatos] = useState(inicial);
  const [edicion, setEdicion] = useState(null);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function cargar() {
    try { setUsuarios(await api.listar()); setError(""); } catch (e) { setError(e.message); }
  }
  useEffect(() => { cargar(); }, []);

  function cambiar(evento) {
    const nuevosDatos = { ...datos, [evento.target.name]: evento.target.value };
    setDatos(nuevosDatos);
    if (Object.keys(errores).length > 0) setErrores(validar(nuevosDatos, edicion));
  }
  function cancelar() { setDatos(inicial); setEdicion(null); setErrores({}); }

  async function enviar(evento) {
    evento.preventDefault();
    const resultado = validar(datos, edicion);
    setErrores(resultado);
    if (Object.keys(resultado).length) { enfocarPrimerError(resultado); return; }
    try {
      if (edicion) await api.actualizar(edicion, { nombre: datos.nombre.trim(), rol: datos.rol, ...(datos.password ? { password: datos.password } : {}) });
      else await api.crear({ nombre: datos.nombre.trim(), correo: datos.correo.trim().toLowerCase(), rol: datos.rol, password: datos.password });
      setMensaje(edicion ? "Usuario actualizado." : "Usuario creado.");
      cancelar();
      await cargar();
    } catch (e) { setError(e.message); }
  }

  async function alternar(usuario) {
    try {
      await api.cambiarEstado(usuario.id, !usuario.activo);
      setMensaje(usuario.activo ? "Usuario desactivado." : "Usuario activado.");
      await cargar();
    } catch (e) { setError(e.message); }
  }

  return (
    <section>
      <h1>Administración de usuarios</h1>
      <form noValidate onSubmit={enviar}>
        <CampoFormulario nombre="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} required maxLength={100} />
        {!edicion && <CampoFormulario nombre="correo" etiqueta="Correo" tipo="email" valor={datos.correo} onChange={cambiar} error={errores.correo} required maxLength={150} />}
        <CampoFormulario nombre="rol" etiqueta="Rol" opciones={roles} valor={datos.rol} onChange={cambiar} error={errores.rol} required />
        <CampoFormulario nombre="password" etiqueta={edicion ? "Nueva contraseña (opcional)" : "Contraseña"} tipo="password" valor={datos.password} onChange={cambiar} error={errores.password} required={!edicion} maxLength={72} />
        <button type="submit" className="btn btn-primary">Guardar usuario</button>
        {edicion && <button type="button" className="btn btn-outline-secondary ms-2" onClick={cancelar}>Cancelar</button>}
      </form>
      {mensaje && <p role="status" className="alert alert-success mt-3">{mensaje}</p>}
      {error && <p role="alert" className="alert alert-danger mt-3">{error}</p>}
      <div className="table-responsive mt-3">
        <table className="table align-middle">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td><td>{usuario.correo}</td><td>{usuario.rol}</td><td>{usuario.activo ? "Activo" : "Inactivo"}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => { setDatos({ nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol, password: "", activo: usuario.activo }); setEdicion(usuario.id); setErrores({}); }}>Editar</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => alternar(usuario)}>{usuario.activo ? "Desactivar" : "Activar"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
export default AdminUsuarios;
