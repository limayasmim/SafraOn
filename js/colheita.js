class GerenciadorColheitas {
    constructor() {
        this.contador = 1; // Yasmim
        this.dados = JSON.parse(localStorage.getItem("colheitas")) || [];
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
        const index = item.dataset.index;
        const dados = this.dados[index]; // dois apos comentario gpt

        document.querySelector('#data').value = dados.data;             
        document.querySelector('#planta').value = dados.planta;         
        document.querySelector('#umidade').value = dados.umidade;       
        document.querySelector('#producao').value = dados.producao;     

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
        const novoItem = { data, planta, umidade, producao }; //gpt

        if (this.itemEditando !== null) {
            const index = this.itemEditando.dataset.index;
            this.dados[index] = novoItem;
        } else {
            this.dados.push(novoItem);
        }  

        this.salvarLocal(); //gpt
        this.renderizarItens(); //gpt
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
            <span>${item.planta}</span>
            <span>${item.umidade}</span>
            <span>${item.producao}</span>
            <menu class="acoes">
                <button class="btn-editar" title="Editar">✎</button>
                <button class="btn-remover" title="Remover">×</button>
            </menu>
         `;

            container.appendChild(novoItem);
        });
    }

    removerItem(item) {
        const index = item.dataset.index;
     
        if (confirm('Remover esta colheita?')) {
        this.dados.splice(index, 1);
        this.salvarLocal();
        this.renderizarItens();
        } else {
            alert('Não é possível remover a última colheita!');
        }
    }

    salvarLocal() {
        localStorage.setItem("colheitas", JSON.stringify(this.dados));
    }

}   

document.addEventListener('DOMContentLoaded', () => {
    new GerenciadorColheitas();
});