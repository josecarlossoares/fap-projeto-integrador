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
        res.status(200).redirect('/usuarios/login');
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
                eFaturavel: element.isBillable
    
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
     
    try {
        const id = parseInt(req.params.id);
        const projeto = await Projeto.findOne({_id: id});

        const item = {
            nomeProjeto: projeto.projectName,
            idProjeto: projeto.projectId,
            statusProjeto: projeto.projectStatus,//status do  projeto
            notas: projeto.notes,
            dataOrcamento: projeto.budgetAppliedDate,//data de aplicação
            eFaturavel: projeto.isBillable,//campo que retorna se o projeto é faturavel
            fatorLucratividade: Indicadores.lucratividadeProjeto(projeto.billableAmount, projeto.totalBudget),//fator de lucratividade do projeto
            percentualConsumoOrcamento: Indicadores.percentualConsumoOrcamento(projeto.spentBudget, projeto.totalBudget)//consumo de custo em relação ao orçamento
        }

        if(item.statusProjeto == 1){
            item.statusProjeto = 'Projeto em andamento'
        }
        if(item.statusProjeto == 2){
            item.statusProjeto = 'Projeto concluído'
        }
        if(item.statusProjeto == 3){
            item.statusProjeto = 'Projeto arquivado'
        }

        res.status(200).send(item);
    } catch (error) {
        res.status(500).send('Erro ao buscar projeto. ', error);
    }
    
    //percentual de consumo do prazo (dias orçados vs. dias percorridos)
    //Percentual de horas orçadas x horas consumidas
    
    //tipo de projeto, escopo ou alocação, integração com a Omie
})




//Rotas de consulta
    //Consultar entregas realizadas dentro do prazo
    // Pesquisa de projetos com filtro de período, nome e tipo de projeto


module.exports = router;