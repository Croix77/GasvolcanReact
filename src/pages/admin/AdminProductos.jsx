import { useState } from "react";
import FormProducto from "../../components/admin/FormProducto";
import TablaProductos from "../../components/admin/TablaProductos";
function AdminProductos({ productos, categorias: categoriasRegistradas, crear, actualizar, eliminar, cargando, error, recargar }) {
  const [edicion, setEdicion] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [accionError, setAccionError] = useState("");
  const categorias = categoriasRegistradas.map((categoria) => categoria.nombre);

  async function guardar(datos) {
    setAccionError("");
    try {
      if (edicion) await actualizar(edicion.id, datos); else await crear(datos);
      setMensaje(edicion ? "Producto actualizado." : "Producto creado.");
      setEdicion(null);
    } catch (e) { setAccionError(e.message); }
  }
  async function borrar(producto) {
    if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) return;
    setAccionError("");
    try {
      await eliminar(producto.id);
      if (edicion?.id === producto.id) setEdicion(null);
      setMensaje("Producto eliminado.");
    } catch (e) { setAccionError(e.message); }
  }

  return (
    <section>
      <h1>Administración del catálogo</h1>
      {cargando && <p>Cargando catálogo...</p>}
      {error && <p role="alert" className="alert alert-danger">{error} <button className="btn btn-sm btn-outline-danger ms-2" onClick={recargar}>Reintentar</button></p>}
      {accionError && <p role="alert" className="alert alert-danger">{accionError}</p>}
      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <h2 className="h4">{edicion ? "Editar producto" : "Nuevo producto"}</h2>
          <FormProducto key={edicion?.id || "nuevo"} producto={edicion} categorias={categorias} onGuardar={guardar} onCancelar={() => { setEdicion(null); setMensaje("Edición cancelada."); }} />
          <p role="status">{mensaje}</p>
        </div>
        <div className="col-12 col-xl-7">
          <h2 className="h4">Productos</h2>
          <TablaProductos productos={productos} onEditar={setEdicion} onEliminar={borrar} />
        </div>
      </div>
    </section>
  );
}
export default AdminProductos;
