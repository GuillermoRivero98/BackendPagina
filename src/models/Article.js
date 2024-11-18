const express = require('express');
const multer = require('multer'); // Para subir archivos
const pool = require('../db'); // Importa la conexión a PostgreSQL
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM articulos');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los artículos:', error);
        res.status(500).json({ message: 'Error al obtener los artículos' });
    }
});

router.post('/', upload.fields([{ name: 'pdf' }, { name: 'foto' }]), async (req, res) => {
    console.log('Datos recibidos en req.body:', req.body);
    console.log('Archivos recibidos en req.files:', req.files);

    const { titulo, contenido, autor } = req.body;
    const pdf = req.files['pdf'] ? req.files['pdf'][0].buffer : null;
    const foto = req.files['foto'] ? req.files['foto'][0].buffer : null;

    if (!titulo || !contenido || !autor) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO articulos (titulo, contenido, autor, pdf, foto) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [titulo, contenido, autor, pdf, foto]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear el artículo:', error);
        res.status(500).json({ message: 'Error al crear el artículo' });
    }
});

module.exports = router;
