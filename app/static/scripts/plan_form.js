document.addEventListener("DOMContentLoaded", () => {

    const editableElements = [
        { element: document.getElementById("plan_name"), label: "Title :" },
        { element: document.getElementById("plan_price"), label: "Price :" },
        { element: document.getElementById("plan_description"), label: "Description :" },
        { element: document.getElementById("plan_img_url"), label: "Image URL :" }
    ];

    editableElements.forEach(({ element, label }) => {
        element.addEventListener("click", () => {
            showEditPopUp(element, label);
        });
    });

    document.getElementById("add_subtitle").addEventListener("click", () => {
        showDetailPopUp();
    });

    const inputValues = [
        { element: document.getElementById("plan_subtitle") },
        { element: document.getElementById("price_with_tax") },
        { element: document.getElementById("voice") },
        { element: document.getElementById("sms") },
        { element: document.getElementById("data") },
        { element: document.getElementById("reference_no") },
        { element: document.getElementById("cormmencing_date") },
        { element: document.getElementById("expiry_date") }
    ];

    inputValues.forEach(({ element }) => {
        element.addEventListener("input", () => {
            review_plan_form(element.value, element);
        });
    });

});


function showEditPopUp(element, label) {

    document.getElementById("title_section").style.opacity = "0.5";
    document.getElementById("title_section").style.transition = "0.3s";

    document.getElementById("form_container").style.opacity = "0.5";
    document.getElementById("form_container").style.transition = "0.3s";


    const inputWrapper = document.createElement("div");
    inputWrapper.classList.add("input_wrapper");
    inputWrapper.style.position = "absolute";
    inputWrapper.style.display = "flex";
    inputWrapper.style.flexDirection = "column";
    inputWrapper.style.justifyContent = "center";
    inputWrapper.style.alignItems = "center";
    inputWrapper.style.top = "30%";
    inputWrapper.style.left = "40%";
    inputWrapper.style.width = "400px";
    inputWrapper.style.height = "30vh";
    inputWrapper.style.border = "1px solid #ccc";
    inputWrapper.style.borderRadius = "10px";
    inputWrapper.style.backgroundColor = "white";
    inputWrapper.innerHTML = "";

    const removeImage = document.createElement("img");
    removeImage.classList.add("remove_icon");
    removeImage.src = "https://jnrcnizvaihqtkeynkjk.supabase.co/storage/v1/object/public/webimages/icons/close-line-svgrepo-com.svg";
    removeImage.alt = "Remove";
    removeImage.style.width = "20px";
    removeImage.style.height = "20px";
    removeImage.style.cursor = "pointer";
    removeImage.style.position = "absolute";
    removeImage.style.top = "0";
    removeImage.style.right = "0";

    const labelText = document.createElement("label");
    labelText.setAttribute("for", element.id);
    labelText.innerText = label;
    labelText.style.fontSize = "20px";
    labelText.style.fontWeight = "bold";
    labelText.style.marginBottom = "10px";

    inputWrapper.appendChild(labelText);


    if (element.id === "plan_description") {
        const textArea = document.createElement("textarea");
        textArea.name = "plan_description";
        textArea.setAttribute("for", element.id);
        textArea.id = "plan_input_textarea";
        textArea.style.display = "flex";
        textArea.style.width = "300px";
        textArea.style.height = "100px";
        textArea.style.border = "1px solid";
        textArea.style.borderRadius = "5px";

        inputWrapper.appendChild(textArea);
        setTimeout(() => textArea.focus(), 0);

        textArea.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                save.click();
            }
        });

    } else if (element.id === "plan_price" || element.id === "price_with_tax") {
        const inputNum = document.createElement("input");
        inputNum.type = "number";
        inputNum.name = "plan_title";
        inputNum.placeholder = label;
        inputNum.id = "plan_input_number"
        inputNum.style.display = "flex";
        inputNum.style.width = "300px";
        inputNum.style.height = "30px";
        inputNum.style.border = "1px solid";
        inputNum.style.borderRadius = "5px";

        inputWrapper.appendChild(inputNum);
        setTimeout(() => inputNum.focus(), 0);

        inputNum.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                save.click();
            }
        });
    } else if (element.id === "plan_img_url") {
        const inputUrl = document.createElement("input");
        inputUrl.type = "url";
        inputUrl.name = "plan_image_url";
        inputUrl.placeholder = label;
        inputUrl.id = "plan_input_url";
        inputUrl.style.display = "flex";
        inputUrl.style.width = "300px";
        inputUrl.style.height = "30px";
        inputUrl.style.border = "1px solid";
        inputUrl.style.borderRadius = "5px";

        inputWrapper.appendChild(inputUrl);
        setTimeout(() => inputUrl.focus(), 0);

        inputUrl.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                save.click();
            }
        });
    } else {
        const input = document.createElement("input");
        input.type = "text";
        input.name = "plan_title";
        input.placeholder = label;
        input.id = "plan_input"
        input.style.display = "flex";
        input.style.width = "300px";
        input.style.height = "30px";
        input.style.border = "1px solid";
        input.style.borderRadius = "5px";

        inputWrapper.appendChild(input);
        setTimeout(() => input.focus(), 0);

        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                save.click();
            }
        });
    }

    const save = document.createElement("button");
    save.innerText = "Save";
    save.style.position = "absolute";
    save.style.bottom = "0";
    save.style.right = "0";
    save.style.width = "100px";
    save.style.height = "30px";
    save.style.border = "1px solid";
    save.style.borderRadius = "10px";
    save.style.color = "black";
    save.style.cursor = "pointer";


    inputWrapper.appendChild(removeImage);
    inputWrapper.appendChild(save);
    document.body.appendChild(inputWrapper);

    setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
    }, 0);

    function handleOutsideClick(event) {
        if (!inputWrapper.contains(event.target)) {
            closePopUp();
        }
    }

    function closePopUp() {
        const wrapper = document.querySelector(".input_wrapper");
        if (wrapper) wrapper.remove();

        document.getElementById("title_section").style.opacity = "1";
        document.getElementById("title_section").style.transition = "0.3s";

        document.getElementById("form_container").style.opacity = "1";
        document.getElementById("form_container").style.transition = "0.3s";

        document.removeEventListener("click", handleOutsideClick);

    }

    removeImage.addEventListener("click", closePopUp);

    if (element.id === "plan_description") {
        document.querySelector("#plan_input_textarea").addEventListener("input", function () {
            element.value = this.value;
            review_plan_form(this.value, element);
        });
    } else if (element.id === "plan_price" || element.id === "price_with_tax") {
        document.querySelector("#plan_input_number").addEventListener("input", function () {
            element.value = this.value;
            review_plan_form(this.value, element);
        });
    } else if (element.id === "plan_img_url") {
        document.querySelector("#plan_input_url").addEventListener("input", function () {
            element.value = this.value;
            review_plan_form(this.value, element);
        });
    } else {
        document.querySelector("#plan_input").addEventListener("input", function () {
            element.value = this.value;
            review_plan_form(this.value, element);
        });
    }

    save.addEventListener("click", () => {
        const inputWrapper = document.querySelector(".input_wrapper");
        inputWrapper.parentNode.removeChild(inputWrapper);
        document.getElementById("title_section").style.opacity = "1";
        document.getElementById("title_section").style.transition = "0.3s";

        document.getElementById("form_container").style.opacity = "1";
        document.getElementById("form_container").style.transition = "0.3s";

    })
}


