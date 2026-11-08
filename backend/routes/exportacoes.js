
const express = require("express");
const router = express.Router();
const conexao = require("../config/database");

// LISTAR EXPORTAÇÕES
router.get("/", async (req, res) => {
    try {
        const [dados] = await conexao.query(`
            SELECT exportacoes.*, produtos.nome AS produto_nome
            FROM exportacoes
            INNER JOIN produtos ON exportacoes.produto_id = produtos.id
            ORDER BY exportacoes.id DESC
        `);

        res.json(dados);

    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao listar exportações",
            erro: erro.message
        });
    }
});

// REGISTRAR EXPORTAÇÃO E BAIXAR ESTOQUE
router.post("/", async (req, res) => {
    const {
        produto_id,
        pais_destino,
        quantidade,
        moeda,
        preco_unitario,
        data_exportacao
    } = req.body;

    const quantidadeExportada = Number(quantidade);

    if (!Number.isInteger(quantidadeExportada) || quantidadeExportada <= 0) {
        return res.status(400).json({
            mensagem: "A quantidade deve ser um número inteiro positivo."
        });
    }

    const conn = await conexao.getConnection();

    try {
        await conn.beginTransaction();

        // Verificar estoque do produto
        const [produtos] = await conn.execute(
            "SELECT estoque FROM produtos WHERE id = ? FOR UPDATE",
            [produto_id]
        );

        if (produtos.length === 0) {
            await conn.rollback();
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        const estoqueAtual = Number(produtos[0].estoque);

        if (quantidadeExportada > estoqueAtual) {
            await conn.rollback();
            return res.status(400).json({
                mensagem: `Estoque insuficiente! Disponível: ${estoqueAtual} unidades.`
            });
        }

        // Descontar estoque
        await conn.execute(
            "UPDATE produtos SET estoque = estoque - ? WHERE id = ?",
            [quantidadeExportada, produto_id]
        );

        // Registrar exportação
        await conn.execute(`
            INSERT INTO exportacoes
            (produto_id, pais_destino, quantidade, moeda, preco_unitario, data_exportacao)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            produto_id,
            pais_destino,
            quantidadeExportada,
            moeda,
            preco_unitario,
            data_exportacao
        ]);

        await conn.commit();

        res.status(201).json({
            mensagem: "Exportação registrada e estoque atualizado!"
        });

    } catch (erro) {
        await conn.rollback();

        res.status(500).json({
            mensagem: "Erro ao registrar exportação",
            erro: erro.message
        });

    } finally {
        conn.release();
    }
});

module.exports = router;

