var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var roleValidos ={

  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol permitido'


}

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({

  nombre: { type: String, required: [true, ' El nombre es necesario']},
  email : { type: String, unique: true, required: [true, ' El email es necesario']},
   password: { type: String, required: [true, ' la contraseña es necesaria'] },
    img : { type: String, required: false},
    role : { type: String, required: true, default: 'USER_ROLE', enum: roleValidos},
    google: { type: Boolean, default: false}

});
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports= mongoose.model('Usuario', usuarioSchema);