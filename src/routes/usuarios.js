const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const  bcrypt = require('bcryptjs')
const Projeto = require('../models/Projeto')
const Usuario = require('../models/Usuario')
const Indicadores = require('../utils/indicadores')

//Main
router.get('/', (req, res) => {
    res.send('Home')
})

//Login
router.get('/login', (req, res) =>{
    res.send('Formulario de login')
})

router.post('/login', (req, res, next) =>{
    try{
        passport.authenticate('local', {
            usernameField: req.body.emailUser,
            password: req.body.passUser,
            successRedirect: "/projetos",
            failureRedirect: "/login",
            failureFlash: true
        })(req, res, next)
    }catch(err){
        console.log('Erro: ', err);
    }

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
    try{
        const listaProjetos = await Projeto.find()
        let listaComIndicadores = []
    
        listaProjetos.forEach((element) => {
            const projeto = {
                nomeProjeto: element.projectName,
                idProjeto: element.projectId,
                statusProjeto: element.projectStatus,
                notas: element.notes,
                eFaturavel: element.isBillable,
                dataOrcamento: element.budgetAppliedDate
    
            }
    
            if(projeto.statusProjeto == 1){
                projeto.statusProjeto = 'Projeto em andamento'
            }
            if(projeto.statusProjeto == 2){
                projeto.statusProjeto = 'Projeto concluído'
            }
            if(projeto.statusProjeto == 3){
                projeto.statusProjeto = 'Projeto arquivado'
            }
    
            listaComIndicadores.push(projeto);
        })
    
        //Total de projetos
        //indicadores para projetos em andamento e concluidos
        const dados = {
            totalProjetos: listaComIndicadores.length,
            lista: listaComIndicadores
        }
        
        res.send(dados); 
    }catch(err){
        console.log('Erro: ', err);
    }
 
})


//Lista de projetos em atraso
router.get('/projetosematraso', (req, res) => {

    //total de projetos em atraso
    //total de projetos
})



//Projeto especifico
router.get('/projetos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        const projeto = await Projeto.findOne({_id: id});
        const item = {
            nomeProjeto: projeto.projectName,
            idProjeto: projeto.projectId,
            statusProjeto: projeto.projectStatus,
            notas: projeto.notes,
            eFaturavel: projeto.isBillable,
            fatorLucratividade: Indicadores.lucratividadeProjeto(projeto.billableAmount, projeto.totalBudget),
            dataOrcamento: projeto.budgetAppliedDate

        }
        res.status(200).send(item);
    } catch (error) {
        res.status(500).send('Erro ao buscar projeto. ', error);
    }

    //fator de lucratividade do projeto, impacto na margem de lucratividade caso EM ATRASO
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