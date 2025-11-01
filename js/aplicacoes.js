class GerenciadorAplicacoes {
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
        document.querySelector('#modalTitulo').textContent = 'Adicionar Aplicação';
        document.querySelector('#btnSubmit').textContent = 'Adicionar';
        this.limparFormulario();
        document.querySelector('#modalForm').showModal();
    }

    fecharModal() {
        document.querySelector('#modalForm').close();
    }

    limparFormulario() {
        document.querySelector('#data').value = '';
        document.querySelector('#motivos').value = '';
        document.querySelector('#defensivos').value = '';
    }

    editarItem(item) {
        this.itemEditando = item;
        const dados = item.querySelectorAll('span');
        
        document.querySelector('#data').value = dados[0].textContent;
        document.querySelector('#motivos').value = dados[1].textContent;
        document.querySelector('#defensivos').value = dados[2].textContent;
        
        document.querySelector('#modalTitulo').textContent = 'Editar Aplicação';
        document.querySelector('#btnSubmit').textContent = 'Salvar';
        document.querySelector('#modalForm').showModal();
    }

    salvar(evento) {
        evento.preventDefault();
        
        const data = document.querySelector('#data').value;
        const motivos = document.querySelector('#motivos').value;
        const defensivos = document.querySelector('#defensivos').value;
        
        if (!data || !motivos || !defensivos) {
            alert('Preencha todos os campos!');
            return;
        }

        if (this.itemEditando) {
            const dados = this.itemEditando.querySelectorAll('span');
            dados[0].textContent = data;
            dados[1].textContent = motivos;
            dados[2].textContent = defensivos;
        } else {
            this.adicionarItem(data, motivos, defensivos);
        }
        
        this.fecharModal();
    }

    adicionarItem(data, motivos, defensivos) {
        this.contador++;
        
        const novoItem = document.createElement('article');
        novoItem.className = 'item-dado';
        
        novoItem.innerHTML = `
            <span>${data}</span>
            <span>${motivos}</span>
            <span>${defensivos}</span>
            <menu class="acoes">
                <button class="btn-editar" title="Editar">✎</button>
                <button class="btn-remover" title="Remover">×</button>
            </menu>
        `;
        
        document.querySelector('#listaDados').appendChild(novoItem);
    }

    removerItem(item) {
        if (document.querySelectorAll('.item-dado').length > 1) {
            if (confirm('Remover esta aplicação?')) {
                item.remove();
            }
        } else {
            alert('Não é possível remover a última aplicação!');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GerenciadorAplicacoes();
});