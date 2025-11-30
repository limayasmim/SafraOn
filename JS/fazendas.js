
const supabaseClient = window.supabase;

class GerenciadorFazendas {
    constructor() {
        this.fazendas = [];
        this.talhoes = {}; // id_fazenda → array de talhões
        this.init();
    }

    init() {
        // Elementos principais
        this.lista = document.getElementById("listaFazendas");
        this.pesquisa = document.getElementById("pesquisa");
        this.btnAdicionar = document.getElementById("btnAdicionarFazenda");

        // Modal fazenda
        this.modalFazenda = document.getElementById("modalFazenda");
        this.formFazenda = document.getElementById("formFazenda");
        this.tituloModalFazenda = document.getElementById("tituloModalFazenda");
        this.inputIdFazenda = document.getElementById("id_fazendas");
        this.inputNomeFazenda = document.getElementById("inputNomeFazenda");
        this.inputLocalFazenda = document.getElementById("inputLocalFazenda");

        // Modal talhão
        this.modalTalhao = document.getElementById("modalTalhao");
        this.formTalhao = document.getElementById("formTalhao");
        this.tituloModalTalhao = document.getElementById("tituloModalTalhao");
        this.inputIdTalhao = document.getElementById("id_talhao");
        this.inputIdFazendaRelacionado = document.getElementById("id_fazendas_relacionada");
        this.inputNomeTalhao = document.getElementById("inputNomeTalhao");

        // Eventos
        this.btnAdicionar.addEventListener("click", () => this.abrirModalFazenda());
        this.formFazenda.addEventListener("submit", (e) => this.salvarFazenda(e));
        this.formTalhao.addEventListener("submit", (e) => this.salvarTalhao(e));
        this.pesquisa.addEventListener("input", () => this.renderizar());

        // Botões de fechar / cancelar
        document.querySelectorAll("[data-close], [data-cancel]").forEach(btn => {
            btn.addEventListener("click", () => this.fecharModais());
        });

        // Delegação de eventos (editar/remover/toggle/adicionar)
        document.addEventListener("click", (e) => this.tratarClique(e));


        // Carregar dados
        this.carregarBanco();
    }

    async carregarBanco() {

        try {
            // const id_usuario = localStorage.getItem("id_usuario");

            // if (!id_usuario) {
            //     console.error("Usuário não está logado");
            //     alert("Erro: usuário não identificado.");
            //     return;
            // }

            const id_usuario = localStorage.getItem("id_usuario");

            if (!id_usuario) {
                console.error("Usuário não identificado.");
                alert("Você precisa fazer login novamente.");
                window.location.href = "login.html";
                return;
            }

            const { data: relacoes, error: erroRel } = await supabaseClient
                .from("usuario_fazendas")
                .select("id_fazendas")
                .eq("id_usuario", id_usuario);

            if (erroRel) throw erroRel;

            const idsFazendas = relacoes.map(r => r.id_fazendas);

            if (idsFazendas.length === 0) {
                this.fazendas = [];
                this.talhoes = [];
                this.renderizar();
                return;
            }

            const { data: fazendas, error: erroF } = await supabaseClient
                .from("fazendas")
                .select("*")
                .in("id_fazendas", idsFazendas)
                .order("id_fazendas", { ascending: true });

            if (erroF) throw erroF;

            this.fazendas = fazendas || [];

            // 3️⃣ BUSCA TALHÕES DE SOMENTE ESSAS FAZENDAS
            const { data: talhoes, error: erroT } = await supabaseClient
                .from("talhao")
                .select("*")
                .in("id_fazendas", idsFazendas)
                .order("id_talhao", { ascending: true });

            if (erroT) {
                console.warn("Tabela talhao pode não existir:", erroT);
                this.talhoes = {};
            } else {
                this.talhoes = {};
                talhoes.forEach(t => {
                    if (!this.talhoes[t.id_fazendas]) {
                        this.talhoes[t.id_fazendas] = [];
                    }
                    this.talhoes[t.id_fazendas].push(t);
                });
            }

            this.renderizar();

        } catch (err) {
            console.error("Erro ao carregar dados:", err.message);
            alert("Erro ao carregar dados");
        }


    }

