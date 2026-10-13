import { useState } from "react";
import CampoFormulario from "../../components/CampoFormulario";
import { rolesDemo, validarUsuario } from "../../data/usuariosDemo";
const inicial = { nombre: "", correo: "", rol: "", activo: true };
function AdminUsuarios({ usuarios, guardar, alternar }) {
  const [datos, setDatos] = useState(inicial);
  const [edicion, setEdicion] = useState(null);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  function cambiar(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }
  function cancelar() {
    setDatos(inicial);
    setEdicion(null);
    setErrores({});
  }
  function enviar(evento) {
    evento.preventDefault();
    const resultado = validarUsuario(datos, usuarios, edicion);
    setErrores(resultado);
    if (Object.keys(resultado).length) return;
    guardar(datos, edicion);
    setMensaje(edicion ? "Usuario actualizado." : "Usuario ficticio creado.");
    cancelar();
  }
  return (
    <section>
      <h1>Administración de usuarios ficticios</h1>
      <p>
        Los usuarios de esta pantalla son registros de demostración. Los roles y
        la desactivación no cambian el login fijo de ejemplo. No introduzcas
        datos personales reales ni contraseñas.
      </p>
      <form noValidate onSubmit={enviar}>
        <CampoFormulario
          nombre="nombre"
          etiqueta="Nombre ficticio"
          valor={datos.nombre}
          onChange={cambiar}
          error={errores.nombre}
          required
          maxLength={100}
        />
        <CampoFormulario
          nombre="correo"
          etiqueta="Correo ficticio"
          tipo="email"
          valor={datos.correo}
          onChange={cambiar}
          error={errores.correo}
          required
          maxLength={150}
        />
        <CampoFormulario
          nombre="rol"
          etiqueta="Rol"
          opciones={rolesDemo}
          valor={datos.rol}
          onChange={cambiar}
          error={errores.rol}
          required
        />
        <button type="submit" className="btn btn-primary">
          Guardar usuario
        </button>
        {edicion && (
          <button
            type="button"
            className="btn btn-outline-secondary ms-2"
            onClick={cancelar}
          >
            Cancelar edición de usuario
          </button>
        )}
      </form>
      <p role="status">{mensaje}</p>
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
                <td>{usuario.rol}</td>
                <td>{usuario.activo ? "Activo" : "Inactivo"}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      aria-label={`Editar usuario ${usuario.nombre}`}
                      onClick={() => {
                        setDatos(usuario);
                        setEdicion(usuario.id);
                        setErrores({});
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      aria-label={`${usuario.activo ? "Desactivar" : "Activar"} usuario ${usuario.nombre}`}
                      onClick={() => {
                        alternar(usuario.id);
                        if (edicion === usuario.id) cancelar();
                        setMensaje(
                          usuario.activo
                            ? "Usuario desactivado."
                            : "Usuario activado.",
                        );
                      }}
                    >
                      {usuario.activo ? "Desactivar" : "Activar"}
                    </button>
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
