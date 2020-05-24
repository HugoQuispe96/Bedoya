var jwt=require('jsonwebtoken');
var sercret=require('../config/config');
exports.VerificarToken=function(req,res,next){
    //dominio.com/usuario/?token=jhjkfdasu234234hakjdajkdh
    let token=req.query.token;
    jwt.verify(token,sercret.PALABRASECRETA,
        (err,decode)=>{
        if(err){
            return res.status(401).json({
                estado:'fail',
                error:err,
                msg:'Acceso privado'
            });
        }
        req.usuario=decode.usuario;
        next();
    });

}