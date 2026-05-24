// dashboard order elements
const dashboardOrderElements = {
    ordersContainer:
        document.getElementById(
            "orders-list"
        ),

    ordersCount:
        document.getElementById(
            "orders-count"
        )
};

// order badge color
function getOrderStatusClass(
    status = "pending"
) {
    switch (
        status.toLowerCase()
    ) {
        case "delivered":
            return "success";

        case "processing":
            return "warning";

        case "cancelled":
            return "danger";

        default:
            return "info";
    }
}

// render orders
function renderDashboardOrders() {
    const orders =
        AppUtils.getJSON(
            "orders",
            []
        );

    if (
        dashboardOrderElements.ordersCount
    ) {
        dashboardOrderElements.ordersCount.innerText =
            orders.length;
    }

    if (
        !orders.length
    ) {
        renderDashboardEmptyState(
            dashboardOrderElements.ordersContainer,
            "No orders found."
        );

        return;
    }

    if (
        !dashboardOrderElements.ordersContainer
    ) {
        return;
    }

    dashboardOrderElements.ordersContainer.innerHTML =
        "";

    orders.forEach(
        (order) => {
            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "dashboard-order-card";

            card.innerHTML = `
                <div class="dashboard-order-top">
                    <div>
                        <h4>
                            Order #${
                                order.id
                            }
                        </h4>

                        <small>
                            ${
                                order.date
                                || "Recently"
                            }
                        </small>
                    </div>

                    <span class="
                        order-status-badge
                        ${
                            getOrderStatusClass(
                                order.status
                            )
                        }
                    ">
                        ${
                            order.status
                            || "Pending"
                        }
                    </span>
                </div>

                <div class="dashboard-order-body">
                    <p>
                        Items:
                        ${
                            order.items?.length
                            || 0
                        }
                    </p>

                    <strong>
                        ${
                            AppUtils.formatPrice(
                                order.total || 0
                            )
                        }
                    </strong>
                </div>
            `;

            dashboardOrderElements
                .ordersContainer
                .appendChild(
                    card
                );
        }
    );
}

// expose globally
window.renderDashboardOrders =
    renderDashboardOrders;