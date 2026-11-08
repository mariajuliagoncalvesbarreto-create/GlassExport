
async function carregarDashboard() {
    try {
        const resposta = await fetch("http://localhost:3000/api/produtos");
        const produtos = await resposta.json();

        // Quantidade de produtos cadastrados
        document.getElementById("totalProdutos").textContent =
            produtos.length;

        // Soma de todo o estoque
        const estoqueTotal = produtos.reduce((total, produto) => {
            return total + Number(produto.estoque);
        }, 0);

        document.getElementById("totalEstoque").textContent =
            estoqueTotal + " unidades";

            
const valorTotalEstoque = produtos.reduce((total, produto) => {
    return total + (Number(produto.custo) * Number(produto.estoque));
}, 0);

document.getElementById("valorEstoque").textContent =
    valorTotalEstoque.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });


    } catch (erro) {
        console.error("Erro ao carregar dashboard:", erro);

        document.getElementById("totalProdutos").textContent =
            "Erro ao carregar";

        document.getElementById("totalEstoque").textContent =
            "Erro ao carregar";
    }
}

carregarDashboard();


async function carregarCotacoesDashboard() {
    try {
        const resposta = await fetch("http://localhost:3000/api/cotacoes");
        const cotacoes = await resposta.json();

        const nomesMoedas = {
            USD: "Dólar americano",
            EUR: "Euro",
            GBP: "Libra esterlina",
            CAD: "Dólar canadense",
            JPY: "Iene japonês",
            CHF: "Franco suíço",
            AUD: "Dólar australiano",
            CNY: "Yuan chinês"
        };

        const lista = document.getElementById("listaCotacoes");

       
lista.innerHTML = Object.entries(cotacoes).map(([codigo, valor]) => `
    <div class="cotacao-item">
        <div class="cotacao-info">
            <span class="cotacao-codigo">${codigo}</span>
            <span class="cotacao-nome">${nomesMoedas[codigo]}</span>
        </div>
        <span class="cotacao-valor">
            R$ ${Number(valor).toFixed(4)}
        </span>
    </div>
`).join("");


    } catch (erro) {
        document.getElementById("listaCotacoes").textContent =
            "Não foi possível carregar as cotações.";
    }
}


carregarCotacoesDashboard();

async function carregarTotalExportacoes() {
    try {
        const resposta = await fetch("http://localhost:3000/api/exportacoes");
        const exportacoes = await resposta.json();

        document.getElementById("totalExportacoes").textContent =
            exportacoes.length;

    } catch (erro) {
        console.error("Erro ao carregar exportações:", erro);
    }
}

carregarTotalExportacoes();
async function carregarTotalUnidadesExportadas() {
    try {
        const resposta = await fetch("http://localhost:3000/api/exportacoes");
        const exportacoes = await resposta.json();

        const total = exportacoes.reduce((soma, item) => {
            return soma + Number(item.quantidade);
        }, 0);

        document.getElementById("totalUnidadesExportadas").textContent = total;

    } catch (erro) {
        console.error("Erro ao carregar unidades exportadas:", erro);
    }
}

carregarTotalUnidadesExportadas();

async function carregarUltimasExportacoes() {
    try {
        const resposta = await fetch("http://localhost:3000/api/exportacoes");
        const exportacoes = await resposta.json();

        const tabela = document.getElementById("ultimasExportacoes");
        tabela.innerHTML = "";

        exportacoes.slice(0, 5).forEach(item => {
            tabela.innerHTML += `
                <tr>
                    <td>${item.produto_nome}</td>
                    <td>${item.pais_destino}</td>
                    <td>${item.quantidade}</td>
                    <td>${item.moeda}</td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error("Erro ao carregar últimas exportações:", erro);
    }
}

carregarUltimasExportacoes();

async function carregarValoresPorMoeda() {
    try {
        const resposta = await fetch("http://localhost:3000/api/exportacoes");
        const exportacoes = await resposta.json();

        const totais = {};

        exportacoes.forEach(item => {
            const moeda = item.moeda;
            const valor = Number(item.quantidade) * Number(item.preco_unitario);

            if (!totais[moeda]) {
                totais[moeda] = 0;
            }

            totais[moeda] += valor;
        });

        const elemento = document.getElementById("valoresPorMoeda");
        elemento.innerHTML = "";

        Object.keys(totais).forEach(moeda => {
            elemento.innerHTML += `
                <p>
                    <strong>${moeda}:</strong>
                    ${totais[moeda].toFixed(2)}
                </p>
            `;
        });

    } catch (erro) {
        console.error("Erro ao calcular valores por moeda:", erro);
    }
}

carregarValoresPorMoeda();


async function carregarRelatorioPaises() {
    try {
        const resposta = await fetch("http://localhost:3000/api/exportacoes");
        const exportacoes = await resposta.json();

        const paises = {};

        exportacoes.forEach(item => {
            const pais = item.pais_destino;
            const moeda = item.moeda;

            const valor =
                Number(item.quantidade) *
                Number(item.preco_unitario);

            if (!paises[pais]) {
                paises[pais] = {
                    operacoes: 0,
                    moedas: {}
                };
            }

            paises[pais].operacoes++;

            if (!paises[pais].moedas[moeda]) {
                paises[pais].moedas[moeda] = 0;
            }

            paises[pais].moedas[moeda] += valor;
        });

        const tabela = document.getElementById("relatorioPaises");
        tabela.innerHTML = "";

        Object.entries(paises).forEach(([pais, dados]) => {

            const valores = Object.entries(dados.moedas)
                .map(([moeda, total]) =>
                    `${moeda} ${total.toFixed(2)}`
                )
                .join("<br>");

            tabela.innerHTML += `
                <tr>
                    <td>${pais}</td>
                    <td>${dados.operacoes}</td>
                    <td style="color:#ffd778;font-weight:bold;">
                        ${valores}
                    </td>
                </tr>
            `;
        });

        if (exportacoes.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="3">
                        Nenhuma exportação registrada.
                    </td>
                </tr>
            `;
        }

    } catch (erro) {
        console.error("Erro ao carregar relatório por país:", erro);
    }
}

carregarRelatorioPaises();


async function carregarGraficoPaises() {
    try {
        const resposta = await fetch("http://localhost:3000/api/exportacoes");
        const exportacoes = await resposta.json();

        const totais = {};

        exportacoes.forEach(item => {
            const pais = item.pais_destino;

            totais[pais] = (totais[pais] || 0) +
                Number(item.quantidade);
        });

        const canvas = document.getElementById("graficoPaises");

        if (!canvas || typeof Chart === "undefined") return;

        new Chart(canvas, {
            type: "bar",

            data: {
                labels: Object.keys(totais),

                datasets: [{
                    label: "Unidades exportadas",
                    data: Object.values(totais),
                    backgroundColor: "#d4af37",
                    borderColor: "#ffd778",
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },

            options: {
                responsive: true,

                plugins: {
                    legend: {
                        labels: {
                            color: "#ffd778"
                        }
                    }
                },

                scales: {
                    x: {
                        ticks: {
                            color: "#ffffff"
                        },
                        grid: {
                            color: "rgba(255,255,255,0.08)"
                        }
                    },

                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: "#ffffff",
                            precision: 0
                        },
                        grid: {
                            color: "rgba(255,255,255,0.08)"
                        }
                    }
                }
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar gráfico:", erro);
    }
}

carregarGraficoPaises();


