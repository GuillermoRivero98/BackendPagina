const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

let articles = [
    {
        id: uuidv4(), 
        title: "La Importancia de la Lectura en la Infancia",
        content: "La lectura es fundamental en el desarrollo cognitivo y emocional de los niños. Fomenta la imaginación y mejora la concentración.",
        author: "María López",
        fecha_publicacion: "2024-10-10"
    },
    {
        id: uuidv4(),
        title: "Nutrición Balanceada para Niños",
        content: "Una alimentación equilibrada es clave para el crecimiento saludable de los niños. Incluye frutas, verduras, proteínas y carbohidratos en su dieta.",
        author: "Juan Pérez",
        fecha_publicacion: "2024-10-15"
    },
    {
        id: uuidv4(),
        title: "Actividades Creativas para el Desarrollo Infantil",
        content: "Las actividades creativas, como el arte y la música, son esenciales para el desarrollo emocional y social de los niños.",
        author: "Ana García",
        fecha_publicacion: "2024-10-20"
    },
    {
        id: uuidv4(),
        title: "La Importancia del Juego en el Aprendizaje",
        content: "El juego es una herramienta fundamental para el aprendizaje en la infancia, ya que permite a los niños explorar y comprender el mundo que les rodea.",
        author: "Carlos Fernández",
        fecha_publicacion: "2024-10-22"
    },
    {
        id: uuidv4(),
        title: "La Tecnología y los Niños",
        content: "La tecnología puede ser una aliada en la educación infantil si se utiliza de manera adecuada. Es importante establecer límites y promover el uso responsable.",
        author: "Laura Martínez",
        fecha_publicacion: "2024-10-25"
    }
];

router.get('/', (req, res) => {
    res.json(articles);
});

router.get('/:id', (req, res) => {
    const articleId = req.params.id;
    const article = articles.find((article) => article.id === articleId);

    if (!article) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    res.json(article);
});

router.post('/', (req, res) => {
    const newArticle = req.body;
    if (!newArticle.title || !newArticle.author || !newArticle.content) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    newArticle.id = uuidv4();
    articles.push(newArticle);
    return res.status(201).json(newArticle);
});

router.put('/:id', (req, res) => {
    const articleId = req.params.id;
    const updatedArticle = req.body;

    const articleIndex = articles.findIndex((article) => article.id === articleId);
    if (articleIndex === -1) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    articles[articleIndex] = { ...articles[articleIndex], ...updatedArticle };
    res.json(articles[articleIndex]);
});

router.delete('/:id', (req, res) => {
    const articleId = req.params.id;
    const articleIndex = articles.findIndex((article) => article.id === articleId);

    if (articleIndex === -1) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    articles.splice(articleIndex, 1);
    res.status(204).send();
});

module.exports = router;
