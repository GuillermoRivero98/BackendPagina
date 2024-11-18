const express = require('express');
const pool = require('../db'); // Conexión a PostgreSQL
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');

// Configura almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware para proteger rutas
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Acceso denegado' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

// Ruta protegida para subir artículos
router.post('/', authenticateToken, upload.fields([{ name: 'pdf' }, { name: 'foto' }]), async (req, res) => {
    const { titulo, contenido, autor, clase_id } = req.body;

    if (req.user.clase_id !== parseInt(clase_id) && req.user.rol !== 'administrador') {
        return res.status(403).json({ message: 'No tienes permiso para subir artículos a esta clase' });
    }

    const pdf = req.files['pdf'] ? req.files['pdf'][0].buffer : null;
    const foto = req.files['foto'] ? req.files['foto'][0].buffer : null;

    if (!titulo || !contenido || !autor || !clase_id) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO articulos (titulo, contenido, autor, clase, pdf, foto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [titulo, contenido, autor, clase_id, pdf, foto]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear el artículo en la base de datos:', error);
        res.status(500).json({ message: 'Error al crear el artículo en la base de datos' });
    }
});

// Ruta para obtener artículos por clase
router.get('/class/:className', async (req, res) => {
    const { className } = req.params; // Obtiene la clase de la solicitud
    console.log(`Clase solicitada: ${className}`); // Para depuración

    try {
        const result = await pool.query(
            'SELECT * FROM articulos WHERE clase = $1',
            [className]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: `No se encontraron artículos para la clase ${className}` });
        }
        res.json(result.rows);
    } catch (error) {
        console.error(`Error al obtener artículos de la clase ${className}:`, error);
        res.status(500).json({ message: `Error al obtener artículos de la clase ${className}` });
    }
});

// Ruta para obtener la foto de un artículo por su ID
router.get('/:id/foto', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT foto FROM articulos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        const foto = result.rows[0].foto;
        if (!foto) {
            return res.status(404).json({ message: 'Foto no disponible' });
        }

        res.set('Content-Type', 'image/jpeg'); // Asegúrate de que el tipo MIME sea correcto
        res.send(foto);
    } catch (error) {
        console.error('Error al obtener la foto del artículo:', error);
        res.status(500).json({ message: 'Error al obtener la foto del artículo' });
    }
});

// Ruta para obtener el PDF de un artículo por su ID
router.get('/:id/pdf', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT pdf FROM articulos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        const pdf = result.rows[0].pdf;
        if (!pdf) {
            return res.status(404).json({ message: 'PDF no disponible' });
        }

        res.set('Content-Type', 'application/pdf');
        res.send(pdf);
    } catch (error) {
        console.error('Error al obtener el PDF del artículo:', error);
        res.status(500).json({ message: 'Error al obtener el PDF del artículo' });
    }
});

module.exports = router;
