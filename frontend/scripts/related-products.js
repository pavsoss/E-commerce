// related products container
const relatedProductsContainer =
    document.getElementById(
        "related-products"
    );

// fetch related products
async function loadRelatedProducts(
    currentProduct
) {
    try {
        if (
            !currentProduct
            ||
            !relatedProductsContainer
        ) {
            return;
        }

        const response =
            await AppUtils.apiRequest(
                "/products"
            );

        if (
            !response.success
        ) {
            throw new Error(
                response.message
                || "Failed to load products"
            );
        }

        const products =
            Array.isArray(
                response.products
            )
                ? response.products
                : [];

        const related =
            products.filter(
                (product) => {
                    return (
                        String(
                            product.id
                        )
                        !==
                        String(
                            currentProduct.id
                        )
                        &&
                        product.category
                        ===
                        currentProduct.category
                    );
                }
            )
            .slice(0, 4);
        renderRelatedProducts(
            related
        );

    } catch (error) {
        console.error(
            "RELATED PRODUCTS ERROR:",
            error
        );
    }
}

// render related products
function renderRelatedProducts(
    products = []
) {
    if (
        !relatedProductsContainer
    ) {
        return;
    }

    if (
        !products.length
    ) {
        relatedProductsContainer.innerHTML = `
            <p>
                No related products found
            </p>
        `;
        return;
    }

    relatedProductsContainer.innerHTML =
        "";

    products.forEach(
        (product) => {
            if (
                typeof renderProductCard
                === "function"
            ) {
                renderProductCard(
                    product,
                    relatedProductsContainer
                );
            }
        }
    );
}

// recently viewed recommendation
function loadRecentlyViewedRecommendations() {
    const viewed =
        AppUtils.getJSON(
            "recentlyViewed",
            []
        );

    const recommendationContainer =
        document.getElementById(
            "recently-viewed-products"
        );

    if (
        !recommendationContainer
    ) {
        return;
    }

    if (
        !viewed.length
    ) {
        recommendationContainer.innerHTML = `
            <p>
                No recently viewed products
            </p>
        `;
        return;
    }

    recommendationContainer.innerHTML =
        "";

    viewed.forEach(
        (product) => {
            if (
                typeof renderProductCard
                === "function"
            ) {
                renderProductCard(
                    product,
                    recommendationContainer
                );
            }
        }
    );
}

// expose globally
window.loadRelatedProducts =
    loadRelatedProducts;

window.renderRelatedProducts =
    renderRelatedProducts;

window.loadRecentlyViewedRecommendations =
    loadRecentlyViewedRecommendations;