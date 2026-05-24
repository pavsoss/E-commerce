// dashboard wishlist elements
const dashboardWishlistElements = {
    wishlistContainer:
        document.getElementById(
            "wishlist-items"
        ),

    wishlistCount:
        document.getElementById(
            "wishlist-count"
        ),

    cartContainer:
        document.getElementById(
            "saved-cart-items"
        ),

    cartCount:
        document.getElementById(
            "cart-count-dashboard"
        )
};

// render wishlist
function renderDashboardWishlist() {
    const wishlist =
        AppUtils.getJSON(
            "wishlist",
            []
        );

    if (
        dashboardWishlistElements.wishlistCount
    ) {
        dashboardWishlistElements.wishlistCount.innerText =
            wishlist.length;
    }

    if (
        !wishlist.length
    ) {
        renderDashboardEmptyState(
            dashboardWishlistElements.wishlistContainer,
            "No wishlist items found."
        );

        return;
    }

    if (
        !dashboardWishlistElements.wishlistContainer
    ) {
        return;
    }
    dashboardWishlistElements.wishlistContainer.innerHTML =
        "";

    wishlist.forEach(
        (item) => {
            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "dashboard-item-card";

            card.innerHTML = `
                <img
                    src="${
                        AppUtils.defaultImage(
                            item.image
                        )
                    }"
                    alt="${
                        item.name
                    }"
                >

                <div class="dashboard-item-info">
                    <h4>
                        ${
                            item.name
                        }
                    </h4>

                    <p>
                        ${
                            item.brand || ""
                        }
                    </p>

                    <strong>
                        ${
                            AppUtils.formatPrice(
                                item.price || 0
                            )
                        }
                    </strong>
                </div>
            `;

            dashboardWishlistElements
                .wishlistContainer
                .appendChild(
                    card
                );
        }
    );
}

// render cart
function renderDashboardCart() {
    const cart =
        AppUtils.getCart();

    if (
        dashboardWishlistElements.cartCount
    ) {
        dashboardWishlistElements.cartCount.innerText =
            cart.length;
    }

    if (
        !cart.length
    ) {
        renderDashboardEmptyState(
            dashboardWishlistElements.cartContainer,
            "No saved cart items found."
        );

        return;
    }

    if (
        !dashboardWishlistElements.cartContainer
    ) {
        return;
    }
    dashboardWishlistElements.cartContainer.innerHTML =
        "";

    cart.forEach(
        (item) => {
            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "dashboard-item-card";

            card.innerHTML = `
                <img
                    src="${
                        AppUtils.defaultImage(
                            item.image
                        )
                    }"
                    alt="${
                        item.name
                    }"
                >

                <div class="dashboard-item-info">
                    <h4>
                        ${
                            item.name
                        }
                    </h4>

                    <p>
                        Qty:
                        ${
                            item.qty || 1
                        }
                    </p>

                    <strong>
                        ${
                            AppUtils.formatPrice(
                                item.price || 0
                            )
                        }
                    </strong>
                </div>
            `;

            dashboardWishlistElements
                .cartContainer
                .appendChild(
                    card
                );
        }
    );
}

// expose globally
window.renderDashboardWishlist =
    renderDashboardWishlist;

window.renderDashboardCart =
    renderDashboardCart;