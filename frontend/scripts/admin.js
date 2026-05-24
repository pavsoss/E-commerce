// ADMIN PANEL INITIALIZED
// Shared helpers are provided globally from utils.js
// auth state
const user =
    AppUtils.getJSON("user");

const token =
    localStorage.getItem(
        "token"
    );

if (
    !token ||
    !user ||
    user.role !== "admin"
) {
    AppUtils.notify(
        "Admin access required",
        "error"
    );
    setTimeout(() => {
        window.location.href =
            "signin.html";
    }, 800);
    throw new Error(
        "Unauthorized admin access"
    );
}

// elements
const elements = {
    productForm:
        document.getElementById(
            "product-form"
        ),

    productTableBody:
        document.getElementById(
            "product-table-body"
        ),

    ordersTableBody:
        document.getElementById(
            "orders-table-body"
        ),

    totalOrders:
        document.getElementById(
            "total-orders"
        ),

    totalProducts:
        document.getElementById(
            "total-products"
        ),

    totalUsers:
        document.getElementById(
            "total-users"
        ),

    totalRevenue:
        document.getElementById(
            "total-revenue"
        ),

    productName:
        document.getElementById(
            "product-name"
        ),

    productCategory:
        document.getElementById(
            "product-category"
        ),

    productPrice:
        document.getElementById(
            "product-price"
        ),

    productDescription:
        document.getElementById(
            "product-description"
        ),

    productImage:
        document.getElementById(
            "product-image"
        ),

    productStock:
        document.getElementById(
            "product-stock"
        ),

    featuredProduct:
        document.getElementById(
            "featured-product"
        )
};

// fetch initial data
let products = [];
let orders = [];

const loadInitialData = async () => {
    try {
        if (elements.productTableBody) {
            elements.productTableBody.innerHTML =
                `<tr>
                    <td colspan="6">
                        Loading products...
                    </td>
                </tr>`;
        }
        const productsRes =
            await AppUtils.apiRequest(
                "/products"
            );
        if (productsRes.success) {
            products =
                Array.isArray(
                    productsRes.products
                )
                    ? productsRes.products
                    : [];
        }

        const ordersRes =
            await AppUtils.apiRequest(
                "/orders"
            );
        if (ordersRes.success) {
            orders =
                Array.isArray(
                    ordersRes.orders
                )
                    ? ordersRes.orders
                    : [];
        }

        renderProducts();
        renderOrders();
        renderStats();
    } catch (error) {
        if (elements.productTableBody) {
            elements.productTableBody.innerHTML =
                `
                    <tr>
                        <td colspan="6">
                            Failed to load products
                        </td>
                    </tr>
                `;
        }
    }
};

// render stars
function renderStats() {

    if (elements.totalOrders) {
        elements.totalOrders.innerText =
            (orders || []).length;
    }

    if (elements.totalProducts) {
        elements.totalProducts.innerText =
            (products || []).length;
    }

    if (elements.totalUsers) {
        elements.totalUsers.innerText =
            localStorage.getItem(
                "visits"
            ) || 0;
    }

    const revenue = (orders || []).reduce(
        (sum, order) => {

            return (
                sum +
                parseFloat(
                    order.total || 0
                ) || 0
            );

        },
        0
    );

    if (elements.totalRevenue) {
        elements.totalRevenue.innerText =
            `₹${revenue.toFixed(2)}`;
    }
}

// add product
if (elements.productForm) {
    elements.productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const productData = {
            name:
                elements.productName.value,

            category:
                elements.productCategory.value,

            price:
                parseFloat(
                    elements.productPrice.value
                ) || 0,
            
            description:
                elements.productDescription.value,
            
            image:
                elements.productImage.value,
            
            stock:
                parseInt(
                    elements.productStock.value
                ) || 0,
            
            featured:
                elements.featuredProduct.checked
        };
        if (
            !productData.name.trim()
            || !productData.category.trim()
            || productData.price < 0
            || productData.stock < 0
        ) {
            AppUtils.notify(
                "Enter valid product details",
                "error"
            );
            return;
        }
        try {
            const res =
            await AppUtils.apiRequest(
                "/products",
                {
                    method: "POST",
                    body: JSON.stringify(
                        productData
                    )
                }
            );
            if (res.success) {
                AppUtils.notify(
                    "Product added successfully!",
                    "success"
                );
                await loadInitialData();
                elements.productForm.reset();
            } else {
                AppUtils.notify(
                    res.message ||
                    "Failed to add product",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);
            AppUtils.notify(
                "Failed to add product.",
                "error"
            );
        }
    });
}

