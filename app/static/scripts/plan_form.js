
document.addEventListener("DOMContentLoaded", () => {

    const area = document.getElementById("selective_area");
    const checkbox = document.getElementById("selective-checkbox");
    const container = document.getElementById("selection_list");
    const dropList = document.getElementById("select_dtn");

    fetch("/admin", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "admin exists.") {
                dropList.classList.remove("disabled");
            } else {
                dropList.classList.add("disabled");
            }
        })
    const form = document.getElementById("planform");
    if (form) {
        console.log("adding event listener to form");
        form.addEventListener("submit", add_plan);
    } else {
        console.error("Error: Form with ID 'planform' not found.");
    }



    checkbox.addEventListener("click", (event) => {
        event.stopPropagation();
        container.style.display = checkbox.checked ? "flex" : "none";
    });

    document.addEventListener("click", (event) => {
        const isClickInsideArea = area.contains(event.target);
        const isClickInsideContainer = container.contains(event.target);

        if (!isClickInsideArea && !isClickInsideContainer) {
            container.style.display = "none";
        }
    });



});

const subSection = document.getElementById("subtitle_container");
subSection.innerHTML = "";

const addSub = document.getElementById("add_subtitle");
addSub.addEventListener("click", () => {
    const inputWrapper = document.createElement("div");
    inputWrapper.classList.add("input_wrapper");
    inputWrapper.style.position = "relative";
    inputWrapper.innerHTML = "";

    const subTitle = document.createElement("input");
    subTitle.type = "text";
    subTitle.name = "plan_subtitles[]";
    subTitle.placeholder = "Subtitle";
    inputWrapper.appendChild(subTitle);

    const removeIcon = document.createElement("img");
    removeIcon.src = "https://jnrcnizvaihqtkeynkjk.supabase.co/storage/v1/object/public/webimages/icons/close-line-svgrepo-com.svg";
    removeIcon.alt = "Remove";
    removeIcon.style.width = "20px";
    removeIcon.style.height = "20px";
    removeIcon.style.cursor = "pointer";
    removeIcon.style.position = "absolute";
    removeIcon.style.top = "17%";
    removeIcon.style.right = "10px";
    inputWrapper.appendChild(removeIcon);


    subSection.appendChild(inputWrapper);
    removeIcon.addEventListener("click", () => {
        subSection.removeChild(inputWrapper);
    });
});



async function add_plan(event) {
    event.preventDefault();

    const form = document.getElementById("planform");
    const formData = new FormData(form);
    const submitButton = document.getElementById("submitButton");
    submitButton.disabled = true;

    const roles = [];

    form.querySelectorAll('input[name="role"]:checked').forEach(checkbox => {
        roles.push(checkbox.value);
    });

    formData.delete("role");

    formData.append("roles", JSON.stringify(roles));

    formData.forEach((value, key) => {
        console.log(key, value);
    });

    try {
        const response = await fetch("/add_plan", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Plan added successfully:", data);
            form.reset();
        } else {
            console.log("Error:", data.error);
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        submitButton.disabled = false;
    }
}

async function preCheckBoxes() {
    const res = await fetch('/get_allowed_roles');
    const select = await res.json();

    const checkboxes = document.querySelectorAll("#selection_item input[type='checkbox']");
    checkboxes.forEach(cb => {
        if (select.includes(cb.value)) {
            cb.checked = true;
        }
    });
}


preCheckBoxes();


function handleCheckbox(checkbox) {
    const value = checkbox.value;
    const selected = checkbox.checked;

    fetch("/role_update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ value, selected })
    });
}
