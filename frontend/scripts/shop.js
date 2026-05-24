// shop page initialized
// products state
let allProducts = [];

// shop page elements
const elements = {
    searchInput: document.getElementById("search-input"),
    filterButtons: document.querySelectorAll(".filter-btn"),
    sortSelect: document.getElementById("sort-select"),
    productContainer: document.getElementById("product-container")
};

// fetch products
async function fetchProducts() {
    try {
        if(elements.productContainer){
            elements.productContainer.innerHTML =
                "<h3>Loading products...</h3>";
        }
        const data = await AppUtils.apiRequest(
            "/products"
        );
        if(data.success) {
            allProducts = Array.isArray(data.products)
                ? data.products
                : [];
            renderProducts(allProducts);
        } else {
            if (elements.productContainer) {
                elements.productContainer.innerHTML =
                    `<h3>${data.message}</h3>`;
            }
        }
    } catch(error) {
        console.error(error);
        if (elements.productContainer) {
            elements.productContainer.innerHTML =
                `<h3>Failed to load products.</h3>`;
        }
    }
}

// render star ratings
function renderStars(rating = 5) {
    return Array.from(
        { length: rating },
        () => `<i class="fas fa-star"></i>`
    ).join("");
}

// render products
function renderProducts(products) {
    if (!elements.productContainer) {
        return;
    }
    elements.productContainer.innerHTML = "";
    if(!Array.isArray(products) || products.length === 0){
        elements.productContainer.innerHTML =
            `<h3>No products found.</h3>`;    
        return;
    }

    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("pro");

        const displayName = product.name || "Product";

        productCard.innerHTML = `
            <img
                src="${AppUtils.defaultImage(product.image)}"
                alt="${displayName}"
            >
            <div class="des">
                <span>${product.category || 'Brand'}</span>
                <h5>${displayName}</h5>
                <div class="star">
                    ${renderStars(
                        Math.min(
                            Math.max(Number(product.rating) || 5, 1),
                            5
                        )
                    )}
                </div>
                <h4>
                    ${AppUtils.formatPrice(product.price)}
                </h4>
                <p class="stock-info">
                    ${
                        Number(product.stock) > 0
                            ? `Stock: ${product.stock}`
                            : "Out Of Stock"
                    }
                </p>
            </div>
            ${
                Number(product.stock) <= 0
                    ? `
                        <button class="out-stock-btn">
                            Out Of Stock
                        </button>
                    `
                    : `
                        <button class="add-to-cart-icon">
                            <i class="fal fa-shopping-cart cart"></i>
                        </button>
                    `
            }
        `;

        // navigate to product page
        productCard.addEventListener("click", (e) => {
            if (
                e.target.closest(".add-to-cart-icon")
            ) {
                return;
            }
        
            AppUtils.setJSON(
                "selectedProduct",
                product
            );
        
            window.location.href = "product.html";
        });

        // add to cart click handler
        const cartBtn = productCard.querySelector(".add-to-cart-icon");
        if(cartBtn){
            cartBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const item = {
                    id: product.id,
                    name: displayName,
                    price: parseFloat(product.price) || 0,
                    img: AppUtils.defaultImage(
                        product.image
                    ),
                    qty: 1
                };

                // use centralized cart handler
                if(typeof addToCartFromProduct === "function"){
                    await addToCartFromProduct(item);
                } else {
                    let cart = AppUtils.getCart();
                    const existingIndex = cart.findIndex(
                        p => p.id === item.id
                    );
                    
                    if(existingIndex >= 0){
                        cart[existingIndex].qty += 1;
                    } else {
                        cart.push(item);
                    }
                    AppUtils.saveCart(cart);
                    AppUtils.notify(
                        "Added to cart 🛍️",
                        "success"
                    );
                }
            });
        }
        elements.productContainer.appendChild(productCard);
    });
}

// initialization
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    // search filter
    if (elements.searchInput) {
        elements.searchInput.addEventListener("input", () => {
            const value =
                elements.searchInput.value.trim().toLowerCase();
            const filtered =
                allProducts.filter((product) =>
                    (product.name || "")
                        .toLowerCase()
                        .includes(value)
                );
            renderProducts(filtered);
        });
    }

    // category filter
    elements.filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            elements.filterButtons.forEach((btn) =>
                btn.classList.remove(
                    "active-filter"
                )
            );

            button.classList.add(
                "active-filter"
            );

            const category =
                button.dataset.category;

            if(category === "all"){
                renderProducts(allProducts);
                return;
            }

            const filtered =
                allProducts.filter(
                    (product) =>
                        (product.category || "")
                            .toLowerCase() === category
                );

            renderProducts(filtered);
        });
    });

    // sort products
    if (elements.sortSelect) {
        elements.sortSelect.addEventListener(
            "change",
            () => {
                let sortedProducts =
                    [...allProducts];

                if (
                    elements.sortSelect.value ===
                    "low-high"
                ) {
                    sortedProducts.sort(
                        (a, b) =>
                            (parseFloat(a.price) || 0) -
                            (parseFloat(b.price) || 0)
                    );
                }

                if (
                    elements.sortSelect.value ===
                    "high-low"
                ) {
                    sortedProducts.sort(
                        (a, b) =>
                            (parseFloat(b.price) || 0) -
                            (parseFloat(a.price) || 0)
                    );
                }

                renderProducts(
                    sortedProducts
                );
            }
        );
    }
});