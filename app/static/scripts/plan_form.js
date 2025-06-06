document.addEventListener("DOMContentLoaded", () => {

    const editableElements = [
        { element: document.getElementById("plan_name"), label: "Title :" },
        { element: document.getElementById("plan_price"), label: "Price :" },
        { element: document.getElementById("plan_description"), label: "Description :" },
        { element: document.getElementById("plan_img_url"), label: "Image URL :" }
    ];

    editableElements.forEach(({ element, label }) => {
        element.addEventListener("click", () => {
            new popup(element, label);
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

class popup {
    constructor(element, label) {
        document.getElementById("title_section").style.opacity = "0.5";
        document.getElementById("title_section").style.transition = "0.3s";

        document.getElementById("form_container").style.opacity = "0.5";
        document.getElementById("form_container").style.transition = "0.3s";

        this.inputWrapper = document.createElement("div");
        this.inputWrapper.classList.add("input_wrapper");
        this.inputWrapper.style.position = "absolute";
        this.inputWrapper.style.display = "flex";
        this.inputWrapper.style.flexDirection = "column";
        this.inputWrapper.style.justifyContent = "center";
        this.inputWrapper.style.alignItems = "center";
        this.inputWrapper.style.top = "30%";
        this.inputWrapper.style.left = "40%";
        this.inputWrapper.style.width = "400px";
        this.inputWrapper.style.height = "30vh";
        this.inputWrapper.style.border = "1px solid #ccc";
        this.inputWrapper.style.borderRadius = "10px";
        this.inputWrapper.style.backgroundColor = "white";
        this.inputWrapper.style.zIndex = "1000";
        this.inputWrapper.innerHTML = "";

        this.removeImage = document.createElement("img");
        this.removeImage.classList.add("remove_icon");
        this.removeImage.src = "https://jnrcnizvaihqtkeynkjk.supabase.co/storage/v1/object/public/webimages/icons/close-line-svgrepo-com.svg";
        this.removeImage.alt = "Remove";
        this.removeImage.style.width = "20px";
        this.removeImage.style.height = "20px";
        this.removeImage.style.cursor = "pointer";
        this.removeImage.style.position = "absolute";
        this.removeImage.style.top = "0";
        this.removeImage.style.right = "0";

        this.labelText = document.createElement("label");
        this.labelText.setAttribute("for", element.id);
        this.labelText.innerText = label;
        this.labelText.style.fontSize = "20px";
        this.labelText.style.fontWeight = "bold";
        this.labelText.style.marginBottom = "10px";

        this.inputWrapper.appendChild(this.labelText);

        if (!element) {
            throw new Error("Element is required to create a popup.");
        }else if (element.id === "plan_description") {
            this.descriptionPop = document.createElement("textarea");
            this.descriptionPop.name = "plan_description";
            this.descriptionPop.setAttribute("for", element.id);
            this.descriptionPop.id = "plan_input_textarea";
            this.descriptionPop.style.display = "flex";
            this.descriptionPop.style.width = "300px";
            this.descriptionPop.style.height = "100px";
            this.descriptionPop.style.border = "1px solid";
            this.descriptionPop.style.borderRadius = "5px";

            this.inputWrapper.appendChild(this.descriptionPop);

        }else if (element.id === "plan_price" || element.id === "price_with_tax") {
            this.pricePop = document.createElement("input");
            this.pricePop.type = "number";
            this.pricePop.name = "plan_title";
            this.pricePop.placeholder = label;
            this.pricePop.id = "plan_input_number"
            this.pricePop.style.display = "flex";
            this.pricePop.style.width = "300px";
            this.pricePop.style.height = "30px";
            this.pricePop.style.border = "1px solid";
            this.pricePop.style.borderRadius = "5px";

            this.inputWrapper.appendChild(this.pricePop);
            
        }else if (element.id === "plan_img_url") {
            this.urlPop = document.createElement("input");
            this.urlPop.type = "url";
            this.urlPop.name = "plan_image_url";
            this.urlPop.placeholder = label;
            this.urlPop.id = "plan_input_url";
            this.urlPop.style.display = "flex";
            this.urlPop.style.width = "300px";
            this.urlPop.style.height = "30px";
            this.urlPop.style.border = "1px solid";
            this.urlPop.style.borderRadius = "5px";

            this.inputWrapper.appendChild(this.urlPop);

        }else {
            this.inputPop = document.createElement("input");
            this.inputPop.type = "text";
            this.inputPop.name = "plan_title";
            this.inputPop.placeholder = label;
            this.inputPop.id = "plan_input"
            this.inputPop.style.display = "flex";
            this.inputPop.style.width = "300px";
            this.inputPop.style.height = "30px";
            this.inputPop.style.border = "1px solid";
            this.inputPop.style.borderRadius = "5px";

            this.inputWrapper.appendChild(this.inputPop);

        }

        const inputToFocus = this.descriptionPop || this.pricePop || this.urlPop || this.inputPop;

        if (inputToFocus) {
            setTimeout( () => {
                inputToFocus.focus();
            }, 0);
            inputToFocus.addEventListener("keydown", (event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    this.save(element);
                }
            });
        }

        this.saveButton = document.createElement("button");
        this.saveButton.innerText = "Save";
        this.saveButton.style.position = "absolute";
        this.saveButton.style.bottom = "0";
        this.saveButton.style.right = "0";
        this.saveButton.style.width = "100px";
        this.saveButton.style.height = "30px";
        this.saveButton.style.border = "1px solid";
        this.saveButton.style.borderRadius = "10px";
        this.saveButton.style.color = "black";
        this.saveButton.style.cursor = "pointer";


        this.inputWrapper.appendChild(this.removeImage);
        this.inputWrapper.appendChild(this.saveButton);
        document.body.appendChild(this.inputWrapper);

        this.handleOutsideClick = (event) => {
            if ((!this.descriptionPop || !this.descriptionPop.contains(event.target)) && 
            (!this.inputPop || !this.inputPop.contains(event.target)) && 
            (!this.pricePop || !this.pricePop.contains(event.target)) && 
            (!this.urlPop || !this.urlPop.contains(event.target)) &&
            !this.inputWrapper.contains(event.target)
        ) {
                this.close();
            }
        }; 

        setTimeout(() => {
            document.addEventListener("click", this.handleOutsideClick);
        },0);

        this.removeImage.addEventListener("click", () => this.close());

        this.saveButton.addEventListener("click", () => this.save(element));

    }

    save(element) {
        const value = 
            this.descriptionPop?.value ||
            this.pricePop?.value ||
            this.urlPop?.value ||
            this.inputPop?.value || "";

        element.value = value;

        review_plan_form(value, element);

        this.close();
        }

    close() {
        this.inputWrapper.remove();
        document.removeEventListener("click", this.handleOutsideClick);

        document.getElementById("title_section").style.opacity = "1";
        document.getElementById("title_section").style.transition = "0.3s";

        document.getElementById("form_container").style.opacity = "1";
        document.getElementById("form_container").style.transition = "0.3s";
    }


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

    detailContainer2.addEventListener("click", (event) => {
        if (!event.currentTarget.contains(event.target)) {
            closeDetailsPopup();
        }
    });

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

    document.getElementById("add_plan").addEventListener("click", (event) => {
        event.preventDefault();
        const { details, trcData, subData } = updatePlanReviewDetailsUpdate();
        clearForms();
        detailReview(details, trcData, subData);
        closeDetailsPopup();
    });
    
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

const Plan = []

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


const details = [];
const trcData = [];
const subData = [];

function updatePlanReviewDetailsUpdate() {


    if (subtitleData.plan_subtitle) subData.push(`<b>Plan Subtitle</b>: ${subtitleData.plan_subtitle}`);

    if (reviewData.price_with_tax) details.push(`<b>Price with TAX</b>: ${reviewData.price_with_tax}`);
    if (reviewData.voice) details.push(`<b>Voice Any Net</b>: ${reviewData.voice}`);
    if (reviewData.sms) details.push(`<b>SMS Any Net</b>: ${reviewData.sms}`);
    if (reviewData.data) details.push(`<b>Any Time Data</b>: ${reviewData.data}`);

    if (reviewtrcData.reference_no) trcData.push(`<b>TRC Reference Number</b>: ${reviewtrcData.reference_no}`);
    if (reviewtrcData.cormmencing_date) trcData.push(`<b>Commencing Data</b>: ${reviewtrcData.cormmencing_date}`);
    if (reviewtrcData.expiry_date) trcData.push(`<b>Expiry Data</b>: ${reviewtrcData.expiry_date}`);

    console.log(details);
    console.log(trcData);
    console.log(subData);

    return { details, trcData, subData };
}

function detailReview(details, trcData, subData) {


    const reviewTable = document.getElementById("plan_review_table");


    const review_subtitle = document.createElement("tr");
    review_subtitle.innerHTML = "";

    const reviewSubtitle = document.createElement("td");
    reviewSubtitle.id = "plan_review_subtitle";
    reviewSubtitle.innerHTML = subData.join("<br>");
    review_subtitle.appendChild(reviewSubtitle);

    const reviewdetails = document.createElement("td");
    reviewdetails.id = "plan_review_details";
    reviewdetails.innerHTML = details.join("<br>");
    review_subtitle.appendChild(reviewdetails);

    const reviewTrc = document.createElement("td");
    reviewTrc.id = "plan_review_trcdetails";
    reviewTrc.innerHTML = trcData.join("<br>");
    review_subtitle.appendChild(reviewTrc);
 

    details.length = 0;
    trcData.length = 0;
    subData.length = 0;

    console.log(Plan);

    reviewTable.appendChild(review_subtitle);

}

function clearForms() {
    const form = document.querySelector("#table_form2");
    form.reset();
}