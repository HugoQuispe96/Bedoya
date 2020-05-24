var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var esquema= new Schema({
    nombre:{type:String,required:true},
    cuadros_adelanto:[{type:Schema.Types.ObjectId,ref: 'Cuadro_adelanto'}],
});

module.exports=mongoose.model('Plan',esquema);