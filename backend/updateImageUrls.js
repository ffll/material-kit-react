const mongoose = require('mongoose');
require('dotenv').config(); // Asegúrate de tener tus variables de entorno para la conexión a MongoDB

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  updateImageUrls();
});

const Post = require('./models/Post'); // Asegúrate de que la ruta al modelo Post es correcta

async function updateImageUrls() {
  try {
    const result = await Post.updateMany(
      { imageUrl: { $regex: '/imagenes/' } }, // Filtra documentos que tengan '/imagenes/' en imageUrl
      [{ $set: { imageUrl: { $replaceOne: { input: '$imageUrl', find: '/imagenes/', replacement: '/images/' } } } }] // Reemplaza '/imagenes/' por '/images/'
    );

    console.log(`Successfully updated ${result.nModified} documents.`);
    db.close();
  } catch (err) {
    console.error('Error updating image URLs:', err);
    db.close();
  }
}
