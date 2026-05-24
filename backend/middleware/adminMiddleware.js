const adminMiddleware =
    (req, res, next) => {
        try {
            // validate authenticated user
            if (!req.user) {
                return res.status(401)
                    .json({
                        success: false,
                        message:
                            "Authentication required"
                    });
            }

            // validate user id
            if (
                !req.user.id
                || Number(req.user.id) < 1
            ) {
                return res.status(401)
                    .json({
                        success: false,
                        message:
                            "Invalid user session"
                    });
            }

            // validate admin role
            const userRole =
                String(
                    req.user.role || ""
                ).trim()
                    .toLowerCase();

            if (
                userRole !== "admin"
            ) {
                return res.status(403)
                    .json({
                        success: false,
                        message:
                            "Admin access required"
                    });
            }
            next();

        } catch (error) {
            console.error(
                "ADMIN MIDDLEWARE ERROR:",
                error
            );

            return res.status(500)
                .json({
                    success: false,
                    message:
                        "Authorization failed"
                });
        }
    };

module.exports =
    adminMiddleware;