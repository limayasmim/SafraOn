class GerenciadorColheitas {
    constructor() {
        this.contadorLinhas = 1;
        this.linhaEditando = null;
        this.inicializarEventos();
    }

    inicializarEventos() {
        // Menu mobile toggle
        document.querySelector('.menu-toggle').addEventListener('click', () => {
            document.querySelector('nav').classList.toggle('active');
        });

        // Fechar menu ao clicar em um item (mobile)
        document.querySelectorAll('nav li').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    document.querySelector('nav').classList.remove('active');
                }
            });
        });

        // Evento para adicionar nova linha
        document.querySelector('.btn-adicionar-linha').addEventListener('click', () => {
            this.abrirModalAdicao();
        });

        // Eventos delegados para editar e remover linhas
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-editar')) {
                this.abrirModalEdicao(e.target.closest('.valores-linha'));
            }
            
            if (e.target.closest('.btn-remover')) {
                this.removerLinha(e.target.closest('.valores-linha'));
            }
        });

        // Eventos do modal de edição
        document.querySelector('#modalEdicao .btn-fechar').addEventListener('click', () => {
            this.fecharModalEdicao();
        });

        document.querySelector('#modalEdicao .btn-cancelar').addEventListener('click', () => {
            this.fecharModalEdicao();
        });

        document.querySelector('#formEdicao').addEventListener('submit', (e) => {
            this.salvarEdicao(e);
        });

        // Eventos do modal de adição
        document.querySelector('#modalAdicao .btn-fechar-adicao').addEventListener('click', () => {
            this.fecharModalAdicao();
        });

        document.querySelector('#modalAdicao .btn-cancelar-adicao').addEventListener('click', () => {
            this.fecharModalAdicao();
        });

        document.querySelector('#formAdicao').addEventListener('submit', (e) => {
            this.adicionarNovaLinha(e);
        });

        // Fechar modais ao clicar fora
        document.querySelectorAll('dialog').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modal.id === 'modalEdicao') {
                        this.fecharModalEdicao();
                    } else {
                        this.fecharModalAdicao();
                    }
                }
            });
        });

        // Fechar menu ao redimensionar a janela
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.querySelector('nav').classList.remove('active');
            }
        });
    }

    abrirModalAdicao() {
        // Limpar formulário
        document.querySelector('#dataAdicao').value = '';
        document.querySelector('#plantaAdicao').value = '';
        document.querySelector('#umidadeAdicao').value = '';
        document.querySelector('#producaoAdicao').value = '';
        
        document.querySelector('#modalAdicao').showModal();
    }

    fecharModalAdicao() {
        document.querySelector('#modalAdicao').close();
    }

    adicionarNovaLinha(evento) {
        evento.preventDefault();
        
        const data = document.querySelector('#dataAdicao').value;
        const planta = document.querySelector('#plantaAdicao').value;
        const umidade = document.querySelector('#umidadeAdicao').value;
        const producao = document.querySelector('#producaoAdicao').value;
        
        if (!data || !planta || !umidade || !producao) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        this.contadorLinhas++;
        
        const novaLinha = document.createElement('article');
        novaLinha.className = 'valores-linha';
        novaLinha.dataset.id = this.contadorLinhas;
        
        novaLinha.innerHTML = `
            <span class="valor-campo">${data}</span>
            <span class="valor-campo">${planta}</span>
            <span class="valor-campo">${umidade}</span>
            <span class="valor-campo">${producao}</span>
            
            <menu class="acoes-linha">
                <button class="btn-acao btn-editar" title="Editar">✎</button>
                <button class="btn-acao btn-remover" title="Remover">×</button>
            </menu>
        `;
        
        document.querySelector('#valoresContainer').appendChild(novaLinha);
        this.fecharModalAdicao();
    }

    abrirModalEdicao(linha) {
        this.linhaEditando = linha;
        const valores = linha.querySelectorAll('.valor-campo');
        
        document.querySelector('#dataEdicao').value = valores[0].textContent;
        document.querySelector('#plantaEdicao').value = valores[1].textContent;
        document.querySelector('#umidadeEdicao').value = valores[2].textContent;
        document.querySelector('#producaoEdicao').value = valores[3].textContent;
        document.querySelector('#linhaId').value = linha.dataset.id;
        
        document.querySelector('#modalEdicao').showModal();
    }

    fecharModalEdicao() {
        document.querySelector('#modalEdicao').close();
        this.linhaEditando = null;
    }

    salvarEdicao(evento) {
        evento.preventDefault();
        
        const data = document.querySelector('#dataEdicao').value;
        const planta = document.querySelector('#plantaEdicao').value;
        const umidade = document.querySelector('#umidadeEdicao').value;
        const producao = document.querySelector('#producaoEdicao').value;
        
        if (this.linhaEditando) {
            const valores = this.linhaEditando.querySelectorAll('.valor-campo');
            valores[0].textContent = data || '00/00/0000';
            valores[1].textContent = planta || 'Digite a planta';
            valores[2].textContent = umidade || '0%';
            valores[3].textContent = producao || '0 sacas';
        }
        
        this.fecharModalEdicao();
    }

    removerLinha(linha) {
        const container = document.querySelector('#valoresContainer');
        if (container.children.length > 1) {
            if (confirm('Tem certeza que deseja remover esta linha?')) {
                linha.remove();
            }
        } else {
            alert('Não é possível remover a última linha!');
        }
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new GerenciadorColheitas();
});