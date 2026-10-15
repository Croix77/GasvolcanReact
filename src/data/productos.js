const gas5kg = '/img/gas-5kg.png';
const gas11kg = '/img/gas-11kg.png';
const gas15kg = '/img/gas-15kg.png';

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
    oferta: true,
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
    oferta: true,
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
    oferta: true,
  },
];

const detalles = {
  CL001: {
    descripcionLarga:
      "Cilindro de gas licuado de petróleo de 5 kg, pensado para hogares de bajo consumo. Perfecto para cocina, calefacción pequeña o artefactos de uso ocasional. Fabricado bajo normativa vigente y con válvula de seguridad.",
    stockCritico: 10,
  },
  CL002: {
    descripcionLarga:
      "El cilindro más utilizado en los hogares chilenos. Con 11 kg de capacidad es ideal para el consumo diario de una familia promedio, incluyendo cocina y calefacción. Compatible con reguladores estándar.",
    stockCritico: 20,
  },
  CL003: {
    descripcionLarga:
      "Cilindro de mayor capacidad, recomendado para hogares con alto consumo o locales pequeños. Con 15 kg de gas licuado se reduce la frecuencia de recargas y es ideal para calefacción central o varios artefactos simultáneos.",
    stockCritico: 15,
  },
  CL004: {
    descripcionLarga:
      "Cilindro industrial de 45 kg. Uso comercial: restaurantes, talleres y calefacción de locales. Pensado para clientes comerciales con alto consumo de gas licuado.",
    stockCritico: 5,
  },
  RG001: {
    descripcionLarga:
      "Regulador de 1 etapa para cilindros de 5, 11 y 15 kg. Presión de salida de 28 mbar. Compatible con los reguladores y mangueras estándar del mercado.",
    stockCritico: 8,
  },
  RG002: {
    descripcionLarga:
      "Regulador de alta presión para cocinas industriales o equipos de mayor consumo. Presión regulable según la necesidad del artefacto conectado.",
    stockCritico: 3,
  },
  RG003: {
    descripcionLarga:
      "Regulador dual con dos salidas. Permite conectar dos artefactos simultáneamente al mismo cilindro, ideal para hogares con varios equipos a gas.",
    stockCritico: 4,
  },
  MG001: {
    descripcionLarga:
      "Manguera flexible homologada de 1.5 metros. Diámetro interior de 9 mm. Compatible con reguladores estándar, ideal para distancias cortas entre el cilindro y el artefacto.",
    stockCritico: 15,
  },
  MG002: {
    descripcionLarga:
      "Manguera larga de 3 metros para instalaciones donde el artefacto está alejado del cilindro. Flexible y homologada con las normas de seguridad vigentes.",
    stockCritico: 10,
  },
  MG003: {
    descripcionLarga:
      "Abrazadera de acero para asegurar la conexión manguera-regulador y manguera-artefacto. Elemento de seguridad esencial en toda instalación de gas.",
    stockCritico: 30,
  },
  MG004: {
    descripcionLarga:
      "Kit con todo lo necesario para instalar un cilindro nuevo: regulador, manguera de 1.5 metros y abrazaderas. Ahorra tiempo y asegura una instalación correcta.",
    stockCritico: 5,
  },
  AC001: {
    descripcionLarga:
      "Carro metálico con ruedas para transportar cilindros de 11 y 15 kg dentro del hogar con seguridad y sin esfuerzo.",
    stockCritico: 4,
  },
  AC002: {
    descripcionLarga:
      "Tapa de plástico ABS para proteger la válvula del cilindro durante el transporte o almacenamiento. Evita daños y mantiene la válvula limpia.",
    stockCritico: 12,
  },
  AC003: {
    descripcionLarga:
      "Detector de gas a batería con sensor electroquímico. Alarma sonora y visual ante fuga de gas GLP o metano. Elemento de seguridad recomendado para todos los hogares.",
    stockCritico: 2,
  },
};

export const productos = datos.map((producto) => ({
  ...producto,
  ...detalles[producto.codigo],
  imagen: imagenes[producto.id] || "",
}));
