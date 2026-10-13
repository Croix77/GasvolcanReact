import { validarCategoria } from "../../services/categorias";
import { enfocarPrimerError } from "../../utils/validacion";
import { useState } from "react";
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
  const [mensaje, setMensaje] = useState("");
  function cancelar() {
    setNombre("");
    setEdicion(null);
    setError("");
  }
  function guardar(evento) {
    evento.preventDefault();
    const errorNombre = validarCategoria(nombre, categorias, edicion);
    setError(errorNombre);
    if (errorNombre) {
      enfocarPrimerError({ "categoria-nombre": errorNombre });
      return;
    }
    try {
      if (edicion) actualizarCategoria(edicion, nombre);
      else crearCategoria(nombre);
      setMensaje(edicion ? "Categoría actualizada." : "Categoría creada.");
      cancelar();
    } catch (fallo) {
      setError(fallo.message);
    }
  }
  function eliminar(categoria) {
    setError("");
    if (!window.confirm(`¿Eliminar la categoría ${categoria.nombre}?`)) return;
    try {
      eliminarCategoria(categoria.id);
      if (edicion === categoria.id) cancelar();
      setMensaje("Categoría eliminada.");
    } catch (fallo) {
      setError(fallo.message);
    }
  }
  return (
    <section>
      <h1>Administración de categorías</h1>
      <form noValidate onSubmit={guardar}>
        <CampoFormulario
          nombre="categoria-nombre"
          etiqueta="Nombre de la categoría"
          valor={nombre}
          onChange={(evento) => {
            const valor = evento.target.value;
            setNombre(valor);
            if (error) setError(validarCategoria(valor, categorias, edicion));
          }}
          error={error}
          required
          maxLength={80}
        />
        <button className="btn btn-primary" type="submit">
          Guardar categoría
        </button>
        {edicion && (
          <button
            className="btn btn-outline-secondary ms-2"
            type="button"
            onClick={cancelar}
          >
            Cancelar edición de categoría
          </button>
        )}
      </form>
      <p role="status">{mensaje}</p>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Categoría</th>
              <th scope="col">Productos</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>
                  {
                    productos.filter(
                      (producto) => producto.categoria === categoria.nombre,
                    ).length
                  }
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      aria-label={`Editar categoría ${categoria.nombre}`}
                      onClick={() => {
                        setEdicion(categoria.id);
                        setNombre(categoria.nombre);
                        setError("");
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      aria-label={`Eliminar categoría ${categoria.nombre}`}
                      onClick={() => eliminar(categoria)}
                    >
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
