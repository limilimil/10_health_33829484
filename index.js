// Imports
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mysql = require('mysql2');

// Create the express application object
const app = express();
const port = 8000;


// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser 
app.use(express.urlencoded({ extended: true }));

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')));

// Define the database connection pool
const db = mysql.createPool({
    host: process.env.HEALTH_HOST,
    user: process.env.HEALTH_USER,
    password: process.env.HEALTH_PASSWORD,
    database: process.env.HEALTH_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

// Load the route handlers
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

const patientsRoutes = require('./routes/patients');
app.use('/patients', patientsRoutes);

const doctorsRoutes = require('./routes/doctors');
app.use('/doctors', doctorsRoutes);

// Start the web app listening
app.listen(port, () => console.log(`App listening on port ${port}!`));
