// environment detection
const isLocalhost =
    window.location.hostname ===
    "localhost"
    ||
    window.location.hostname ===
    "127.0.0.1";

// frontend config
const CONFIG = {
    // api base url
    API_BASE:
        isLocalhost
            ? "http://localhost:5000/api"
            : "https://your-backend-domain.com/api",

    // app info
    APP_NAME:
        "AnthropicBots E-Commerce",

    APP_VERSION:
        "2.0.0",

    // request settings
    REQUEST_TIMEOUT:
        10000,

    // pagination
    PRODUCTS_PER_PAGE:
        8,

    // currency
    CURRENCY:
        "₹",

    // storage keys
    STORAGE_KEYS: {
        CART:
            "cart",

        WISHLIST:
            "wishlist",

        TOKEN:
            "token",

        USER:
            "user",

        RECENTLY_VIEWED:
            "recentlyViewed"
    }
};

// freeze config
Object.freeze(
    CONFIG
);

// expose globally
window.CONFIG =
    CONFIG;