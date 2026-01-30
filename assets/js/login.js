document.addEventListener("DOMContentLoaded", () => {

  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const rememberMe = document.getElementById("rememberMe");
  const btnLogin = document.getElementById("btnLogin");
  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");

  let attempts = JSON.parse(localStorage.getItem("attempts")) || 0;

  document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector("i");
      input.type = input.type === "password" ? "text" : "password";
      icon.classList.toggle("bi-eye");
      icon.classList.toggle("bi-eye-slash");
    });
  });

  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();

    if (attempts >= 3) {
      Swal.fire("Bloqueado", "Demasiados intentos fallidos. Esperá un momento.", "error");
      return;
    }

    btnLogin.disabled = true;
    btnText.textContent = "Validando...";
    btnLoader.classList.remove("d-none");

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.email === email.value && u.password === password.value);

      if (!user) {
        attempts++;
        localStorage.setItem("attempts", attempts);

        Swal.fire("Error", "Correo o contraseña incorrectos", "error");

        btnLogin.disabled = false;
        btnText.textContent = "Entrar";
        btnLoader.classList.add("d-none");
        return;
      }

      localStorage.removeItem("attempts");
      localStorage.setItem("isAuth", "true");

      if (rememberMe.checked) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        timer: 1200,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = "pages/dashboard.html";
      }, 1200);

    }, 800);
  });
});
