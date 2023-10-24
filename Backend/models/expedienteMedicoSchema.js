var mongoose = require("mongoose");

const fichaMedicaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  genero: { type: String, required: true },
  direccion: { type: String },
  telefono: { type: String },
  correo: { type: String },
  expedientes: [
    {
      fecha: { type: Date },
      medico: { type: String },
      diagnostico: { type: String },
      receta: { type: String },
    },
  ],
  notasAdicionales: { type: String },
});
const FichaMedica = mongoose.model("FichaMedica", fichaMedicaSchema);

module.exports = FichaMedica;
