
class Produto {
    constructor(id, nome, descricao, custo, estoque) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.custo = Number(custo ?? 0);
        this.estoque = estoque;
    }

    calcularPrecoVenda() {
        return this.custo * 2;
    }

    calcularPrecoMoeda(cotacao) {
        return this.calcularPrecoVenda() / cotacao;
    }
}

module.exports = Produto;
