// Usa o cliente já criado no HTML
const supabaseClient = window.supabase;


class GerenciadorManejos {
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
        document.querySelector('#modalTitulo').textContent = 'Adicionar Manejo';
        document.querySelector('#btnSubmit').textContent = 'Adicionar';
        this.limparFormulario();
        document.querySelector('#modalForm').showModal();
    }

    fecharModal() {
        document.querySelector('#modalForm').close();
    }

    limparFormulario() {
        document.querySelector('#data').value = '';
        document.querySelector('#tipo').value = '';
        document.querySelector('#motivo').value = '';
        document.querySelector('#descricao').value = '';
    }

    async carregarBanco() {

        try {
            const { data, error } = await supabaseClient
                .from('manejo')
                .select('*')
                .order('id_manejo', { ascending: true });

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
        // const dados = item.querySelectorAll('span');
        const index = item.dataset.index;
        const dados = this.dados[index];

        if (!dados) {
            alert('Erro: item não encontrado.');
            return;
        }

        document.querySelector('#data').value = dados.data || '';
        document.querySelector('#tipo').value = dados.tipo || '';
        document.querySelector('#motivo').value = dados.motivo || '';
        document.querySelector('#descricao').value = dados.descricao || '';

        document.querySelector('#modalTitulo').textContent = 'Editar Manejo';
        document.querySelector('#btnSubmit').textContent = 'Salvar';
        document.querySelector('#modalForm').showModal();
    }

    async salvar(evento) {
        evento.preventDefault();

        const data = document.querySelector('#data').value;
        const tipo = document.querySelector('#tipo').value;
        const motivo = document.querySelector('#motivo').value;
        const descricao = document.querySelector('#descricao').value;

        
        if (!data || !tipo || !motivo || !descricao) {
            alert('Preencha todos os campos!');
            return;
        }

        const novoItem = { data, tipo, motivo, descricao };


       try {
            if (this.itemEditando !== null) {
                const index = this.itemEditando.dataset.index;
                const itemBanco = this.dados[index];
                if (!itemBanco || !itemBanco.id_manejo) {
                    alert('Erro ao identificar item para atualizar.', err.message, err);
                    return;
                }

                const { error } = await supabaseClient
                    .from('manejo')
                    .update(novoItem)           
                    .eq('id_manejo', itemBanco.id_manejo);

                if (error) throw error;
            } else {
                // inserir novo registro
                const { error } = await supabaseClient
                    .from('manejo')
                    .insert([novoItem]);

                if (error) throw error;
            }

           
            await this.carregarBanco();
            this.fecharModal();

        } catch (err) {
            console.error('Erro ao salvar manejo:', err);
            alert('Erro ao salvar/atualizar. Veja o console.');
        }
    }

    renderizarItens() {

        const container = document.querySelector('.dados-container section');
        if (!container) return;
        container.innerHTML = '';

        this.dados.forEach((item, index) => {
            const novoItem = document.createElement('article');
            novoItem.className = 'item-dado';
            novoItem.dataset.index = index;
            novoItem.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';

            novoItem.innerHTML = `
            <span>${item.data || ''}</span>
            <span>${item.tipo || ''}</span>
            <span>${item.motivo || ''}</span>
            <span>${item.descricao || ''}</span>
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

      if (!itemBanco || !itemBanco.id_manejo) {
            alert('Erro: não foi possível identificar item para remover.');
            return;
        }

        if (confirm('Remover este manejo?')) {
            try {
                const { error } = await supabaseClient
                    .from('manejo')
                    .delete()
                    .eq('id_manejo', itemBanco.id_manejo);

                if (error) throw error;
                await this.carregarBanco();
            } catch (err) {
                console.error('Erro ao remover manejo:', err);
                alert('Erro ao remover! Veja o console.');
            }
        }

    }

    // salvarLocal() {
    //     localStorage.setItem("manejos", JSON.stringify(this.dados));
    // }
}

document.addEventListener('DOMContentLoaded', () => {
    new GerenciadorManejos();
});

