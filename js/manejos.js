class GerenciadorManejos {
    constructor() {
        this.contador = 1;
        this.itemEditando = null;
        this.iniciar();
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
        const dados = item.querySelectorAll('span');
        
        document.querySelector('#data').value = dados[0].textContent;
        document.querySelector('#tipo').value = dados[1].textContent;
        document.querySelector('#motivos').value = dados[2].textContent;
        document.querySelector('#descricao').value = dados[3].textContent;
        
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

        if (this.itemEditando) {
            const dados = this.itemEditando.querySelectorAll('span');
            dados[0].textContent = data;
            dados[1].textContent = tipo;
            dados[2].textContent = motivos;
            dados[3].textContent = descricao;
        } else {
            this.adicionarItem(data, tipo, motivos, descricao);
        }
        
        this.fecharModal();
    }

    adicionarItem(data, tipo, motivos, descricao) {
        this.contador++;
        
        const novoItem = document.createElement('article');
        novoItem.className = 'item-dado';
        
        novoItem.innerHTML = `
            <span>${data}</span>
            <span>${tipo}</span>
            <span>${motivos}</span>
            <span>${descricao}</span>
            <menu class="acoes">
                <button class="btn-editar" title="Editar">✎</button>
                <button class="btn-remover" title="Remover">×</button>
            </menu>
        `;
        
        document.querySelector('#listaDados').appendChild(novoItem);
    }

    removerItem(item) {
        if (document.querySelectorAll('.item-dado').length > 1) {
            if (confirm('Remover esta manejo?')) {
                item.remove();
            }
        } else {
            alert('Não é possível remover o último manejo!');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GerenciadorManejos();
});

