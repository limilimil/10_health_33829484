// Create a new router
const express = require('express');
const router = express.Router();

// Route handlers
router.get('/', (req, res, next) => {
    res.render('index.ejs');
});

router.get('/about', (req, res, next) => {
    res.render('about.ejs');
});

// Export the router object so index.js can access it
module.exports = router;