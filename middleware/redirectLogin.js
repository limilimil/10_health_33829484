const redirectLogin = (req, res, next) => {
    if (!req.session.userID) {
      res.redirect(process.env.HEALTH_BASE_PATH + '/patients/login'); // redirect to the login page
    } else { 
        next(); // move to the next middleware function
    } 
}

module.exports = redirectLogin;