// cart storage
let cart =
    AppUtils.getCart();

// wishlist storage
let wishlist =
    getJSON(
        "wishlist"
    ) || [];

// save cart
function saveCart() {
    AppUtils.saveCart(
        cart
    );

    if (
        typeof updateCartCount ===
        "function"
    ) {
        updateCartCount();
    }
}

// save wishlist
function saveWishlist() {
    setJSON(
        "wishlist",
        wishlist
    );
}

// add to cart
function addToCart(
    product
) {
    if (!product) {
        return;
    }
    const existing =
        cart.find(
            (item) =>
                String(item.id)
                === String(product.id)
        );

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            ...product,
            qty: 1
        });
    }

    saveCart();
    notify(
        `${product.name} added to cart`,
        "success"
    );
}

// add to wishlist
function toggleWishlist(
    product
) {
    if (!product) {
        return;
    }

    const exists =
        wishlist.some(
            (item) =>
                String(item.id)
                === String(product.id)
        );

    if (exists) {
        wishlist =
            wishlist.filter(
                (item) =>
                    String(item.id)
                    !== String(product.id)
            );
        notify(
            "Removed from wishlist",
            "info"
        );
    } else {
        wishlist.push(
            product
        );
        notify(
            "Added to wishlist",
            "success"
        );
    }
    saveWishlist();
}

// get product by id
function getProductById(
    id,
    products = []
) {
    return products.find(
        (product) =>
            String(product.id)
            === String(id)
    );
}

// action delegation
document.addEventListener(
    "click",
    (event) => {
        const addCartBtn =
            event.target.closest(
                ".add-cart-btn"
            );

        const wishlistBtn =
            event.target.closest(
                ".wishlist-btn"
            );

        const viewBtn =
            event.target.closest(
                ".view-product-btn"
            );

        // add cart
        if (addCartBtn) {
            const id =
                addCartBtn.dataset.id;

            const product =
                getProductById(
                    id,
                    window.allProducts || []
                );

            if (product) {
                addToCart(
                    product
                );
            }
        }

        // wishlist
        if (wishlistBtn) {
            const id =
                wishlistBtn.dataset.id;

            const product =
                getProductById(
                    id,
                    window.allProducts || []
                );

            if (product) {
                toggleWishlist(
                    product
                );
            }
        }

        // product page
        if (viewBtn) {
            const id =
                viewBtn.dataset.id;

            window.location.href =
                `product.html?id=${id}`;
        }
    }
);

// expose globally
window.addToCart =
    addToCart;

window.toggleWishlist =
    toggleWishlist;