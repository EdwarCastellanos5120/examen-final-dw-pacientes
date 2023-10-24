document.addEventListener("DOMContentLoaded", function () {
  // Obtener el ID del paciente desde la URL
  const pacienteId = obtenerPacienteIdDesdeURL();

  // Obtener el token almacenado en LocalStorage
  const token = localStorage.getItem("token");

  // Obtener los campos de edición por su ID
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const fechaNacimientoInput = document.getElementById("fechaNacimiento");
  const generoSelect = document.getElementById("genero");
  const direccionInput = document.getElementById("direccion");
  const telefonoInput = document.getElementById("telefono");
  const correoInput = document.getElementById("correo");
  const notasAdicionalesTextarea = document.getElementById("notasAdicionales");
  const expedientesMedicosDiv = document.getElementById("expedientesMedicos");

  const expedientesMedicos = [];

  function eliminarExpediente(index) {
    if (index >= 0 && index < expedientesMedicos.length) {
      expedientesMedicos.splice(index, 1);
      mostrarExpedientesMedicos();
    }
  }

  const regresarMenuBtn = document.getElementById("regresarMenu");
  regresarMenuBtn.addEventListener("click", () => {
    window.location.href = "../pages/inicio.html";
  });

  const agregarExpedienteBtn = document.getElementById("agregarExpediente");
  agregarExpedienteBtn.addEventListener("click", () => {
    const fechaExpedienteInput =
      document.getElementById("fechaExpediente").value;
    const medicoInput = document.getElementById("medico").value;
    const diagnosticoInput = document.getElementById("diagnostico").value;
    const recetaInput = document.getElementById("receta").value;

    if (
      fechaExpedienteInput &&
      medicoInput &&
      diagnosticoInput &&
      recetaInput
    ) {
      expedientesMedicos.push({
        fecha: fechaExpedienteInput,
        medico: medicoInput,
        diagnostico: diagnosticoInput,
        receta: recetaInput,
      });
      document.getElementById("fechaExpediente").value = "";
      document.getElementById("medico").value = "";
      document.getElementById("diagnostico").value = "";
      document.getElementById("receta").value = "";
      mostrarExpedientesMedicos();
    } else {
      alert("Por favor, complete todos los campos del expediente.");
    }
  });

  function mostrarExpedientesMedicos() {
    expedientesMedicosDiv.innerHTML = `<h5 class="card-title mt-3 fs-4">Expedientes Médicos:</h5`;

    expedientesMedicos.forEach((expediente, index) => {
      const expedienteInfo = document.createElement("div");
      const fechaExpediente = new Date(expediente.fecha);
      const fechaExpedienteFormateada = fechaExpediente
        .toISOString()
        .split("T")[0];
      expedienteInfo.innerHTML = `
        ${fechaExpedienteFormateada} - ${expediente.medico}<br>
        Diagnóstico: ${expediente.diagnostico}<br>
        Receta: ${expediente.receta}
      `;

      const eliminarBtn = document.createElement("button");
      eliminarBtn.textContent = "Eliminar";
      eliminarBtn.classList.add("btn", "btn-danger");
      eliminarBtn.addEventListener("click", () => {
        eliminarExpediente(index);
      });

      expedienteInfo.appendChild(eliminarBtn);
      expedientesMedicosDiv.appendChild(expedienteInfo);
    });
  }

  // Llena los campos de edición con los datos del paciente desde la API
  fetch(`http://localhost:3000/api/pacientes/buscar/${pacienteId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Agrega el token en los encabezados
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        alert("Error al cargar los datos del paciente.");
      }
    })
    .then((data) => {
      if (data && data.nombre) {
        const fechaNacimiento = new Date(data.fechaNacimiento);
        const fechaNacimientoFormateada = fechaNacimiento
          .toISOString()
          .split("T")[0];
        nombreInput.value = data.nombre;
        apellidoInput.value = data.apellido;
        fechaNacimientoInput.value = fechaNacimientoFormateada; // Establecer la fecha formateada
        generoSelect.value = data.genero;
        direccionInput.value = data.direccion;
        telefonoInput.value = data.telefono;
        correoInput.value = data.correo;
        notasAdicionalesTextarea.value = data.notasAdicionales;
        data.expedientes.forEach((expediente) => {
          expedientesMedicos.push({
            fecha: expediente.fecha,
            medico: expediente.medico,
            diagnostico: expediente.diagnostico,
            receta: expediente.receta,
          });
        });

        expedientesMedicos.forEach((expediente, index) => {
          const expedienteInfo = document.createElement("div");
          const fechaExpediente = new Date(expediente.fecha);
          const fechaExpedienteFormateada = fechaExpediente
            .toISOString()
            .split("T")[0];
          expedienteInfo.innerHTML = `
              ${fechaExpedienteFormateada} - ${expediente.medico}<br>
              Diagnóstico: ${expediente.diagnostico}<br>
              Receta: ${expediente.receta}
            `;

          const eliminarBtn = document.createElement("button");
          eliminarBtn.textContent = "Eliminar";
          eliminarBtn.classList.add("btn", "btn-danger");
          eliminarBtn.addEventListener("click", () => {
            eliminarExpediente(index);
          });

          expedienteInfo.appendChild(eliminarBtn);
          expedientesMedicosDiv.appendChild(expedienteInfo);
        });
      } else {
        alert(
          "Error: Los datos del paciente no están definidos o no contienen la propiedad 'nombre'."
        );
      }
    })
    .catch((error) => {
      console.error("Error al cargar los datos del paciente:", error);
    });

  const guardarPacienteBtn = document.getElementById("guardarPaciente");
  guardarPacienteBtn.addEventListener("click", () => {
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
    const fechaNacimiento = fechaNacimientoInput.value;
    const genero = generoSelect.value;
    const direccion = direccionInput.value;
    const telefono = telefonoInput.value;
    const correo = correoInput.value;
    const notasAdicionales = notasAdicionalesTextarea.value;
    const pacienteData = {
      nombre,
      apellido,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      correo,
      notasAdicionales,
      expedientes: expedientesMedicos,
    };
    const pacienteId = obtenerPacienteIdDesdeURL();
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/pacientes/actualizar/${pacienteId}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pacienteData),
    })
      .then((response) => {
        if (response.status === 200) {
          alert("Paciente actualizado exitosamente.");
        } else {
          alert("Error al actualizar el paciente.");
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  });

  function obtenerPacienteIdDesdeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const pacienteId = urlParams.get("id");
    return pacienteId;
  }
});
