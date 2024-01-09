const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const  bcrypt = require('bcryptjs')
const Projeto = require('../models/Projeto')
const Usuario = require('../models/Usuario')

//Main
router.get('/', (req, res) => {
    res.send('Home')
})

//Login
router.get('/login', (req, res) =>{
    res.send('Formulario de login')
})

router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        usernameField: req.body.emailUser,
        password: req.body.passUser,
        successRedirect: "/projetos",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next)
})

//Logout
router.get('/logout', (req, res, next) =>{
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).redirect('/');
    });
})

//Todos os projetos
router.get('/projetos', async (req, res) => {

    const listaProjetos = await Projeto.find()
    
    res.send(listaProjetos)
})
//Total de projetos
//indicadores para projetos em andamento e concluidos

//Lista de projetos em atraso
router.get('/projetosematraso', (req, res) => {

})
//total de projetos em atraso
//total de projetos


//Projeto especifico
router.get('/projetos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        const projeto = await Projeto.findOne({_id: id});

        res.status(200).send(projeto);
    } catch (error) {
        res.status(500).send('Erro ao buscar projeto');
    }

    //fator de lucratividade do projeto, impacto na margem de luucratividade caso EM ATRASO
    //consumo de tempo e custo em relação ao orçamento
    //percentual de consumo do prazo
    //percentual de consumo do prazo (dias orçados vs. dias percorridos)
    //Percentual de horas orçadas x horas consumidas
    //tipo de  projeto, escopo ou alocação
})




//Rotas de consulta
//Consultar entregas realizadas dentro do prazo
// Pesquisa de projetos com filtro de período, nome e tipo de projeto


module.exports = router;