const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Usuario  = require('../models/Usuario')
const bcrypt = require('bcryptjs')

//Main
router.get('/', (req, res) => {
    res.redirect('/usuarios/')
})

//Rotas de administrador
router.get('/registro', (req, res) => {
    res.send('tela de  cadastro')
})
//Cadastrar novos usuarios
router.post('/registro', (req, res) => {

    let erros = [];

    if(!req.body.nomeUser || req.body.nomeUser == undefined || req.body.nomeUser == null){
        erros.push({erro: 'nome inválido!'})
    }
    if(!req.body.cargoUser || req.body.cargoUser == undefined || req.body.cargoUser == null){
        erros.push({erro: 'cargo inválido!'})
    }
    if(!req.body.emailUser || req.body.emailUser == undefined || req.body.emailUser == null){
        erros.push({erro: 'email inválido!'})
    }
    if(!req.body.passUser || req.body.passUser == undefined || req.body.passUser == null){
        erros.push({erro: 'senha inválido!'})
    }
    if(req.body.passUser.length < 8){
        erros.push({erro: 'senha muito curta'})
    }

    if(erros.length > 0){
        res.send('Os dados inseridos apresentaram inconsistencia. Por favor, refaça o cadastro')
    }else{
        Usuario.findOne({emailUser: req.body.emailUser}).then((user) => {
            if(user){
                return res.send('Já existe alguem cadastrado com esse email.')
            }else{
                const novoUsuario = new Usuario({
                    nomeUser: req.body.nomeUser,
                    tipoUser: req.body.tipoUser,
                    cargoUser: req.body.cargoUser,
                    statusUser: req.body.statusUser,
                    emailUser: req.body.emailUser,
                    passUser: req.body.passUser,
                    registroUser: req.body.registroUser
                })

                const generateHash = async () => {
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hash = await bcrypt.hash(novoUsuario.passUser, salt);
                
                        novoUsuario.passUser = hash;
                
                        await novoUsuario.save();
                        res.send('Cadastro efetuado!');
                    } catch (error) {
                        console.log('Erro: ', error);
                        res.send('Erro ao cadastrar usuário');
                    }
                };
                
                generateHash();
            }

        })
    }

})
//Editar informações de contas de usuário
//Consultar informações de usuarios, historico


module.exports = router;