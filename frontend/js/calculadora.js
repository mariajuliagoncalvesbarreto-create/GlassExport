
let produtosDisponiveis = [];


let cotacoes = {};

async function carregarCotacoes() {
    try {
        const resposta = await fetch("http://localhost:3000/api/cotacoes");

        cotacoes = await resposta.json();

        atualizarCotacao();

    } catch (erro) {
        console.error("Erro ao carregar cotações:", erro);
    }
}

function atualizarCotacao() {
    const moeda = document.getElementById("moeda").value;

    document.getElementById("cotacao").value =
        cotacoes[moeda] || "";
}

document.getElementById("moeda").addEventListener(
    "change",
    atualizarCotacao
);

carregarCotacoes();


async function carregarProdutosCalculadora() {

    const resposta = await fetch("http://localhost:3000/api/produtos");

    produtosDisponiveis = await resposta.json();

    const select = document.getElementById("produtoCalc");

    produtosDisponiveis.forEach(produto => {

        const opcao = document.createElement("option");

        opcao.value = produto.id;
        opcao.textContent = produto.nome;

        select.appendChild(opcao);
    });
}

carregarProdutosCalculadora();

document.getElementById("formCalculadora")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const idProduto = Number(document.getElementById("produtoCalc").value);

    const moeda = document.getElementById("moeda").value;

    const cotacao = Number(document.getElementById("cotacao").value);

    const produto = produtosDisponiveis.find(p => p.id === idProduto);

    const precoVendaReais = Number(produto.custo) * 2;

    const precoEstrangeiro = precoVendaReais / cotacao;

    document.getElementById("resultado").innerHTML = `
        <h3>Resultado da exportação</h3>
        <p>Produto: ${produto.nome}</p>
        <p>Preço de custo: R$ ${Number(produto.custo).toFixed(2)}</p>
        <p>Preço de venda: R$ ${precoVendaReais.toFixed(2)}</p>
        <p>Moeda: ${moeda}</p>
        <h2>Preço internacional: ${moeda} ${precoEstrangeiro.toFixed(2)}</h2>
    `;
});
