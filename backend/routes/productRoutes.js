const express =
    require("express");

const router =
    express.Router();

const {
    getProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require(
    "../controllers/productController"
);

const authMiddleware =
    require(
        "../middleware/authMiddleware"
    );

const adminMiddleware =
    require(
        "../middleware/adminMiddleware"
    );

// validate product id
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
                        "Invalid product ID"
                });
        }
        req.productId =
            parsedId;
        next();
    }
);

// get all products
router.get(
    "/",
    getProducts
);

// get single product
router.get(
    "/:id",
    getSingleProduct
);

// create product
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    (req, res, next) => {

        const {
            name,
            category,
            price,
            stock
        } = req.body;
        if (
            !name?.trim()
            || !category?.trim()
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Name and category are required"
                });
        }
        if (
            Number(price) < 0
            || Number(stock) < 0
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Price and stock must be valid"
                });
        }
        next();
    },
    createProduct
);

// update product
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    (req, res, next) => {

        const {
            name,
            category,
            price,
            stock
        } = req.body;

        if (
            name !== undefined
            && !String(name).trim()
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Product name cannot be empty"
                });
        }
        if (
            category !== undefined
            && !String(category).trim()
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Category cannot be empty"
                });
        }
        if (
            price !== undefined
            && Number(price) < 0
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Price cannot be negative"
                });
        }
        if (
            stock !== undefined
            && Number(stock) < 0
        ) {
            return res.status(400)
                .json({
                    success: false,
                    message:
                        "Stock cannot be negative"
                });
        }
        next();
    },
    updateProduct
);

// delete product
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);

// route fallback
router.use((req, res) => {

    res.status(404).json({
        success: false,
        message:
            "Product route not found"
    });
});

module.exports =
    router;