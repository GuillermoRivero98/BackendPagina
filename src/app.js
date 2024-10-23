const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const articlesRoutes = require('./routes/articles');
const dotenv = require('dotenv');

dotenv.config(); // Carga las variables de entorno

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI; // Carga la URI desde el archivo .env

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// Usar las rutas de artículos
app.use('/api/articles', articlesRoutes);

// Conectar a MongoDB
mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log('Conexión a MongoDB exitosa');
})
.catch(err => {
    console.error('Error al conectar a MongoDB:', err.message);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
