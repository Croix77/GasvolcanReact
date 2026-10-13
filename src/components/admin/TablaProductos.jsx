import { moneda } from "../../utils/moneda";
function TablaProductos({ productos, onEditar, onEliminar }) {
  return (
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
                    onClick={() => onEditar(producto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    type="button"
                    aria-label={`Eliminar ${producto.nombre}`}
                    onClick={() => onEliminar(producto)}
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
  );
}
export default TablaProductos;
