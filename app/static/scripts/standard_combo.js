fetch("/show_plans", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
})
    .then(response => response.json())
    .then(data => {
        if (data) {
            planToggale(data);
        } else {
            console.error("Plans not found in response:", data);
        }
    })

    .catch(error => {
        console.error("Error fetching plans:", error);
    });

let fileName = planToggale();

fetch("/plan_details", {
    method: "GET",
    body: fileName,
})
    .then(response => response.json())
    .then(res => {
        const data = res.plans;
        console.log("Data:", data);
        if (data) {
            showPlans(data);
        } else {
            console.error("Plans details not found in response:", data);
        }
    })

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
    return plan.subtitle.trim().replace(" ", "_").toLowerCase();
}



function showPlans(data) {

    const planTitle = document.getElementById("title_container");
    planTitle.innerHTML = `
    <h1>${data["title"]}</h1>`;


    const planImage = document.getElementById("package_img");
    planImage.innerHTML = `
    <img src="${data["file"]}"  alt="${data["title"]}" class="img-fluid" id="plan_img">`;


    const grid_1 = document.getElementById("grid1");
    grid_1.innerHTML = "";


    const table = document.createElement("table");
    table.classList.add("table");
    table.innerHTML = `
        <tr>
            <th>Price</th>
            <th>Voice</th>
            <th>SMS</th>
            <th>DATA</th>
            <th>Time</th>
        </tr>
        `
    for (let i = 0; i < data.subtitle.length; i++) {
        const tableRow = document.createElement("tr");
        tableRow.classList.add("table_row");

        for (let j = 0; j < 5; j++) {
            const index = j + i * 5;
            const tableData = document.createElement("td");
            tableData.classList.add("table_data");
            tableData.textContent = data.details[index].split(":")[1].trim();
            tableRow.appendChild(tableData);
        }
        table.appendChild(tableRow);
    }
    grid_1.appendChild(table);

    const grid2 = document.getElementById("grid2");
    grid2.innerHTML = "";

    const table2 = document.createElement("table");
    table2.classList.add("table2");
    table2.innerHTML = `
        <tr>
            <th>TRC Reference No</th>
            <th>Commencing Date</th>
            <th>Expiry Date</th>
        </tr>
            `;
    for (let i = 0; i < data["TRC Reference No"].length; i++) {
        const tableRow2 = document.createElement("tr");

        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        td1.textContent = data["TRC Reference No"][i].trim();
        td2.textContent = data["Commencing Date"][i].trim();
        td3.textContent = data["Expiry Date"][i].trim();
        tableRow2.appendChild(td1);
        tableRow2.appendChild(td2);
        tableRow2.appendChild(td3);

        table2.appendChild(tableRow2);
    }
    grid2.appendChild(table2);
}

