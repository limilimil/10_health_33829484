// Create a new router
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const doctorsModel = require('../models/doctorsModel');

// Route handlers
router.get('/login', (req, res, next) => {
    res.render('doctor_login.ejs');
});

router.post('/login', async (req, res, next) => {
    const username = req.body.username;
    const result = await doctorsModel.getDoctorsAuth(username);
    if (result.length == 0) {
        res.send("Login failed. Please check your credentials and try again.");
    } else {
        const hashedPassword = result[0].hashed_password;
        const match = await bcrypt.compare(req.body.password, hashedPassword);
        if (match) {
            req.session.adminID = req.body.username;
            res.redirect(process.env.HEALTH_BASE_PATH + '/doctors/dashboard'); // Successful logins redirects to the landing page
        } else {
            res.send("Login failed. Please check your credentials and try again.");
        }
    }
});

router.get('/dashboard', async (req, res, next) => {
    let doctorName = ""; // Blank name in case of failure

    // Get the doctors last name to display on the page
    if(req.session.adminID) {
        try {
            doctorName = await doctorsModel.getLastName(req.session.adminID);
        } catch (err) {
            console.error(err);
        }
    }
    res.render('dashboard.ejs', { doctorName } );
});

// Export the router object so index.js can access it
module.exports = router;