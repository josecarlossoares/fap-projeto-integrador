module.exports = {
    //fator de lucratividade
    lucratividadeProjeto: function (billableAmount, totalBudget){
        let receitasTotais = billableAmount
        let custosTotais = totalBudget

        let fator = billableAmount / totalBudget
        return fator.toFixed(2);
    },
    //consumo de custo em relação ao orçamento
    percentualConsumoOrcamento: function (spentBudget, totalBudget){
        if (totalBudget === 0) {
            return 0;
        }
        const percentualConsumoOrcamento = (spentBudget / totalBudget) * 100;
        return percentualConsumoOrcamento.toFixed(2);
    },
    //percentual de consumo do prazo (dias orçados vs. dias percorridos)
    percentualConsumoPrazo: function (tempoGasto, prazoTotal){
        if (prazoTotal === 0) {
            return 0;
        }

        const percentualConsumoTempo = (tempoGasto / prazoTotal) * 100;
        return percentualConsumoTempo.toFixed(2);
    }
    //Percentual de horas orçadas x horas consumidas
    //tipo de projeto, escopo ou alocação
}