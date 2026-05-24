// dashboard settings elements
const dashboardSettingsElements = {
    settingsForm:
        document.getElementById(
            "settings-form"
        ),

    settingsName:
        document.getElementById(
            "settings-name"
        ),

    settingsEmail:
        document.getElementById(
            "settings-email"
        )
};

// validate profile
function validateDashboardProfile(
    name,
    email
) {
    if (
        !name ||
        !email
    ) {
        notify(
            "All profile fields are required",
            "error"
        );
        return false;
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        !emailRegex.test(
            email
        )
    ) {
        notify(
            "Invalid email address",
            "error"
        );
        return false;
    }
    return true;
}

// save profile
function saveDashboardProfile(
    event
) {
    event.preventDefault();
    const user =
        AppUtils.getJSON(
            "user",
            {}
        );

    const updatedUser = {
        ...user,

        name:
            dashboardSettingsElements
                .settingsName
                ?.value
                .trim(),

        email:
            dashboardSettingsElements
                .settingsEmail
                ?.value
                .trim()
    };

    const valid =
        validateDashboardProfile(
            updatedUser.name,
            updatedUser.email
        );

    if (!valid) {
        return;
    }

    AppUtils.setJSON(
        "user",
        updatedUser
    );

    // update dashboard UI
    if (
        dashboardElements?.userName
    ) {
        dashboardElements.userName.innerText =
            updatedUser.name;
    }

    if (
        dashboardElements?.userEmail
    ) {
        dashboardElements.userEmail.innerText =
            updatedUser.email;
    }

    notify(
        "Profile updated successfully!",
        "success"
    );
}

// bind form
if (
    dashboardSettingsElements.settingsForm
) {
    dashboardSettingsElements
        .settingsForm
        .addEventListener(
            "submit",
            saveDashboardProfile
        );
}

// expose globally
window.saveDashboardProfile =
    saveDashboardProfile;