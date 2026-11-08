
let produtosCadastrados = [];

// MOSTRAR PRODUTOS NA TABELA
function mostrarProdutos(produtos) {
    const lista = document.getElementById("listaProdutos");
    lista.innerHTML = "";

    if (produtos.length === 0) {
        lista.innerHTML = `
            <tr>
                <td colspan="5">Nenhum produto encontrado.</td>
            </tr>`;
        return;
    }

    produtos.forEach(produto => {
        const precoVenda = Number(produto.custo) * 2;
        const estoque = Number(produto.estoque);

        let corEstoque = "#7CFC98";
        let mensagemEstoque = "Estoque normal";

        if (estoque === 0) {
            corEstoque = "#ff5555";
            mensagemEstoque = "Estoque zerado!";
        } else if (estoque < 10) {
            corEstoque = "#ffd778";
            mensagemEstoque = "Estoque baixo!";
        }

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.descricao}</td>
            <td>R$ ${Number(produto.custo).toFixed(2)}</td>
            <td>R$ ${precoVenda.toFixed(2)}</td>
            <td>
                <span style="color:${corEstoque};font-weight:bold;">
                    ${estoque} unidades
                </span>
                <br>
                <small style="color:${corEstoque}">
                    ${mensagemEstoque}
                </small>
            </td>`;

        lista.appendChild(linha);
    });
}

// CARREGAR PRODUTOS
async function carregarProdutos() {
    try {
        const resposta = await fetch("http://localhost:3000/api/produtos");
        produtosCadastrados = await resposta.json();

        mostrarProdutos(produtosCadastrados);

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

// PESQUISAR PRODUTOS
document.getElementById("pesquisaProduto").addEventListener("input", function() {
    const pesquisa = this.value.toLowerCase();

    const produtosFiltrados = produtosCadastrados.filter(produto =>
        produto.nome.toLowerCase().includes(pesquisa) ||
        produto.descricao.toLowerCase().includes(pesquisa)
    );

    mostrarProdutos(produtosFiltrados);
});

// CADASTRAR PRODUTO
const formulario = document.getElementById("formProduto");

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const produto = {
        nome: document.getElementById("nome").value,
        descricao: document.getElementById("descricao").value,
        custo: Number(document.getElementById("custo").value),
        estoque: Number(document.getElementById("estoque").value)
    };

    try {
        const resposta = await fetch("http://localhost:3000/api/produtos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || resultado.mensagem);
        }

        mostrarNotificacao("Produto cadastrado com sucesso!", "sucesso");

        formulario.reset();
        document.getElementById("pesquisaProduto").value = "";

        carregarProdutos();

    } catch (erro) {
        alert("Erro ao cadastrar produto: " + erro.message);
    }
});

// INICIAR
carregarProdutos();


