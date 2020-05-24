var express = require('express');
var router = express.Router();
var Persona = require('../../models/persona.model');
var Scout = require('../../models/scout.model');
var Unidad = require('../../models/unidad.model');
var Plan = require('../../models/plan.model');
var Cuadro_adelanto = require('../../models/cuadro.model');
var Requisito = require('../../models/requisito.model');
var Progreso = require('../../models/progreso_plan.model');
var Verificar=require('../../middleware/autenticacion');
var bcrypt=require('bcrypt');

router.get('/integrantes/:unidad', async(req,res,next)=>{
  const unidad = req.params.unidad;
  try {
    const listaDb = await Persona.find({unidad,rol:'Integrante', 'estado':true});
    res.json(listaDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

router.get('/listar', async(req, res) => {
  try {
      const listaDb = await Persona.find({'rol':'Integrante', 'estado':true});
      res.json(listaDb);
  } catch (error) {
      return res.status(400).json({
      mensaje: 'Ocurrio un error',
        error
      })
    }
  });

router.post('/nuevo', async(req, res) => {
    var persona = Object.create(Persona);
    var adicional = Object.create(Scout);
    var progreso = new Progreso();
    var id_progreso = "";

    persona.id= req.body.id;
    persona.nombre= req.body.nombre;
    persona.apellidos= req.body.apellidos;
    persona.correo= req.body.correo;
    if(req.body.contrasena){
      persona.contrasena=bcrypt.hashSync(req.body.contrasena,10);
    }
    if(req.body.fechaNacimiento){
      persona.fechaNacimiento = Date.parse(req.body.fechaNacimiento);
      persona.unidad=calcularUnidad(req.body.fechaNacimiento);
    }
    persona.direccion = req.body.direccion;
    persona.imagen = req.body.imagen;
    persona.celular = req.body.celular;
    persona.barrio = req.body.barrio;
    persona.telefono = req.body.telefono;
    persona.ocupacion = req.body.ocupacion;
    persona.estado = req.body.estado;
    persona.inscrito = req.body.inscrito;
    if(persona.unidad){
      try {
        const UnidadDB = await Unidad.findOne({unidad:persona.unidad});
        const PlanDB = await Plan.findOne({_id:UnidadDB.plan_asignado});
        var Cuadros = [];
        var Requisitos = [];
        for (var cuadro of PlanDB.cuadros_adelanto) {
          var CuadroDB = await Cuadro_adelanto.findOne({_id:cuadro});
          console.log(CuadroDB);
          for (var requisito of CuadroDB.requisitos) {
            var RequisitoDB = await Requisito.findOne({_id:requisito});
            Requisitos.push(RequisitoDB);
          }
          CuadroDB.requisitos = Requisitos;
          Requisitos = [];
          Cuadros.push(CuadroDB);
        }
        PlanDB.cuadros_adelanto=Cuadros;
        progreso.plan.push(PlanDB);
        const ProgresoDB = await Progreso.create(progreso);
        id_progreso=ProgresoDB._id;
      } catch (error) {
        return res.status(400).json({
        mensaje: 'Error al crear el progreso',
          error
        })
      }
    }
    adicional.nombreMadre = req.body.nombreMadre;
    adicional.celularMadre = req.body.celularMadre;
    adicional.nombrePadre = req.body.nombrePadre;
    adicional.celularPadre = req.body.celularPadre;
    adicional.nombreEmergencia = req.body.nombreEmergencia;
    adicional.celularEmergencia = req.body.celularEmergencia;
    adicional.progreso_plan = id_progreso;
    persona.adicional = adicional;
    try {
      const scoutDB = await Persona.create(persona);
      res.status(200).json(scoutDB); 
    } catch (error) {
      return res.status(500).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

router.get('/listar/:id', async(req, res) => {
    const id = req.params.id;
    try {
      const scoutDB = await Persona.findOne({id, 'rol':'Integrante' });
      res.json(scoutDB);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

router.put('/eliminar/:id', async(req, res) => {
    const _id = req.params.id;
    try {
      const scoutDB = await Persona.findByIdAndUpdate(
        _id,
        {estado:false},
        {new: true});
      res.json(scoutDB); 
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});
router.put('/activar/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const scoutDB = await Persona.findByIdAndUpdate(
      _id,
      {estado:true},
      {new: true});
    res.json(scoutDB); 
  } catch (error) {
      return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
      })
  }
});
router.get('/inactivos', async(req, res) => {
  try {
    const listaDb = await Persona.find({estado:false});
    res.json(listaDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});
router.get('/progreso/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const scoutDb = await Persona.findOne({_id});
    const progresoDb = await Progreso.find({_id:scoutDb.adicional.progreso_plan});
    res.json(progresoDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

router.put('/actualizar/:id/:idplan', async(req, res) => {
    const _id = req.params.id;
    const idplan = req.params.idplan;
    var persona = Object.create(Persona);
    var adicional = Object.create(Scout);
    if(req.body.id){
        const validacionDB = await Persona.findOne({id:req.body.id});
        if(validacionDB){
          if(validacionDB._id != _id){
            return res.json("Id debe ser unico");
          }
        }
      persona.id= req.body.id;
    }
    if(req.body.nombre){
      persona.nombre= req.body.nombre;
    }
    if(req.body.apellidos){
      persona.apellidos= req.body.apellidos;
    }
    if(req.body.correo){
      persona.correo= req.body.correo;
    }
    if(req.body.unidad){
      persona.unidad= req.body.unidad;
    }
    if(req.body.imagen){
      persona.imagen= req.body.imagen;
    }
    if(req.body.contrasena){
      if(validacionDB.contrasena!=req.body.contrasena){
        persona.contrasena=bcrypt.hashSync(req.body.contrasena,10);
      }
    }
    if(req.body.fechaNacimiento){
      persona.fechaNacimiento = Date.parse(req.body.fechaNacimiento);
    }

    if(req.body.celularAcudiente||req.body.nombreAcudiente||req.body.inscrito||req.body.estado||req.body.ocupacion||req.body.telefono||req.body.barrio||
    req.body.celularEmergencia||req.body.nombreEmergencia||req.body.celular||req.body.direccion||req.body.nombreMadre||req.body.celularMadre||req.body.nombrePadre||req.body.celularPadre){
      if(req.body.direccion){
        persona.direccion = req.body.direccion;
      }
      if(req.body.celular){
        persona.celular = req.body.celular;
      }
      if(req.body.nombreEmergencia){
        adicional.nombreEmergencia = req.body.nombreEmergencia;
      }
      if(req.body.celularEmergencia){
        adicional.celularEmergencia = req.body.celularEmergencia;
      }
      if(req.body.barrio){
        persona.barrio = req.body.barrio;
      }
      if(req.body.telefono){
        persona.telefono = req.body.telefono;
      }
      if(req.body.ocupacion){
        persona.ocupacion = req.body.ocupacion;
      }
      if(req.body.estado){
        persona.estado = req.body.estado;
      }
      if(req.body.inscrito){
        persona.inscrito = req.body.inscrito;
      }
      if(req.body.nombreMadre){
        adicional.nombreMadre = req.body.nombreMadre;
      }
      if(req.body.celularMadre){
        adicional.celularMadre = req.body.celularMadre;
      }
      if(req.body.nombrePadre){
        adicional.nombrePadre = req.body.nombrePadre;
      }
      if(req.body.celularPadre){
        adicional.celularPadre = req.body.celularPadre;
      }
      adicional.progreso_plan = idplan;

      
      persona.adicional = adicional;
    }
    try {
      const scoutDB = await Persona.findByIdAndUpdate(
        _id,
        persona,
        {new: true});
      res.json(scoutDB);  
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

function calcularUnidad(fecha) {
  var hoy = new Date();
  var cumpleanos = new Date(fecha);
  var edad = hoy.getFullYear() - cumpleanos.getFullYear();
  var m = hoy.getMonth() - cumpleanos.getMonth();
  var unidad = "";

  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
  }
  if(edad<7){
    unidad="Familia";
  }
  else if(edad>=7 && edad<10){
    unidad="Manada";
  }
  else if(edad>=10 && edad<14){
    unidad="Tropa";
  }
  else if(edad>=14 && edad<16){
    unidad="Sociedad";
  }
  else{
    unidad="Clan";
  }
  return unidad;
}
module.exports = router;