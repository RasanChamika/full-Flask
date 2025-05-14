function changeIframe(page) {
    var iframe = document.getElementById("changeIframe");
    if (iframe) {
        iframe.src = "/static/" + page;
    } else {
        console.error("Iframe not found!");
    }
}

function menuToggle(event) {
    event.stopPropagation();
    const menu = document.querySelector(".menu");

    if (menu) {
        menu.classList.toggle("active");
    } else {
        console.error("Menu element not found!");
    }
}

function closeMenuOutsideClick(event) {
    const menu = document.querySelector(".menu");
    const userIcon = document.getElementById("user");

    if (menu && !menu.contains(event.target) && event.target !== userIcon) {
        menu.classList.remove("active");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.getElementById("user");

    if (userIcon) {
        userIcon.addEventListener("click", menuToggle);
    } else {
        console.error("User icon not found!");
    }

    document.addEventListener("click", closeMenuOutsideClick);
});

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        let userOut = document.getElementById("logout_click");
        if (userOut) {
            userOut.addEventListener("click", logout);
        } else {
            console.error("Error: logout button not found.");
        }
    }, 500);
});

function logout() {
    fetch("/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((response) => {
            if (response.ok) {
                window.location.href = "/index";
            }
        })
        .catch(error => console.error("Logout failed:", error));
}

fetch('/user', {
    method: "GET"
})

    .then(response => response.json())
    .then(data => {
        if (data.email && data.name) {
            userInfo(data.email, data.name);
        } else {
            console.log("data not found")
        }
    })
    .catch(error => console.error("Error fetching user data:", error));

function userInfo(email, username) {
    let emailElement = document.getElementById("user_email");
    let usernameElement = document.getElementById("user_name");

    if (emailElement && usernameElement) {
        emailElement.innerHTML = email;
        usernameElement.innerHTML = username;
    } else {
        console.error("User info elements not found.");
    }
}
