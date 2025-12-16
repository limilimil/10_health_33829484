// Create a new router
const express = require('express');
const router = express.Router();
const { check, validationResult, matchedData } = require('express-validator');

// Data models
const appointmentsModel = require('../models/appointmentsModel');
const patientsModel = require('../models/patientsModel');

// Middleware
const redirectLogin = require('../middleware/redirectLogin');
const patientsRedirect = redirectLogin({ sessionID: 'userID', redirectPath: '/patients/login' });

// Route handlers
router.get('/', patientsRedirect, async (req, res, next) => {
    if(req.session.userID) {
        try {
            const id = await patientsModel.getID(req.session.userID);
            const appointments = await appointmentsModel.patientAppointments(id, upcomingOnly = true);

            res.render('appointments.ejs', { title: 'Appointments', appointments });
        } catch (err) {
            console.error(err);
        }
    }
});

// Cancels an apppointment
router.post('/', patientsRedirect, (req, res, next) => {
    const result = appointmentsModel.cancel([req.body.id]);
    res.send('Appointment cancelled');
});

// Handles the appointment request route
router.get('/request', patientsRedirect, (req, res, next) => {
    res.render('request.ejs', { title: 'Request an appointment', reason: "", errorMessage: "" });
});

// Stores the patients appointment request in the database
router.post('/request', patientsRedirect, 
    [
        check('reason').isString().isLength({ min: 5, max: 255 }).withMessage("Please input between 5-255 characters")
    ], (req, res, next) => {
        const reason = req.sanitize(req.body.reason); // Sanitise the input
        // Check for validation errors
        const errors = validationResult(req);
        // Render the view with the error message
        if(!errors.isEmpty()) {
            const errorMessage = errors.errors[0].msg
            return res.render('request.ejs', { title: 'Request an appointment', reason, errorMessage });
        }
        const result = appointmentsModel.insertRequest([req.body.reason, req.session.userID]);
        res.send('Appointment request sent');
    }
);

// Export the router object so index.js can access it
module.exports = router;