const express =
    require("express");

const router =
    express.Router();

const {
    signup,
    login,
    refreshAccessToken
} = require(
    "../controllers/authController"
);

const authMiddleware =
    require(
        "../middleware/authMiddleware"
    );

// auth status route
router.get(
    "/status",
    (req, res) => {
        res.status(200)
            .json({
                success: true,
                message:
                    "Auth API running"
            });
    }
);

// signup route
router.post(
    "/signup",
    (req, res, next) => {
        const {
            name,
            email,
            password
        } = req.body;

        // validate request body
        if (
            !name
            || !email
            || !password
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "All fields are required"
                });
        }
        next();
    },
    signup
);

// login route
router.post(
    "/login",
    (req, res, next) => {
        const {
            email,
            password
        } = req.body;

        // validate request body
        if (
            !email
            || !password
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Email and password required"
                });
        }
        next();
    },
    login
);

// refresh token route
router.post(
    "/refresh-token",
    (req, res, next) => {
        const {
            refreshToken
        } = req.body;

        if (!refreshToken) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Refresh token required"
                });
        }
        next();
    },
    refreshAccessToken
);

// current user route
router.get(
    "/me",
    authMiddleware,
    (req, res) => {
        res.status(200)
            .json({
                success: true,
                user: {
                    id:
                        req.user.id,

                    role:
                        req.user.role
                }
            });
    }
);

// route fallback
router.use((req, res) => {
    res.status(404)
        .json({
            success: false,
            message:
                "Auth route not found"
        });
});

module.exports =
    router;