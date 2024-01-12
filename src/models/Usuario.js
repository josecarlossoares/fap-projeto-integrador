//Importandd modulos
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Criando a classe modelo de usuarios
const Usuario = new Schema({

        _id: {
          type: Number,
        },
        cpfUser: {
          type: Number,
          unique: true // Garante que o email seja único
        },
        nomeUser: {
          type: String,
          required: true,
        },
        tipoUser: {
          type: String,
          default: 'padrao'
        },
        cargoUser: {
          type: String
        },
        statusUser: {
          type: String,
          default: 'ativo'
        },
        emailUser: {
          type: String,
          required: true,
          unique: true // Garante que o email seja único
        },
        passUser: {
          type: String,
          required: true,
        },
        registroUser: {
          type: String
        }
    
})
//Exportando a model
module.exports = mongoose.model('usuarios', Usuario);