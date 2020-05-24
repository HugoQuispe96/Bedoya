var express = require('express');
var router = express.Router();
var Plan = require('../../models/plan.model');
var Unidad = require('../../models/unidad.model');

router.post('/nuevo/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;

    try {
        var unidadDB = await Unidad.findOne({_id});
        var planDB = await Plan.create(body);
        unidadDB.plan_asignado=planDB._id;
        await Unidad.findByIdAndUpdate(
            _id,
            unidadDB,
            {new: true});
        res.json(planDB); 
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
        const planDB = await Plan.findByIdAndUpdate(
        _id,
        body,
        {new: true});

        res.json(planDB);  
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.delete('/eliminar/:idplan/:idunidad', async(req, res) => {
    const idplan = req.params.idplan;
    const idunidad = req.params.idunidad;
    try {
        const planDB = await Plan.findByIdAndDelete({_id:idplan});
        if(!planDB){
        return res.status(400).json({
            mensaje: 'No se encontró el id indicado',
            error
        })
        }
        var unidadDB = await Unidad.findOne({_id:idunidad});
        unidadDB.plan_asignado=null;
        await Unidad.findByIdAndUpdate(
            {_id : idunidad},
            unidadDB,
            {new: true});

        res.json(planDB);  
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});
router.get('/listar', async(req, res) => { 
    try {
      const listaDb = await Plan.find();
      res.json(listaDb);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });
  
module.exports = router;