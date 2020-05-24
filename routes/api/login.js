var express = require('express');
var router = express.Router();
var Pesona = require('../../models/persona.model');
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');

router.post('/',(req,res,next)=>{
    if(!req.body.id){
        return res.status(300).json({error:'Falta id',estado:'fail'});
    }else if(!req.body.contrasena){
        return res.status(300).json({error:'Falta contraseña',estado:'fail'});
    }
    Pesona.find({id:req.body.id},(err,user)=>{
          if(err){
              return res.status(302)
              .json({error:err,estado:'fail'});
          }
          if(user.length==0)
              return res.status(302).json({error:err,estado:'fail'});
          if(bcrypt.compareSync(req.body.contrasena,user[0].contrasena)){
              //crear el token
              let token=jwt.sign({usuario:user[0],
                  iat:Math.floor(Date.now() / 1000) - 30 },'shdn2io3u91289j9348h9');
              return res.status(200).json({usuario:user[0]});
          }else
              return res.status(300).json({error:'No exite el usuario',estado:'fail'});
      });    
  });

module.exports = router;