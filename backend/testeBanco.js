
const conexao = require("./config/database");

async function testar() {
    try {
        const [resultado] = await conexao.query("SELECT * FROM produtos");

        console.log("Conexão com MySQL funcionando!");
        console.log(resultado);

    } catch (erro) {
        console.log("Erro ao conectar:", erro.message);
    }
}

testar();
