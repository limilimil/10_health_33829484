// Create a new router
const express = require('express');
const router = express.Router();

const appointmentsModel = require('../models/appointmentsModel');
const redirectLogin = require('../middleware/redirectLogin');
const patientsModel = require('../models/patientsModel');

// Route handlers
router.get('/', redirectLogin, async (req, res, next) => {

    if(req.session.userID) {
        try {
            const id = await patientsModel.getID(req.session.userID);
            const appointments = await appointmentsModel.patientAppointments(id);

            res.render('appointments.ejs', { title: 'Appointments', appointments });
        } catch (err) {
            console.error(err);
        }
    }
});

// Handles the appointment request route
router.get('/request', redirectLogin, (req, res, next) => {
    res.render('request.ejs', { title: 'Request an appointment' });
});

// Stores the patients appointment request in the database
router.post('/request', redirectLogin, (req, res, next) => {
    const result = appointmentsModel.insertRequest([req.body.reason, req.session.userID]);
    res.send('Appointment request sent');
});

// Export the router object so index.js can access it
module.exports = router;