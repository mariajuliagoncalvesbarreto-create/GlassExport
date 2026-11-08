
class Moeda {
    constructor(pais, codigo, cotacao) {
        this.pais = pais;
        this.codigo = codigo;
        this.cotacao = Number(cotacao);
    }

    converter(valorEmReais) {
        return valorEmReais / this.cotacao;
    }
}

module.exports = Moeda;
