var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var Requisito= new Schema({
    descripcion:{type:String},
    estado:{type:String},
});

var Cuadro= new Schema({
    nombre:{type:String},
    tipo:{type:String},
    fecha:{type:Date},
    estado:{type:Boolean},
    imagen:{type:String, default: null},
    requisitos:[{type:Requisito}],
});

var Plan= new Schema({
    nombre:{type:String},
    cuadros_adelanto:[{type:Cuadro}],
});

var esquema= new Schema({
    plan:[{type:Plan}],
});

module.exports=mongoose.model('Progreso',esquema);