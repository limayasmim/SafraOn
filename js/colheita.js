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




class GerenciadorColheitas {
    constructor() {
        this.dados = [];
        this.itemEditando = null;
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

            else if (e.target.classList.contains('btn-remover')) {
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
        document.querySelector('#modalTitulo').textContent = 'Adicionar Colheita';
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
        document.querySelector('#umidade').value = '';
        document.querySelector('#producao').value = '';
    }

    async carregarBanco() {

        try {

            if (!idTalhao) {
                alert("Erro: Talhão não informado!");
                return;
            }
            
        
            const { data, error } = await supabaseClient
                .from('colheita')
                .select('*')
                .eq('id_talhao', idTalhao)
                .order('id_colheita', { ascending: true });

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
        document.querySelector('#umidade').value = dados.umidade;
        document.querySelector('#producao').value = dados.producao;

        document.querySelector('#modalTitulo').textContent = 'Editar Colheita';
        document.querySelector('#btnSubmit').textContent = 'Salvar';
        document.querySelector('#modalForm').showModal();
    }

    async salvar(evento) {
        evento.preventDefault();

        const data = document.querySelector('#data').value;
        const planta = document.querySelector('#planta').value;
        const umidade = document.querySelector('#umidade').value;
        const producao = document.querySelector('#producao').value;

        if (!data || !planta || !umidade || !producao) {
            alert('Preencha todos os campos!');
            return;
        }
        const novoItem = { data, planta, umidade, producao,
            id_talhao: idTalhao };

        try {

            if (this.itemEditando !== null) {
                const index = this.itemEditando.dataset.index;
                const itemBanco = this.dados[index];
                if (!itemBanco || !itemBanco.id_colheita) {
                    alert('Erro ao identificar o item para atualizar.');
                    return;
                }
                const { error } = await supabaseClient
                    .from('colheita')
                    .update(novoItem)
                    .eq('id_colheita', itemBanco.id_colheita);
                if (error) throw error
            } else {
                const { error } = await supabaseClient
                    .from('colheita')
                    .insert([novoItem]);
                if (error) throw error;
            }

            await this.carregarBanco();
            this.fecharModal();
        } catch (err) {
            console.error('Erro ao salvar a colheita', err);
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
            // novoItem.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';

            novoItem.innerHTML = `
            <span>${item.data || ''}</span>
            <span>${item.planta || ''}</span>
            <span>${item.umidade || ''}</span>
            <span>${item.producao || ''}</span>
            <menu class="acoes">
                <button class="btn-editar" title="Editar">✎</button>
                <button class="btn-remover" title="Remover">×</button>
            </menu>
         `;

            container.appendChild(novoItem);
        });
    }

    async removerItem(item) {
        const index = item.dataset.index;
        const itemBanco = this.dados[index];

        if (!itemBanco || !itemBanco.id_colheita) {
            alert('Erro: não foi possível identificar item para remover.');
            return;
        }

        if (confirm('Remover esta colheita?')) {
            try{
                const {error} = await supabaseClient
                    .from('colheita')
                    .delete()
                    .eq('id', itemBanco.id_colheita);
                if (error) throw error;
                await this.carregarBanco();
            }catch(err){
                console.error('Erro ao remover a colheita', err);
                alert('Não é possível remover a última colheita!');
            }
        } 
    }

    

}

document.addEventListener('DOMContentLoaded', () => {
    new GerenciadorColheitas();
});