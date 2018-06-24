var mongoose = require('mongoose');

var DetalleSchema = mongoose.Schema({
    local: {
       
        idcliente: String,
        descripcion: String,
        fragil: String,
        enviado: Boolean,
        recibido: Boolean,
        activo: Number,
      
       
    },
});

module.exports = mongoose.model('Detalle', DetalleSchema);