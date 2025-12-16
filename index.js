// Imports
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const path = require('path');

// Import module for async database
const mysql = require('mysql2/promise');

// Create the express application object
const app = express();
const port = 8000;


// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

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

// Create a session
app.use(session({
    secret: process.env.HEALTH_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// Create an input sanitizer
app.use(expressSanitizer());

// Define application-specific data
app.locals.appData = {appName: "General Practice"};

// Load the route handlers
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

const patientsRoutes = require('./routes/patients');
app.use('/patients', patientsRoutes);

const doctorsRoutes = require('./routes/doctors');
app.use('/doctors', doctorsRoutes);

const appointmentsRoutes = require('./routes/appointments');
app.use('/appointments', appointmentsRoutes);

// Start the web app listening
app.listen(port, () => console.log(`App listening on port ${port}!`));
