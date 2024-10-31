const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // Importar el middleware CORS
const articlesRoutes = require('./routes/articles'); // Asegúrate de que esta ruta sea correcta
require('dotenv').config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para permitir CORS
app.use(cors()); // Esto permitirá todas las solicitudes de orígenes cruzados
// Nota: Considera restringir el origen para producción
// app.use(cors({ origin: 'http://tu-dominio.com' }));

// Middleware para analizar JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a MongoDB');
})
.catch(err => {
  console.error('Error de conexión a MongoDB:', err);
});

// Rutas para artículos
app.use('/api/articles', articlesRoutes);

// Ruta para la página principal (opcional)
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Artículos');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
