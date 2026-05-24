// hero rotating text
const heroTexts = [
    "Super Value Deals",
    "Latest Fashion Trends",
    "Save More With Coupons",
    "New Arrivals Available"
];

let heroIndex = 0;
const heroHeading =
    document.querySelector(
        "#hero h1"
    );

if (heroHeading) {
    setInterval(() => {
        heroIndex =
            (
                heroIndex + 1
            ) % heroTexts.length;

        heroHeading.style.opacity =
            "0";

        setTimeout(
            () => {
                heroHeading.innerText =
                    heroTexts[
                        heroIndex
                    ];

                heroHeading.style.opacity =
                    "1";
            },
            300
        );

    }, 4000);
}

// countdown timer
const countdown =
    document.getElementById(
        "countdown"
    );

if (countdown) {
    const targetDate =
        new Date();

    targetDate.setDate(
        targetDate.getDate() + 5
    );

    function updateCountdown() {
        const now =
            new Date().getTime();

        const distance =
            targetDate - now;

        if (distance < 0) {
            countdown.innerHTML =
                "Offer Expired";

            return;
        }

        const days =
            Math.floor(
                distance /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );

        const hours =
            Math.floor(
                (
                    distance %
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                ) /
                (
                    1000 *
                    60 *
                    60
                )
            );

        const minutes =
            Math.floor(
                (
                    distance %
                    (
                        1000 *
                        60 *
                        60
                    )
                ) /
                (
                    1000 *
                    60
                )
            );
        countdown.innerHTML =
            `${days}d ${hours}h ${minutes}m`;
    }

    updateCountdown();
    setInterval(
        updateCountdown,
        60000
    );
}

// newsletter validation
const newsletterForm =
    document.querySelector(
        "#newsletter .form"
    );

if (newsletterForm) {
    newsletterForm.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();
            const input =
                newsletterForm.querySelector(
                    "input"
                );

            const email =
                input?.value.trim();

            const validEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !email ||
                !validEmail.test(email)
            ) {
                notify(
                    "Please enter a valid email",
                    "error"
                );

                return;
            }

            notify(
                "Newsletter subscription successful!",
                "success"
            );
            newsletterForm.reset();
        }
    );
}