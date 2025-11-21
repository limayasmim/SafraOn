const params = new URLSearchParams(window.location.search);
const idTalhao = params.get("id");

console.log("ID TALHÃO =", idTalhao);
carregarTituloTalhao(idTalhao);

// Usa o cliente já criado no HTML
const supabaseClient = window.supabase;

async function carregarTituloTalhao(idTalhao) {
const titulo = document.getElementById("tituloTalhao");
if (!titulo) return;


if (!idTalhao) {
titulo.textContent = "Talhão não encontrado";
return;
}


const { data, error } = await supabaseClient
.from("talhao")
.select("nome_talhao")
.eq("id_talhao", idTalhao)
.single();


if (error || !data) {
titulo.textContent = "Talhão não encontrado";
return;
}


titulo.textContent = data.nome_talhao;
}


class GerenciadorPlantio {
    constructor() {
        this.dados = [];
        this.itemEditando = null;
        
        carregarTituloTalhao(idTalhao);

        this.iniciar();
        this.renderizarItens();
        this.carregarBanco();
    }

    iniciar() {
        document.querySelector('.btn-adicionar').addEventListener('click', () => {
            this.abrirModal();
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-editar')) {
                this.editarItem(e.target.closest('.item-dado'));
            }

            if (e.target.classList.contains('btn-remover')) {
                this.removerItem(e.target.closest('.item-dado'));
            }
        });

        document.querySelector('.btn-fechar').addEventListener('click', () => {
            this.fecharModal();
        });

        document.querySelector('.btn-cancelar').addEventListener('click', () => {
            this.fecharModal();
        });

        document.querySelector('#formDados').addEventListener('submit', (e) => {
            this.salvar(e);
        });

        document.querySelector('#modalForm').addEventListener('click', (e) => {
            if (e.target === document.querySelector('#modalForm')) {
                this.fecharModal();
            }
        });
    }

    abrirModal() {
        this.itemEditando = null;
        document.querySelector('#modalTitulo').textContent = 'Adicionar Plantio';
        document.querySelector('#btnSubmit').textContent = 'Adicionar';
        this.limparFormulario();
        document.querySelector('#modalForm').showModal();
    }

    fecharModal() {
        document.querySelector('#modalForm').close();
    }

    limparFormulario() {
        document.querySelector('#data').value = '';
        document.querySelector('#planta').value = '';
        document.querySelector('#variedade').value = '';
        document.querySelector('#adubo').value = '';
        document.querySelector('#inoculantes').value = '';
        document.querySelector('#populacao').value = '';
    }

    async carregarBanco() {

        try {

            if (!idTalhao) {
                alert("Erro: Talhão não informado!");
                return;
            }

            const { data, error } = await supabaseClient
                .from('plantio')
                .select('*')
                .eq('id_talhao', idTalhao)
                .order('id_plantio', { ascending: true });

            if (error) throw error;

            this.dados = data || [];
            this.renderizarItens();
        } catch (err) {
            console.error('Erro ao carregar dados do banco:', err);
            alert('Erro ao carregar dados do banco! Veja o console.');
        }
    }


    editarItem(item) {
        this.itemEditando = item;
        const index = item.dataset.index;
        const dados = this.dados[index];

        document.querySelector('#data').value = dados.data;
        document.querySelector('#planta').value = dados.planta;
        document.querySelector('#variedade').value = dados.variedade;
        document.querySelector('#adubo').value = dados.adubo;
        document.querySelector('#inoculantes').value = dados.inoculantes;
        document.querySelector('#populacao').value = dados.populacao;

        document.querySelector('#modalTitulo').textContent = 'Editar Plantio';
        document.querySelector('#btnSubmit').textContent = 'Salvar';
        document.querySelector('#modalForm').showModal();
    }

    async salvar(evento) {
        evento.preventDefault();

        const data = document.querySelector('#data').value;
        const planta = document.querySelector('#planta').value;
        const variedade = document.querySelector('#variedade').value;
        const adubo = document.querySelector('#adubo').value;
        const inoculantes = document.querySelector('#inoculantes').value;
        const populacao = document.querySelector('#populacao').value;

        if (!data || !planta || !variedade || !adubo || !inoculantes || !populacao) {
            alert('Preencha todos os campos!');
            return;
        }

        const novoItem = { data, planta, variedade, adubo, inoculantes, populacao, id_talhao: idTalhao
        };

        try {
            if (this.itemEditando !== null) {
                const index = this.itemEditando.dataset.index;
                const itemBanco = this.dados[index];
                if (!itemBanco || !itemBanco.id_plantio) {
                    alert('Erro ao identificar o item para atualizar.');
                    return;
                }
                const { error } = await supabaseClient
                    .from('plantio')
                    .update(novoItem)
                    .eq('id_plantio', itemBanco.id_plantio);
                if (error) throw error;

            } else {
                const { error } = await supabaseClient
                    .from('plantio')
                    .insert([novoItem]);
                if (error) throw error;
            }

            await this.carregarBanco();
            this.fecharModal();

        } catch (err) {
            console.error('Erro ao salvar o plantio:', err);
            alert('Erro ao salvar/atualizar. Veja o console.')
        }
    }

    renderizarItens() {

        const container = document.querySelector('.dados-container section');
        if (!container) return;
        container.innerHTML = "";

        this.dados.forEach((item, index) => {

            const novoItem = document.createElement('article');
            novoItem.className = 'item-dado';
            novoItem.dataset.index = index;
            novoItem.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr 1fr';

            novoItem.innerHTML = ` 
            <span>${item.data || ''}</span>
            <span>${item.planta || ''}</span>
            <span>${item.variedade || ''}</span>
            <span>${item.adubo || ''}</span>
            <span>${item.inoculantes || ''}</span>
            <span>${item.populacao || ''}</span>
            <menu class="acoes">
                <button class="btn-editar" title="Editar">✎</button>
                <button class="btn-remover" title="Remover">×</button>
            </menu>
            `;

            container.appendChild(novoItem);
        })
    }

    async removerItem(item) {
        const index = item.dataset.index;
        const itemBanco = this.dados[index];


        if (!itemBanco || !itemBanco.id_plantio) {
            alert('Erro: não foi possível identificar item para remover.');
            return;
        }

        if (confirm('Remover esta aplicação')) {
            try {
                const { error } = await supabaseClient
                    .from('plantio')
                    .delete()
                    .eq('id_plantio', itemBanco.id_plantio);

                if (error) throw error;
                await this.carregarBanco();
            } catch (err) {
                console.error('Erro ao remover a plantio:', err.message, err);
                alert('Erro ao remover! Veja o console.');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GerenciadorPlantio();
});