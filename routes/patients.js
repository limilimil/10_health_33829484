// Create a new router
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const patients = require('../models/patients');

const saltRounds = 10;

// Route handlers
router.get('/login', function(req, res, next) {
    res.render('login.ejs');
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