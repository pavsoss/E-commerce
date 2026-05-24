// cart state
let cart = AppUtils.getCart();

// cart page elements
const elements = {
    cartContainer: document.getElementById("cart-items"),
    subtotalElement: document.getElementById("subtotal"),
    taxElement: document.getElementById("tax"),
    totalElement: document.getElementById("total"),
    checkoutShipping: document.getElementById("checkout-shipping"),
    addToCartBtn: document.getElementById("add-to-cart-btn"),
    buyNowBtn: document.getElementById("buy-now-btn")
};

// render cart
async function renderCart() {
    if (!elements.cartContainer) return;
    elements.cartContainer.innerHTML = "";
    if(cart.length === 0) {
        elements.cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add products to continue shopping.</p>
                <a href="shop.html" class="continue-shopping-btn">Continue Shopping</a>
            </div>
        `;
        elements.subtotalElement.innerText = "₹0";
        elements.taxElement.innerText = "₹0";
        elements.totalElement.innerText = "₹0";
        return;
    }

    let subtotal = 0;
    cart.forEach((item, index) => {
        const price =
            parseFloat(item.price) || 0;
        subtotal += price * item.qty;
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Price: ${AppUtils.formatPrice(price)}</p>
                <div class="cart-qty-controls">
                    <button data-index="${index}" class="decrease-qty">-</button>
                    <span>${item.qty}</span>
                    <button data-index="${index}" class="increase-qty">+</button>
                </div>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        const moveBtn = document.createElement("button");
        moveBtn.classList.add("move-wishlist-btn");
        moveBtn.innerText = "Move to Wishlist";
        moveBtn.dataset.index = index;
        moveBtn.addEventListener("click", () => {
            const wishlist = AppUtils.getWishlist();
            const exists = wishlist.find(
                item =>
                    item.id === cart[index].id &&
                    item.color === cart[index].color &&
                    item.size === cart[index].size
            );
            if(!exists){
                wishlist.push(cart[index]);
            }
            AppUtils.saveWishlist(wishlist);
            cart.splice(index, 1);
            saveCart();
            renderCart();
            AppUtils.notify("Moved to wishlist ❤️", "success");
        });
        cartItem.querySelector(".cart-item-info").appendChild(moveBtn);
        elements.cartContainer.appendChild(cartItem);
    });

    const tax = subtotal * 0.18;
    // CALCULATE SHIPPING
    let shippingCost = 0;
    if(subtotal < 999 && subtotal > 0){
        shippingCost = 49; // flat shipping fee below ₹999
    }
    AppUtils.setJSON("shippingCost", shippingCost);
    const total = subtotal + tax + shippingCost;

    if(elements.subtotalElement){
        elements.subtotalElement.innerText =
            `₹${subtotal.toFixed(2)}`;
    }
    if(elements.taxElement){
        elements.taxElement.innerText = `₹${tax.toFixed(2)}`;
    }
    
    if(elements.checkoutShipping){
        elements.checkoutShipping.innerText = shippingCost === 0 ? "Free" : `₹${shippingCost}`;
    }
    
    if(elements.totalElement){
        elements.totalElement.innerText =
            `₹${total.toFixed(2)}`;
    }
    attachCartEventListeners();
}

// cart event listeners
function attachCartEventListeners() {
    document.querySelectorAll(".increase-qty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if (!cart[index]) return;
            cart[index].qty++;
            saveCart();
            renderCart();
        });
    });

    document.querySelectorAll(".decrease-qty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if (!cart[index]) return;
            if (cart[index].qty > 1) {
                cart[index].qty--;
            } else {
                cart.splice(index, 1);
            }
            saveCart();
            renderCart();
        });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if (!cart[index]) return;
            cart.splice(index, 1);
            saveCart();
            renderCart();
        });
    });
}

// add to cart from product/product page
async function addToCartFromProduct(product) {
    const item = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        img: product.img || product.image,
        color: product.color,
        size: product.size,
        qty: product.qty || 1
    };

    // standardized cart duplicate check
    const existingIndex = cart.findIndex(p => p.id === item.id && p.color === item.color && p.size === item.size);
    if(existingIndex >= 0){
        cart[existingIndex].qty += item.qty;
    } else {
        cart.push(item);
    }
    saveCart();
    AppUtils.notify("Added to cart 🛍️", "success");

    // sync cart to backend for logged-in users
    const token = AppUtils.getToken();
    if(token){
        try{
            const data = await AppUtils.apiRequest("/cart/add", {
                method: "POST",
                body: JSON.stringify(item)
            });
            if(!data.success){
                console.warn("Backend cart sync failed");
            }
        } catch(err){
            console.error("Error adding item to backend cart:", err);
        }
    }

    // Update cart totals if cart page is open
    if(elements.cartContainer){
        renderCart();
    }
}

// save cart
function saveCart() {
    AppUtils.saveCart(cart);
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    if(elements.cartContainer){
        renderCart();
    }
});