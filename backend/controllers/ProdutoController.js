

const conexao = require("../config/database");
const Produto = require("../models/Produto");

class ProdutoController {

    static async listar(req, res) {
        try {
            const [dados] = await conexao.query(
                "SELECT * FROM produtos"
            );

            const produtos = dados.map(item => {
                return new Produto(
                    item.id,
                    item.nome,
                    item.descricao,
                    item.preco_custo,
                    item.estoque
                );
            });

            res.json(produtos);

        } catch (erro) {
            res.status(500).json({
                mensagem: "Erro ao listar produtos",
                erro: erro.message
            });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { nome, descricao, custo, estoque } = req.body;

            await conexao.execute(
                "INSERT INTO produtos (nome, descricao, preco_custo, estoque) VALUES (?, ?, ?, ?)",
                [nome, descricao, custo, estoque]
            );

            res.status(201).json({
                mensagem: "Produto cadastrado com sucesso"
            });

        } catch (erro) {
            res.status(500).json({
                mensagem: "Erro ao cadastrar produto",
                erro: erro.message
            });
        }
    }
}

module.exports = ProdutoController;

