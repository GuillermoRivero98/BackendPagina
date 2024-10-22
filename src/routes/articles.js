const express = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configuración de Multer para almacenar los archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname)); // Nombre único para el archivo
    }
});

const upload = multer({ storage: storage });

let articles = []; // Lista de artículos en memoria

// Ruta para subir un artículo con PDF
router.post('/', upload.single('pdf'), (req, res) => {
    try {
        const { title, author, fecha_publicacion, summary } = req.body;

        // Verificación de campos obligatorios
        if (!title || !author || !fecha_publicacion || !summary || !req.file) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear el nuevo artículo
        const newArticle = {
            id: uuidv4(),
            title,
            author,
            summary,  // Resumen del contenido
            pdfPath: `/uploads/${req.file.filename}`,  // Ruta del PDF
            fecha_publicacion
        };

        // Guardar el artículo en la lista
        articles.push(newArticle);
        res.status(201).json(newArticle);
    } catch (error) {
        console.error('Error al crear el artículo:', error);
        res.status(500).json({ message: 'Error al crear el artículo' });
    }
});

// Ruta para obtener todos los artículos
router.get('/', (req, res) => {
    res.json(articles);
});

// Ruta para obtener un artículo por ID
router.get('/:id', (req, res) => {
    const article = articles.find(a => a.id === req.params.id);
    if (!article) {
        return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.json(article);
});

module.exports = router;
