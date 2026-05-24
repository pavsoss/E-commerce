// mobile navbar
const bar =
    document.getElementById(
        "bar"
    );

const nav =
    document.getElementById(
        "navbar"
    );

if (bar && nav) {
    bar.addEventListener(
        "click",
        () => {
            nav.classList.toggle(
                "active"
            );
            nav.style.right =
                nav.style.right === "0px"
                    ? "-300px"
                    : "0px";
        }
    );
}

// sticky header
const header =
    document.getElementById(
        "header"
    );

if (header) {
    let ticking = false;
    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(
                    () => {
                        header.style.boxShadow =
                            window.scrollY > 80
                                ? "0 5px 25px rgba(0,0,0,0.15)"
                                : "none";
                        ticking = false;
                    }
                );
                ticking = true;
            }
        }
    );
}

// button ripple effect
document
    .querySelectorAll("button")
    .forEach((btn) => {

        btn.addEventListener(
            "click",
            function (e) {

                const ripple =
                    document.createElement(
                        "span"
                    );

                ripple.style.cssText = `
                    position:absolute;
                    width:10px;
                    height:10px;
                    background:white;
                    border-radius:50%;
                    transform:scale(0);
                    animation:ripple 0.6s linear;
                    top:${e.offsetY}px;
                    left:${e.offsetX}px;
                `;

                this.style.position =
                    "relative";

                this.appendChild(
                    ripple
                );

                setTimeout(
                    () => ripple.remove(),
                    600
                );
            }
        );
    });

// global cart count badge
function updateCartCount() {
    const cart =
        AppUtils.getCart();

    const total =
        cart.reduce(
            (sum, item) => {

                return (
                    sum +
                    (
                        parseInt(
                            item.qty
                        ) || 0
                    )
                );
            },
            0
        );

    let badge =
        document.getElementById(
            "cart-count"
        );

    if (!badge) {

        badge =
            document.createElement(
                "span"
            );

        badge.id =
            "cart-count";

        badge.style.cssText = `
            position:absolute;
            top:-8px;
            right:-10px;
            background:red;
            color:white;
            font-size:12px;
            padding:2px 6px;
            border-radius:50%;
        `;

        const cartIcon =
            document.querySelector(
                ".fa-shopping-bag"
            )?.parentElement;

        if (cartIcon) {

            cartIcon.appendChild(
                badge
            );
        }
    }

    badge.innerText = total;
}

updateCartCount();

// expose globally
window.updateCartCount =
    updateCartCount;