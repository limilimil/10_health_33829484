// Create a new router
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const doctorsModel = require('../models/doctorsModel');
const appointmentsModel = require('../models/appointmentsModel');

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
    const doctor = {}

    // Get the doctors last name to display on the page
    if(req.session.adminID) {
        try {
            doctor.name = await doctorsModel.getLastName(req.session.adminID);
        } catch (err) {
            console.error(err);
        }
    }

    try {
        const appointments = await appointmentsModel.getAppointments();
        console.log(appointments);
        res.render('dashboard.ejs', { doctor, appointments } );
    } catch (err) {
        console.error(err);
    }

});

router.get('/appointments/:id', async (req, res, next) => {
    const appointment_id = req.params.id;
    try {
        const result = await appointmentsModel.getAppointment(appointment_id);
        const appointment = result[0];
        res.render('edit_appointment.ejs', { appointment });
    } catch (err) {
        console.error(err);
    }
});

// Export the router object so index.js can access it
module.exports = router;