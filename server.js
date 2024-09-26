const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

//app.use(express.static(path.join(__dirname, '../frontend/public')));

let articles = [];

app.get('/articles', (req, res) => {
    res.json(articles);
});

app.get('/articles/:id', (req, res) => {
    const articleId = req.params.id;
    const article = articles.find((article) => article.id === articleId);

    if (!article) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    res.json(article);
});

app.post('/articles', (req, res) => {
    console.log(req.body);
    const newArticle = req.body;
    if (!newArticle.title || !newArticle.author || !newArticle.content) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    newArticle.id = uuidv4();
    articles.push(newArticle);
    return res.status(201).json(newArticle);
});

app.put('/articles/:id', (req, res) => {
    const articleId = req.params.id;
    const updatedArticle = req.body;

    const articleIndex = articles.findIndex((article) => article.id === articleId);
    if (articleIndex === -1) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    articles[articleIndex] = { ...articles[articleIndex], ...updatedArticle };
    res.json(articles[articleIndex]);
});


app.delete('/articles/:id', (req, res) => {
    const articleId = req.params.id;
    const articleIndex = articles.findIndex((article) => article.id === articleId);

    if (articleIndex === -1) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    articles.splice(articleIndex, 1);
    res.status(204).send();
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

