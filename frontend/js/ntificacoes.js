
function mostrarNotificacao(mensagem, tipo = "sucesso") {

    const notificacao = document.createElement("div");

    notificacao.className = `notificacao ${tipo}`;

    const icone = tipo === "sucesso" ? "✅" : "❌";

    notificacao.innerHTML = `
        <span class="icone">${icone}</span>
        <span class="mensagem">${mensagem}</span>
    `;

    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.classList.add("saindo");

        setTimeout(() => {
            notificacao.remove();
        }, 400);

    }, 3500);
}
