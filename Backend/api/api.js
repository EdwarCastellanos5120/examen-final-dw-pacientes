var mongoose = require("mongoose");
var express = require("express");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
var router = express.Router();
var usuario = require("../models/userSchema");
var expediente = require("../models/expedienteMedicoSchema");

const bcrypt = require("bcrypt");

const tokenGeneral =
  "";

var conexion = "";

const db = conexion;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conexion a la base de datos exitosa");
  })
  .catch((error) => {
    console.log("Error al conectar a la base de datos", error);
  });

router.get("/", (req, res) => {
  res.send("Hola Mundo");
});


router.post(
  "/usuarios/crear",
  [
    check("correo").isEmail().withMessage("El correo electrónico no es válido"),
    check("clave")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { correo, clave } = req.body;

      const usuarioExistente = await usuario.findOne({ correo });

      if (usuarioExistente) {
        return res
          .status(400)
          .json({ error: "El correo del usuario ya existe." });
      }

      const hashedClave = await bcrypt.hash(clave, 10);
      const nuevoUsuario = new usuario({ correo, clave: hashedClave });
      await nuevoUsuario.save();

      res.status(201).json({ status: "Usuario creado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo crear el usuario." });
    }
  }
);


router.post("/usuarios/login", async (req, res) => {
  const { correo, clave } = req.body;
  try {
    const user = await usuario.findOne({ correo }).exec();
    if (!user) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }
    const claveValida = await bcrypt.compare(clave, user.clave);
    if (!claveValida) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      {
        correo,
        exp: Math.floor(Date.now() / 1000) + 300,
      },
      tokenGeneral
    );
    res.json({ token, id: user._id });
  } catch (error) {
    console.error("Error en la base de datos", error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    return res.status(403).json({ error: "Token no proporcionado" });
  }

  jwt.verify(token, tokenGeneral, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
    req.user = decoded;
    next();
  });
};

router.get("/pacientes/expedientes", verificarToken, async (req, res) => {
  try {
    const expedientes = await expediente.find({});
    res.status(200).json(expedientes);
  } catch (error) {
    console.error("Error al listar expedientes médicos", error);
    res.status(500).json({ error: "Error al listar expedientes médicos" });
  }
});

router.post("/pacientes/crear", verificarToken, async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      correo,
      expedientes,
      notasAdicionales,
    } = req.body;

    const nuevaFichaMedica = new expediente({
      nombre,
      apellido,
      fechaNacimiento,
      genero,
      direccion,
      telefono,
      correo,
      expedientes,
      notasAdicionales,
    });
    await nuevaFichaMedica.save();
    res.status(201).json(nuevaFichaMedica);
  } catch (error) {
    console.error("Error al crear ficha médica", error);
    res.status(500).json({ error: "Error al crear ficha médica" });
  }
});

router.put("/pacientes/actualizar/:id", verificarToken, async (req, res) => {
  try {
    const fichaId = req.params.id;
    const datosActualizados = req.body;
    if (!mongoose.Types.ObjectId.isValid(fichaId)) {
      return res.status(400).json({ error: "ID de ficha médica no válido" });
    }

    const fichaActualizada = await expediente.findByIdAndUpdate(
      fichaId,
      datosActualizados,
      { new: true }
    );

    if (!fichaActualizada) {
      return res.status(404).json({ error: "Ficha médica no encontrada" });
    }

    res.status(200).json(fichaActualizada);
  } catch (error) {
    console.error("Error al actualizar ficha médica", error);
    res.status(500).json({ error: "Error al actualizar ficha médica" });
  }
});

router.delete("/pacientes/eliminar/:id", verificarToken, async (req, res) => {
  try {
    const fichaId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(fichaId)) {
      return res.status(400).json({ error: "ID de ficha médica no válido" });
    }
    const fichaEliminada = await expediente.findByIdAndRemove(fichaId);
    if (!fichaEliminada) {
      return res.status(404).json({ error: "Ficha médica no encontrada" });
    }
    res.status(200).json({ msg: "Eliminado con Éxito" });
  } catch (error) {
    console.error("Error al eliminar ficha médica", error);
    res.status(500).json({ error: "Error al eliminar ficha médica" });
  }
});

router.get("/pacientes/buscar/:id", verificarToken, async (req, res) => {
  try {
    const fichaId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(fichaId)) {
      return res.status(400).json({ error: "ID de ficha médica no válido" });
    }
    const fichaEncontrada = await expediente.findById(fichaId);
    if (!fichaEncontrada) {
      return res.status(404).json({ error: "Ficha médica no encontrada" });
    }
    res.status(200).json(fichaEncontrada);
  } catch (error) {
    console.error("Error al buscar ficha médica por ID", error);
    res.status(500).json({ error: "Error al buscar ficha médica" });
  }
});

router.get(
  "/pacientes/buscarpornombre/:nombre",
  verificarToken,
  async (req, res) => {
    try {
      const nombre = req.params.nombre;
      if (!nombre) {
        return res
          .status(400)
          .json({ error: "Debe proporcionar un nombre para buscar" });
      }
      const regexNombre = new RegExp(nombre, "i");
      const fichasEncontradas = await expediente.find({ nombre: regexNombre });
      if (fichasEncontradas.length === 0) {
        return res
          .status(404)
          .json({ error: "No se encontraron fichas médicas con ese nombre" });
      }
      res.status(200).json(fichasEncontradas);
    } catch (error) {
      console.error("Error al buscar fichas médicas por nombre", error);
      res.status(500).json({ error: "Error al buscar ficha médica" });
    }
  }
);

module.exports = router;
