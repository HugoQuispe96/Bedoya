var express = require('express');
var router = express.Router();
var Unidad = require('../../models/unidad.model');

router.get('/listar', async(req, res) => {
    try {
      const listaDb = await Unidad.find({'estado':true});
      res.json(listaDb);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

  router.get('/inactivos', async(req, res) => {
    try {
      const listaDb = await Unidad.find({'estado':false});
      res.json(listaDb);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

router.post('/nuevo', async(req, res) => {
    const body = req.body;
    try {
      const unidadDB = await Unidad.create(body);
      res.status(200).json(unidadDB); 
    } catch (error) {
      return res.status(500).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

  router.put('/activar/:id', async(req, res) => {
    const _id = req.params.id;
    try {
      const unidadDB = await Unidad.findByIdAndUpdate(
        _id,
        {estado:true},
        {new: true});
      res.json(unidadDB);  
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
    const unidadDB = await Unidad.findByIdAndUpdate(
      _id,
      {estado:false},
      {new: true});
    res.json(unidadDB);  
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
      const unidadDB = await Unidad.findByIdAndUpdate(
        _id,
        body,
        {new: true});
      res.json(unidadDB);  
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

module.exports = router;