document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const submitButton = e.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registrando...';

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    Swal.fire("Atención", "Todos los campos son obligatorios", "warning");
    return;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Swal.fire("Error", "Por favor ingresa un correo válido", "error");
    return;
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres", "error");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.some(user => user.email === email);

  if (userExists) {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Registrarme';
    Swal.fire("Error", "El correo ya está registrado", "error");
    return;
  }

  const newUser = {
    name,
    email,
    password, //  luego lo haremos hash
    role: "user",
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  Swal.fire({
    icon: "success",
    title: "Registro exitoso",
    text: "Ahora puedes iniciar sesión",
    timer: 1800,
    showConfirmButton: false
  });

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1800);
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

// Indicador de fortaleza de contraseña
const passwordStrengthDiv = document.getElementById("passwordStrength");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

if (passwordInput && strengthBar) {
    passwordInput.addEventListener("input", function() {
        const password = this.value;
        
        if (password.length === 0) {
            passwordStrengthDiv.style.display = "none";
            return;
        }
        
        passwordStrengthDiv.style.display = "block";
        
        let strength = 0;
        let text = "";
        let color = "";
        
        // Criterios de fortaleza
        if (password.length >= 6) strength += 25;
        if (password.length >= 10) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
        
        // Determinar nivel
        if (strength < 30) {
            text = "Débil";
            color = "bg-danger";
        } else if (strength < 60) {
            text = "Media";
            color = "bg-warning";
        } else if (strength < 80) {
            text = "Buena";
            color = "bg-info";
        } else {
            text = "Fuerte";
            color = "bg-success";
        }
        
        strengthBar.style.width = strength + "%";
        strengthBar.className = "progress-bar " + color;
        strengthText.innerText = "Fortaleza: " + text;
    });
}

