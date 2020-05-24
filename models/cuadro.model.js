var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var esquema= new Schema({
    nombre:{type:String,required:true},
    tipo:{type:String,required:true},
    fecha:{type:Date},
    estado:{type:Boolean, default:false},
    imagen:{type:String, default: null},
    requisitos:[{type:Schema.Types.ObjectId,ref: 'Requisito'}],
});

module.exports=mongoose.model('Cuadro_adelanto',esquema);