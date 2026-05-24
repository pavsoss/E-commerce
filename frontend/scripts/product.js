console.log(
    "Product page loaded successfully!"
);

// product page elements
const elements = {
    mainImage:
        document.getElementById(
            "main-product-image"
        ),

    qtyInput:
        document.getElementById(
            "product-qty"
        ),

    productCategory:
        document.getElementById(
            "product-category"
        ),

    productName:
        document.getElementById(
            "product-name"
        ),

    productPrice:
        document.getElementById(
            "product-price"
        ),

    productOriginalPrice:
        document.getElementById(
            "product-original-price"
        ),

    productDiscount:
        document.getElementById(
            "product-discount"
        ),

    productBrand:
        document.getElementById(
            "product-brand"
        ),

    productDescription:
        document.getElementById(
            "product-description"
        ),

    productStock:
        document.getElementById(
            "product-stock"
        ),

    variantStock:
        document.getElementById(
            "variant-stock"
        ),

    wishlistBtn:
        document.getElementById(
            "wishlist-btn"
        ),

    reviewForm:
        document.getElementById(
            "review-form"
        ),

    plusBtn:
        document.getElementById(
            "plus-btn"
        ),

    minusBtn:
        document.getElementById(
            "minus-btn"
        ),

    addToCartBtn:
        document.getElementById(
            "add-to-cart-btn"
        ),

    buyNowBtn:
        document.getElementById(
            "buy-now-btn"
        )
};

// expose globally
Object.entries(
    elements
).forEach(
    ([key, value]) => {
        window[key] = value;
    }
);

// current product state
window.currentProductData =
    null;

// product id
const urlParams =
    new URLSearchParams(
        window.location.search
    );

const productId =
    parseInt(
        urlParams.get("id")
    );

// invalid id fallback
if (!productId) {
    window.location.href =
        "shop.html";
}

// fallback product
function getFallbackProduct() {
    return {
        id: 1,
        brand:
            "AnthropicBots",
        name:
            "Modern Fashion T-Shirt",
        category:
            "T-Shirt",
        price: 999,
        image:
            "assets/images/f1.jpg",
        description:
            "Premium quality cotton t-shirt with breathable fabric and modern fashion styling.",
        stock: 12,
        rating: 4.5,
        discount_percent: 10
    };
}

// fetch product
async function fetchProduct() {
    try {
        const response =
            await AppUtils.apiRequest(
                `/products/${productId}`
            );

        if (
            response.success
            &&
            response.product
        ) {
            window.currentProductData =
                response.product;

        } else {
            window.currentProductData =
                getFallbackProduct();
        }

    } catch (error) {
        console.error(
            "PRODUCT FETCH ERROR:",
            error
        );

        window.currentProductData =
            getFallbackProduct();
    }
    initializeProductPage();
}

// initialize page
function initializeProductPage() {
    const product =
        window.currentProductData;

    if (!product) {
        return;
    }

    // rendering
    if (
        typeof renderProduct ===
        "function"
    ) {
        renderProduct(
            product
        );
    }

    // variants
    if (
        typeof setupVariants ===
        "function"
    ) {
        setupVariants(
            product
        );
    }

    // actions
    if (
        typeof setCurrentProduct ===
        "function"
    ) {
        setCurrentProduct(
            product
        );
    }

    // reviews
    if (
        typeof loadProductReviews ===
        "function"
    ) {
        loadProductReviews(
            product.id
        );
    }

    // related
    if (
        typeof loadRelatedProducts ===
        "function"
    ) {
        loadRelatedProducts(
            product
        );
    }

    // recommendations
    if (
        typeof loadRecentlyViewedRecommendations ===
        "function"
    ) {
        loadRecentlyViewedRecommendations();
    }
}

// keyboard accessibility
document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key === "+"
            &&
            window.plusBtn
        ) {
            plusBtn.click();
        }

        if (
            event.key === "-"
            &&
            window.minusBtn
        ) {
            minusBtn.click();
        }
    }
);

// image zoom
if (
    window.mainImage
) {
    mainImage.addEventListener(
        "mousemove",
        () => {
            mainImage.style.transform =
                "scale(1.15)";
        }
    );

    mainImage.addEventListener(
        "mouseleave",
        () => {
            mainImage.style.transform =
                "scale(1)";
        }
    );
}

// init
document.addEventListener(
    "DOMContentLoaded",
    () => {
        fetchProduct();
        if (
            typeof updateCartCount ===
            "function"
        ) {
            updateCartCount();
        }
    }
);