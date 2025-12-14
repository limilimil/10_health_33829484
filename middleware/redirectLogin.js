const redirectLogin = ({ sessionID, redirectPath }) => {
    return (req, res, next) => {
        // Skip redirect in development environment
        if (process.env.HEALTH_NODE_ENV === 'development') {
            return next();
        }
        if (!req.session[sessionID]) {
            res.redirect(process.env.HEALTH_BASE_PATH + redirectPath); // redirect to the login page
        } else { 
            next(); // move to the next middleware function
        } 
    };
};

module.exports = redirectLogin;