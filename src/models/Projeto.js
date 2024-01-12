//Importando modulos
const mongoose  = require('mongoose')
const Schema = mongoose.Schema

//Classe modelo para projetos
const Projeto = new Schema({
    _id: {type: Number, unique: true}, //ID do projeto, mongo
    memberCount: { type: Number}, //Contagem de membro
    groupCount: { type: Number}, //contagem de grupo
    billableAmount: { type: Number}, //Valor faturável
    billableCurrency: { type: String}, //Moeda faturável
    totalBudget: { type: Number}, //orçamento total
    spentBudget: { type: Number}, //orçamento gasto
    budgetCurrency: { type: String}, //moeda do orçamento
    projectId: { type: Number}, //ID do projeto, t metric
    projectName: { type: String}, //Nome do Projeto
    projectCode: { type: String}, //Código do projeto
    accountId: { type: Number}, //ID da conta
    projectStatus: { type: Number}, //status do projeto
    clientId: { type: Number}, //ID do Cliente
    avatar: { type: String},
    isBillable: { type: Boolean}, //é faturável?
    invoiceMethod: { type: Number}, //Método de fatura
    budgetingMethod: { type: Number}, //Método de orçamento
    spentRatesType: { type: Number}, //Tipo de taxas gastas
    budgetSize: { type: Number}, //tamanho do orçamento
    overBudgetBehaviour: { type: Number}, //sobre o comportamento orçamentário
    budgetPeriod: { type: Number}, //Período de orçamento
    budgetAppliedDate: { type: String}, //data de aplicação do orçamento
    budgetAlertPercents: { type: Number}, //porcentagens de alerta de orçamento
    notes: { type: String},
    projectFee: { type: Number}, //Taxa do projeto
    projectFeePeriod: { type: Number}, //Período de taxa do projeto
    tipoProjeto: { type: String } // Adicionando o campo tipoProjeto
})
//Exportando a model
module.exports = mongoose.model('projeto', Projeto);