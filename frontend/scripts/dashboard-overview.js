// dashboard elements
const dashboardElements = {
    userName:
        document.getElementById(
            "user-name"
        ),

    userEmail:
        document.getElementById(
            "user-email"
        ),

    settingsName:
        document.getElementById(
            "settings-name"
        ),

    settingsEmail:
        document.getElementById(
            "settings-email"
        ),

    menuItems:
        document.querySelectorAll(
            ".dashboard-menu li"
        ),

    tabs:
        document.querySelectorAll(
            ".dashboard-tab"
        )
};

// empty state
function renderDashboardEmptyState(
    container,
    message
) {
    if (!container) {
        return;
    }

    container.innerHTML =
        `<p>${message}</p>`;
}

// user data
function loadDashboardUserData(
    user
) {
    if (!user) {
        return;
    }

    if (
        dashboardElements.userName
    ) {
        dashboardElements.userName.innerText =
            user.name || "User";
    }

    if (
        dashboardElements.userEmail
    ) {
        dashboardElements.userEmail.innerText =
            (
                user.email || ""
            ).trim();
    }

    if (
        dashboardElements.settingsName
    ) {
        dashboardElements.settingsName.value =
            user.name || "";
    }

    if (
        dashboardElements.settingsEmail
    ) {
        dashboardElements.settingsEmail.value =
            (
                user.email || ""
            ).trim();
    }
}

// tabs
function initializeDashboardTabs() {
    dashboardElements.menuItems.forEach(
        (item) => {
            item.addEventListener(
                "click",
                () => {
                    dashboardElements.menuItems.forEach(
                        (menu) => {
                            menu.classList.remove(
                                "active-tab"
                            );
                        }
                    );

                    dashboardElements.tabs.forEach(
                        (tab) => {
                            tab.classList.remove(
                                "active"
                            );
                        }
                    );

                    item.classList.add(
                        "active-tab"
                    );

                    const target =
                        item.dataset.tab;

                    const targetElement =
                        document.getElementById(
                            target
                        );

                    if (
                        targetElement
                    ) {
                        targetElement.classList.add(
                            "active"
                        );
                    }
                }
            );
        }
    );
}

// hash navigation
function openDashboardTabFromHash() {
    const hash =
        window.location.hash.replace(
            "#",
            ""
        );

    if (!hash) {
        return;
    }

    dashboardElements.menuItems.forEach(
        (menu) => {
            menu.classList.remove(
                "active-tab"
            );
        }
    );

    dashboardElements.tabs.forEach(
        (tab) => {
            tab.classList.remove(
                "active"
            );
        }
    );

    const targetTab =
        document.getElementById(
            hash
        );

    const targetMenu =
        document.querySelector(
            `.dashboard-menu li[data-tab="${hash}"]`
        );

    if (targetTab) {
        targetTab.classList.add(
            "active"
        );
    }

    if (targetMenu) {
        targetMenu.classList.add(
            "active-tab"
        );
    }
}

// listeners
window.addEventListener(
    "load",
    openDashboardTabFromHash
);

// expose globally
window.dashboardElements =
    dashboardElements;

window.renderDashboardEmptyState =
    renderDashboardEmptyState;

window.loadDashboardUserData =
    loadDashboardUserData;

window.initializeDashboardTabs =
    initializeDashboardTabs;