import { useState } from "react";
import { enfocarPrimerError } from "../../utils/validacion";
import CampoFormulario from "../../components/CampoFormulario";

const roles = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  CLIENTE: "Cliente",
  OPERADORA: "Operadora / Despachadora",
  REPARTIDOR: "Repartidor",
};

const inicial = { nombre: "", correo: "", rol: "", password: "" };

function validar(datos, edicion) {
  const errores = {};
  if (datos.nombre.trim().length < 2 || datos.nombre.trim().length > 100)
    errores.nombre = "Escribe un nombre válido de 2 a 100 caracteres.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim()) || datos.correo.trim().length > 150)
    errores.correo = "Escribe un correo válido.";
  if (!Object.hasOwn(roles, datos.rol)) errores.rol = "Selecciona un rol válido.";
  if ((!edicion || datos.password) &&
      (datos.password.length < 8 || new TextEncoder().encode(datos.password).length > 72))
    errores.password = "La contraseña debe tener al menos 8 caracteres y un máximo de 72 bytes.";
  return errores;
}

function AdminUsuarios({ usuarios, guardar, alternar, cargando, error, recargar, correoSesion, alCambiarClavePropia }) {
  const [datos, setDatos] = useState(inicial);
  const [edicion, setEdicion] = useState(null);
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const usuarioPropio = Boolean(edicion && datos.correo === correoSesion);

  function cambiar(nombre, valor) {
    const nuevosDatos = { ...datos, [nombre]: valor };
    setDatos(nuevosDatos);
    setErrorApi("");
    if (Object.keys(errores).length) setErrores(validar(nuevosDatos, edicion));
  }

  function cambiarCampo(evento) {
    cambiar(evento.target.name, evento.target.value);
  }

  function cancelar() {
    setDatos(inicial);
    setEdicion(null);
    setErrores({});
    setErrorApi("");
  }

  async function enviar(evento) {
    evento.preventDefault();
    const resultado = validar(datos, edicion);
    setErrores(resultado);
    setMensaje("");
    setErrorApi("");
    if (Object.keys(resultado).length) {
      enfocarPrimerError(resultado);
      return;
    }
    setOcupado(true);
    try {
      await guardar(datos, edicion);
      setMensaje(edicion ? "Usuario actualizado." : "Usuario creado.");
      cancelar();
      if (usuarioPropio && datos.password) alCambiarClavePropia?.();
    } catch (fallo) {
      const campos = fallo.campos ?? {};
      setErrores(campos);
      setErrorApi(fallo.message);
      enfocarPrimerError(campos);
    } finally {
      setOcupado(false);
    }
  }

  async function cambiarEstado(usuario) {
    setMensaje("");
    setErrorApi("");
    setOcupado(true);
    try {
      await alternar(usuario.id, !usuario.activo);
      if (edicion === usuario.id) cancelar();
      setMensaje(usuario.activo ? "Usuario desactivado." : "Usuario activado.");
    } catch (fallo) {
      setErrorApi(fallo.message);
    } finally {
      setOcupado(false);
    }
  }

  if (cargando) return <section><h1>Administración de usuarios</h1><p role="status">Cargando usuarios…</p></section>;

  return (
    <section>
      <h1>Administración de usuarios</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-outline-danger" onClick={recargar}>Volver a intentar</button>
        </div>
      )}
      <form noValidate onSubmit={enviar} aria-busy={ocupado}>
        <fieldset disabled={ocupado || Boolean(error)}>
          <CampoFormulario nombre="nombre" etiqueta="Nombre" valor={datos.nombre} onChange={cambiarCampo}
            error={errores.nombre} required maxLength={100} />
          <CampoFormulario nombre="correo" etiqueta="Correo electrónico" tipo="email" valor={datos.correo}
            onChange={cambiarCampo} error={errores.correo} required maxLength={150} readOnly={Boolean(edicion)} />
          <CampoFormulario nombre="rol" etiqueta="Rol" opciones={Object.values(roles)}
            valor={roles[datos.rol] ?? ""}
            onChange={(evento) => cambiar("rol", Object.keys(roles).find((rol) => roles[rol] === evento.target.value) ?? "")}
            error={errores.rol} required disabled={usuarioPropio} />
          <CampoFormulario nombre="password"
            etiqueta={edicion ? "Nueva contraseña (opcional)" : "Contraseña inicial"}
            tipo="password" valor={datos.password} onChange={cambiarCampo}
            error={errores.password} required={!edicion} maxLength={72} autoComplete="new-password" />
          <button type="submit" className="btn btn-primary">Guardar usuario</button>
          {edicion && (
            <button type="button" className="btn btn-outline-secondary ms-2" onClick={cancelar}>
              Cancelar edición de usuario
            </button>
          )}
        </fieldset>
      </form>
      {errorApi && <p role="alert" className="alert alert-danger mt-3">{errorApi}</p>}
      <p role="status">{mensaje}</p>
      {!usuarios.length && !error && <p>No hay usuarios registrados.</p>}
      {usuarios.length > 0 && (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>{roles[usuario.rol]}</td>
                  <td>{usuario.activo ? "Activo" : "Inactivo"}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button type="button" className="btn btn-outline-primary btn-sm"
                        aria-label={`Editar usuario ${usuario.nombre}`} disabled={ocupado}
                        onClick={() => {
                          setDatos({ ...usuario, password: "" });
                          setEdicion(usuario.id);
                          setErrores({});
                          setErrorApi("");
                          setMensaje("");
                        }}>
                        Editar
                      </button>
                      {usuario.correo !== correoSesion && (
                        <button type="button" className="btn btn-outline-secondary btn-sm"
                          aria-label={`${usuario.activo ? "Desactivar" : "Activar"} usuario ${usuario.nombre}`}
                          disabled={ocupado} onClick={() => cambiarEstado(usuario)}>
                          {usuario.activo ? "Desactivar" : "Activar"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
export default AdminUsuarios;
