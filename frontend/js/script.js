
const API = "http://localhost:3000/api/produtos";

async function carregarProdutos() {
    try {
        const resposta = await fetch(API);

        const produtos = await resposta.json();

        const lista = document.getElementById("listaProdutos");

        lista.innerHTML = "";

        produtos.forEach(produto => {
            const preco = Number(produto.custo) * 2;

            lista.innerHTML += `
                <tr>
                    <td>${produto.nome}</td>
                    <td>R$ ${Number(produto.custo).toFixed(2)}</td>
                    <td>R$ ${preco.toFixed(2)}</td>
                    <td>${produto.estoque}</td>
                </tr>
            `;
        });

        document.getElementById("totalProdutos").textContent =
            produtos.length;

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

carregarProdutos();
