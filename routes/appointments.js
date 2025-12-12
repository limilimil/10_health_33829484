// Create a new router
const express = require('express');
const router = express.Router();

const appointmentsModel = require('../models/appointmentsModel');
const redirectLogin = require('../middleware/redirectLogin');

// Route handlers
router.get('/', redirectLogin, (req, res, next) => {
    res.render('appointments.ejs');
});

router.get('/request', redirectLogin, (req, res, next) => {
    res.render('request.ejs');
});

router.post('/request', redirectLogin, (req, res, next) => {
    const result = appointmentsModel.insertRequest([req.body.reason, req.session.userID]);
    res.send('Appointment request sent');
});

// Export the router object so index.js can access it
module.exports = router;