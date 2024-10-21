const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

const articlesRoutes = require('./routes/articles');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/articles', articlesRoutes);  

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); 
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
