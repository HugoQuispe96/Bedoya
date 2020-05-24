var express = require('express');
var router = express.Router();
var Requisito = require('../../models/requisito.model');
var Cuadro_adelanto = require('../../models/cuadro.model');
var Scout = require('../../models/persona.model');
var Progreso = require('../../models/progreso_plan.model');

router.get('/',(req,res,next)=>{
    console.log("funciona");
});

router.post('/nuevo/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;

    try {
        var cuadroDB = await Cuadro_adelanto.findOne({_id});
        var requisitoDB = await Requisito.create(body);
        cuadroDB.requisitos.push(requisitoDB._id);
        await Cuadro_adelanto.findByIdAndUpdate(
            _id,
            cuadroDB,
            {new: true});
        res.json(requisitoDB); 
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
        const requisitoDB = await Requisito.findByIdAndUpdate(
        _id,
        body,
        {new: true});
        res.json(requisitoDB);  
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.delete('/eliminar/:idrequisito/:idcuadro', async(req, res) => {
    const idrequisito = req.params.idrequisito;
    const idcuadro = req.params.idcuadro;

    try {
        const requisitoDB = await Requisito.findByIdAndDelete({_id:idrequisito});
        if(!requisitoDB){
            return res.status(400).json({
                mensaje: 'No se encontró el id indicado',
                error
            })
        }
        var cuadroDB = await Cuadro_adelanto.findOne({_id:idcuadro});
        var requisitos = cuadroDB.requisitos.filter(x => {
            return x != idrequisito;
        });
        cuadroDB.requisitos=requisitos;
        await Cuadro_adelanto.findByIdAndUpdate(
            {_id : idcuadro},
            cuadroDB,
            {new: true});

        res.json(requisitoDB); 

    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.get('/solicitar/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const requisitoDB = await Requisito.findOne({_id});
        if(requisitoDB.estado === 'No realizado' || requisitoDB.estado === 'Rechazado' ){
            res.json(await Requisito.findByIdAndUpdate(_id, {estado : 'Pendiente'},{new: true}));
        }
        else{
            return res.status(400).json({
                mensaje: 'Estado debe ser No realizado o Rechazado'
                });
        }
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.get('/aceptar/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const requisitoDB = await Requisito.findOne({_id});
        if(requisitoDB.estado === 'Pendiente'){
            res.json(await Requisito.findByIdAndUpdate(_id, {estado : 'Realizado'},{new: true}));
        }
        else{
            return res.status(400).json({
                mensaje: 'Estado debe ser Pendiente'
                });
        }  
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.get('/rechazar/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const requisitoDB = await Requisito.findOne({_id});
        if(requisitoDB.estado === 'Pendiente'){
            res.json(await Requisito.findByIdAndUpdate(_id, {estado : 'Rechazado'},{new: true}));
        }
        else{
            return res.status(400).json({
                mensaje: 'Estado debe ser Pendiente'
                });
        }    
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});
router.get('/listar', async(req, res) => { 
    try {
      const listaDb = await Requisito.find();
      res.json(listaDb);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

router.post('/nuevo_adicional/:id_integrante/:id_cuadro', async(req, res) => {
const _id = req.params.id_integrante;
const id = req.params.id_cuadro;
const body = req.body;

try {
    var scoutDb = await Scout.findOne({_id});
    var progresoDb = await Progreso.findOne({'_id' : scoutDb.adicional.progreso_plan});
    var requisitoDb = await Requisito.create(body);

    for (const plan of progresoDb.plan) {
        for (const cuadro of plan.cuadros_adelanto) {
            if(cuadro.id==id){
                cuadro.requisitos.push(requisitoDb);
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

router.put('/actualizar_adicional/:id_integrante/:id_requisito', async(req, res) => {
    const _id = req.params.id_integrante;
    const id = req.params.id_requisito;
    const body = req.body;
  
    try {
        var scoutDb = await Scout.findOne({_id});
        var progresoDb = await Progreso.findOne({'_id' : scoutDb.adicional.progreso_plan});
        for (const plan of progresoDb.plan) {
          for (const cuadro of plan.cuadros_adelanto) {
            for (const requisito of cuadro.requisitos) {
                if(requisito.id == id){
                    if(body.descripcion){
                        requisito.descripcion=body.descripcion;
                    }
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

router.delete('/eliminar_adicional/:id_integrante/:id_requisito', async(req, res) => {
    const _id = req.params.id_integrante;
    const id_requisito = req.params.id_requisito;

    try {
        var scoutDb = await Scout.findOne({_id});
        var progresoDb = await Progreso.findOne({'_id' : scoutDb.adicional.progreso_plan});
        for (const plan of progresoDb.plan) {
            for (const cuadro of plan.cuadros_adelanto) {
              for (const requisito of cuadro.requisitos) {
                if(requisito.id == id_requisito){
                    var requisitos = cuadro.requisitos.filter(x => {
                        return x._id != id_requisito;
                    });
                    cuadro.requisitos=requisitos;
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