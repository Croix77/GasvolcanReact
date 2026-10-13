import { useState } from "react";
import CampoFormulario from "../../components/CampoFormulario";
import { validarProducto } from "../../data/catalogo";
import { moneda } from "../../utils/moneda";
import { productos as productosIniciales } from "../../data/productos";
const inicial = {
  nombre: "",
  descripcion: "",
  categoria: "",
  precio: "",
  stock: "",
  oferta: false,
};
function Administracion({ productos, crear, actualizar, eliminar, pedidos }) {
  const [edicion, setEdicion] = useState(null);
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const categorias = [
    ...new Set(
      [...productosIniciales, ...productos].map(
        (producto) => producto.categoria,
      ),
    ),
  ];
  function cambiar(evento) {
    setDatos({
      ...datos,
      [evento.target.name]:
        evento.target.type === "checkbox"
          ? evento.target.checked
          : evento.target.value,
    });
  }
  function cancelar() {
    setDatos(inicial);
    setEdicion(null);
    setErrores({});
  }
  function guardar(evento) {
    evento.preventDefault();
    const resultado = validarProducto(datos);
    setErrores(resultado);
    if (Object.keys(resultado).length) return;
    if (edicion) actualizar(edicion, datos);
    else crear(datos);
    setMensaje(edicion ? "Producto actualizado." : "Producto creado.");
    cancelar();
  }
  function editar(producto) {
    setEdicion(producto.id);
    setDatos(producto);
    setErrores({});
  }
  function borrar(producto) {
    if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) return;
    eliminar(producto.id);
    if (edicion === producto.id) cancelar();
    setMensaje("Producto eliminado.");
  }
  return (
    <section>
      <h1>Administración del catálogo</h1>
      <p className="alert alert-warning">
        Panel de demostración local. No utiliza cuentas reales ni controla el
        catálogo de una tienda en producción.
      </p>
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <h2 className="h4">
            {edicion ? "Editar producto" : "Nuevo producto"}
          </h2>
          <form noValidate onSubmit={guardar}>
            <CampoFormulario
              nombre="nombre"
              etiqueta="Nombre del producto"
              valor={datos.nombre}
              onChange={cambiar}
              error={errores.nombre}
              required
              maxLength={100}
            />
            <CampoFormulario
              nombre="descripcion"
              etiqueta="Descripción"
              multilinea
              valor={datos.descripcion}
              onChange={cambiar}
              error={errores.descripcion}
              required
              maxLength={500}
            />
            <CampoFormulario
              nombre="categoria-admin"
              etiqueta="Categoría del producto"
              opciones={categorias}
              valor={datos.categoria}
              onChange={(evento) =>
                setDatos({ ...datos, categoria: evento.target.value })
              }
              error={errores.categoria}
              required
            />
            <CampoFormulario
              nombre="precio"
              etiqueta="Precio residencial (CLP)"
              tipo="number"
              valor={datos.precio}
              onChange={cambiar}
              error={errores.precio}
              required
              min={1}
              step={1}
            />
            <CampoFormulario
              nombre="stock"
              etiqueta="Stock"
              tipo="number"
              valor={datos.stock}
              onChange={cambiar}
              error={errores.stock}
              required
              min={0}
              step={1}
            />
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                id="oferta"
                name="oferta"
                type="checkbox"
                checked={datos.oferta}
                onChange={cambiar}
              />
              <label className="form-check-label" htmlFor="oferta">
                Destacar en ofertas
              </label>
            </div>
            <button className="btn btn-primary" type="submit">
              Guardar producto
            </button>
            {edicion && (
              <button
                type="button"
                className="btn btn-outline-secondary ms-2"
                onClick={cancelar}
              >
                Cancelar edición
              </button>
            )}
          </form>
          <p role="status">{mensaje}</p>
        </div>
        <div className="col-12 col-lg-7">
          <h2 className="h4">Productos</h2>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>{moneda(producto.precio)}</td>
                    <td>{producto.stock}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          type="button"
                          aria-label={`Editar ${producto.nombre}`}
                          onClick={() => editar(producto)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          type="button"
                          aria-label={`Eliminar ${producto.nombre}`}
                          onClick={() => borrar(producto)}
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
          <h2 className="h4 mt-4">Stock crítico</h2>
          <p>
            {productos
              .filter((producto) => producto.stock <= 10)
              .map((producto) => `${producto.nombre} (${producto.stock})`)
              .join(", ") || "No hay productos con stock crítico."}
          </p>
          <h2 className="h4 mt-4">Pedidos de demostración de esta sesión</h2>
          {pedidos.length === 0 ? (
            <p>No hay pedidos registrados.</p>
          ) : (
            <ul>
              {pedidos.map((pedido) => (
                <li key={pedido.id}>
                  {pedido.estado} · {pedido.comuna} · {moneda(pedido.total)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
export default Administracion;
