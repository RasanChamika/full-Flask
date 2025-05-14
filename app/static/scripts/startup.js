window.addEventListener("load", () => {
    const splashScreen = document.getElementById("splash_logo");

    setTimeout(() => {
        splashScreen.style.transform = "scale(10)";
        splashScreen.style.opacity = "0";

    }, 1000);
});