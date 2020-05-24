var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var esquema= new Schema({
    nombreEmergencia:{type:String,required:true},
    celularEmergencia:{type:String,required:true},
    nombreMadre:{type:String,required:true},
    celularMadre:{type:String,required:true},
    nombrePadre:{type:String,required:true},
    celularPadre:{type:String,required:true},
    progreso_plan:{type:Schema.Types.ObjectId,ref: 'Progreso'},
});

module.exports=mongoose.model('Scout',esquema);
