import { useState } from "react";
import FormProducto from "../../components/admin/FormProducto";
import TablaProductos from "../../components/admin/TablaProductos";

function AdminProductos({
  productos,
  categorias: categoriasRegistradas,
  crear,
  actualizar,
  eliminar,
  recargar,
}) {
  const [edicion, setEdicion] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const categorias = categoriasRegistradas.map((categoria) => categoria.nombre);

  async function guardar(datos) {
    setOcupado(true);
    setError("");
    setMensaje("");
    try {
      if (edicion) await actualizar(edicion.id, datos);
      else await crear(datos);
      setMensaje(edicion ? "Producto actualizado." : "Producto creado.");
      setEdicion(null);
    } catch (fallo) {
      if (fallo.status === 409) recargar?.();
      throw fallo;
    } finally {
      setOcupado(false);
    }
  }

  async function borrar(producto) {
    if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) return;
    setOcupado(true);
    setError("");
    setMensaje("");
    try {
      await eliminar(producto.id);
      if (edicion?.id === producto.id) setEdicion(null);
      setMensaje("Producto eliminado.");
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <section>
      <h1>Administración del catálogo</h1>
      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <h2 className="h4">{edicion ? "Editar producto" : "Nuevo producto"}</h2>
          <FormProducto key={edicion?.id || "nuevo"} producto={edicion}
            categorias={categorias} onGuardar={guardar} deshabilitado={ocupado}
            onCancelar={() => {
              setEdicion(null);
              setMensaje("Edición cancelada.");
            }}
          />
          <p role="status">{mensaje}</p>
        </div>
        <div className="col-12 col-xl-7">
          <h2 className="h4">Productos</h2>
          {error && <p role="alert" className="alert alert-danger">{error}</p>}
          <TablaProductos productos={productos} onEditar={setEdicion} onEliminar={borrar}
            deshabilitado={ocupado} />
          <h2 className="h4 mt-4">Stock crítico</h2>
          <p>
            {productos
              .filter((producto) => producto.stock <= (producto.stockCritico ?? 10))
              .map((producto) => `${producto.nombre} (${producto.stock})`)
              .join(", ") || "No hay productos con stock crítico."}
          </p>
        </div>
      </div>
    </section>
  );
}
export default AdminProductos;
