const express =
    require("express");

const router =
    express.Router();

const authMiddleware =
    require(
        "../middleware/authMiddleware"
    );

const adminMiddleware =
    require(
        "../middleware/adminMiddleware"
    );

const orderController =
    require(
        "../controllers/orderController"
    );

// validate order id
router.param(
    "id",
    (req, res, next, id) => {
        const parsedId =
            parseInt(id);

        if (
            !parsedId
            || parsedId < 1
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Invalid order ID"
                });
        }
        req.orderId =
            parsedId;

        next();
    }
);

// create order
router.post(
    "/",
    authMiddleware,
    (req, res, next) => {
        const {
            items,
            total
        } = req.body;

        // validate items
        if (
            !Array.isArray(items)
            || !items.length
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Order items are required"
                });
        }

        // validate total
        if (
            Number(total) <= 0
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Invalid order total"
                });
        }
        next();
    },
    orderController.createOrder
);

// get all orders
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    orderController.getAllOrders
);

// get current user orders
router.get(
    "/my-orders",
    authMiddleware,
    orderController.getUserOrders
);

// update order status
router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    (req, res, next) => {
        const {
            status
        } = req.body;

        const allowedStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (
            !status
            || !allowedStatuses.includes(
                String(status)
                    .toLowerCase()
            )
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Invalid order status"
                });
        }
        next();
    },
    orderController.updateOrderStatus
);

// order route status
router.get(
    "/status/check",
    (req, res) => {
        res.status(200)
            .json({
                success: true,
                message:
                    "Order API running"
            });
    }
);

// route fallback
router.use((req, res) => {
    res.status(404)
        .json({
            success: false,
            message:
                "Order route not found"
        });
});

module.exports =
    router;