// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');  // Importar la conexión a PostgreSQL
require('dotenv').config();

const app = express();  // Inicializar `app` antes de usarlo
const PORT = process.env.PORT || 3001;
const articlesRoutes = require('./routes/articles');

// Prueba de conexión a PostgreSQL
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error al conectar a PostgreSQL:', err);
    } else {
        console.log('Conexión a PostgreSQL exitosa:', res.rows[0]);
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos

// Usar la ruta de artículos
app.use('/api/articles', articlesRoutes);

// Ruta de prueba para obtener todos los artículos desde PostgreSQL
app.get('/api/articles', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM articulos'); // Asegúrate de que la tabla se llama "articulos"
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener artículos:', err);
        res.status(500).json({ error: 'Error al obtener artículos' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
