const express = require('express');
const Article = require('../models/Article'); // Asegúrate de que la ruta sea correcta
const router = express.Router();

// Ruta para obtener todos los artículos
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find(); // Obtener todos los artículos
        res.json(articles); // Enviar la lista de artículos
    } catch (error) {
        console.error('Error al obtener los artículos:', error);
        res.status(500).json({ message: 'Error al obtener los artículos' });
    }
});

// Ruta para crear un nuevo artículo
router.post('/', async (req, res) => {
    const { title, content, author, filePath } = req.body; // Asegúrate de que estos campos estén en el cuerpo de la solicitud
    const newArticle = new Article({ title, content, author, filePath });

    try {
        await newArticle.save();
        res.status(201).json(newArticle);
    } catch (error) {
        console.error('Error al crear el artículo:', error);
        res.status(500).json({ message: 'Error al crear el artículo' });
    }
});

// Exportar el router
module.exports = router;
