// ================= CONFIGURACIÓN =================
const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 2 * 60 * 1000; // 2 minutos

// ================= UTILIDAD =================
function getNow() {
  return new Date().toLocaleString();
}

// ================= LOGIN =================
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const remember = document.getElementById("remember")?.checked;

  // ====== VERIFICAR BLOQUEO ======
  const blockedUntil = localStorage.getItem("blockedUntil");

  if (blockedUntil && Date.now() < blockedUntil) {
    const remaining = Math.ceil((blockedUntil - Date.now()) / 1000);
    Swal.fire(
      "Cuenta bloqueada",
      `Intentá nuevamente en ${remaining} segundos`,
      "error"
    );
    return;
  }

  // Desbloqueo automático
  if (blockedUntil && Date.now() >= blockedUntil) {
    localStorage.removeItem("blockedUntil");
    localStorage.removeItem("loginAttempts");
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  // ================= LOGIN FALLIDO =================
  if (!user) {
    let attempts = parseInt(localStorage.getItem("loginAttempts")) || 0;
    attempts++;
    localStorage.setItem("loginAttempts", attempts);

    if (attempts >= MAX_ATTEMPTS) {
      localStorage.setItem("blockedUntil", Date.now() + BLOCK_TIME);
      Swal.fire(
        "Cuenta bloqueada",
        "Demasiados intentos fallidos. Intenta más tarde.",
        "error"
      );
      return;
    }

    Swal.fire(
      "Error",
      `Credenciales incorrectas. Intentos restantes: ${
        MAX_ATTEMPTS - attempts
      }`,
      "error"
    );
    return;
  }

  // ================= LOGIN EXITOSO =================
  user.lastLogin = getNow();

  user.history = user.history || [];
  user.history.push({
    action: "Inicio de sesión exitoso",
    date: getNow(),
  });

  const updatedUsers = users.map((u) =>
    u.email === user.email ? user : u
  );

  localStorage.setItem("users", JSON.stringify(updatedUsers));
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("isAuth", "true");

  // Reset de bloqueos
  localStorage.removeItem("loginAttempts");
  localStorage.removeItem("blockedUntil");

  //  Recordar sesión
  if (remember) {
    localStorage.setItem("remember", "true");
  } else {
    localStorage.removeItem("remember");
  }

  Swal.fire({
    icon: "success",
    title: "Bienvenido",
    text: "Inicio de sesión exitoso",
    timer: 1500,
    showConfirmButton: false,
  }).then(() => {
    window.location.href = "pages/dashboard.html";
  });
});

// ================= DESBLOQUEO EN VIVO (UX PRO) =================
setInterval(() => {
  const blockedUntil = localStorage.getItem("blockedUntil");
  if (blockedUntil && Date.now() >= blockedUntil) {
    localStorage.removeItem("blockedUntil");
    localStorage.removeItem("loginAttempts");
    location.reload();
  }
}, 1000);