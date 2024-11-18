const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { nombre, email, password, clase_id } = req.body;
    if (!nombre || !email || !password || !clase_id) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, password, clase_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, hashedPassword, clase_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        const token = jwt.sign(
            { id: user.id, rol: user.rol, clase_id: user.clase_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

module.exports = router;