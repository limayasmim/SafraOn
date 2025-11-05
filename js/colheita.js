class GerenciadorColheitas {
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

    editarItem(item) {
        this.itemEditando = item;
        const dados = item.querySelectorAll('span');
        
        document.querySelector('#data').value = dados[0].textContent;
        document.querySelector('#planta').value = dados[1].textContent;
        document.querySelector('#umidade').value = dados[2].textContent;
        document.querySelector('#producao').value = dados[3].textContent;
        
        document.querySelector('#modalTitulo').textContent = 'Editar Colheita';
        document.querySelector('#btnSubmit').textContent = 'Salvar';
        document.querySelector('#modalForm').showModal();
    }

    salvar(evento) {
        evento.preventDefault();
        
        const data = document.querySelector('#data').value;
        const planta = document.querySelector('#planta').value;
        const umidade = document.querySelector('#umidade').value;
        const producao = document.querySelector('#producao').value;
        
        if (!data || !planta || !umidade || !producao) {
            alert('Preencha todos os campos!');
            return;
        }

        if (this.itemEditando) {
            const dados = this.itemEditando.querySelectorAll('span');
            dados[0].textContent = data;
            dados[1].textContent = planta;
            dados[2].textContent = umidade;
            dados[3].textContent = producao;
        } else {
            this.adicionarItem(data, planta, umidade, producao);
        }
        
        this.fecharModal();
    }

    adicionarItem(data, planta, umidade, producao) {
        this.contador++;
        
        const novoItem = document.createElement('article');
        novoItem.className = 'item-dado';
        
        novoItem.innerHTML = `
            <span>${data}</span>
            <span>${planta}</span>
            <span>${umidade}</span>
            <span>${producao}</span>
            <menu class="acoes">
                <button class="btn-editar" title="Editar">✎</button>
                <button class="btn-remover" title="Remover">×</button>
            </menu>
        `;
        
        document.querySelector('#listaDados').appendChild(novoItem);
    }

    removerItem(item) {
        if (document.querySelectorAll('.item-dado').length > 1) {
            if (confirm('Remover esta colheita?')) {
                item.remove();
            }
        } else {
            alert('Não é possível remover a última colheita!');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GerenciadorColheitas();
});