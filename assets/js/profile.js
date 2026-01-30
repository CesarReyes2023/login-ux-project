document.addEventListener("DOMContentLoaded", () => {

  function getNow() {
    return new Date().toLocaleString();
  }

  let user = JSON.parse(localStorage.getItem("user"));
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const nameInput = document.getElementById("profileName");
  const emailInput = document.getElementById("profileEmail");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const lastLoginText = document.getElementById("lastLogin");
  const historyList = document.getElementById("historyList");

  nameInput.value = user.name;
  emailInput.value = user.email;

  if (user.lastLogin) {
    lastLoginText.textContent = "Último acceso: " + user.lastLogin;
  }

  (user.history || []).forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${item.date} - ${item.action}`;
    historyList.appendChild(li);
  });

  document.getElementById("profileForm").addEventListener("submit", e => {
    e.preventDefault();

    if (newPassword.value && newPassword.value !== confirmPassword.value) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    users = users.map(u => {
      if (u.email === user.email) {
        return {
          ...u,
          name: nameInput.value,
          password: newPassword.value || u.password,
          history: [
            ...(u.history || []),
            {
              action: newPassword.value
                ? "Cambio de nombre y contraseña"
                : "Cambio de nombre",
              date: getNow()
            }
          ]
        };
      }
      return u;
    });

    user = users.find(u => u.email === user.email);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify(user));

    Swal.fire({
      icon: "success",
      title: "Perfil actualizado",
      timer: 1200,
      showConfirmButton: false
    });

    newPassword.value = "";
    confirmPassword.value = "";
  });

});