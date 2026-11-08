
let produtosExportacao = [];
let exportacoesCadastradas = [];

// CARREGAR PRODUTOS NO SELECT DO CADASTRO E DO FILTRO
async function carregarProdutosExportacao() {
    try {
        const resposta = await fetch("http://localhost:3000/api/produtos");
        produtosExportacao = await resposta.json();

        const selectCadastro = document.getElementById("produtoExportacao");
        const selectFiltro = document.getElementById("filtroProduto");

        produtosExportacao.forEach(produto => {
            const opcaoCadastro = document.createElement("option");
            opcaoCadastro.value = produto.id;
            opcaoCadastro.textContent = produto.nome;
            selectCadastro.appendChild(opcaoCadastro);

            const opcaoFiltro = document.createElement("option");
            opcaoFiltro.value = produto.nome;
            opcaoFiltro.textContent = produto.nome;
            selectFiltro.appendChild(opcaoFiltro);
        });

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

// CADASTRAR EXPORTAÇÃO
document.getElementById("formExportacao").addEventListener("submit", async function(event) {
    event.preventDefault();

    const exportacao = {
        produto_id: Number(document.getElementById("produtoExportacao").value),
        pais_destino: document.getElementById("paisDestino").value,
        quantidade: Number(document.getElementById("quantidadeExportada").value),
        moeda: document.getElementById("moedaExportacao").value,
        preco_unitario: Number(document.getElementById("precoExportacao").value),
        data_exportacao: document.getElementById("dataExportacao").value
    };

    try {
        const resposta = await fetch("http://localhost:3000/api/exportacoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(exportacao)
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mostrarNotificacao("Exportação registrada com sucesso!", "sucesso");
            document.getElementById("formExportacao").reset();
            carregarExportacoes();
        } else {
            alert(dados.mensagem);
        }

    } catch (erro) {
        alert("Erro ao registrar exportação.");
        console.error(erro);
    }
});

// MOSTRAR EXPORTAÇÕES
function mostrarExportacoes(exportacoes) {
    const lista = document.getElementById("listaExportacoes");
    lista.innerHTML = "";

    if (exportacoes.length === 0) {
        lista.innerHTML = `
            <tr>
                <td colspan="7">Nenhuma exportação encontrada.</td>
            </tr>`;
        return;
    }

    exportacoes.forEach(item => {
        const valorTotal = Number(item.quantidade) * Number(item.preco_unitario);

        lista.innerHTML += `
            <tr>
                <td>${item.produto_nome}</td>
                <td>${item.pais_destino}</td>
                <td>${item.quantidade}</td>
                <td>${item.moeda}</td>
                <td>${Number(item.preco_unitario).toFixed(2)}</td>
                <td style="color:#ffd778;font-weight:bold;">
                    ${item.moeda} ${valorTotal.toFixed(2)}
                </td>
                <td>${item.data_exportacao.split("T")[0]}</td>
            </tr>`;
    });
}

// APLICAR FILTROS
function aplicarFiltros() {
    const pais = document.getElementById("filtroPais").value.toLowerCase();
    const produto = document.getElementById("filtroProduto").value;
    const moeda = document.getElementById("filtroMoeda").value;

    const filtradas = exportacoesCadastradas.filter(item => {
        const combinaPais = item.pais_destino.toLowerCase().includes(pais);
        const combinaProduto = produto === "" || item.produto_nome === produto;
        const combinaMoeda = moeda === "" || item.moeda === moeda;

        return combinaPais && combinaProduto && combinaMoeda;
    });

    mostrarExportacoes(filtradas);
}

// CARREGAR EXPORTAÇÕES
async function carregarExportacoes() {
    try {
        const resposta = await fetch("http://localhost:3000/api/exportacoes");
        exportacoesCadastradas = await resposta.json();

        aplicarFiltros();

    } catch (erro) {
        console.error("Erro ao carregar exportações:", erro);
    }
}

// EVENTOS DOS FILTROS
document.getElementById("filtroPais").addEventListener("input", aplicarFiltros);
document.getElementById("filtroProduto").addEventListener("change", aplicarFiltros);
document.getElementById("filtroMoeda").addEventListener("change", aplicarFiltros);

// LIMPAR FILTROS
document.getElementById("limparFiltros").addEventListener("click", function() {
    document.getElementById("filtroPais").value = "";
    document.getElementById("filtroProduto").value = "";
    document.getElementById("filtroMoeda").value = "";

    aplicarFiltros();
});

// INICIAR
carregarProdutosExportacao();
carregarExportacoes();


