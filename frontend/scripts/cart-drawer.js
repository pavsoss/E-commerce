// cart drawer elements
const cartDrawer =
    document.getElementById(
        "cart-drawer"
    );

const cartDrawerItems =
    document.getElementById(
        "cart-drawer-items"
    );

const cartDrawerTotal =
    document.getElementById(
        "cart-drawer-total"
    );

const openCartBtn =
    document.getElementById(
        "open-cart-drawer"
    );

const closeCartBtn =
    document.getElementById(
        "close-cart-drawer"
    );

// cart state
let drawerCart =
    AppUtils.getCart();

// open drawer
function openCartDrawer() {
    if (!cartDrawer) {
        return;
    }

    cartDrawer.classList.add(
        "active"
    );

    renderCartDrawer();
}

// close drawer
function closeCartDrawer() {
    if (!cartDrawer) {
        return;
    }

    cartDrawer.classList.remove(
        "active"
    );
}

// render cart drawer
function renderCartDrawer() {
    if (
        !cartDrawerItems ||
        !cartDrawerTotal
    ) {
        return;
    }

    drawerCart =
        AppUtils.getCart();

    if (!drawerCart.length) {
        cartDrawerItems.innerHTML = `
            <p>
                Your cart is empty
            </p>
        `;

        cartDrawerTotal.innerHTML =
            formatPrice(0);

        return;
    }

    cartDrawerItems.innerHTML =
        drawerCart.map(
            (item) => {
                return `
                    <div class="drawer-item">
                        <img
                            src="${
                                defaultImage(
                                    item.image
                                )
                            }"
                            alt="${
                                item.name
                            }"
                        >

                        <div class="drawer-item-info">
                            <h4>
                                ${
                                    item.name
                                }
                            </h4>

                            <p>
                                ${
                                    formatPrice(
                                        item.price
                                    )
                                }
                            </p>

                            <small>
                                Qty:
                                ${
                                    item.qty
                                }
                            </small>
                        </div>

                        <button
                            class="remove-drawer-item"
                            data-id="${
                                item.id
                            }"
                        >
                            ✕
                        </button>
                    </div>
                `;
            }
        ).join("");

    const total =
        drawerCart.reduce(
            (sum, item) => {
                return (
                    sum +
                    (
                        item.price *
                        item.qty
                    )
                );
            },
            0
        );
    cartDrawerTotal.innerHTML =
        formatPrice(total);
}

// remove item
function removeDrawerItem(
    id
) {
    drawerCart =
        drawerCart.filter(
            (item) =>
                String(item.id)
                !== String(id)
        );

    AppUtils.saveCart(
        drawerCart
    );

    renderCartDrawer();
    if (
        typeof updateCartCount ===
        "function"
    ) {
        updateCartCount();
    }

    notify(
        "Item removed from cart",
        "info"
    );
}

// event listeners
if (openCartBtn) {
    openCartBtn.addEventListener(
        "click",
        openCartDrawer
    );
}

if (closeCartBtn) {
    closeCartBtn.addEventListener(
        "click",
        closeCartDrawer
    );
}

// drawer delegation
document.addEventListener(
    "click",
    (event) => {
        const removeBtn =
            event.target.closest(
                ".remove-drawer-item"
            );

        if (removeBtn) {
            removeDrawerItem(
                removeBtn.dataset.id
            );
        }
    }
);

// expose globally
window.openCartDrawer =
    openCartDrawer;

window.renderCartDrawer =
    renderCartDrawer;