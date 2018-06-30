var mongoose = require('mongoose');

var LogisticsSchema = mongoose.Schema({
    rutas: {
       
       ruta: String,
       inicio: String,
       fin: String,
       id_ruta: Number,
       id_subruta: Number,
    },

});

module.exports = mongoose.model('Logistics', LogisticsSchema);