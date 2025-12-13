const redirectLogin = ({ sessionID, redirectPath }) => {
    return (req, res, next) => {
        if (!req.session[sessionID]) {
            res.redirect(process.env.HEALTH_BASE_PATH + redirectPath); // redirect to the login page
        } else { 
            next(); // move to the next middleware function
        } 
    };
};

module.exports = redirectLogin;