function showDetailPopUp() {
    const detailContainer2 = document.getElementById("form_container2");
    const form_container = document.getElementById("form_container");

    document.getElementById("title_section").style.opacity = "0.5";
    document.getElementById("title_section").style.transition = "0.3s";

    document.getElementById("title_section").style.opacity = "0.5";
    document.getElementById("title_section").style.transition = "0.3s";

    document.getElementById("form_container").style.opacity = "0.5";
    document.getElementById("form_container").style.transition = "0.3s";

    detailContainer2.style.background = "white";
    detailContainer2.style.padding = "10px";
    detailContainer2.style.border = "1px solid";
    detailContainer2.style.borderRadius = "5px";
    detailContainer2.style.top = "200px";
    detailContainer2.style.left = "400px";
    detailContainer2.style.width = "auto";
    detailContainer2.style.height = "auto";
    detailContainer2.style.overflow = "hidden";
    detailContainer2.style.display = "block";

    const removeImage2 = document.createElement("img");
    removeImage2.classList.add("remove_icon2");
    removeImage2.src = "https://jnrcnizvaihqtkeynkjk.supabase.co/storage/v1/object/public/webimages/icons/close-line-svgrepo-com.svg";
    removeImage2.alt = "Remove2";
    removeImage2.style.width = "20px";
    removeImage2.style.height = "20px";
    removeImage2.style.cursor = "pointer";
    removeImage2.style.position = "absolute";
    removeImage2.style.top = "0";
    removeImage2.style.right = "0";
    detailContainer2.appendChild(removeImage2);

    setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
    }, 0);

    function handleOutsideClick(event) {
        if (!detailContainer2.contains(event.target)) {
            closeDetailsPopup();
        }
    }

    function closeDetailsPopup() {
        const detailContainer2 = document.getElementById("form_container2");
        if (detailContainer2) detailContainer2.style.display = "none";

        document.getElementById("title_section").style.opacity = "1";
        document.getElementById("title_section").style.transition = "0.3s";

        document.getElementById("form_container").style.opacity = "1";
        document.getElementById("form_container").style.transition = "0.3s";

        document.removeEventListener("click", handleOutsideClick);

    }

}

