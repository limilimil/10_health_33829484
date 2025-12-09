// Imports
const express = require('express');
const ejs = require('ejs');

const path = require('path');

// Create the express application object
const app = express();
const port = 8000;

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')));

// Load the route handlers
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

const patientsRoutes = require('./routes/patients');
app.use('/patients', patientsRoutes);

const doctorsRoutes = require('./routes/doctors');
app.use('/doctors', doctorsRoutes);

// Start the web app listening
app.listen(port, () => console.log(`App listening on port ${port}!`));
