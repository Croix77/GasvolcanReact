import { validarCategoria } from "../../services/categorias";
import { enfocarPrimerError } from "../../utils/validacion";
import { useState } from "react";
import CampoFormulario from "../../components/CampoFormulario";

function AdminCategorias({ categorias, productos, crearCategoria, actualizarCategoria, eliminarCategoria }) {
  const [nombre, setNombre] = useState("");
  const [edicion, setEdicion] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  function cancelar() { setNombre(""); setEdicion(null); setError(""); }

  async function guardar(evento) {
    evento.preventDefault();
    const errorNombre = validarCategoria(nombre, categorias, edicion);
    setError(errorNombre);
    if (errorNombre) { enfocarPrimerError({ "categoria-nombre": errorNombre }); return; }
    try {
      if (edicion) await actualizarCategoria(edicion, nombre); else await crearCategoria(nombre);
      setMensaje(edicion ? "Categoría actualizada." : "Categoría creada.");
      cancelar();
    } catch (fallo) { setError(fallo.message); }
  }

  async function eliminar(categoria) {
    setError("");
    if (!window.confirm(`¿Eliminar la categoría ${categoria.nombre}?`)) return;
    try {
      await eliminarCategoria(categoria.id);
      if (edicion === categoria.id) cancelar();
      setMensaje("Categoría eliminada.");
    } catch (fallo) { setError(fallo.message); }
  }

  return (
    <section>
      <h1>Administración de categorías</h1>
      <form noValidate onSubmit={guardar}>
        <CampoFormulario nombre="categoria-nombre" etiqueta="Nombre de la categoría" valor={nombre} onChange={(e) => { setNombre(e.target.value); if (error) setError(validarCategoria(e.target.value, categorias, edicion)); }} error={error} required maxLength={80} />
        <button className="btn btn-primary" type="submit">Guardar categoría</button>
        {edicion && <button className="btn btn-outline-secondary ms-2" type="button" onClick={cancelar}>Cancelar</button>}
      </form>
      <p role="status">{mensaje}</p>
      <div className="table-responsive">
        <table className="table">
          <thead><tr><th>Categoría</th><th>Productos</th><th>Acciones</th></tr></thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>{productos.filter((p) => p.categoria === categoria.nombre || p.categoriaId === categoria.id).length}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => { setEdicion(categoria.id); setNombre(categoria.nombre); setError(""); }}>Editar</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => eliminar(categoria)}>Eliminar</button>
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
export default AdminCategorias;
