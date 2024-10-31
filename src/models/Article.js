const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    fecha_publicacion: {
        type: Date,
        default: Date.now,
    },
    filePath: {
        type: String,
        required: true,  // Asegúrate de que siempre tienes un valor para filePath
    },
});

module.exports = mongoose.model('Article', articleSchema);
