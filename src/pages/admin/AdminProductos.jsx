import { useState } from "react";
import FormProducto from "../../components/admin/FormProducto";
import TablaProductos from "../../components/admin/TablaProductos";
import { productos as iniciales } from "../../data/productos";
function AdminProductos({ productos, crear, actualizar, eliminar }) {
  const [edicion, setEdicion] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const categorias = [
    ...new Set(
      [...iniciales, ...productos].map((producto) => producto.categoria),
    ),
  ];
  function guardar(datos) {
    if (edicion) actualizar(edicion.id, datos);
    else crear(datos);
    setMensaje(edicion ? "Producto actualizado." : "Producto creado.");
    setEdicion(null);
  }
  function borrar(producto) {
    if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) return;
    eliminar(producto.id);
    if (edicion?.id === producto.id) setEdicion(null);
    setMensaje("Producto eliminado.");
  }
  return (
    <section>
      <h1>Administración del catálogo</h1>
      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <h2 className="h4">
            {edicion ? "Editar producto" : "Nuevo producto"}
          </h2>
          <FormProducto
            key={edicion?.id || "nuevo"}
            producto={edicion}
            categorias={categorias}
            onGuardar={guardar}
            onCancelar={() => {
              setEdicion(null);
              setMensaje("Edición cancelada.");
            }}
          />
          <p role="status">{mensaje}</p>
        </div>
        <div className="col-12 col-xl-7">
          <h2 className="h4">Productos</h2>
          <TablaProductos
            productos={productos}
            onEditar={setEdicion}
            onEliminar={borrar}
          />
          <h2 className="h4 mt-4">Stock crítico</h2>
          <p>
            {productos
              .filter(
                (producto) => producto.stock <= (producto.stockCritico ?? 10),
              )
              .map((producto) => `${producto.nombre} (${producto.stock})`)
              .join(", ") || "No hay productos con stock crítico."}
          </p>
        </div>
      </div>
    </section>
  );
}
export default AdminProductos;
