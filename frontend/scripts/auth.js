// auth page elements
const elements = {
    signupForm: document.getElementById("signup-form"),
    signinForm: document.getElementById("signin-form"),

    signupName: document.getElementById("signup-name"),
    signupEmail: document.getElementById("signup-email"),
    signupPassword: document.getElementById("signup-password"),

    signinEmail: document.getElementById("signin-email"),
    signinPassword: document.getElementById("signin-password"),

    authLink: document.getElementById("auth-link"),
    dropdown: document.getElementById("profile-dropdown"),
    logoutBtn: document.getElementById("logout-btn")
};

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// BACKEND AUTH FUNCTIONS
// signup user
const signupUser = async (name, email, password) => {
    return await AppUtils.apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
            name,
            email,
            password
        })
    });
};

// login user
const loginUser = async (email, password) => {
    return await AppUtils.apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password
        })
    });
};

function toggleFormLoading(button, isLoading, loadingText = "Please wait...") {
    if(!button) return;

    if(isLoading){
        button.dataset.originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = loadingText;
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || "Submit";
    }
}

// clear auth/session data
const clearAuthSession = () => {
    AppUtils.clearAuthData();

    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
};

// EMAIL SIGNUP
if(elements.signupForm){
    elements.signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if(
            e.submitter?.disabled
        ){
            return;
        }
        const name = elements.signupName.value.trim();
        const email = elements.signupEmail.value.trim();
        const password = elements.signupPassword.value;
        if (!name) {
            AppUtils.notify("Name is required", "error");
            return;
        }

        if (!emailRegex.test(email)) {
            AppUtils.notify("Enter a valid email", "error");
            return;
        }

        if (!passwordRegex.test(password)) {
            AppUtils.notify(
                "Password must contain uppercase, lowercase, number and 8 characters",
                "error"
            );
            return;
        }
        const submitBtn = elements.signupForm.querySelector("button[type='submit']");
        toggleFormLoading(submitBtn, true, "Creating Account...");
        try {
            const response = await signupUser(name, email, password);
            if(response.success){
                AppUtils.notify(
                    "Account Created Successfully!",
                    "success"
                );
                window.location.href = "signin.html";
            } else {
                AppUtils.notify(response.message, "error");
            }
        } catch(error){
            console.error(error);
            AppUtils.notify("Signup failed. Please try again.", "error");
        } finally {
            toggleFormLoading(submitBtn, false);
        }
    });
}

// EMAIL SIGNIN
if(elements.signinForm){
    elements.signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if(
            e.submitter?.disabled
        ){
            return;
        }
        const email = elements.signinEmail.value.trim();
        const password = elements.signinPassword.value.trim();
        if (!emailRegex.test(email)) {
            AppUtils.notify(
                "Enter a valid email",
                "error"
            );
            return;
        }
        if (!password) {
            AppUtils.notify(
                "Password is required",
                "error"
            );
            return;
        }
        const submitBtn = elements.signinForm.querySelector("button[type='submit']");
        toggleFormLoading(submitBtn, true, "Signing In...");

        try {
            const response = await loginUser(email, password);
            if(response.success){
                // Store auth data
                localStorage.setItem("token", response.accessToken);
                localStorage.setItem(
                    "refreshToken",
                    response.refreshToken
                );
                AppUtils.setJSON("user", response.user);

                AppUtils.notify("Login Successful!", "success");

                window.location.href = "index.html";
            } else {
                AppUtils.notify(response.message, "error");
            }
        } catch(error){
            console.error(error);
            AppUtils.notify("Login failed. Please try again.", "error");
        } finally {
            toggleFormLoading(submitBtn, false);
        }
    });
}

// current auth token
const token = AppUtils.getToken();

if(elements.authLink){
    if(token){
        elements.authLink.innerHTML = `<i class="fas fa-user"></i>`;
        elements.authLink.href = "#";
        elements.authLink.classList.add("profile-active");

        // Toggle Dropdown
        elements.authLink.addEventListener("click", (e) => {
            e.preventDefault();
            if(elements.dropdown){
                elements.dropdown.classList.toggle("active");
            }
        });

        // Logout
        if(elements.logoutBtn){
            elements.logoutBtn.addEventListener("click", () => {
                clearAuthSession();
                if(elements.dropdown){
                    elements.dropdown.classList.remove("active");
                }
                AppUtils.notify("Logged out successfully", "success");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 800);
            });
        }

        // Close Dropdown on outside click
        document.addEventListener("click", (e) => {
            if(!e.target.closest(".profile-wrapper")){
                if(elements.dropdown){
                    elements.dropdown.classList.remove("active");
                }
            }
        });
        document.addEventListener(
            "keydown",
            (e) => {
                if(
                    e.key === "Escape" &&
                    elements.dropdown
                ){        
                    elements.dropdown.classList.remove(
                        "active"
                    );
                }
            }
        );
    } else {
        elements.authLink.innerHTML = "Sign In";
        elements.authLink.href = "signin.html";
        elements.authLink.classList.remove("profile-active");

        if(elements.dropdown){
            elements.dropdown.classList.remove("active");
        }
    }
}