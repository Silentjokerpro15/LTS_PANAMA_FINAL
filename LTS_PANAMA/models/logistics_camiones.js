var mongoose = require('mongoose');

var CamionesSchema = mongoose.Schema({
 
    camiones: {
       
        modelo: String,
        color: String,
        placa: String,
        id_camion: Number,
     },
});

module.exports = mongoose.model('Camiones', CamionesSchema);