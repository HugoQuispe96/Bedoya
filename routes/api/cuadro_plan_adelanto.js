var express = require('express');
var router = express.Router();
var Plan = require('../../models/plan.model');
var Cuadro_adelanto = require('../../models/cuadro.model');
var Scout = require('../../models/persona.model');
var Progreso = require('../../models/progreso_plan.model');

router.post('/nuevo/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;

    try {
        var planDB = await Plan.findOne({_id});
        var cuadroDB = await Cuadro_adelanto.create(body);
        planDB.cuadros_adelanto.push(cuadroDB._id);
        await Plan.findByIdAndUpdate(
            _id,
            planDB,
            {new: true});
        res.json(cuadroDB); 
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
  });

router.put('/actualizar/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
        const cuadroDB = await Cuadro_adelanto.findByIdAndUpdate(
        _id,
        body,
        {new: true});
        res.json(cuadroDB);  
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.delete('/eliminar/:idcuadro/:idplan', async(req, res) => {
    const idplan = req.params.idplan;
    const idcuadro = req.params.idcuadro;

    try {
        const cuadroDB = await Cuadro_adelanto.findByIdAndDelete({_id:idcuadro});
        if(!cuadroDB){
            return res.status(400).json({
                mensaje: 'No se encontró el id indicado',
                error
            })
        }
        var planDB = await Plan.findOne({_id:idplan});
        var cuadros_adelanto = planDB.cuadros_adelanto.filter(x => {
            return x != idcuadro;
        });
        planDB.cuadros_adelanto=cuadros_adelanto;
        await Plan.findByIdAndUpdate(
            {_id : idplan},
            planDB,
            {new: true});

        res.json(cuadroDB); 

    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});
router.get('/listar', async(req, res) => { 
    try {
      const listaDb = await Cuadro_adelanto.find();
      res.json(listaDb);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });
  router.get('/lista/:tipo/:id', async(req, res) => { 
    const tipo = req.params.tipo;
    const _id = req.params.id;
    var Cuadros = [];
    try {
        const scoutDb = await Scout.findOne({_id});
        const progresoDb = await Progreso.findOne({_id:scoutDb.adicional.progreso_plan});
        for (const cuadro of progresoDb.plan[0].cuadros_adelanto) {
            if(cuadro.tipo == tipo){
                Cuadros.push(cuadro);
            }
        }
        res.json(Cuadros);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });
  router.get('/integrante-peticion-cancelacion/:id/:tipo/:id_requisito', async(req, res) => { 
    const id_requisito = req.params.id_requisito;
    const _id = req.params.id;
    const tipo = req.params.tipo;
    var Cuadros = [];
    try {
        const scoutDb = await Scout.findOne({_id});
        const progresoDb = await Progreso.findOne({_id:scoutDb.adicional.progreso_plan});
        for (const plan of progresoDb.plan) {
            for (const cuadro of plan.cuadros_adelanto) {
                for (const requisito of cuadro.requisitos) {
                  if(requisito._id==id_requisito){
                      if(requisito.estado=="No realizado")
                      {
                        requisito.estado="Pendiente";
                      }else if(requisito.estado=="Pendiente"){
                        requisito.estado="No realizado";
                      }
                  }
                }
            }
        }
        const actualizacionDB = await Progreso.findByIdAndUpdate(
            {_id:scoutDb.adicional.progreso_plan},
            progresoDb,
            {new: true});

        for (const lista of actualizacionDB.plan[0].cuadros_adelanto) {
            if(lista.tipo == tipo){
                Cuadros.push(lista);
            }
        }
        res.json(Cuadros);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });
  router.get('/validar-cancelar/:id/:tipo/:id_requisito', async(req, res) => { 
    const id_requisito = req.params.id_requisito;
    const _id = req.params.id;
    const tipo = req.params.tipo;
    var estado_cuadro = true;
    var cambio = false;
    var Cuadros = [];
    try {
        const scoutDb = await Scout.findOne({_id});
        const progresoDb = await Progreso.findOne({_id:scoutDb.adicional.progreso_plan});
        for (const plan of progresoDb.plan) {
            for (const cuadro of plan.cuadros_adelanto) {
                for (const requisito of cuadro.requisitos) {
                  if(requisito._id==id_requisito){
                      if(requisito.estado=="No realizado")
                      {
                        requisito.estado="Realizado";
                        cambio = true;
                      }else if(requisito.estado=="Realizado"){
                        requisito.estado="No realizado";
                        cambio = true;
                      }
                  }
                  if(requisito.estado=="No realizado" || requisito.estado=="Pendiente"){
                    estado_cuadro=false;
                  }
                }
                if(estado_cuadro && cambio){
                  cuadro.estado=true;
                }else if(cuadro.estado==true && !cambio){
                }else{
                  cuadro.estado=false;
                }
                estado_cuadro=true;
                cambio=false;
            }
        }
        const actualizacionDB = await Progreso.findByIdAndUpdate(
            {_id:scoutDb.adicional.progreso_plan},
            progresoDb,
            {new: true});

        for (const lista of actualizacionDB.plan[0].cuadros_adelanto) {
            if(lista.tipo == tipo){
                Cuadros.push(lista);
            }
        }
        res.json(Cuadros);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });
  router.get('/aceptar-peticion/:id/:tipo/:id_requisito', async(req, res) => { 
    const id_requisito = req.params.id_requisito;
    const _id = req.params.id;
    const tipo = req.params.tipo;
    var estado_cuadro = true;
    var cambio = false;
    var Cuadros = [];
    try {
        const scoutDb = await Scout.findOne({_id});
        const progresoDb = await Progreso.findOne({_id:scoutDb.adicional.progreso_plan});
        for (const plan of progresoDb.plan) {
            for (const cuadro of plan.cuadros_adelanto) {
                for (const requisito of cuadro.requisitos) {
                  if(requisito._id==id_requisito){
                      if(requisito.estado=="Pendiente")
                      {
                        requisito.estado="Realizado";
                        cambio=true;
                      }
                  }
                  if(requisito.estado=="No realizado" || requisito.estado=="Pendiente"){
                    estado_cuadro=false;
                  }
                }
                if(estado_cuadro && cambio){
                  cuadro.estado=true;
                }else if(cuadro.estado==true && !cambio){

                }else{
                  cuadro.estado=false;
                }
                estado_cuadro=true;
                cambio=false;
            }
        }
        const actualizacionDB = await Progreso.findByIdAndUpdate(
            {_id:scoutDb.adicional.progreso_plan},
            progresoDb,
            {new: true});

        for (const lista of actualizacionDB.plan[0].cuadros_adelanto) {
            if(lista.tipo == tipo){
                Cuadros.push(lista);
            }
        }
        res.json(Cuadros);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });
  router.get('/rechazar-peticion/:id/:tipo/:id_requisito', async(req, res) => { 
    const id_requisito = req.params.id_requisito;
    const _id = req.params.id;
    const tipo = req.params.tipo;
    var Cuadros = [];
    try {
        const scoutDb = await Scout.findOne({_id});
        const progresoDb = await Progreso.findOne({_id:scoutDb.adicional.progreso_plan});
        for (const plan of progresoDb.plan) {
            for (const cuadro of plan.cuadros_adelanto) {
                for (const requisito of cuadro.requisitos) {
                  if(requisito._id==id_requisito){
                      if(requisito.estado=="Pendiente")
                      {
                        requisito.estado="No realizado";
                      }
                  }
                }
            }
        }
        const actualizacionDB = await Progreso.findByIdAndUpdate(
            {_id:scoutDb.adicional.progreso_plan},
            progresoDb,
            {new: true});

        for (const lista of actualizacionDB.plan[0].cuadros_adelanto) {
            if(lista.tipo == tipo){
                Cuadros.push(lista);
            }
        }
        res.json(Cuadros);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

router.post('/nuevo_adicional/:id_integrante', async(req, res) => {
  const _id = req.params.id_integrante;
  const body = req.body;

  try {
      var scoutDb = await Scout.findOne({_id});
      var progresoDb = await Progreso.findOne({'_id' : scoutDb.adicional.progreso_plan});
      var cuadroDb = await Cuadro_adelanto.create(body);
      progresoDb.plan[0].cuadros_adelanto.push(cuadroDb);
      const actualizacionDB = await Progreso.findByIdAndUpdate(
        {_id:scoutDb.adicional.progreso_plan},
        progresoDb,
        {new: true});
      res.json(actualizacionDB);
      
  } catch (error) {
      return res.status(400).json({
          mensaje: 'Ocurrio un error',
          error
      })
  }
});  

router.delete('/eliminar_adicional/:id_integrante/:id_cuadro', async(req, res) => {
  const _id = req.params.id_integrante;
  const id_cuadro = req.params.id_cuadro;

  try {
      var scoutDb = await Scout.findOne({_id});
      var progresoDb = await Progreso.findOne({'_id' : scoutDb.adicional.progreso_plan});
      var cuadros_adelanto = progresoDb.plan[0].cuadros_adelanto.filter(x => {
        return x._id != id_cuadro;
      });
      progresoDb.plan[0].cuadros_adelanto=cuadros_adelanto;
      const actualizacionDB = await Progreso.findByIdAndUpdate(
        {_id:scoutDb.adicional.progreso_plan},
        progresoDb,
        {new: true});
      res.json(actualizacionDB);
      
  } catch (error) {
      return res.status(400).json({
          mensaje: 'Ocurrio un error',
          error
      })
  }
});

router.put('/actualizar_adicional/:id_integrante/:id_cuadro', async(req, res) => {
  const _id = req.params.id_integrante;
  const id_cuadro = req.params.id_cuadro;
  const body = req.body;

  try {
      var scoutDb = await Scout.findOne({_id});
      var progresoDb = await Progreso.findOne({'_id' : scoutDb.adicional.progreso_plan});
      for (const plan of progresoDb.plan) {
        for (const cuadro of plan.cuadros_adelanto) {
          if(cuadro.id == id_cuadro){
            if(body.nombre){
              cuadro.nombre=body.nombre;
            }
            if(body.tipo){
              cuadro.tipo=body.tipo;
            }
            if(body.imagen){
              cuadro.imagen=body.imagen;
            }
          }
        }
      }
      const actualizacionDB = await Progreso.findByIdAndUpdate(
        {_id:scoutDb.adicional.progreso_plan},
        progresoDb,
        {new: true});
      res.json(actualizacionDB);
      
  } catch (error) {
      return res.status(400).json({
          mensaje: 'Ocurrio un error',
          error
      })
  }
});

module.exports = router;