import passport from 'passport';

// Middleware for AUTHENTICATION VALIDATION function
export function validateAuth(req, res, next) {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                status: "error",
                code: 401,
                message: "Not authorized",
                data: "Unauthorized"
            });
        }
        req.user = user;
        next();
    })(req, res, next);
}