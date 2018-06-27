var mongoose = require('mongoose');

var LogisticsSchema = mongoose.Schema({
    rutas: {
       
       ruta: String,
       inicio: String,
       fin: String,
       id_ruta: Number,
    },

});

module.exports = mongoose.model('Logistics', LogisticsSchema);