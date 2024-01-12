//Importando modulos
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')

//Função de validação e criação de sessão de usuario
module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'emailUser', passwordField: 'passUser'}, (email, senha, done)  => {
        
        Usuario.findOne({emailUser: email}).then((usuario) => {
            if(!usuario){
                return done(null, false, {message: 'essa conta não existe'})
            }
            
            //Comparando as senhas encriptadas
            bcrypt.compare(senha, usuario.passUser, (erro, batem) => {
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message:'Senha incorreta'})
                }
            })
        })
    }))

    //Criando a sessão
    passport.serializeUser((usuario, done) => {
        done(null, usuario._id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id).then((usuario)=>{
            done(null,usuario)
        }).catch((err)=>{
            done (null,false,{message:'algo deu errado'})
        })
    })
}