// render products
function renderProducts() {
    if (!elements.productTableBody) {
        return;
    }

    elements.productTableBody.innerHTML =
        "";
    
    if (!(products || []).length) {
        elements.productTableBody.innerHTML =
            `
                <tr>
                    <td colspan="6">
                        No products found
                    </td>
                </tr>
            `;    
        return;
    }

    (products || []).forEach((product) => {
        if (!product.id) {
            return;
        }
        if (!product) {
            return;
        }
        const row =
            document.createElement("tr");
        row.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <button
                    type="button"
                    class="action-btn edit-btn"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="action-btn delete-btn"
                >
                    Delete
                </button>
            </td>
        `;

        row.children[0].innerText =
            product.name || "Product";

        row.children[1].innerText =
            product.category || "Category";

        row.children[2].innerText =
            AppUtils.formatPrice(
                product.price || 0
            );

        row.children[3].innerText =
            String(product.stock || 0);

        row.children[4].innerText =
            product.featured
                ? "Featured"
                : "—";

        row.querySelector(".edit-btn")
            ?.addEventListener(
                "click",
                () => {
                    editProduct(product.id);
                }
            );

        row.querySelector(".delete-btn")
            ?.addEventListener(
                "click",
                () => {
                    deleteProduct(product.id);
                }
            );

        elements.productTableBody
            .appendChild(row);
    });
}

// delete product
async function deleteProduct(id) {
    const confirmed =
        confirm(
            "Delete this product permanently?"
        );

    if (!confirmed) {
        return;
    }
    try {
        const res =
            await AppUtils.apiRequest(
                `/products/${id}`,
                {
                    method: "DELETE"
                }
            );
        if (res.success) {
            products = products.filter(
                (p) => p.id !== id
            );
            renderProducts();
            renderStats();
            AppUtils.notify(
                "Product deleted successfully!",
                "success"
            );
        } else {
            AppUtils.notify(
                res.message ||
                "Failed to delete product",
                "error"
            );
        }
    } catch (error) {
        console.error(error);
        AppUtils.notify(
            "Failed to delete product.",
            "error"
        );
    }
}

// edit products
async function editProduct(id) {
    const product = products.find((p) => p.id === id);
    if (!product) {
        return;
    }

    const newName = prompt("Edit Product Name", product.name);
    const newPrice = prompt("Edit Product Price", product.price);
    const newStock = prompt("Edit Product Stock", product.stock);

    if (
        newName?.trim()
        && !isNaN(newPrice)
        && !isNaN(newStock)
        && parseFloat(newPrice) >= 0
        && parseInt(newStock) >= 0
    ) {
        const updatedData = {
            name: newName.trim(),
            description:
                product.description || "",
            price: parseFloat(newPrice),
            image:
                product.image || "",
            category:
                product.category || "",
            stock: parseInt(newStock) || 0,
            featured:
                product.featured || false
        };

        try {
            const res =
                await AppUtils.apiRequest(
                    `/products/${id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(
                            updatedData
                        )
                    }
                );
            if (res.success) {
                Object.assign(product, updatedData);
                renderProducts();
                renderStats();
                AppUtils.notify(
                    "Product updated successfully!",
                    "success"
                );
            } else {
                AppUtils.notify(
                    res.message ||
                    "Failed to update product",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);
            AppUtils.notify(
                "Failed to update product.",
                "error"
            );
        }
    }
}

// render orders
function renderOrders() {
    if (!elements.ordersTableBody) return;
    elements.ordersTableBody.innerHTML = "";
    if (!(orders || []).length) {
        elements.ordersTableBody.innerHTML =
            `
                <tr>
                    <td colspan="3">
                        No orders found
                    </td>
                </tr>
            `;    
        return;
    }
    (orders || []).forEach((order) => {
        if (!order) {
            return;
        }
        const row = document.createElement("tr");
        row.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
        `;

        row.children[0].innerText =
            String(order.id || "-");

        row.children[1].innerText =
            order.date || "-";

        row.children[2].innerText =
            AppUtils.formatPrice(
                order.total || 0
            );
        elements.ordersTableBody.appendChild(row);
    });
}

// initialize
loadInitialData();