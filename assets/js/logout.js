function logout() {
    Swal.fire({
        title: "¿Cerrar sesión?",
        text: "Tu sesión se cerrará",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, salir",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("isAuth");
            localStorage.removeItem("user");
            window.location.href = "../index.html";
        }
    });
}