    abrirModalFazenda(f = null) {
        if (f) {
            this.tituloModalFazenda.textContent = "Editar Fazenda";
            this.inputIdFazenda.value = f.id_fazendas;
            this.inputNomeFazenda.value = f.fazenda;
            this.inputLocalFazenda.value = f.local || "";
        } else {
            this.tituloModalFazenda.textContent = "Adicionar Fazenda";
            this.inputIdFazenda.value = "";
            this.inputNomeFazenda.value = "";
            this.inputLocalFazenda.value = "";
        }
        this.modalFazenda.showModal();
    }

    abrirModalTalhao(id_fazendas, talhao = null) {
        this.inputIdFazendaRelacionado.value = id_fazendas;

        if (talhao) {
            this.tituloModalTalhao.textContent = "Editar Talhão";
            this.inputIdTalhao.value = talhao.id_talhao;
            this.inputNomeTalhao.value = talhao.nome_talhao;
        } else {
            this.tituloModalTalhao.textContent = "Adicionar Talhão";
            this.inputIdTalhao.value = "";
            this.inputNomeTalhao.value = "";
        }
        this.modalTalhao.showModal();
    }

    fecharModais() {
        if (this.modalFazenda.open) this.modalFazenda.close();
        if (this.modalTalhao.open) this.modalTalhao.close();
    }

    async salvarFazenda(e) {
        e.preventDefault();
        const id = this.inputIdFazenda.value;
        const nome = this.inputNomeFazenda.value.trim();
        const local = this.inputLocalFazenda.value.trim();

        if (!nome) return alert("Digite o nome da fazenda");

        try {
            if (id) {
                await supabaseClient
                    .from("fazendas")
                    .update({ nome_fazenda: nome, local: local })
                    .eq("id_fazendas", id);
            } else {


                const id_usuario = localStorage.getItem("id_usuario");

                // 1️⃣ Insere a fazenda
                const { data: fazendaInserida, error: erroFaz } = await supabaseClient
                    .from("fazendas")
                    .insert([{ nome_fazenda: nome, local: local }])
                    .select()
                    .single();

                if (erroFaz) throw erroFaz;

                const novaFazendaId = fazendaInserida.id_fazendas;

                // 2️⃣ Vincula a fazenda ao usuário
                const { error: erroRelacao } = await supabaseClient
                    .from("usuario_fazendas")
                    .insert([{ id_usuario: id_usuario, id_fazendas: novaFazendaId }]);

                if (erroRelacao) throw erroRelacao;
            }

            this.fecharModais();
            this.carregarBanco();

        } catch (err) {
            console.error("Erro ao salvar fazenda:", err.message);
            alert("Erro ao salvar fazenda");
        }
    }

    async salvarTalhao(e) {
        e.preventDefault();

        const id_talhao = this.inputIdTalhao.value;
        const id_fazendas = this.inputIdFazendaRelacionado.value;
        const nome = this.inputNomeTalhao.value.trim();

        if (!nome) return alert("Digite o nome do talhão");

        try {
            if (id_talhao) {
                await supabaseClient
                    .from("talhao")
                    .update({ nome_talhao: nome })
                    .eq("id_talhao", id_talhao);
            } else {
                await supabaseClient
                    .from("talhao")
                    .insert([{ id_fazendas, nome_talhao: nome }]);
            }

            this.fecharModais();
            this.carregarBanco();
        } catch (err) {
            console.error("Erro ao salvar talhão:", err.message);
            alert("Erro ao salvar talhão");
        }
    }

