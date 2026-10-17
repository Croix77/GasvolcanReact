import { Link } from "react-router-dom";

export default function FormatosCilindros() {
  return (
    <div className="carrusel-formatos">
      <div className="bienvenida-cilindros">
        {[
          [5, "pequeno"],
          [15, "grande"],
          [11, "mediano"],
        ].map(([peso, tamano]) => (
          <Link key={peso} to={`/productos/gas-${peso}kg`} aria-label={`Ver cilindro de ${peso} kg`}>
            <img className={`cilindro-${tamano}`} src={`/img/gas-${peso}kg.png`} alt={`Cilindro de ${peso} kg`} />
          </Link>
        ))}
      </div>
      <p className="bienvenida-etiqueta">5, 11 y 15 kg · Elige tu formato</p>
    </div>
  );
}
