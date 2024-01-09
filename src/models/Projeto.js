const mongoose  = require('mongoose')
const Schema = mongoose.Schema

const Projeto = new Schema({
    _id: {type: Number, unique: true},
    memberCount: { type: Number},
    groupCount: { type: Number},
    billableAmount: { type: Number},
    billableCurrency: { type: String},
    totalBudget: { type: Number},
    spentBudget: { type: Number},
    budgetCurrency: { type: String},
    projectId: { type: Number},
    projectName: { type: String},
    projectCode: { type: String},
    accountId: { type: Number},
    projectStatus: { type: Number},
    clientId: { type: Number},
    avatar: { type: String},
    isBillable: { type: Boolean},
    invoiceMethod: { type: Number},
    budgetingMethod: { type: Number},
    spentRatesType: { type: Number},
    budgetSize: { type: Number},
    overBudgetBehaviour: { type: Number},
    budgetPeriod: { type: Number},
    budgetAppliedDate: { type: String},
    budgetAlertPercents: { type: Number},
    notes: { type: String},
    projectFee: { type: Number},
    projectFeePeriod: { type: Number}
})

module.exports  = mongoose.model('projeto', Projeto);
 //ID do projeto
 //Contagem de membro
 //contagem de grupo
 //Valor faturável
 //Moeda faturável
 //orçamento total
 //orçamento gasto
 //moeda do orçamento
 //ID do projeto
 //Nome do Projeto
 //Código do projeto
 //ID da conta
 //status do projeto
 //ID do Cliente
 //avatar
 //é faturável
 //Método de fatura
 //Método de orçamento
 //Tipo de taxas gastas
 //tamanho do orçamento
 // sobre o comportamento orçamentário
 //Período de orçamento
 //data de aplicação do orçamento
 //porcentagens de alerta de orçamento
 //notas
 //Taxa do projeto
 //Período de taxa do projeto