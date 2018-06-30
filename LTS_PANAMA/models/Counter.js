var mongoose = require('mongoose');

var CounterSchema = mongoose.Schema({
    local: {
       
        nombrec: String,
        nombree: String,
        cedula: String,
        inicio: String,
        destino: String,
        monto: Number,
        activo: Number,
       id_pedido: Number,
    },
});

module.exports = mongoose.model('Counter', CounterSchema);