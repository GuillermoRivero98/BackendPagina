const express = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configuración de Multer para almacenar los archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta de destino para los archivos
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname)); // Nombre único para el archivo
    }
});

const upload = multer({ storage: storage });

let articles = []; // Lista de artículos en memoria (puedes cambiarlo si usas una base de datos)

// Ruta para subir un artículo con PDF
router.post('/', upload.single('pdf'), (req, res) => {
    try {
        const { title, author, fecha_publicacion } = req.body;

        // Verificación de campos obligatorios
        if (!title) {
            return res.status(400).json({ message: 'El campo título es obligatorio' });
        }
        if (!author) {
            return res.status(400).json({ message: 'El campo autor es obligatorio' });
        }
        if (!fecha_publicacion) {
            return res.status(400).json({ message: 'El campo fecha de publicación es obligatorio' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'El archivo PDF es obligatorio' });
        }

        // Crear el nuevo artículo
        const newArticle = {
            id: uuidv4(),
            title,
            author,
            pdfPath: `/uploads/${req.file.filename}`,  // Ruta del PDF
            fecha_publicacion
        };

        // Guardar el artículo en la lista
        articles.push(newArticle);

        res.status(201).json(newArticle); // Respuesta exitosa con el nuevo artículo
    } catch (error) {
        console.error('Error al crear el artículo:', error);
        res.status(500).json({ message: 'Error al crear el artículo' });
    }
});

// Ruta para obtener todos los artículos
router.get('/', (req, res) => {
    res.json(articles); // Devuelve la lista de artículos
});

// Ruta para obtener un artículo por ID
router.get('/:id', (req, res) => {
    const article = articles.find(a => a.id === req.params.id);
    if (!article) {
        return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.json(article);
});

// Ruta para eliminar un artículo por ID
router.delete('/:id', (req, res) => {
    const articleIndex = articles.findIndex(a => a.id === req.params.id);
    if (articleIndex === -1) {
        return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    
    articles.splice(articleIndex, 1); // Elimina el artículo de la lista
    res.status(200).json({ message: 'Artículo eliminado con éxito' });
});

module.exports = router;
