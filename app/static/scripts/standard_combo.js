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
            planToggale(data);
        } else {
            console.error("Plans not found in response:", data);
        }
    })

    .catch(error => {
        console.error("Error fetching plans:", error);
    });

function planToggale(data) {
    const planToggale = document.getElementById("package_toggle");
    planToggale.innerHTML = "";

    data.forEach(plan => {
        const menu = document.createElement("div");
        menu.classList.add("meun");
        menu.innerHTML = `
        <div class="menu_parent">
            <div class="title">
                <a href="${plan.subtitle.trim().replace(/\s+/g, '')}.html">${plan.subtitle}</a>
            </div>
        </div>
        `;
        planToggale.appendChild(menu);
    });
}