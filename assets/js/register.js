document.addEventListener("DOMContentLoaded", () => {

  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const strengthBar = document.getElementById("passwordStrength");

  document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector("i");
      input.type = input.type === "password" ? "text" : "password";
      icon.classList.toggle("bi-eye");
      icon.classList.toggle("bi-eye-slash");
    });
  });

  password.addEventListener("input", () => {
    let strength = 0;
    if (password.value.length >= 6) strength++;
    if (/[A-Z]/.test(password.value)) strength++;
    if (/[0-9]/.test(password.value)) strength++;

    strengthBar.style.width = `${strength * 33}%`;
    strengthBar.className = "progress-bar";

    if (strength === 1) strengthBar.classList.add("bg-danger");
    if (strength === 2) strengthBar.classList.add("bg-warning");
    if (strength === 3) strengthBar.classList.add("bg-success");
  });

  document.getElementById("registerForm").addEventListener("submit", e => {
    e.preventDefault();

    if (password.value !== confirmPassword.value) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: password.value
    });

    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      timer: 1200,
      showConfirmButton: false
    });

    setTimeout(() => window.location.href = "index.html", 1200);
  });
});
