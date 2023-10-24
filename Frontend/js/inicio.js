document.addEventListener("DOMContentLoaded", function () {
  const expedientesContainer = document.getElementById("expedientesContainer");

  function cargarDatosPaciente() {
    const token = localStorage.getItem("token");
    // Simula la solicitud a la API (debes adaptar esto a tu API real)
    fetch("http://localhost:3000/api/pacientes/expedientes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de obtener el token de localStorage
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          alert(
            "El token es inválido o ha expirado. Inicia sesión nuevamente."
          );
        } else {
          alert("Error al obtener datos del paciente.");
        }
      })
      .then((data) => {
        expedientesContainer.innerHTML = "";
        data.forEach((pacienteData, index) => {
          const pacienteCard = document.createElement("div");
          pacienteCard.className = "card mb-3";
          pacienteCard.setAttribute("data-id", pacienteData.id);
          const fechaNacimiento = new Date(pacienteData.fechaNacimiento);
          const fechaNacimientoFormateada = fechaNacimiento
            .toISOString()
            .split("T")[0];

          const cardHTML = `
          <div class="card-header bg-primary text-white">
            <h5 class="card-title mb-0 fs-2">${pacienteData.nombre} ${pacienteData.apellido}</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <img src="../${pacienteData.genero}.png" alt="Imagen del paciente" class="img-fluid">
              </div>
              <div class="col-md-8">
                <h6 class="card-subtitle mb-2 text-dark fs-4">Fecha Nacimiento: ${fechaNacimientoFormateada}</h6>
                <p class="card-text fs-4">
                  Género: ${pacienteData.genero}<br>
                  Dirección: ${pacienteData.direccion}<br>
                  Teléfono: ${pacienteData.telefono}<br>
                  Correo: ${pacienteData.correo}
                </p>
              </div>
            </div>
            <h5 class="card-title mt-3 fs-4">Notas Adicionales:</h5>
            <p class="card-text fs-5">${pacienteData.notasAdicionales}</p>
            <h5 class="card-title mt-3 fs-4">Expedientes Medicos:</h5>
          </div>
        `;

          pacienteCard.innerHTML = cardHTML;

          pacienteData.expedientes.forEach((expediente) => {
            const expedienteInfo = document.createElement("p");
            const fechaExpediente = new Date(expediente.fecha);
            const fechaExpedienteFormateada = fechaExpediente
              .toISOString()
              .split("T")[0];
            expedienteInfo.innerHTML = `
            ${fechaExpedienteFormateada} - ${expediente.medico}<br>
            Diagnóstico: ${expediente.diagnostico}<br>
            Receta: ${expediente.receta}
          `;
            pacienteCard
              .querySelector(".card-body")
              .appendChild(expedienteInfo);
          });

          function agregarBotonEliminar(pacienteData) {
            const btnEliminar = document.createElement("button");
            btnEliminar.className = "btn btn-danger";
            btnEliminar.textContent = "Eliminar";
            btnEliminar.onclick = function () {
              eliminarPaciente(pacienteData._id);
            };
            return btnEliminar;
          }

          const cardFooter = document.createElement("div");
          cardFooter.className = "card-footer text-right";
          cardFooter.innerHTML = `
            <a href="editar.html?id=${pacienteData._id}" class="btn btn-primary me-2">Editar</a>
          `;

          cardFooter.appendChild(agregarBotonEliminar(pacienteData));
          pacienteCard.appendChild(cardFooter);

          expedientesContainer.appendChild(pacienteCard);

          if (index % 2 === 1) {
            const rowDiv = document.createElement("div");
            rowDiv.className = "row";
            expedientesContainer.appendChild(rowDiv);
          }
        });
      });
  }

  const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
  cerrarSesionBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });

  const crearNuevoBtn = document.getElementById("crearNuevo");
  crearNuevoBtn.addEventListener("click", () => {
    window.location.href = "../pages/crear.html";
  });

  function eliminarPaciente(id) {
    const confirmacion = confirm(
      "¿Estás seguro de que deseas eliminar a este paciente?"
    );
    if (confirmacion) {
      // Realizar la solicitud DELETE al servidor para eliminar al paciente
      fetch(`http://localhost:3000/api/pacientes/eliminar/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            alert("Paciente eliminado con éxito.");
            window.location.reload();
          } else {
            throw new Error(response.status);
          }
        })
        .catch((error) => {
          console.error("Error al eliminar el paciente:", error);
        });
    }
  }

  cargarDatosPaciente();
});
