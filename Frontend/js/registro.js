document.addEventListener("DOMContentLoaded", function () {
  const registrarBtn = document.getElementById("registrarBtn");

  registrarBtn.addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Crear un objeto con los datos del formulario
    const formData = {
      correo: email,
      clave: password,
    };

    // Realizar la solicitud POST a la API
    fetch("http://localhost:3000/api/usuarios/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "Usuario creado") {
          alert("Usuario creado exitosamente. Regresando al inicio...");
          window.location.href = "../index.html";
        } else {
          alert("Error al crear el usuario: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  });
});
