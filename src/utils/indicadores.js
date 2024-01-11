module.exports = {
    //fator de lucratividade
    lucratividadeProjeto: function (billableAmount, totalBudget){
        let receitasTotais = billableAmount
        let custosTotais = totalBudget

        let fator = billableAmount / totalBudget
        return fator;
    }
    //percentual de consumo do prazo
}