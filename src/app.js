const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const pool = require('./db'); // Conexión a PostgreSQL

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Importar rutas
const authRoutes = require('./routes/auth');
const articlesRoutes = require('./routes/articles');
const usersRoutes = require('./routes/users');

// Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/articles', articlesRoutes); // Rutas de artículos
app.use('/api/users', usersRoutes); // Rutas de usuarios

// Puerto
const PORT = process.env.PORT || 3001;

// Conexión a la base de datos
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error al conectar a PostgreSQL:', err);
        process.exit(1);
    } else {
        console.log('Conexión a PostgreSQL exitosa:', res.rows[0]);
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
