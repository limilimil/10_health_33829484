// Create a new router
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const patients = require('../models/patients');
const redirectLogin = require('../middleware/redirectLogin');

const saltRounds = 10;

// Route handlers

// Route for patient landing page
router.get('/', redirectLogin, async function(req, res, next) {
    let patientName = ""; // Blank name in case of failure

    // Get the patients first name to display on the page
    if(req.session.userID) {
        try {
            patientName = await patients.getName(req.session.userID);
        } catch (err) {
            console.error(err);
        }
    }
    res.render('patients.ejs', { patientName } );
});

router.get('/login', function(req, res, next) {
    res.render('login.ejs');
});

router.post('/login', async function(req, res, next) {
    const username = req.body.username;
    const result = await patients.getPatientAuth(username);
    if (result.length == 0) {
        res.send("Login failed. Please check your credentials and try again.");
    } else {
        const hashedPassword = result[0].hashed_password;
        const match = await bcrypt.compare(req.body.password, hashedPassword);
        if (match) {
            req.session.userID = req.body.username;
            res.redirect(process.env.HEALTH_BASE_PATH + '/patients/'); // Successful logins redirects to the landing page
        } else {
            res.send("Login failed. Please check your credentials and try again.");
        }
    }
});

router.get('/register', function(req, res, next) {
    res.render('register.ejs');
});

router.post('/registered', async (req, res, next) => {
    const plainPassword = req.body.password;
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        const newUser = [req.body.first, req.body.last, req.body.email, req.body.nhs, req.body.username, hashedPassword];
        const result = await patients.insert(newUser);
        res.send("Patient registered");
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// Export the router object so index.js can access it
module.exports = router;