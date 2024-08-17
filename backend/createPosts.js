require('dotenv').config(); // Cargar las variables de entorno al inicio del script

const mongoose = require('mongoose');
const Post = require('./models/Post'); // Asegúrate de que la ruta sea correcta

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.error(err));

const createPosts = async () => {
  try {
    const posts = [
      {
        title: 'INCENDIO',
        description: `Ubicación\nMetros cuadrados cubiertos\nTipo de construcción\nActividad`,
        imageUrl: '/assets/images/incendio.jpg',
      },
      {
        title: 'COMBINADO FAMILIAR',
        description: `Ubicación\nMetros cuadrados cubiertos\nTipo de construcción\nOcupación (permanente / transitoria / de alquiler)\nValor del electrodoméstico más caro\nMedida del cristal más grande`,
        imageUrl: '/assets/images/combinado_familiar.jpg',
      },
      {
        title: 'INTEGRAL DE CONSORCIOS',
        description: `Cuit\nUbicación\nMetros cuadrados cubiertos o reglamento\nTipo de construcción\nCantidad de ascensores\nCochera\nCaldera`,
        imageUrl: '/assets/images/integral_de_consorcios.jpg',
      },
      {
        title: 'INTEGRAL DE COMERCIO',
        description: `Cuit\nUbicación\nActividad\nMetros cuadrados cubiertos\nTipo de construcción\nValor en mercadería\nCarteles / Letreros`,
        imageUrl: '/assets/images/integral_de_comercio.jpg',
      },
      {
        title: 'AUTOMOTORES',
        description: `Año\nMarca y modelo tal cual figura en la cedula\nLocalidad`,
        imageUrl: '/assets/images/automotores.jpg',
      },
      {
        title: 'TRANSPORTE DE MERCADERIAS (TERRESTRE)',
        description: `Cuit transportista\nTipo y suma asegurada de la mercadería\nOrigen del transito\nLugar de entrega`,
        imageUrl: '/assets/images/transporte_mercaderias.jpg',
      },
      {
        title: 'TRANSPORTE DE MERCADERIAS (TERRESTRE – Flotante anual)',
        description: `Cuit transportista\nTipo de la mercadería\nSuma máxima estimada por viaje\nValor de transporte anual\nZona de trabajo`,
        imageUrl: '/assets/images/transporte_flotante_anual.jpg',
      },
      {
        title: 'SEGURO TECNICO – EQUIPOS ELECTRONICOS',
        description: `Detalle de equipo/s\nSuma asegurada\nCobertura requerida\nVigencia`,
        imageUrl: '/assets/images/seguro_equipos_electronicos.jpg',
      },
      {
        title: 'EMBARCACIONES DE PLACER',
        description: `Tipo de embarcación (lancha a motor, semirrígido, crucero, velero, moto de agua)\nAño\nMaterial\nSuma asegurada\nUbicación actual\nZona de navegación`,
        imageUrl: '/assets/images/embarcaciones.jpg',
      },
      {
        title: 'ACCIDENTES PERSONALES',
        description: `Vigencia\nActividad\nCantidad de personas\nSuma asegurada`,
        imageUrl: '/assets/images/accidentes_personales.jpg',
      },
      {
        title: 'ART',
        description: `Formulario 931`,
        imageUrl: '/assets/images/art.jpg',
      },
      {
        title: 'VIDA OBLIGATORIO Y VIDA COLECTIVO',
        description: `Recibo de sueldo y fecha de nacimiento de cada empleado`,
        imageUrl: '/assets/images/vida_obligatorio.jpg',
      },
      {
        title: 'RESPONSABILIDAD CIVIL PROFESIONAL',
        description: `Especialidad\nJurisdicción\nCategoría ante IVA\nSuma asegurada\nJefe de equipo`,
        imageUrl: '/assets/images/responsabilidad_civil_profesional.jpg',
      },
      {
        title: 'CAUCION',
        description: `INFORMACION REQUERIDA PARA ANALISIS DE CLIENTES Y COTIZACION / EMISION DE POLIZAS\nBalance, CUIT, Datos fiscales del Tomador.\nDocumentación de donde surge la obligación (Pliego, Contrato, Orden de Compra, etc.).\nIdentificar objeto, garantías requeridas, monto, plazos, etc.\nExperiencia y trayectoria del Tomador.\nConvenio global (certificado por escribano).\nEn caso de ser necesario, la Compañía Aseguradora podrá solicitar:\nVentas post último balance.\nAval/es (certificado por escribano).\nManifestación de bienes (certificado por contador).`,
        imageUrl: '/assets/images/caucion.jpg',
      },
      {
        title: 'AGRO',
        description: `Razón Social\nCUIT\nCultivo\nCantidad de hectáreas\nValor por hectárea($/u$s)\nZona (Código Postal)`,
        imageUrl: '/assets/images/agro.jpg',
      },
    ];

    // Insertar los posts en la base de datos
    await Post.insertMany(posts);
    console.log('¡Datos insertados con éxito!');
  } catch (error) {
    console.error('Error insertando los datos:', error);
  } finally {
    mongoose.connection.close(); // Cerrar la conexión a la base de datos
  }
};

// Ejecutar la función para crear los posts
createPosts();


