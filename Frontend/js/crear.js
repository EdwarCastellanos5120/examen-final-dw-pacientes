document.addEventListener("DOMContentLoaded", function () {
  const expedientes = [];
  const agregarExpedienteBtn = document.getElementById("agregarExpediente");
  agregarExpedienteBtn.addEventListener("click", () => {
    const fechaExpediente = document.getElementById("fechaExpediente").value;
    const medico = document.getElementById("medico").value;
    const diagnostico = document.getElementById("diagnostico").value;
    const receta = document.getElementById("receta").value;
    if (fechaExpediente && medico && diagnostico && receta) {
      const expediente = {
        fecha: fechaExpediente,
        medico,
        diagnostico,
        receta,
      };

      expedientes.push(expediente);
      document.getElementById("fechaExpediente").value = "";
      document.getElementById("medico").value = "";
      document.getElementById("diagnostico").value = "";
      document.getElementById("receta").value = "";
      const expedientesContainer = document.getElementById(
        "expedientesContainer"
      );
      const expedienteInfo = document.createElement("div");
      expedienteInfo.innerHTML = `
        <p>Fecha: ${expediente.fecha}</p>
        <p>Médico: ${expediente.medico}</p>
        <p>Diagnóstico: ${expediente.diagnostico}</p>
        <p>Receta: ${expediente.receta}</p>
      `;
      expedientesContainer.appendChild(expedienteInfo);
    }
  });
  const guardarPacienteBtn = document.getElementById("crearPaciente");
  guardarPacienteBtn.addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const genero = document.getElementById("genero").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const notasAdicionales = document.getElementById("notasAdicionales").value;
    if (nombre && apellido) {
      const pacienteData = {
        nombre,
        apellido,
        fechaNacimiento,
        genero,
        direccion,
        telefono,
        correo,
        expedientes,
        notasAdicionales,
      };

      fetch("http://localhost:3000/api/pacientes/crear", {
        method: "POST",
        body: JSON.stringify(pacienteData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            alert("Paciente creado con éxito.");
            window.location.href = "../pages/inicio.html"; 
          } else {
            throw new Error(response.status);
          }
        })
        .catch((error) => {
          console.error("Error al comunicarse con el servidor:", error);
          alert("Ocurrió un error en la solicitud al servidor.");
        });
    } else {
      alert(
        "Por favor, ingresa al menos el nombre y el apellido del paciente."
      );
    }
  });

  const regresarMenuBtn = document.getElementById("regresarMenu");
  regresarMenuBtn.addEventListener("click", () => {
    window.location.href = "../pages/inicio.html"; 
  });
});
