document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const submitButton = e.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Ingresando...';

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  
  if (!email || !password) {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Entrar';
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor completa todos los campos"
    });
    return;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Entrar';
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor ingresa un correo válido"
    });
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  
  const user = users.find(
    u => u.email === email && u.password === password
  );

  
  if (user) {
    localStorage.setItem("isAuth", "true");
    localStorage.setItem("user", JSON.stringify({
      name: user.name,
      email: user.email,
      role: user.role,
      loginAt: new Date().toISOString()
    }));

    Swal.fire({
      icon: "success",
      title: "Bienvenido",
      text: `Hola ${user.name}`,
      timer: 1500,
      showConfirmButton: false
    });

    setTimeout(() => {
      window.location.href = "pages/dashboard.html";
    }, 1500);

  } else {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Entrar';
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Correo o contraseña incorrectos"
    });
  }
});

const toggle = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (toggle && passwordInput) {
    toggle.addEventListener("click", () => {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;

        toggle.innerHTML = 
        type === "password"
        ? '<i class="bi bi-eye"></i>'
        : '<i class="bi bi-eye-slash"></i>';
    });
}
