function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuth");

    Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        timer: 1200,
        showConfirmButton: false
    });

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1200);
}