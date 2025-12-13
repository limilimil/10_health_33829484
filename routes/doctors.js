// Create a new router
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const bcrypt = require('bcrypt');

// Data models
const doctorsModel = require('../models/doctorsModel');
const appointmentsModel = require('../models/appointmentsModel');

// Middleware
const redirectLogin = require('../middleware/redirectLogin');
const adminRedirect = redirectLogin({ sessionID: 'adminID', redirectPath: '/doctors/login' });

const adminLayout = (req, res, next) => {
    res.locals.layout = 'layouts/adminLayout';
    res.locals.showNavbar = true;
    next();
}

router.use(adminLayout);

// Route handlers
// Route for the doctors login page
router.get('/login', (req, res, next) => {
    res.render('doctor_login.ejs', { showNavbar: false, title: "Doctor login"});
});

// For verifying the doctor login credentials
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

// Landing page for admin tasks
router.get('/dashboard', adminRedirect, async (req, res, next) => {
    const doctor = {}

    // Get the doctors last name to display on the page
    if(req.session.adminID) {
        try {
            doctor.name = await doctorsModel.getLastName(req.session.adminID);
        } catch (err) {
            console.error(err);
        }
    }
    // Gets a list of appointments
    try {
        const appointments = await appointmentsModel.getAppointments();
        res.render('dashboard.ejs', { title: 'Admin dashboard', doctor, appointments } );
    } catch (err) {
        console.error(err);
    }

});

// Route for viewing an individual appointment by its ID
router.get('/appointments/:id', adminRedirect, async (req, res, next) => {
    const appointment_id = req.params.id;
    try {
        const result = await appointmentsModel.getAppointment(appointment_id);
        const appointment = result[0];

        // Convert date to the correct format for html datetime-local input
        if(appointment.appointment_datetime) {
            appointment.appointment_datetime = appointment.appointment_datetime.toISOString().slice(0, 16);
        }
        
        // Retrieve the list of states and flatten into a single array
        const states = await appointmentsModel.getStates();
        const status = states.map(Object.values).flat();

        const doctors = await doctorsModel.getDoctors();


        res.render('edit_appointment.ejs', { title: "Edit appointment", appointment, status, doctors });
    } catch (err) {
        console.error(err);
    }
});

router.post('/appointments/:id', adminRedirect,
    [
        check('date').default(null),
        check('doctor').default(null)
    ], 
    async (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        
        const update = [req.body.date, req.body.status, req.body.doctor, req.params.id];

        try {
            const result = await appointmentsModel.updateAppointment(update)

            res.send("Appointment updated");
        } catch (err) {
            console.error(err);
        }
    }
);

// Export the router object so index.js can access it
module.exports = router;