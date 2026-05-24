// product controls
const searchInput =
    document.getElementById(
        "search-input"
    );

const sortSelect =
    document.getElementById(
        "sort-products"
    );

const categoryFilter =
    document.getElementById(
        "category-filter"
    );

// filtered products
let filteredProducts =
    [];

// apply filters
function applyShopFilters() {
    let products =
        [...(
            window.allProducts || []
        )];

    // search filter
    const searchValue =
        searchInput?.value
            ?.trim()
            .toLowerCase();

    if (searchValue) {
        products =
            products.filter(
                (product) => {
                    return (
                        product.name
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )
                        ||
                        product.category
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )
                    );
                }
            );
    }

    // category filter
    const category =
        categoryFilter?.value;

    if (
        category &&
        category !== "all"
    ) {
        products =
            products.filter(
                (product) =>
                    product.category ===
                    category
            );
    }

    // sorting
    const sortValue =
        sortSelect?.value;

    switch (sortValue) {
        case "price-low-high":
            products.sort(
                (a, b) =>
                    a.price - b.price
            );

            break;

        case "price-high-low":
            products.sort(
                (a, b) =>
                    b.price - a.price
            );

            break;

        case "name-a-z":
            products.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );

            break;

        case "name-z-a":
            products.sort(
                (a, b) =>
                    b.name.localeCompare(
                        a.name
                    )
            );

            break;
        default:
            break;
    }
    filteredProducts =
        products;

    updateFilteredUI();
}

// update UI
function updateFilteredUI() {
    if (
        typeof renderFeaturedProducts ===
        "function"
    ) {
        renderFeaturedProducts(
            filteredProducts
        );
    }

    if (
        typeof renderNewArrivals ===
        "function"
    ) {
        renderNewArrivals(
            filteredProducts
        );
    }
}

// listeners
if (searchInput) {
    searchInput.addEventListener(
        "input",
        applyShopFilters
    );
}

if (sortSelect) {
    sortSelect.addEventListener(
        "change",
        applyShopFilters
    );
}

if (categoryFilter) {
    categoryFilter.addEventListener(
        "change",
        applyShopFilters
    );
}

// expose globally
window.applyShopFilters =
    applyShopFilters;