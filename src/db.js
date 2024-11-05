// src/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,         // usuario de PostgreSQL
    host: process.env.PG_HOST,         // host de PostgreSQL (generalmente "localhost")
    database: process.env.PG_DATABASE, // nombre de la base de datos
    password: process.env.PG_PASSWORD, // contraseña de PostgreSQL
    port: process.env.PG_PORT || 5432, // puerto de PostgreSQL, por defecto es 5432
});
console.log('Usuario:', process.env.PG_USER);
console.log('Base de datos:', process.env.PG_DATABASE);

module.exports = pool;
