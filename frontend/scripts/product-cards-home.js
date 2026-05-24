// featured products container
const featuredContainer =
    document.getElementById(
        "featured-products"
    );

// new arrivals container
const arrivalsContainer =
    document.getElementById(
        "new-arrivals-products"
    );

// render product card
function createProductCard(
    product
) {
    const rating =
        Number(
            product.rating || 4
        );

    const stars =
        Array.from(
            {
                length: 5
            },
            (_, index) => {
                return `
                    <i class="fas fa-star${
                        index < rating
                            ? ""
                            : "-o"
                    }"></i>
                `;
            }
        ).join("");

    return `
        <div class="pro fade-in">
            ${
                product.featured
                    ? `
                        <span class="product-badge">
                            Featured
                        </span>
                    `
                    : ""
            }

            <img
                src="${
                    defaultImage(
                        product.image
                    )
                }"
                alt="${
                    product.name
                }"
            >

            <div class="des">

                <span>
                    ${
                        product.category
                        || "Fashion"
                    }
                </span>

                <h5>
                    ${
                        product.name
                    }
                </h5>

                <div class="star">
                    ${stars}
                </div>

                <h4>
                    ${
                        formatPrice(
                            product.price
                        )
                    }
                </h4>

                <div class="product-actions">

                    <button
                        class="view-product-btn"
                        data-id="${
                            product.id
                        }"
                    >
                        View
                    </button>

                    <button
                        class="add-cart-btn"
                        data-id="${
                            product.id
                        }"
                    >
                        Add Cart
                    </button>

                </div>
            </div>

            <a
                href="#"
                class="cart add-cart-btn"
                data-id="${
                    product.id
                }"
            >
                <i class="fal fa-shopping-cart cart"></i>
            </a>

        </div>
    `;
}

// render featured products
function renderFeaturedProducts(
    products = []
) {
    if (
        !featuredContainer
    ) {
        return;
    }
    const featured =
        products.filter(
            (product) =>
                product.featured
        );

    featuredContainer.innerHTML =
        featured.length
            ? featured
                .slice(0, 8)
                .map(
                    createProductCard
                )
                .join("")
            : `
                <p>
                    No featured products found
                </p>
            `;
}

// render new arrivals
function renderNewArrivals(
    products = []
) {
    if (
        !arrivalsContainer
    ) {
        return;
    }

    const arrivals =
        [...products]
            .reverse()
            .slice(0, 8);

    arrivalsContainer.innerHTML =
        arrivals.length
            ? arrivals
                .map(
                    createProductCard
                )
                .join("")
            : `
                <p>
                    No new arrivals found
                </p>
            `;
}

// expose globally
window.renderFeaturedProducts =
    renderFeaturedProducts;

window.renderNewArrivals =
    renderNewArrivals;

window.createProductCard =
    createProductCard;