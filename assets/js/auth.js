(function () {
    const isAuth = localStorage.getItem("isAuth");

    if  (!isAuth || isAuth !== "true") {
        window.location.href = "../index.html";
    }

}) ();