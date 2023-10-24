document.addEventListener("DOMContentLoaded", function () {
  const ingresarBtn = document.querySelector(".btn-primary");

  ingresarBtn.addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const formData = {
      correo: email,
      clave: password,
    };
    fetch("http://localhost:3000/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("id", data.id);
          window.location.href = "../pages/inicio.html";
        } else {
          alert("Credenciales inválidas: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  });
});
