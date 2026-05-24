// product action state
let currentProduct =
    null;

// set current product
function setCurrentProduct(
    product
) {
    currentProduct =
        product || null;
}

// get quantity
function getSelectedQuantity() {
    if (
        !window.qtyInput
    ) {
        return 1;
    }
    return (
        parseInt(
            window.qtyInput.value
        ) || 1
    );
}

// build cart product
function buildCartProduct() {
    if (
        !currentProduct
    ) {
        return null;
    }
    return {
        id:
            currentProduct.id,

        name:
            currentProduct.name,

        price:
            currentProduct.price,

        image:
            currentProduct.image,

        brand:
            currentProduct.brand,

        qty:
            getSelectedQuantity(),

        color:
            window.selectedColor
            || "Default",

        size:
            window.selectedSize
            || "M"
    };
}

// add to cart
function addProductToCart() {
    const product =
        buildCartProduct();

    if (!product) {
        notify(
            "Product unavailable",
            "error"
        );
        return;
    }

    const cart =
        AppUtils.getCart();

    const existing =
        cart.find(
            (item) => {
                return (
                    String(item.id)
                    ===
                    String(product.id)
                    &&
                    item.color
                    ===
                    product.color
                    &&
                    item.size
                    ===
                    product.size
                );
            }
        );

    if (existing) {
        existing.qty +=
            product.qty;

    } else {
        cart.push(
            product
        );
    }

    AppUtils.saveCart(
        cart
    );

    if (
        typeof updateCartCount ===
        "function"
    ) {
        updateCartCount();
    }

    notify(
        "Added to cart",
        "success"
    );
}

// buy now
function buyNow() {
    addProductToCart();
    setTimeout(
        () => {
            window.location.href =
                "checkout.html";
        },
        500
    );
}

// wishlist
function toggleProductWishlist() {
    if (
        !currentProduct
    ) {
        return;
    }

    let wishlist =
        AppUtils.getJSON(
            "wishlist",
            []
        );

    const exists =
        wishlist.some(
            (item) =>
                String(item.id)
                ===
                String(
                    currentProduct.id
                )
        );

    if (exists) {
        wishlist =
            wishlist.filter(
                (item) =>
                    String(item.id)
                    !==
                    String(
                        currentProduct.id
                    )
            );
        notify(
            "Removed from wishlist",
            "info"
        );
    } else {
        wishlist.push({
            id:
                currentProduct.id,

            name:
                currentProduct.name,

            price:
                currentProduct.price,

            image:
                currentProduct.image,

            brand:
                currentProduct.brand
        });

        notify(
            "Added to wishlist",
            "success"
        );
    }

    AppUtils.setJSON(
        "wishlist",
        wishlist
    );
}

// action bindings
if (
    window.addToCartBtn
) {
    window.addToCartBtn.addEventListener(
        "click",
        addProductToCart
    );
}

if (
    window.buyNowBtn
) {
    window.buyNowBtn.addEventListener(
        "click",
        buyNow
    );
}

if (
    window.wishlistBtn
) {
    window.wishlistBtn.addEventListener(
        "click",
        toggleProductWishlist
    );
}

// expose globally
window.setCurrentProduct =
    setCurrentProduct;

window.addProductToCart =
    addProductToCart;

window.buyNow =
    buyNow;

window.toggleProductWishlist =
    toggleProductWishlist;