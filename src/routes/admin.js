//Importando modulos
const express = require('express')
const router = express.Router()
const Usuario  = require('../models/Usuario')
const bcrypt = require('bcryptjs')

//Rota principal
router.get('/', (req, res) => {
    res.redirect('/usuarios/')
})

//Login
router.get('/login', (req, res) =>{
    res.redirect('/usuarios/login')
})

//Rotas de administrador
router.get('/registro', (req, res) => {
    res.send('tela de cadastro')
})
//Cadastrar novos usuarios
router.post('/registro', (req, res) => {
    let erros = [];
    //Validando integridade dos campos
    if(!req.body.nomeUser || req.body.nomeUser == undefined || req.body.nomeUser == null){
        erros.push({erro: 'nome inválido!'})
    }
    if(!req.body.cpfUser || req.body.cpfUser == undefined || req.body.cpfUser == null){
        erros.push({erro: 'cpf inválido!'})
    }
    if(req.body.cpfUser.length < 11 || req.body.cpfUser.length > 11){
        erros.push({erro: 'cpf inválido!'})
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
        //verificando a existencia no banco
        Usuario.findOne({emailUser: req.body.emailUser}).then((user) => {
            if(user){
                return res.send('Já existe alguem cadastrado com esse email.')
            }else{
                const novoUsuario = new Usuario({
                    _id: req.body.cpfUser,
                    cpfUser: req.body.cpfUser,
                    nomeUser: req.body.nomeUser,
                    tipoUser: req.body.tipoUser,
                    cargoUser: req.body.cargoUser,
                    statusUser: req.body.statusUser,
                    emailUser: req.body.emailUser,
                    passUser: req.body.passUser,
                    registroUser: req.body.registroUser
                })
                //Gerando hash para a senha
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
                }
                
                generateHash()
            }

        })
    }

})

//Editar informações de contas de usuário
router.put('/editarusuario/:id',  async (req, res) => {  
    try {
        let erros = [];
        //Validando integridade dos campos
        if(!req.body.nomeUser || req.body.nomeUser == undefined || req.body.nomeUser == null){
            erros.push({erro: 'nome inválido!'})
        }
        if(!req.body.cpfUser || req.body.cpfUser == undefined || req.body.cpfUser == null){
            erros.push({erro: 'cpf inválido!'})
        }
        if(req.body.cpfUser.length < 11 || req.body.cpfUser.length > 11){
            erros.push({erro: 'cpf inválido!'})
        }
        if(!req.body.cargoUser || req.body.cargoUser == undefined || req.body.cargoUser == null){
            erros.push({erro: 'cargo inválido!'})
        }
        if(!req.body.emailUser || req.body.emailUser == undefined || req.body.emailUser == null){
            erros.push({erro: 'email inválido!'})
        }
        if(!req.body.passUser || req.body.passUser == undefined || req.body.passUser == null){
            erros.push({erro: 'senha inválida!'})
        }
        if(req.body.passUser.length < 8){
            erros.push({erro: 'senha muito curta!'})
        }

        if(erros.length > 0){
            res.send('Os dados inseridos apresentaram inconsistencia.')
        }else{
            const id = parseInt(req.params.id);

            const novosDadosUsuario = new Usuario({
                _id: req.body.cpfUser,
                cpfUser: req.body.cpfUser,
                nomeUser: req.body.nomeUser,
                tipoUser: req.body.tipoUser,
                cargoUser: req.body.cargoUser,
                statusUser: req.body.statusUser,
                emailUser: req.body.emailUser,
                passUser: req.body.passUser,
                registroUser: req.body.registroUser
            })

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(novosDadosUsuario.passUser, salt);
                
            novosDadosUsuario.passUser = hash;
    
            await Usuario.findByIdAndUpdate(id, novosDadosUsuario, { new: true }).then((u) => {
                if(u){
                    console.log('Dados de usuario atualizados');
                    res.send(novosDadosUsuario);                                
                }else{
                    console.log('Usuario não encontrado');
                    res.send('Erro ao rastrear usuario')
                }
            })
        }  
     
    } catch (error) {
        res.status(500).send('Erro ao efetuar alterações: ', error);
    }

})

//Consultar informações de usuarios, historico

module.exports = router;