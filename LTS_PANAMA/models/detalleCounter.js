var mongoose = require('mongoose');

var DetalleSchema = mongoose.Schema({
    local: {
       
        idcliente: String,
        descripcion: String,
        fragil: String,
        direccion: String,
        enviado: Boolean,
        recibido: Boolean,
        activo: Number,
        manifiestoid: String,
       
    },
});

module.exports = mongoose.model('Detalle', DetalleSchema);