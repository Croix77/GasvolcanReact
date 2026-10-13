import gas5kg from "../assets/img/gas-5kg.png";
import gas11kg from "../assets/img/gas-11kg.png";
import gas15kg from "../assets/img/gas-15kg.png";

const imagenes = {
  "gas-5kg": gas5kg,
  "gas-11kg": gas11kg,
  "gas-15kg": gas15kg,
};

const datos = [
  {
    id: "gas-5kg",
    codigo: "CL001",
    categoria: "Cilindros de Gas",
    nombre: "Cilindro de Gas 5 Kg",
    descripcion:
      "Cilindro de gas licuado de petróleo 5 kg. Para uso residencial (cocina, calefacción pequeña).",
    precio: 6500,
    precioComercial: 6000,
    stock: 80,
    oferta: false,
  },
  {
    id: "gas-11kg",
    codigo: "CL002",
    categoria: "Cilindros de Gas",
    nombre: "Cilindro de Gas 11 Kg",
    descripcion:
      "Cilindro estándar doméstico. El más utilizado en hogares chilenos. Compatible con reguladores estándar.",
    precio: 12000,
    precioComercial: 11000,
    stock: 200,
    oferta: false,
  },
  {
    id: "gas-15kg",
    codigo: "CL003",
    categoria: "Cilindros de Gas",
    nombre: "Cilindro de Gas 15 Kg",
    descripcion:
      "Cilindro de mayor capacidad para hogares de alto consumo o locales pequeños.",
    precio: 16000,
    precioComercial: 14500,
    stock: 90,
    oferta: false,
  },
  {
    id: "cl004",
    codigo: "CL004",
    categoria: "Cilindros de Gas",
    nombre: "Cilindro GLP 45 kg",
    descripcion:
      "Cilindro industrial. Uso comercial: restaurantes, talleres, calefacción de locales.",
    precio: 45000,
    precioComercial: 40000,
    stock: 30,
    oferta: false,
  },
  {
    id: "rg001",
    codigo: "RG001",
    categoria: "Reguladores",
    nombre: "Regulador doméstico estándar",
    descripcion:
      "Regulador de 1 etapa para cilindros 5, 11 y 15 kg. Presión de salida 28 mbar.",
    precio: 8990,
    precioComercial: 8200,
    stock: 45,
    oferta: false,
  },
  {
    id: "rg002",
    codigo: "RG002",
    categoria: "Reguladores",
    nombre: "Regulador de alta presión",
    descripcion:
      "Regulador para cocinas industriales o equipos de mayor consumo. Presión regulable.",
    precio: 18990,
    precioComercial: 17000,
    stock: 12,
    oferta: false,
  },
  {
    id: "rg003",
    codigo: "RG003",
    categoria: "Reguladores",
    nombre: "Regulador dual (2 salidas)",
    descripcion:
      "Permite conectar dos artefactos simultáneamente al mismo cilindro.",
    precio: 14990,
    precioComercial: 13500,
    stock: 18,
    oferta: false,
  },
  {
    id: "mg001",
    codigo: "MG001",
    categoria: "Mangueras y Conexiones",
    nombre: "Manguera gas 1.5 m",
    descripcion:
      "Manguera flexible homologada. Diámetro interior 9mm. Compatible con reguladores estándar.",
    precio: 3990,
    precioComercial: 3500,
    stock: 80,
    oferta: false,
  },
  {
    id: "mg002",
    codigo: "MG002",
    categoria: "Mangueras y Conexiones",
    nombre: "Manguera gas 3 m",
    descripcion:
      "Manguera larga para instalaciones donde el artefacto está alejado del cilindro.",
    precio: 6990,
    precioComercial: 6200,
    stock: 50,
    oferta: false,
  },
  {
    id: "mg003",
    codigo: "MG003",
    categoria: "Mangueras y Conexiones",
    nombre: "Abrazadera metálica",
    descripcion:
      "Abrazadera de acero para asegurar la conexión manguera-regulador y manguera-artefacto.",
    precio: 990,
    precioComercial: 800,
    stock: 200,
    oferta: false,
  },
  {
    id: "mg004",
    codigo: "MG004",
    categoria: "Mangueras y Conexiones",
    nombre: "Kit conexión completo (regulador + manguera 1.5m + abrazaderas)",
    descripcion: "Todo lo necesario para instalar un cilindro nuevo.",
    precio: 12990,
    precioComercial: 11500,
    stock: 25,
    oferta: false,
  },
  {
    id: "ac001",
    codigo: "AC001",
    categoria: "Accesorios",
    nombre: "Carro porta cilindro 11/15 kg",
    descripcion:
      "Carro metálico con ruedas para transportar cilindros dentro del hogar con seguridad.",
    precio: 12990,
    precioComercial: 11000,
    stock: 20,
    oferta: false,
  },
  {
    id: "ac002",
    codigo: "AC002",
    categoria: "Accesorios",
    nombre: "Tapa protectora para válvula",
    descripcion:
      "Tapa de plástico ABS para proteger la válvula del cilindro durante el transporte.",
    precio: 1490,
    precioComercial: 1200,
    stock: 60,
    oferta: false,
  },
  {
    id: "ac003",
    codigo: "AC003",
    categoria: "Accesorios",
    nombre: "Detector de gas a batería",
    descripcion:
      "Sensor electroquímico. Alarma sonora y visual ante fuga de gas GLP o metano.",
    precio: 19990,
    precioComercial: 17000,
    stock: 8,
    oferta: false,
  },
];

export const productos = datos.map((producto) => ({
  ...producto,
  imagen: imagenes[producto.id] || "",
}));
