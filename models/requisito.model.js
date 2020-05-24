var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var esquema= new Schema({
    descripcion:{type:String, required:true},
    estado:{type:String, default:"No realizado"},
});

module.exports=mongoose.model('Requisito',esquema);