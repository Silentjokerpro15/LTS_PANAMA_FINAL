var mongoose = require('mongoose');

var DetalleSchema = mongoose.Schema({
    local: {
       
        id_pedido: Number,
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