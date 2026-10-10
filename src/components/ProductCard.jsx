function ProductCard() {
  return (
    <article className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h2 className="h5">Cilindro de Gas 15 Kg</h2>
        <p className="card-text">Gas licuado de petróleo de uso doméstico e industrial.</p>
        <p className="fw-bold text-primary fs-4">$25.990</p>
        <button className="btn btn-primary mt-auto">Añadir al Carrito</button>
      </div>
    </article>
  );
}

export default ProductCard;