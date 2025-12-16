// Create a new router
const express = require('express');
const router = express.Router();
const { check, validationResult, matchedData } = require('express-validator');

// For password hashing
const bcrypt = require('bcrypt');

// Data models
const patientsModel = require('../models/patientsModel');
const appointmentsModel = require('../models/appointmentsModel');

// Middleware
const redirectLogin = require('../middleware/redirectLogin');
const patientsRedirect = redirectLogin({ sessionID: 'userID', redirectPath: '/patients/login' });

const saltRounds = 10;

// Validation rules for NHS numbers
function validatekNHSNumber(nhsNumber) {
    // Remove whitespace
    const digits = nhsNumber.replace(/\s+/g, '');

    // Convert to an array of single digit numbers
    const numbers = digits.split('').map(Number);

    // Checks if there are exactly 10 digits
    if (numbers.length !== 10) {
        return false;
    }

    // Multiply first 9 digits by descending weights 
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += numbers[i] * (10 - i);
    }

    // Calculate the check digit
    const remainder = sum % 11;
    const checkDigit = remainder === 0 ? 0 : 11 - remainder;
    if (checkDigit === 10) return false; // Check digit cannot be 10
    
    return checkDigit === numbers[9];
}

// Route handlers

// Route for patient landing page
router.get('/', patientsRedirect, async (req, res, next) => {
    let patientName = ""; // Blank name in case of failure

    if(req.session.userID) {
        try {
            // Get the patients first name to display on the page
            const result = await patientsModel.getPatientWithUsername(req.session.userID);
            const patient = result[0]; // Only first result is needed
            // Retrieve the first 10 entries of upcoming appointments only
            upcomingAppointments = await appointmentsModel.getAppointments({ patient_id: patient.id, upcoming: true }, 10)
            patientName = patient.first_name;
        } catch (err) {
            console.error(err);
        }
    }
    res.render('patients.ejs', { title: 'Overview', patientName, upcomingAppointments} );
});

// Cancels an apppointment
router.post('/', patientsRedirect, async (req, res, next) => {
    const result = await appointmentsModel.cancel([req.body.id]);
    res.send('Appointment cancelled');
});

// Login route
router.get('/login', (req, res, next) => {
    res.render('login.ejs', { title: 'Patients login' });
});

// Verify login
router.post('/login', async (req, res, next) => {
    const username = req.body.username;
    const result = await patientsModel.getPatientAuth(username);
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

// Route for logging out
router.get('/logout', patientsRedirect, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./')
        }
        return res.redirect(process.env.HEALTH_BASE_PATH); // Returns to the homepage
    });
});

// Route for registration page
router.get('/register', (req, res, next) => {
    res.render('register.ejs', { title: 'Patient registration form', errors: {}, formData: {} });
});

router.post('/registered', 
    [
        check('first').trim().isLength({ min: 1, max: 50 }).withMessage("First name cannot be over 50 characters").isAlpha().withMessage("Please enter letters only"),
        check('last').trim().isLength({ min: 1, max: 50 }).withMessage("Last name cannot be over 50 characters").isAlpha().withMessage("Please enter letters only"),
        check('email').isEmail().withMessage("Please enter a valid email address").trim().isLength({ min: 5, max: 120 }).withMessage("Email address invalid"), 
        check('nhs').custom(validatekNHSNumber).withMessage("The NHS number you entered cannot be verified").customSanitizer(nhs => nhs.replace(/\s+/g, '')),
        check('username').trim().isLength({ min: 4, max: 30}).withMessage("Username must be between 4 and 30 characters").isAlphanumeric().withMessage("Username must be letters and numbers only"),
        check('password').isLength({ min: 8, max: 64}).withMessage("Password must be between 8 and 64 characters")

    ], async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Retrieves relevant error messages to be displayed on the user interface
            const errorMessages = { first: [], last: [], email: [], nhs: [], username: [], password: [] };
            for (let i = 0; i < errors.errors.length; i++) {
                let inputField = errors.errors[i].path
                if(errorMessages[inputField]) { // Only includes error messages for existing input types
                    errorMessages[inputField].push(errors.errors[i].msg);
                }
            }
            // Loads the registration page again with error messages and previous inputs except password
            res.render('./register', { title: "Patient registration form", errors: errorMessages, formData: req.body });
        } else {
            const data = matchedData(req);

            // Sanitise user inputs
            data.first = req.sanitize(data.first);
            data.last = req.sanitize(data.last);
            data.email = req.sanitize(data.email);
            data.nhs = req.sanitize(data.nhs);
            data.username = req.sanitize(data.username);
            const plainPassword = data.password;
            try {
                // Password hashing
                const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
                // Inserts user into the database
                const newUser = [data.first, data.last, data.email, data.nhs, data.username, hashedPassword];
                const result = await patientsModel.insert(newUser);
                res.send("Patient registered");
            } catch(err) {
                console.error(err);
                next(err);
            }
        }
});

// Export the router object so index.js can access it
module.exports = router;