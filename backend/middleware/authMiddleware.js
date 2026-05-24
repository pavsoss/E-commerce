const jwt =
    require("jsonwebtoken");

// environment validation
if (!process.env.JWT_SECRET) {
    throw new Error(
        "JWT_SECRET environment variable is not set"
    );
}

// auth middleware
const authMiddleware =
    (req, res, next) => {
        try {
            const authHeader =
                req.headers.authorization;

            // validate auth header
            if (!authHeader) {
                return res.status(401)
                    .json({
                        success: false,
                        message:
                            "No token provided"
                    });
            }

            // validate bearer format
            if (
                !authHeader.startsWith(
                    "Bearer "
                )
            ) {

                return res.status(401)
                    .json({
                        success: false,
                        message:
                            "Bearer token required"
                    });
            }

            // extract token
            const token =
                authHeader
                    .split(" ")[1]
                    ?.trim();

            if (!token) {
                return res.status(401)
                    .json({
                        success: false,
                        message:
                            "Invalid token format"
                    });
            }

            // verify token
            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

            // validate decoded payload
            if (
                !decoded
                || !decoded.id
            ) {
                return res.status(401)
                    .json({
                        success: false,
                        message:
                            "Invalid token payload"
                    });
            }

            // attach user
            req.user = {
                id:
                    Number(decoded.id),

                role:
                    decoded.role
                    || "user"
            };
            next();

        } catch (error) {
            console.error(
                "AUTH ERROR:",
                error
            );
            let message =
                "Unauthorized access";

            if (
                error.name
                === "TokenExpiredError"
            ) {
                message =
                    "Token expired";

            } else if (
                error.name
                === "JsonWebTokenError"
            ) {
                message =
                    "Invalid token";
            }

            return res.status(401)
                .json({
                    success: false,
                    message
                });
        }
    };

module.exports =
    authMiddleware;