    async removerFazenda(id) {
        if (!confirm("Remover esta fazenda?")) return;

        try {
            await supabaseClient.from("talhao").delete().eq("id_fazendas", id);
            await supabaseClient.from("fazendas").delete().eq("id_fazendas", id);

            this.carregarBanco();
        } catch (err) {
            console.error("Erro ao remover fazenda:", err.message);
        }
    }

    async removerTalhao(id) {
        if (!confirm("Remover este talhão?")) return;

        try {
            await supabaseClient.from("talhao").delete().eq("id_talhao", id);
            this.carregarBanco();
        } catch (err) {
            console.error("Erro ao remover talhão:", err.message);
        }
    }

    tratarClique(e) {
        const el = e.target;

        if (el.classList.contains("btn-editar-fazenda")) {
            const id = el.dataset.id;
            const fazenda = this.fazendas.find(f => f.id_fazendas == id);
            this.abrirModalFazenda(fazenda); 
        }

        if (el.classList.contains("btn-remover-fazenda")) {
            this.removerFazenda(el.dataset.id);
        }

        if (el.classList.contains("btn-toggle-talhoes")) {
            const painel = document.getElementById(`talhoes-${el.dataset.id}`);
            painel.style.display = painel.style.display === "block" ? "none" : "block";
        }

        if (el.classList.contains("btn-adicionar-talhao")) {
            this.abrirModalTalhao(el.dataset.id);
        }

        if (el.classList.contains("btn-editar-talhao")) {
            const fazendaId = el.dataset.id;
            const talhaoId = el.dataset.tid;
            const talhao = Object.values(this.talhoes).flat().find(t => t.id_talhao == talhaoId);
            this.abrirModalTalhao(fazendaId, talhao);
        }

        if (el.classList.contains("btn-remover-talhao")) {
            this.removerTalhao(el.dataset.tid);
        }

        if (el.classList.contains("btn-ver-talhoes") ||
            el.closest(".btn-ver-talhoes")) {

            const id = el.dataset.id || el.closest(".btn-ver-talhoes")?.dataset.id;
            if (id) window.location.href = `outrotalhao.html?id=${id}`;
        }

    }

    renderizar() {
        const termo = this.pesquisa.value.toLowerCase();
        this.lista.innerHTML = "";

        this.fazendas.forEach(f => {
            if (termo && !f.nome_fazenda.toLowerCase().includes(termo)) return;

            const artigo = document.createElement("section2");

            artigo.innerHTML = `
                <h4 class="abrir-talhoes" data-id="${f.id_fazendas}">
                    <span class="nome-fazenda">${f.nome_fazenda}</span>

                    <div class="botoes-controle">
                        <button class="btn-editar-fazenda" data-id="${f.id_fazendas}">✎</button>
                        <button class="btn-remover-fazenda" data-id="${f.id_fazendas}">✖</button>
                        <button class="btn-toggle-talhoes" data-id="${f.id_fazendas}">▼</button>
                    </div>
                </h4>

                 <button class="btn-ver-talhoes" data-id="${f.id_fazendas}">
                    Ver talhões 
                 </button>

                    <div id="talhoes-${f.id_fazendas}" class="painel-talhoes" style="display:none">
                    <p class="local-fazenda">Local: ${f.local || "A definir"}</p>

                    <div class="lista-talhoes">
                        ${(this.talhoes[f.id_fazendas] || []).map(t => `
                            <h5>
                                <span>${t.nome_talhao}</span>
                                <div class="acoes-talhao">
                                    <button class="btn-editar-talhao" data-id="${f.id_fazendas}" data-tid="${t.id_talhao}">✎</button>
                                    <button class="btn-remover-talhao" data-tid="${t.id_talhao}">✖</button>
                                </div>
                            </h5>
                        `).join("")}
                    </div>

                    <button class="btn-adicionar-talhao" data-id="${f.id_fazendas}">
                        Adicionar talhão +
                    </button>
                </div>
            `;

            this.lista.appendChild(artigo);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => new GerenciadorFazendas());



