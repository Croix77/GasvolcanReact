import { useState } from "react";
import { validarCategoria } from "../../services/categorias";
import { enfocarPrimerError } from "../../utils/validacion";
import CampoFormulario from "../../components/CampoFormulario";

function AdminCategorias({
  categorias,
  productos,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
}) {
  const [nombre, setNombre] = useState("");
  const [edicion, setEdicion] = useState(null);
  const [error, setError] = useState("");
  const [errorApi, setErrorApi] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [ocupado, setOcupado] = useState(false);

  function cancelar() {
    setNombre("");
    setEdicion(null);
    setError("");
    setErrorApi("");
  }

  async function guardar(evento) {
    evento.preventDefault();
    const errorNombre = validarCategoria(nombre, categorias, edicion);
    setError(errorNombre);
    setErrorApi("");
    setMensaje("");
    if (errorNombre) {
      enfocarPrimerError({ "categoria-nombre": errorNombre });
      return;
    }
    setOcupado(true);
    try {
      if (edicion) await actualizarCategoria(edicion, nombre);
      else await crearCategoria(nombre);
      setMensaje(edicion ? "Categoría actualizada." : "Categoría creada.");
      cancelar();
    } catch (fallo) {
      setErrorApi(fallo.message);
    } finally {
      setOcupado(false);
    }
  }

  async function eliminar(categoria) {
    setError("");
    setErrorApi("");
    if (!window.confirm(`¿Eliminar la categoría ${categoria.nombre}?`)) return;
    setMensaje("");
    setOcupado(true);
    try {
      await eliminarCategoria(categoria.id);
      if (edicion === categoria.id) cancelar();
      setMensaje("Categoría eliminada.");
    } catch (fallo) {
      setErrorApi(fallo.message);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <section>
      <h1>Administración de categorías</h1>
      <form noValidate onSubmit={guardar} aria-busy={ocupado}>
        <fieldset disabled={ocupado}>
          <CampoFormulario nombre="categoria-nombre" etiqueta="Nombre de la categoría" valor={nombre}
            onChange={(evento) => {
              const valor = evento.target.value;
              setNombre(valor);
              setErrorApi("");
              if (error) setError(validarCategoria(valor, categorias, edicion));
            }}
            error={error} required maxLength={80} />
          <button className="btn btn-primary" type="submit">Guardar categoría</button>
          {edicion && (
            <button className="btn btn-outline-secondary ms-2" type="button" onClick={cancelar}>
              Cancelar edición de categoría
            </button>
          )}
        </fieldset>
      </form>
      {errorApi && <p role="alert" className="alert alert-danger mt-3">{errorApi}</p>}
      <p role="status">{mensaje}</p>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Categoría</th>
              <th scope="col">Productos activos</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>{productos.filter((producto) => producto.categoriaId === categoria.id).length}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-outline-primary btn-sm"
                      aria-label={`Editar categoría ${categoria.nombre}`} disabled={ocupado}
                      onClick={() => {
                        setEdicion(categoria.id);
                        setNombre(categoria.nombre);
                        setError("");
                        setErrorApi("");
                        setMensaje("");
                      }}>
                      Editar
                    </button>
                    <button type="button" className="btn btn-outline-danger btn-sm"
                      aria-label={`Eliminar categoría ${categoria.nombre}`} disabled={ocupado}
                      onClick={() => eliminar(categoria)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {categorias.length === 0 && <p>No hay categorías registradas.</p>}
    </section>
  );
}
export default AdminCategorias;
