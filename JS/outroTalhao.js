class GerenciadorOutroTalhao {

    constructor() {
        this.fazendas = [];
        this.talhoes = {};

    }
}

async function carregarTalhoesDaFazenda(idFazenda) {

    const { data, error } = await supabase
        .from("talhao")
        .select("*")
        .eq("id_fazendas", idFazenda);

    if (error) {
        console.error("Erro ao carregar talhões:", error);
        return;
    }

    const lista = document.getElementById("listaTalhoes");
    lista.innerHTML = "";

    data.forEach(t => {
        lista.innerHTML += `
            <div class="talhao-card">
                <h4>${t.nome_talhao}</h4>

                <a href="plantio.html?id=${t.id_talhao}">Plantio</a>
                <a href="manejos.html?id=${t.id_talhao}">Manejo</a>
                <a href="aplicacoes.html?id=${t.id_talhao}">Aplicações</a>
                <a href="colheita.html?id=${t.id_talhao}">Colheita</a>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const idFazenda = params.get("id");

    if (idFazenda) carregarTalhoesDaFazenda(idFazenda);
});
