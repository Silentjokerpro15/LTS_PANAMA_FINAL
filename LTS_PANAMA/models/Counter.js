var mongoose = require('mongoose');

var CounterSchema = mongoose.Schema({
    local: {
       
        nombrec: String,
        nombree: String,
        cedula: String,
        oficina: String,
        monto: Number,
        activo: Number,
       
    },
});

module.exports = mongoose.model('Counter', CounterSchema);