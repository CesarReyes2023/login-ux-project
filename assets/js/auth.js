(function () {
    const isAuth = localStorage.getItem("isAuth");
    const user = localStorage.getItem("user");

    if (!isAuth || isAuth !== "true" || !user) {
        window.location.href = "../index.html";
    }
})();