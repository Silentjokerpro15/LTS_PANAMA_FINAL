var mongoose = require('mongoose');

var ManifestSchema = mongoose.Schema({
    local: {
       
        idmanifest: String,
        fecha: String,
        camion: String,
        conductor: String,
        ruta: String,
        //sucursal: String,
        activo: Number,
    },
});

module.exports = mongoose.model('Manifest', ManifestSchema);