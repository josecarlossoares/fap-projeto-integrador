const express = require('express')
const router = express.Router()
const passport = require('passport')
const Projeto = require('../models/Projeto')
const Indicadores = require('../utils/indicadores')

//Rota principal
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
        
        const dados = {
            //Total de projetos
            totalProjetos: listaComIndicadores.length,
            //indicadores para projetos em andamento e concluidos
            lista: listaComIndicadores
        }
        
        res.send(dados); 
    }catch(err){
        console.log('Erro: ', err);
    }
 
})

// Lista de projetos em atraso
router.get('/projetosematraso', async (req, res) => {
    try {
        const listaProjetos = await Projeto.find();
        let projetosEmAtraso = [];

        const dataAtual = new Date();

        listaProjetos.forEach((element) => {
            const dataAplicacaoOrcamento = new Date(element.budgetAppliedDate);
            if (dataAtual > dataAplicacaoOrcamento) {
                const projeto = {
                    nomeProjeto: element.projectName,
                    idProjeto: element.projectId,
                    statusProjeto: element.projectStatus,
                    notas: element.notes,
                    eFaturavel: element.isBillable,
                    dataAplicacaoOrcamento: element.budgetAppliedDate
                };

                if (projeto.statusProjeto == 1) {
                    projeto.statusProjeto = 'Projeto em andamento';
                } else if (projeto.statusProjeto == 2) {
                    projeto.statusProjeto = 'Projeto concluído';
                } else if (projeto.statusProjeto == 3) {
                    projeto.statusProjeto = 'Projeto arquivado';
                }

                projetosEmAtraso.push(projeto);
            }
        });

        const dados = {
            totalProjetosEmAtraso: projetosEmAtraso.length,
            projetosEmAtraso: projetosEmAtraso
        };
        res.send(dados);
    } catch (err) {
        console.log('Erro: ', err);
    }
});


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

// Consultar entregas realizadas dentro do prazo
router.get('/entregasdentrodoprazo', async (req, res) => {
    try {
        const listaProjetos = await Projeto.find();
        let entregasNoPrazo = [];

        const dataAtual = new Date();

        listaProjetos.forEach((element) => {
            const dataTerminoProjeto = new Date(element.budgetAppliedDate);

            if (dataTerminoProjeto > dataAtual) {
                entregasNoPrazo.push({
                    nomeProjeto: element.projectName,
                    idProjeto: element.projectId,
                    dataTerminoProjeto: element.budgetAppliedDate
                });
            }
        });

        const dados = {
            totalEntregasNoPrazo: entregasNoPrazo.length,
            entregasNoPrazo: entregasNoPrazo
        };

        res.send(dados);
    } catch (err) {
        console.log('Erro: ', err);
    }
});

// Pesquisa de projetos com filtro de período, nome e tipo de projeto
router.get('/pesquisaprojetos', async (req, res) => {
    try {
        const { periodo, nomeProjeto, tipoProjeto } = req.query;

        // Crie um objeto de filtro com base nos parâmetros fornecidos
        const filtro = {};
        if (periodo) {
            filtro.dataTerminoProjeto = { $gte: new Date(periodo) };
        }
        if (nomeProjeto) {
            filtro.nomeProjeto = { $regex: new RegExp(nomeProjeto, 'i') };
        }
        if (tipoProjeto) {
            filtro.tipoProjeto = tipoProjeto; // Adapte conforme necessário
        }

        const listaProjetosFiltrados = await Projeto.find(filtro);

        const dados = {
            totalProjetosFiltrados: listaProjetosFiltrados.length,
            projetosFiltrados: listaProjetosFiltrados
        };

        res.send(dados);
    } catch (err) {
        console.log('Erro: ', err);
    }
});

module.exports = router;