class GerenciadorManejos {
    constructor() {
        this.contador = 1;
        this.dados = JSON.parse(localStorage.getItem("manejos")) || [];
        this.itemEditando = null;
        this.iniciar();
        this.renderizarItens();
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
        document.querySelector('#motivos').value = '';
        document.querySelector('#descricao').value = '';
    }

    editarItem(item) {
        this.itemEditando = item;
       // const dados = item.querySelectorAll('span');
        const index = item.dataset.index;
        const dados = this.dados[index];
        
        document.querySelector('#data').value = dados.data;
        document.querySelector('#tipo').value = dados.tipo;
        document.querySelector('#motivos').value = dados.motivos;
        document.querySelector('#descricao').value = dados.descricao;
        
        document.querySelector('#modalTitulo').textContent = 'Editar Manejo';
        document.querySelector('#btnSubmit').textContent = 'Salvar';
        document.querySelector('#modalForm').showModal();
    }

    salvar(evento) {
        evento.preventDefault();
        
        const data = document.querySelector('#data').value;
        const tipo = document.querySelector('#tipo').value;
        const motivos = document.querySelector('#motivos').value;
        const descricao = document.querySelector('#descricao').value;
        
        if (!data || !tipo || !motivos || !descricao) {
            alert('Preencha todos os campos!');
            return;
        }
        const novoItem = { data, tipo, motivos, descricao };

        if (this.itemEditando !==null) {
            const index = this.itemEditando.dataset.index;
            this.dados[index] = novoItem;
        } else {
            this.dados.push(novoItem);
        }
        
        this.salvarLocal();
        this.renderizarItens();
        this.fecharModal();
    }

    renderizarItens() {
        
        const container = document.querySelector('.dados-container section');
        container.innerHTML = '';
        
        this.dados.forEach((item, index) => {
            const novoItem = document.createElement('article');
            novoItem.className = 'item-dado';
            novoItem.dataset.index = index;
            novoItem.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';

            novoItem.innerHTML = `
            <span>${item.data}</span>
            <span>${item.tipo}</span>
            <span>${item.motivos}</span>
            <span>${item.descricao}</span>
            <menu class="acoes">
                <button class="btn-editar" title="Editar">✎</button>
                <button class="btn-remover" title="Remover">×</button>
            </menu>
         `;

           container.appendChild(novoItem);
        });
       
    }

    removerItem(item) {
        const index = item.dataset.index

        if (confirm('Remover este manejo?')) {
        this.dados.splice(index, 1);
        this.salvarLocal();
        this.renderizarItens();
        } else {
            alert('Não é possível remover o último manejo!');
        }
    }

    salvarLocal(){
        localStorage.setItem("manejos", JSON.stringify(this.dados));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GerenciadorManejos();
});

