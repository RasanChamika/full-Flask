document.addEventListener("DOMContentLoaded", function () {
    let body = document.getElementById("body");
    if (body) {
        applyFormStyles();
    } else {
        console.error("Error: Body element not found.");
    }

    document.getElementById("email").addEventListener("input", function () {
        employeeCheck(this.value)
    });

    // Event listener for Show Login button
    document.getElementById("showLogin").addEventListener("click", function () {

        // Hide Register Container and Show Login Container after flip
        document.getElementById("container1").style.display = "none";
        document.getElementById("container2").style.display = "flex";

    });

    // Event listener for Show Register button
    document.getElementById("showRegister").addEventListener("click", function () {

        // Hide Login Container and Show Register Container after flip
        document.getElementById("container2").style.display = "none";
        document.getElementById("container1").style.display = "flex";
    });
});
// Apply styles when the page loads (depending on the container shown by default)
function applyFormStyles() {
    let formContainer = document.getElementById("register_form_container");
    if (formContainer) {
        formContainer.style.borderRadius = "0 10px 10px 0"; // Register Form Border Radius
    }

    let registerformheader = document.getElementById("register_header");
    if (registerformheader) {
        registerformheader.style.height = "30%"
    }

    let termsCheckbox = document.getElementById("terms");
    if (termsCheckbox) {
        // Adjust margin for the checkbox
    }

    let registerImage = document.getElementById("imgreg");
    if (registerImage) {
        registerImage.style.borderRadius = "10px 0 0 10px"; // Register Image Border Radius
    }

    // Default for the login form (if it's visible)
    let loginFormContainer = document.getElementById("login_form_container");
    if (loginFormContainer) {
        loginFormContainer.style.borderRadius = "10px 0 0 10px"; // Login Form Border Radius
    }

    let loginformheader = document.getElementById("login_header");
    if (loginformheader) {
        loginformheader.style.height = "50%"
    }

    let rememberCheckbox = document.getElementById("remember");
    if (rememberCheckbox) {
        // Adjust margin for the checkbox
    }

    let loginImage = document.getElementById("imglog");
    if (loginImage) {
        loginImage.style.borderRadius = "0 10px 10px 0"; // Login Image Border Radius
    }

    let logConfPassword = document.getElementById("cof_password");
    if (logConfPassword) {
        logConfPassword.style.display = "none"; // Hide Confirm Password for Login
    }
}


// async function register(event) {
//     event.preventDefault();

//     let form = document.getElementById("registerform");
//     let formData = new FormData(form);

//     let jsonObject = {};
//     formData.forEach((value, key) => {
//         jsonObject[key] = value;
//     })


//     try {
//         const response = await fetch("/register", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(jsonObject)
//         })

//         const data = await response.json();
//         if (response.ok) {
//             console.log("User registered Successfully:", data);
//             form.reset();
//         } else {
//             if (data.error === "user already exists") {
//                 alert("User already exists");

//             } else if (data.error === "username must be at least 6 characters long") {
//                 alert("Username must be at least 6 characters long");
//                 form.querySelector("input[type='text']").value = "";

//             } else if (data.error === "email is invaid") {
//                 alert("Email is invalid");
//                 form.querySelector("input[id='reg_email']").value = "";

//             } else if (data.error === "password must be at least 8 characters long and contain at least one uppercase letter, one digit and one special character") {
//                 alert("Password must be at least 8 characters long and contain at least one uppercase letter, one digit and one special character");
//                 form.querySelectorAll("input[id='reg_password']");
//                 passwords.forEach(password => password.value = "");

//             } else if (data.error === "passwords do not matched") {
//                 alert("Passwords do not match");
//                 form.querySelectorAll("input[type='password']");
//                 passwords.forEach(password => password.value = "");

//             } else if (data.error === "please agree to the terms and conditions") {
//                 alert("Please agree to the terms and conditions");

//                 console.log("Error:", data.error);
//                 alert("Error: " + data.error);
//             }
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

// async function login(event) {
//     event.preventDefault();

//     let email = document.getElementById("email").value;
//     let password = document.getElementById("password").value;
//     let conf_password_exi = document.getElementById("cof_password");
//     let conf_password = conf_password_exi ? conf_password_exi.value : null;
//     let form = document.getElementById("loginform");

//     if (email && password) {

//         try {
//             const response = await fetch("/login", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     username: email,
//                     userpassword: password,
//                     confirmuserpassword: conf_password
//                 })
//             })

//             const data = await response.json();
//             if (response.ok) {
//                 console.log(data.message);
//                 form.reset();
//                 if (data.redirect) {
//                     window.location.href = data.redirect;
//                 }
//             } else {
//                 console.log("Error:", data.message);
//                 alert("Error:" + data.message);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     }

// }

function employeeCheck(email) {

    /*    let email = document.getElementById("email").value; */

    fetch("/auth/employee_register", {
        method: "POST",
        body: JSON.stringify({
            email: email
        }),
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Only employee exists.") {
                if (document.getElementById("cof_password").style.display === "none") {
                    let confirmPassword = document.getElementById("cof_password");
                    let newPassword = document.getElementById("password");
                    newPassword.placeholder = "New Password";

                    confirmPassword.style.display = "block";
                    confirmPassword.style.transition = "opacity 0.3s ease-out";


                    // confirmPassword.type = "password";
                    // confirmPassword.id = "cof_password";
                    // confirmPassword.name = "cof_password";
                    // confirmPassword.placeholder = "Confirm Password";
                    // confirmPassword.required = true;
                    // confirmPassword.style.transition = "opacity 0.3s ease-in-out";


                    setTimeout(() => {
                        confirmPassword.style.opacity = "1";
                    }, 10);
                }
            } else if (data.message === "User already exists." || data.message === "Employee exists.") {
                if (document.getElementById("cof_password").style.display === "block") {
                    let confirmPassword = document.getElementById("cof_password");
                    confirmPassword.style.display = "none";

                    let password = document.getElementById("password");
                    password.placeholder = "Password";
                }
            }
        })
}