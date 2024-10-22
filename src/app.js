const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const articlesRoutes = require('./routes/articles');

const app = express();
const PORT = 3001;

// Configuraciones de middleware
app.use(cors());
app.use(bodyParser.json());

// Servir la carpeta de archivos PDF
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usar el router para los artículos
app.use('/api/articles', articlesRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
