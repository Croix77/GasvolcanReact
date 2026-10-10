import bannerImage from "../assets/img/banner-gas-el-volcan.png";
function Bienvenida() {
  const nombreProyecto = "Gas el Volcan";

  return (
    <section className="text-center my-4">
      <img 
        src={bannerImage} 
        alt="Banner Gas El Volcán" 
        className="img-fluid rounded mb-3" 
        style={{ maxHeight: "300px", objectFit: "contain" }}
      />
      <h1>{nombreProyecto}</h1>
      <p className="lead">Encuentra cilindros de gas y despacho a domicilio de forma rápida y segura.</p>
    </section>
  );
}

export default Bienvenida;