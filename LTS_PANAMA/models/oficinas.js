var mongoose = require('mongoose');

var OficinasSchema = mongoose.Schema({
 
    oficinas: {
       
        pais: String,
        provincia: String,
        descripcion: String,
        distrito: String,
        id_oficina: Number,
        
     },
});

module.exports = mongoose.model('Oficinas', OficinasSchema);