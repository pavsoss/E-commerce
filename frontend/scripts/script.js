// global state
let allProducts = [];

// fetch products
async function fetchAllProducts() {
    try {
        const data =
            await AppUtils.apiRequest(
                "/products"
            );

        if (data.success) {
            allProducts =
                Array.isArray(
                    data.products
                )
                    ? data.products
                    : [];

            window.allProducts =
                allProducts;

            renderProducts(
                allProducts
            );
        }
    } catch (error) {
        console.error(
            "PRODUCT FETCH ERROR:",
            error
        );
    }
}

fetchAllProducts();

// render products
function renderProducts(
    products = []
) {
    const container =
        document.getElementById(
            "products-container"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    products.forEach(
        (product) => {
            const card =
                document.createElement(
                    "div"
                );

            card.innerHTML =
                createProductCard(
                    product
                );

            const productElement =
                card.firstElementChild;

            if (
                productElement
            ) {
                container.appendChild(
                    productElement
                );
            }
        }
    );
}

// product quick view
document
    .querySelectorAll(
        ".pro img"
    )
    .forEach((img) => {
        img.addEventListener(
            "click",
            () => {
                const modal =
                    document.createElement(
                        "div"
                    );

                modal.style.cssText = `
                    position:fixed;
                    inset:0;
                    background:rgba(0,0,0,0.7);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    z-index:9999;
                `;

                modal.setAttribute(
                    "role",
                    "dialog"
                );

                modal.setAttribute(
                    "aria-modal",
                    "true"
                );

                const box =
                    document.createElement(
                        "div"
                    );

                box.style.cssText = `
                    background:white;
                    padding:20px;
                    border-radius:10px;
                    text-align:center;
                `;

                const big =
                    document.createElement(
                        "img"
                    );

                big.src =
                    img.src;

                big.style.width =
                    "300px";

                box.appendChild(
                    big
                );

                modal.appendChild(
                    box
                );

                document.body.appendChild(
                    modal
                );

                document.body.style.overflow =
                    "hidden";

                function closeModal() {
                    document.body.style.overflow =
                        "";

                    modal.remove();

                    document.removeEventListener(
                        "keydown",
                        handleEscape
                    );
                }

                function handleEscape(
                    event
                ) {
                    if (
                        event.key ===
                        "Escape"
                    ) {
                        closeModal();
                    }
                }

                modal.addEventListener(
                    "click",
                    closeModal
                );

                document.addEventListener(
                    "keydown",
                    handleEscape
                );
            }
        );
    });

// scroll animation
const observer =
    new IntersectionObserver(
        (entries) => {
            entries.forEach(
                (entry) => {
                    if (
                        entry.isIntersecting
                    ) {
                        entry.target.style.transform =
                            "translateY(0)";

                        entry.target.style.opacity =
                            "1";
                    }
                }
            );
        },
        {
            threshold: 0.1
        }
    );

document
    .querySelectorAll(
        ".pro, .fe-box, .banner-box"
    )
    .forEach((element) => {
        element.style.transform =
            "translateY(40px)";

        element.style.opacity =
            "0";

        element.style.transition =
            "0.6s ease";

        observer.observe(
            element
        );
        element.addEventListener(
            "transitionend",
            () => {
                observer.unobserve(
                    element
                );
            },
            {
                once: true
            }
        );
    });

// recently viewed products
const productCards =
    document.querySelectorAll(
        ".pro"
    );

let viewed =
    AppUtils.getJSON(
        "viewed",
        []
    );

productCards.forEach(
    (card) => {
        card.addEventListener(
            "click",
            () => {
                const product = {
                    name:
                        card.querySelector(
                            "h5"
                        )?.innerText,

                    image:
                        card.querySelector(
                            "img"
                        )?.src,

                    brand:
                        card.querySelector(
                            ".des span"
                        )?.innerText,

                    price:
                        card.querySelector(
                            "h4"
                        )?.innerText
                };

                viewed.unshift(
                    product
                );

                viewed = [
                    ...new Map(
                        viewed.map(
                            (p) => [
                                p.image ||
                                p.name,
                                p
                            ]
                        )
                    ).values()
                ].slice(0, 5);

                AppUtils.setJSON(
                    "viewed",
                    viewed
                );
            }
        );
    });

// estimated delivery date
function deliveryDate() {
    const date =
        new Date();

    date.setDate(
        date.getDate() +
        Math.floor(
            Math.random() * 5 + 3
        )
    );
    return date.toDateString();
}

productCards.forEach(
    (card) => {
        const delivery =
            document.createElement(
                "p"
            );

        delivery.style.fontSize =
            "11px";

        delivery.style.color =
            "#666";

        delivery.innerText =
            "Delivery by: " +
            deliveryDate();

        card.appendChild(
            delivery
        );
    }
);

// product labels
productCards.forEach(
    (card, index) => {
        if (index < 2) {
            const tag =
                document.createElement(
                    "span"
                );

            tag.innerText =
                "NEW";

            tag.style.cssText = `
                position:absolute;
                top:10px;
                right:10px;
                background:red;
                color:white;
                padding:3px 6px;
                font-size:10px;
                border-radius:4px;
            `;

            card.appendChild(
                tag
            );
        }
    }
);

// image hover zoom
productCards.forEach(
    (card) => {
        const img =
            card.querySelector(
                "img"
            );

        if (!img) {
            return;
        }

        img.style.transition =
            "0.3s";

        img.addEventListener(
            "mousemove",
            () => {
                img.style.transform =
                    "scale(1.2)";
            }
        );

        img.addEventListener(
            "mouseleave",
            () => {
                img.style.transform =
                    "scale(1)";
            }
        );
    }
);

// quantity buttons
productCards.forEach(
    (card) => {
        const qtyBox =
            document.createElement(
                "div"
            );

        qtyBox.style.marginTop =
            "8px";

        const minus =
            document.createElement(
                "button"
            );

        const plus =
            document.createElement(
                "button"
            );

        const count =
            document.createElement(
                "span"
            );

        minus.type =
            "button";

        plus.type =
            "button";

        minus.innerText =
            "-";

        plus.innerText =
            "+";

        count.innerText =
            "1";

        [minus, plus].forEach(
            (button) => {
                button.style.cssText = `
                    width:36px;
                    height:36px;
                    border:none;
                    border-radius:8px;
                    background:#f3f3f3;
                    font-size:18px;
                    cursor:pointer;
                    transition:0.3s ease;
                `;
            }
        );

        minus.onclick =
            () => {
                if (
                    Number(
                        count.innerText
                    ) > 1
                ) {
                    count.innerText =
                        Number(
                            count.innerText
                        ) - 1;
                }
            };

        plus.onclick =
            () => {
                count.innerText =
                    Number(
                        count.innerText
                    ) + 1;
            };

        qtyBox.append(
            minus,
            count,
            plus
        );

        card.appendChild(
            qtyBox
        );
    }
);

// lazy image loading
const lazyObserver =
    new IntersectionObserver(
        (entries) => {
            entries.forEach(
                (entry) => {
                    if (
                        entry.isIntersecting
                    ) {
                        lazyObserver.unobserve(
                            entry.target
                        );
                    }
                }
            );
        }
    );

document
    .querySelectorAll(
        "img"
    )
    .forEach((img) => {
        lazyObserver.observe(
            img
        );
    });

// clickable star ratings
document
    .querySelectorAll(
        ".star"
    )
    .forEach(
        (starContainer) => {
            const stars =
                starContainer.querySelectorAll(
                    "i"
                );

            stars.forEach(
                (
                    star,
                    index
                ) => {
                    star.style.cursor =
                        "pointer";

                    star.onclick =
                        () => {
                            stars.forEach(
                                (
                                    current,
                                    i
                                ) => {
                                    current.style.color =
                                        i <= index
                                            ? "gold"
                                            : "#ccc";
                                }
                            );
                        };
                }
            );
        }
    );