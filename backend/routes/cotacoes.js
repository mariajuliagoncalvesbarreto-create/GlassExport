

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const resposta = await fetch(
            "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,CAD-BRL,JPY-BRL,CHF-BRL,AUD-BRL,CNY-BRL"
        );

        const dados = await resposta.json();

        res.json({
            USD: Number(dados.USDBRL.bid),
            EUR: Number(dados.EURBRL.bid),
            GBP: Number(dados.GBPBRL.bid),
            CAD: Number(dados.CADBRL.bid),
            JPY: Number(dados.JPYBRL.bid),
            CHF: Number(dados.CHFBRL.bid),
            AUD: Number(dados.AUDBRL.bid),
            CNY: Number(dados.CNYBRL.bid)
        });

    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao consultar cotações",
            erro: erro.message
        });
    }
});

module.exports = router;

