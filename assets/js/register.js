// ================= UTILIDADES =================
// ⚠️ Devuelve fecha y hora actual
function getNow() {
  return new Date().toLocaleString();
}

// ================= EVENTO REGISTRO =================
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault(); //  evita recarga del form

  // ================= CAMPOS =================
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // ================= VALIDACIONES =================
  if (!name || !email || !password) {
    Swal.fire("Error", "Todos los campos son obligatorios", "error");
    return;
  }

  // ================= OBTENER USUARIOS =================
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // ================= VALIDAR EMAIL DUPLICADO =================
  const exists = users.some((u) => u.email === email);
  if (exists) {
    Swal.fire("Error", "El correo ya está registrado", "error");
    return;
  }

  // ================= CREAR USUARIO =================
  const newUser = {
    name,
    email,
    password,
    lastLogin: null,
    history: [
      {
        action: "Cuenta creada",
        date: getNow(),
      },
    ],
  };

  users.push(newUser);

  // ================= GUARDAR =================
  localStorage.setItem("users", JSON.stringify(users));

  // ================= CONFIRMACIÓN =================
  Swal.fire({
    icon: "success",
    title: "Registro exitoso",
    text: "Ahora podés iniciar sesión",
    timer: 1500,
    showConfirmButton: false,
  }).then(() => {
    // 🔁 REDIRECCIÓN CORRECTA
    window.location.href = "../index.html";
  });
});
