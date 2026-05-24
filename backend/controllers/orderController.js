const db =
    require("../config/db");

const {
    createOrderService
} = require(
    "../services/order.service"
);

// helper utilities
const safeNumber = (value) => {
    const parsed =
        parseFloat(value);

    return isNaN(parsed)
        ? 0
        : parsed;
};

const safeInteger = (value) => {
    const parsed =
        parseInt(value);

    return isNaN(parsed)
        ? 0
        : parsed;
};

const sanitizeString =
    (value) => {
        return String(
            value || ""
        ).trim();
    };

// create order
const createOrder =
    async (
        req,
        res
    ) => {
        try {
            const {
                customer,
                address,
                paymentMethod,
                items,
                total
            } = req.body;

            // validation
            if (
                !customer
                ||
                !customer.name
                ||
                !customer.email
            ) {
                return res.status(400)
                    .json({
                        success: false,
                        message:
                            "Customer information required"
                    });
            }

            if (
                !address
                ||
                !address.fullAddress
            ) {
                return res.status(400)
                    .json({
                        success: false,
                        message:
                            "Delivery address required"
                    });
            }

            if (
                !Array.isArray(
                    items
                )
                ||
                !items.length
            ) {
                return res.status(400)
                    .json({
                        success: false,
                        message:
                            "Order items required"
                    });
            }

            if (
                safeNumber(total) <= 0
            ) {
                return res.status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid order total"
                    });
            }

            const validPaymentMethods = [
                "cod",
                "card",
                "upi",
                "paypal"
            ];

            if (
                !validPaymentMethods.includes(
                    sanitizeString(
                        paymentMethod
                    ).toLowerCase()
                )
            ) {

                return res.status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid payment method"
                    });
            }

            // create order via service
            const result =
                await createOrderService({
                    user_id:
                        req.user.id,

                    customer_name:
                        sanitizeString(
                            customer.name
                        ),

                    customer_email:
                        sanitizeString(
                            customer.email
                        ),

                    customer_phone:
                        sanitizeString(
                            customer.phone
                        ),

                    city:
                        sanitizeString(
                            address.city
                        ),

                    state:
                        sanitizeString(
                            address.state
                        ),

                    zip:
                        sanitizeString(
                            address.zip
                        ),

                    full_address:
                        sanitizeString(
                            address.fullAddress
                        ),

                    payment_method:
                        sanitizeString(
                            paymentMethod
                        ).toLowerCase(),

                    total:
                        safeNumber(
                            total
                        ),
                    items
                });

            return res.status(201)
                .json({
                    success: true,
                    message:
                        "Order placed successfully",
                    orderId:
                        result.orderId
                });

        } catch (error) {
            console.error(
                "CREATE ORDER ERROR:",
                error
            );

            return res.status(500)
                .json({
                    success: false,
                    message:
                        error.message
                        || "Failed to create order"
                });
        }
    };

// get all orders
const getAllOrders =
    (req, res) => {
        const query = `
            SELECT
                id,
                user_id,
                customer_name,
                customer_email,
                payment_method,
                total,
                status,
                created_at
            FROM orders
            ORDER BY id DESC
        `;

        db.query(
            query,
            (
                err,
                results
            ) => {
                if (err) {
                    console.error(err);
                    return res.status(500)
                        .json({
                            success: false,
                            message:
                                "Server error"
                        });
                }

                res.status(200)
                    .json({
                        success: true,
                        orders:
                            Array.isArray(results)
                                ? results
                                : []
                    });
            }
        );
    };

// get user orders
const getUserOrders =
    (req, res) => {
        const query = `
            SELECT
                id,
                customer_name,
                payment_method,
                total,
                status,
                created_at
            FROM orders
            WHERE user_id = ?
            ORDER BY id DESC
        `;

        db.query(
            query,
            [req.user.id],
            (
                err,
                results
            ) => {
                if (err) {
                    console.error(err);
                    return res.status(500)
                        .json({
                            success: false,
                            message:
                                "Server error"
                        });
                }

                res.status(200)
                    .json({
                        success: true,
                        orders:
                            Array.isArray(results)
                                ? results
                                : []
                    });
            }
        );
    };

// get order by id
const getOrderById =
    (req, res) => {
        const id =
            safeInteger(
                req.params.id
            );

        if (!id) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Invalid order ID"
                });
        }

        const query = `
            SELECT *
            FROM orders
            WHERE id = ?
        `;

        db.query(
            query,
            [id],
            (
                err,
                results
            ) => {
                if (err) {
                    console.error(err);
                    return res.status(500)
                        .json({
                            success: false,
                            message:
                                "Server error"
                        });
                }

                if (
                    !Array.isArray(results)
                    || !results.length
                ) {
                    return res.status(404)
                        .json({
                            success: false,
                            message:
                                "Order not found"
                        });
                }

                res.status(200)
                    .json({
                        success: true,
                        order:
                            results[0]
                    });
            }
        );
    };

// update order status
const updateOrderStatus =
    (req, res) => {
        const id =
            safeInteger(
                req.params.id
            );

        const status =
            sanitizeString(
                req.body.status
            ).toLowerCase();

        const validStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!id) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Invalid order ID"
                });
        }

        if (
            !validStatuses.includes(
                status
            )
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Invalid order status"
                });
        }

        const query = `
            UPDATE orders
            SET status = ?
            WHERE id = ?
        `;

        db.query(
            query,
            [
                status,
                id
            ],
            (
                err,
                result
            ) => {
                if (err) {
                    console.error(err);
                    return res.status(500)
                        .json({
                            success: false,
                            message:
                                "Server error"
                        });
                }

                if (
                    !result
                    || result.affectedRows === 0
                ) {
                    return res.status(404)
                        .json({
                            success: false,
                            message:
                                "Order not found"
                        });
                }

                res.status(200)
                    .json({
                        success: true,
                        message:
                            "Order status updated"
                    });
            }
        );
    };

module.exports = {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};