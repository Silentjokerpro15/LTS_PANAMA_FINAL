var mongoose = require('mongoose');

var LogisticsSchema = mongoose.Schema({
    rutas: {
       
       ruta: String,
       inicio: String,
       fin: String,
       
    },
    camiones: {
       
        Modelo: String,
        color: String,
        Placa: String,
        
     },
});

module.exports = mongoose.model('Logistics', LogisticsSchema);