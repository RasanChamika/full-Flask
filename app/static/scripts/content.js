fetch("/show_plans", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
})
    .then(response => response.json())
    .then(data => {
        // Ensure data has a 'plans' key, and it's an array
        if (data) {
            updatePlans(data);
        } else {
            console.error("Plans not found in response:", data);
        }
    })

    .catch(error => {
        console.error("Error fetching plans:", error);
    });



// var img = [];

// img[0] = ["../static/images/banner_1.png"];
// img[1] = ["../static/images/5g-desktop.jpg"]
// img[2] = ["../static/images/Awurudu2025_Web.jpg"]
// img[3] = ["../static/images/DeviceOffer2in1_Desk.jpg"]
// img[4] = ["../static/images/MAX PLUS SLI DESK.jpg"]
// img[5] = ["../static/images/S25 ANDEsk.jpg"]
// img[6] = ["../static/images/ts desk1600542.png"]
// img[7] = ["../static/images/WEB BANNER DESKTOP MPLUS.jpg"]

// var index = 1;

function bannerFadeOut() {
    const image = document.querySelectorAll("#banner_img");
    let index = 0;
    const interval = 150; // interval time in ms
    const duration = 4000; // total fade duration in ms
    const holdTime = 2000; // hold time at full opacity before fade
    const gap = interval / duration;

    function fadeOutIn() {
        const current = image[index];
        const next = image[(index + 1) % image.length];
        let op = 1;

        // Make sure next image is prepared
        next.style.opacity = 0;
        next.style.display = "block";

        // Hold current image at full opacity
        setTimeout(() => {
            const fading = setInterval(() => {
                op -= gap;
                current.style.opacity = op;
                next.style.opacity = 1 - op;

                if (op <= 0) {
                    clearInterval(fading);
                    current.style.opacity = 0;
                    current.style.display = "none";
                    next.style.opacity = 1;
                    index = (index + 1) % image.length;
                    setTimeout(fadeOutIn, 0); // trigger next image immediately
                }
            }, interval);
        }, holdTime);
    }

    // Initialize all images' opacity
    image.forEach((img, i) => {
        img.style.opacity = i === 0 ? 1 : 0;
        img.style.display = i === 0 ? "block" : "none";
        img.style.position = "absolute";
        img.style.top = 0;
        img.style.left = 0;
        img.style.width = "100%";
        img.style.transition = "opacity 0.5s ease-in-out";
    });

    setTimeout(fadeOutIn, 2000); // initial delay before first fade
}


window.onload = bannerFadeOut;

function updatePlans(data) {

    const planContainer = document.getElementById("plan_cards");
    planContainer.innerHTML = "";

    data.forEach(plan => {
        const card = document.createElement("div");
        card.classList.add("card");
        const trimedSub = plan.subtitle.trim().replace(/\s+/g, '');
        console.log(trimedSub);
        card.setAttribute("data-href", `${trimedSub}.html`);
        card.innerHTML = `
        <img src = "${plan.file}" class = "card-img-top" alt = "${plan.title}">
        <h2>${plan.title}</h2>
        <p>${plan.subtitle}</p>
        <p>${plan.description}</p>
        <p>${plan.price}</p>
        `;
        planContainer.appendChild(card);
    });

    plansStore(data);
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            // Handle card click event
            const href = card.getAttribute("data-href")
            console.log(href)
            window.location.href = href;

        });


    });


}

function generateCustomUUID(title) {
    const prefix = title.replace(/\s+/g, '').toLowerCase().slice(0, 4);
    const now = new Date();
    const timestamp = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0');
    const randomPart = Math.floor(Math.random() * 10000).toString(16);

    return `${prefix}-${timestamp}-${randomPart}`;
}

function plansStore(data) {
    data.forEach(plan => {
        const planId = generateCustomUUID(plan.subtitle);
        const package = {
            id: planId,
            title: plan.title,
            subtitle: plan.subtitle,
            description: plan.description,
            file: plan.file,
            price: plan.price
        };
        fetch("/save_plans", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(package)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Plan saved successfully:", plan);
                } else {
                    console.error("Error saving plan:", response.statusText);
                }
            });
    });

}