const subtitleData = {
    plan_subtitle: "none"
};


const reviewData = {
    price_with_tax: "none",
    voice: "none",
    sms: "none",
    data: "none"
};

const reviewtrcData = {
    reference_no: "none",
    cormmencing_date: "none",
    expiry_date: "none"
}

function review_plan_form(value, element) {

    if (element.id === "plan_name") {
        document.getElementById("plan_review_name").innerHTML = `<b>Plan Name</b>: ${value}`;
    }

    if (element.id === "plan_price") {
        document.getElementById("plan_review_display_price").innerHTML = `<b>Plan Display price</b>: ${value}`
    }

    if (element.id === "plan_description") {
        document.getElementById("plan_review_description").innerHTML = `<b>Plan Description</b>: ${value}`
    }

    if (element.id in reviewData) {
        reviewData[element.id] = value;
    }
    if (element.id in reviewtrcData) {
        reviewtrcData[element.id] = value;
    }
    if (element.id in subtitleData) {
        subtitleData[element.id] = value;
    }



}
document.getElementById("add_plan").addEventListener("click", (event) => {
    event.preventDefault();
    const { details, trcData, subData } = updatePlanReviewDetailsUpdate();
    clearForms();
    detailReview(details, trcData, subData);
});

const details = [];
const trcData = [];
const subData = [];

function updatePlanReviewDetailsUpdate() {


    if (subtitleData.plan_subtitle) subData.push(`<b>Plan Subtitle</b>: ${subtitleData.plan_subtitle}`);

    if (reviewData.price_with_tax) details.push(`Price with TAX: ${reviewData.price_with_tax}`);
    if (reviewData.voice) details.push(`Voice Any Net: ${reviewData.voice}`);
    if (reviewData.sms) details.push(`SMS Any Net: ${reviewData.sms}`);
    if (reviewData.data) details.push(`Any Time Data: ${reviewData.data}`);

    if (reviewtrcData.reference_no) trcData.push(`<b>TRC Reference Number</b>: ${reviewtrcData.reference_no}`);
    if (reviewtrcData.cormmencing_date) trcData.push(`<b>Commencing Data</b>: ${reviewtrcData.cormmencing_date}`);
    if (reviewtrcData.expiry_date) trcData.push(`<b>Expiry Data</b>: ${reviewtrcData.expiry_date}`);

    return { details, trcData, subData };
}

function detailReview(details, trcData, subData) {

    console.log(subData);

    const reviewTable = document.getElementById("plan_review_table");


    const review_subtitle = document.createElement("tr");
    review_subtitle.innerHTML = "";

    const reviewSubtitle = document.createElement("td");
    reviewSubtitle.id = "plan_review_subtitle";
    reviewSubtitle.innerHTML = subData.join("<br>");
    review_subtitle.appendChild(reviewSubtitle);

    const reviewdetails = document.createElement("td");
    reviewdetails.id = "plan_review_details";
    reviewdetails.innerHTML = `<b>${details.join("<br>")}</b>`;
    review_subtitle.appendChild(reviewdetails);

    const reviewTrc = document.createElement("td");
    reviewTrc.id = "plan_review_trcdetails";
    reviewTrc.innerHTML = trcData.join("<br>");
    review_subtitle.appendChild(reviewTrc);

    reviewTable.appendChild(review_subtitle);

}

function clearForms() {
    const form = document.querySelector("#table_form2");
    form.reset();
}
