const clave = "gas-volcan-resultado-compra";
export function leerEscenarioCompra() {
  try {
    return sessionStorage.getItem(clave) === "error" ? "error" : "exito";
  } catch {
    return "exito";
  }
}
export function guardarEscenarioCompra(resultado) {
  try {
    sessionStorage.setItem(clave, resultado === "error" ? "error" : "exito");
    return true;
  } catch {
    return false;
  }
}
