const express = require('express');
const Article = require('../models/Article'); // Modelo de artículos
const multer = require('multer'); // Para subir archivos
const path = require('path');
const router = express.Router();

// Configuración de multer para almacenar los archivos en la carpeta "uploads"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Ruta para obtener todos los artículos
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (error) {
        console.error('Error al obtener los artículos:', error);
        res.status(500).json({ message: 'Error al obtener los artículos' });
    }
});

// Ruta para crear un nuevo artículo con PDF
router.post('/', upload.single('pdf'), async (req, res) => {
    const { title, content, author } = req.body;
    const filePath = `/uploads/${req.file.filename}`; // Asegúrate de que esta ruta es correcta

    if (!title || !content || !author) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const newArticle = new Article({ title, content, author, filePath });

    try {
        const savedArticle = await newArticle.save();
        res.status(201).json(savedArticle);
    } catch (error) {
        console.error('Error al crear el artículo:', error);
        res.status(500).json({ message: 'Error al crear el artículo' });
    }
});

module.exports = router;
