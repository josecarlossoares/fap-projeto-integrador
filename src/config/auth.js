const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'emailUser', passwordField: 'passUser'}, (email, senha, done)  => {
        
        Usuario.findOne({email: email}).then((usuario) => {
            if(!usuario){
                return done(null, false, {message: 'essa conta não existe'})
            }

            bcrypt.compare(senha, usuario.passUser, (erro, batem) => {
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message:'Senha incorreta'})
                }
            })
        })
    }))


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