function resetSystem() {
    Swal.fire ( {
        title: "¿Resetear Sistema?",
        text: "Se borraran todos los datos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, borrar todo"
    }).then (result => {
        if (resultisConfirmed) {
            localStorage.clear();
            localitation.reload();
        }

    });
    
}