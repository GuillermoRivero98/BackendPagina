const express = require('express');
const multer = require('multer'); // Para subir archivos
const pool = require('../db'); // Importa la conexión a PostgreSQL
const router = express.Router();

// Configuración de multer para almacenar los archivos en la memoria
const storage = multer.memoryStorage(); // Cambiado a memoryStorage
const upload = multer({ storage: storage });

// Ruta para obtener todos los artículos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM articulos');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los artículos:', error);
        res.status(500).json({ message: 'Error al obtener los artículos' });
    }
});

// Ruta para crear un nuevo artículo con PDF y foto
router.post('/', upload.fields([{ name: 'pdf' }, { name: 'foto' }]), async (req, res) => {
    const { titulo, contenido, autor } = req.body;
    const pdf = req.files['pdf'] ? req.files['pdf'][0].buffer : null;  // Obtiene el archivo PDF como un buffer
    const foto = req.files['foto'] ? req.files['foto'][0].buffer : null; // Obtiene la imagen como un buffer

    console.log('Datos recibidos:', { titulo, contenido, autor });
    console.log('Tamaño del PDF:', pdf ? pdf.length : 'No hay PDF');
    console.log('Tamaño de la foto:', foto ? foto.length : 'No hay foto');

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
        console.error('Error al crear el artículo:', error);  // Esto mostrará el error completo
        res.status(500).json({ message: 'Error al crear el artículo' });
    }
});

// Ruta para obtener el PDF de un artículo por su ID
router.get('/:id/pdf', async (req, res) => {
    try {
        const result = await pool.query('SELECT pdf FROM articulos WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'PDF no encontrado' });
        }

        const pdf = result.rows[0].pdf;
        res.setHeader('Content-Type', 'application/pdf'); // Establece el tipo de contenido para PDF
        res.send(pdf);
    } catch (error) {
        console.error('Error al obtener el PDF:', error);
        res.status(500).json({ message: 'Error al obtener el PDF' });
    }
});

// Ruta para obtener la foto de un artículo por su ID
router.get('/:id/foto', async (req, res) => {
    try {
        const result = await pool.query('SELECT foto FROM articulos WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Foto no encontrada' });
        }

        const foto = result.rows[0].foto;
        res.setHeader('Content-Type', 'image/jpeg'); // Cambia esto según el formato de la imagen (jpeg, png, etc.)
        res.send(foto);
    } catch (error) {
        console.error('Error al obtener la foto:', error);
        res.status(500).json({ message: 'Error al obtener la foto' });
    }
});

module.exports = router;
