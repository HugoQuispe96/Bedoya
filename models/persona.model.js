var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema=mongoose.Schema;

var Scout= new Schema({
    nombreEmergencia:{type:String,required:true},
    celularEmergencia:{type:String,required:true},
    nombreMadre:{type:String,required:true},
    celularMadre:{type:String,required:true},
    nombrePadre:{type:String,required:true},
    celularPadre:{type:String,required:true},
    progreso_plan:{type:Schema.Types.ObjectId,ref: 'Progreso'},
});

var esquema= new Schema({
    id:{type:Number,required:true, index: true, unique: true},
    nombre:{type:String,required:true},
    apellidos:{type:String,required:true},
    fechaNacimiento:{type:Date,required:true},
    correo:{type:String,required:true},
    contrasena:{type:String,required:true},
    unidad:{type:String,required:true},
    celular:{type:String,required:true},
    direccion:{type:String,required:true},
    rol:{type:String, default: "Integrante"},
    imagen:{type:String, default: null},
    nombre_de_caza:{type:String, default: null},
    telefono:{type:String},
    barrio:{type:String},   
    ocupacion:{type:String, required:true},
    estado:{type:Boolean, default: true},
    inscrito:{type:Boolean, default: false},
    adicional:{type:Scout, default: null}
});
esquema.plugin(uniqueValidator);
module.exports = mongoose.model('Persona',esquema);