var mongoose = require('mongoose');

var CamionesSchema = mongoose.Schema({
 
    camiones: {
       
        modelo: String,
        color: String,
        placa: String,
        
     },
});

module.exports = mongoose.model('Camiones', CamionesSchema);