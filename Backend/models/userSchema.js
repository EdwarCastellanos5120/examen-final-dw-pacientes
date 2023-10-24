var mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  clave: {
    type: String,
    required: true,
  },
});
const Usuario = mongoose.model("Usuario", userSchema);
module.exports = Usuario;
