// src/data/productos.js
export const productos = [
    {
        codigo: "CL001",
        nombre: "Cilindro GLP 5 kg",
        categoria: "Cilindros de Gas",
        descripcion: "Para cocina y calefacción pequeña en hogares de bajo consumo.",
        descripcionLarga:
            "Cilindro de gas licuado de petróleo de 5 kg, pensado para hogares de bajo consumo. Perfecto para cocina, calefacción pequeña o artefactos de uso ocasional. Fabricado bajo normativa vigente y con válvula de seguridad.",
        precio: 6500,
        stock: 80,
        stockCritico: 10,
        imagen: "/img/gas-5kg.png"
    },
    {
        codigo: "CL002",
        nombre: "Cilindro GLP 11 kg",
        categoria: "Cilindros de Gas",
        descripcion: "Cilindro estándar doméstico, el más utilizado en los hogares.",
        descripcionLarga:
            "El cilindro más utilizado en los hogares chilenos. Con 11 kg de capacidad es ideal para el consumo diario de una familia promedio, incluyendo cocina y calefacción. Compatible con reguladores estándar.",
        precio: 12000,
        stock: 200,
        stockCritico: 20,
        imagen: "/img/gas-11kg.png"
    },
    {
        codigo: "CL003",
        nombre: "Cilindro GLP 15 kg",
        categoria: "Cilindros de Gas",
        descripcion: "Mayor capacidad para hogares de alto consumo o locales pequeños.",
        descripcionLarga:
            "Cilindro de mayor capacidad, recomendado para hogares con alto consumo o locales pequeños. Con 15 kg de gas licuado se reduce la frecuencia de recargas y es ideal para calefacción central o varios artefactos simultáneos.",
        precio: 16000,
        stock: 90,
        stockCritico: 15,
        imagen: "/img/gas-15kg.png"
    },
    {
        codigo: "CL004",
        nombre: "Cilindro GLP 45 kg",
        categoria: "Cilindros de Gas",
        descripcion: "Cilindro industrial para restaurantes, talleres y locales.",
        descripcionLarga:
            "Cilindro industrial de 45 kg. Uso comercial: restaurantes, talleres y calefacción de locales. Pensado para clientes comerciales con alto consumo de gas licuado.",
        precio: 45000,
        stock: 30,
        stockCritico: 5,
        imagen: "/img/producto-generico.svg"
    },
    {
        codigo: "RG001",
        nombre: "Regulador doméstico estándar",
        categoria: "Reguladores",
        descripcion: "Regulador de 1 etapa para cilindros de 5, 11 y 15 kg.",
        descripcionLarga:
            "Regulador de 1 etapa para cilindros de 5, 11 y 15 kg. Presión de salida de 28 mbar. Compatible con los reguladores y mangueras estándar del mercado.",
        precio: 8990,
        stock: 45,
        stockCritico: 8,
        imagen: "/img/producto-generico.svg"
    },
    {
        codigo: "RG002",
        nombre: "Regulador de alta presión",
        categoria: "Reguladores",
        descripcion: "Para cocinas industriales o equipos de mayor consumo.",
        descripcionLarga:
            "Regulador de alta presión para cocinas industriales o equipos de mayor consumo. Presión regulable según la necesidad del artefacto conectado.",
        precio: 18990,
        stock: 12,
        stockCritico: 3,
        imagen: "/img/producto-generico.svg"
    },
    {
        codigo: "RG003",
        nombre: "Regulador dual (2 salidas)",
        categoria: "Reguladores",
        descripcion: "Permite conectar dos artefactos al mismo cilindro.",
        descripcionLarga:
            "Regulador dual con dos salidas. Permite conectar dos artefactos simultáneamente al mismo cilindro, ideal para hogares con varios equipos a gas.",
        precio: 14990,
        stock: 18,
        stockCritico: 4,
        imagen: "/img/producto-generico.svg"
    },
    {
        codigo: "MG001",
        nombre: "Manguera gas 1.5 m",
        categoria: "Mangueras y Conexiones",
        descripcion: "Manguera flexible homologada con diámetro interior de 9 mm.",
        descripcionLarga:
            "Manguera flexible homologada de 1.5 metros. Diámetro interior de 9 mm. Compatible con reguladores estándar, ideal para distancias cortas entre el cilindro y el artefacto.",
        precio: 3990,
        stock: 80,
        stockCritico: 15,
        imagen: "/img/producto-generico.svg"
    },
    {
        codigo: "MG002",
        nombre: "Manguera gas 3 m",
        categoria: "Mangueras y Conexiones",
        descripcion: "Manguera larga cuando el artefacto está alejado del cilindro.",
        descripcionLarga:
            "Manguera larga de 3 metros para instalaciones donde el artefacto está alejado del cilindro. Flexible y homologada con las normas de seguridad vigentes.",
        precio: 6990,
        stock: 50,
        stockCritico: 10,
        imagen: "/img/producto-generico.svg"
    },
    {
        codigo: "MG003",
        nombre: "Abrazadera metálica",
        categoria: "Mangueras y Conexiones",
        descripcion: "Abrazadera de acero para asegurar conexiones.",
        descripcionLarga:
            "Abrazadera de acero para asegurar la conexión manguera-regulador y manguera-artefacto. Elemento de seguridad esencial en toda instalación de gas.",
        precio: 990,
        stock: 200,
        stockCritico: 30,
        imagen: "/img/producto-generico.svg"
    },
    {
        codigo: "MG004",
        nombre: "Kit conexión completo",
        categoria: "Mangueras y Conexiones",
        descripcion: "Regulador + manguera 1.5 m + abrazaderas para instalar un cilindro.",
        descripcionLarga:
            "Kit con todo lo necesario para instalar un cilindro nuevo: regulador, manguera de 1.5 metros y abrazaderas. Ahorra tiempo y asegura una instalación correcta.",
        precio: 12990,
        stock: 25,
        stockCritico: 5,
        imagen: "/img/producto-generico.svg"
    },
    {
        codigo: "AC001",
        nombre: "Carro porta cilindro 11/15 kg",
        categoria: "Accesorios",
        descripcion: "Carro metálico con ruedas para transportar cilindros.",
        descripcionLarga:
            "Carro metálico con ruedas para transportar cilindros de 11 y 15 kg dentro del hogar con seguridad y sin esfuerzo.",
        precio: 12990,
        stock: 20,
        stockCritico: 4,
        imagen: "/img/producto-generico.svg"
    },
    {
        codigo: "AC002",
        nombre: "Tapa protectora para válvula",
        categoria: "Accesorios",
        descripcion: "Tapa de plástico ABS para proteger la válvula en el transporte.",
        descripcionLarga:
            "Tapa de plástico ABS para proteger la válvula del cilindro durante el transporte o almacenamiento. Evita daños y mantiene la válvula limpia.",
        precio: 1490,
        stock: 60,
        stockCritico: 12,
        imagen: "/img/producto-generico.svg"
    },
    {
        codigo: "AC003",
        nombre: "Detector de gas a batería",
        categoria: "Accesorios",
        descripcion: "Sensor electroquímico con alarma ante fugas de gas GLP o metano.",
        descripcionLarga:
            "Detector de gas a batería con sensor electroquímico. Alarma sonora y visual ante fuga de gas GLP o metano. Elemento de seguridad recomendado para todos los hogares.",
        precio: 19990,
        stock: 8,
        stockCritico: 2,
        imagen: "/img/producto-generico.svg"
    }
];