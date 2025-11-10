// Função para mostrar feedback
function mostrarFeedback(mensagem) {
    alert(mensagem);
}

// Função para alternar talhões
function toggleTalhoes(num) {
    const talhoes = document.getElementById("talhoes-" + num);
    const botao = document.querySelector(`button[onclick="toggleTalhoes(${num})"]`);
    
    if (!talhoes || !botao) return;

    if (talhoes.style.display === "block") {
        talhoes.style.display = "none";
        botao.innerHTML = "▼";
    } else {
        talhoes.style.display = "block";
        botao.innerHTML = "▲";
    }
}

// Função para editar nome da fazenda
function editarFazenda(numFazenda, botao) {
    const h4 = botao.closest('h4');
    const spanNome = h4.querySelector('.nome-fazenda');
    const nomeAtual = spanNome.textContent;
    
    const novoNome = prompt("Digite o novo nome da fazenda:", nomeAtual);
    
    if (novoNome && novoNome.trim() !== "") {
        spanNome.textContent = novoNome.trim();
        mostrarFeedback(`Fazenda renomeada para "${novoNome}"`);
    }
}

// Função para editar localidade da fazenda
function editarLocalidade(numFazenda, botao) {
    const talhoesContainer = document.getElementById(`talhoes-${numFazenda}`);
    if (!talhoesContainer) return;
    
    const localAtualElement = talhoesContainer.querySelector('.local-fazenda');
    const localAtual = localAtualElement ? localAtualElement.textContent.replace('Local: ', '') : '';
    
    const novoLocal = prompt("Digite a nova localidade da fazenda:", localAtual);
    
    if (novoLocal !== null) {
        if (!localAtualElement) {
            // Se não existe elemento de local, cria um
            const p = document.createElement('p');
            p.className = 'local-fazenda';
            p.textContent = `Local: ${novoLocal.trim()}`;
            talhoesContainer.insertBefore(p, talhoesContainer.firstChild);
        } else {
            localAtualElement.textContent = `Local: ${novoLocal.trim()}`;
        }
        mostrarFeedback(`Localidade atualizada para "${novoLocal}"`);
    }
}

// Função para editar nome do talhão
function editarTalhao(botao) {
    const h5 = botao.closest('h5');
    const spanNome = h5.querySelector('.nome-talhao');
    const nomeAtual = spanNome.textContent;
    
    const novoNome = prompt("Digite o novo nome do talhão:", nomeAtual);
    
    if (novoNome && novoNome.trim() !== "") {
        spanNome.textContent = novoNome.trim();
        mostrarFeedback(`Talhão renomeado para "${novoNome}"`);
    }
}

// Adicionar nova fazenda
document.getElementById('adicionarBtn').addEventListener('click', function () {
    const inputSection = document.getElementById('inputFazenda');
    inputSection.style.display = inputSection.style.display === 'block' ? 'none' : 'block';
});

function adicionarFazenda() {
    const input = document.getElementById('nomeFazenda');
    const nomeFazenda = input.value.trim();

    if (nomeFazenda) {
        criarFazendaNaLista(nomeFazenda);
        input.value = '';
        document.getElementById('inputFazenda').style.display = 'none';
        mostrarFeedback(`Fazenda "${nomeFazenda}" adicionada com sucesso!`);
    } else {
        mostrarFeedback('Por favor, digite um nome para a fazenda');
    }
}

function criarFazendaNaLista(nomeFazenda) {
    const adicionarBtn = document.getElementById('adicionarBtn');
    const novoId = Date.now();
    
    const novaFazendaHTML = `
        <h4>
            <span class="nome-fazenda">${nomeFazenda}</span>
            <div class="botoes-controle">
                <button class="editar-btn" onclick="editarFazenda(${novoId}, this)" title="Editar nome">✎</button>
                <button class="local-btn" onclick="editarLocalidade(${novoId}, this)" title="Editar localidade">⚲</button>
                <button class="toggle-button" onclick="toggleTalhoes(${novoId})">▼</button>
            </div>
        </h4>
        <div id="talhoes-${novoId}" style="display: none;">
            <p class="local-fazenda">Local: A definir</p>
            <button onclick="adicionarTalhao(${novoId})">Adicionar talhão +</button>
        </div>
    `;
    
    adicionarBtn.insertAdjacentHTML('beforebegin', novaFazendaHTML);
}

// Função para adicionar talhão
function adicionarTalhao(numFazenda) {
    const talhoesContainer = document.getElementById(`talhoes-${numFazenda}`);
    if (!talhoesContainer) return;

    // Encontra o último botão (que é o "Adicionar talhão +")
    const botoes = talhoesContainer.querySelectorAll('button');
    const botaoAdicionar = botoes[botoes.length - 1];
    
    // Conta quantos talhões já existem
    const talhoesExistentes = talhoesContainer.querySelectorAll('h5').length;
    const novoNumeroTalhao = talhoesExistentes + 1;

    // Cria o novo talhão
    const novoTalhao = document.createElement('h5');
    novoTalhao.innerHTML = `
        <span class="nome-talhao">Talhão ${novoNumeroTalhao}</span>
        <button class="editar-talhao-btn" onclick="editarTalhao(this)" title="Editar nome">✎</button>
    `;
    
    // Insere antes do botão "Adicionar talhão +"
    talhoesContainer.insertBefore(novoTalhao, botaoAdicionar);

    mostrarFeedback(`Talhão ${novoNumeroTalhao} adicionado à fazenda`);
}

// Pesquisa em tempo real
document.getElementById('pesquisa').addEventListener('input', function (e) {
    const termo = e.target.value.toLowerCase();
    const fazendas = document.querySelectorAll('main article h4');

    fazendas.forEach(fazenda => {
        const nomeElement = fazenda.querySelector('.nome-fazenda');
        const textoFazenda = nomeElement ? nomeElement.textContent.toLowerCase() : '';
        const containerTalhoes = fazenda.nextElementSibling;

        if (textoFazenda.includes(termo)) {
            fazenda.style.display = 'flex';
            if (containerTalhoes && containerTalhoes.id.startsWith('talhoes-')) {
                // Mantém o estado atual (aberto/fechado) durante a pesquisa
            }
        } else {
            fazenda.style.display = 'none';
            if (containerTalhoes && containerTalhoes.id.startsWith('talhoes-')) {
                // Não altera o display dos talhões durante a pesquisa
            }
        }
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('inputFazenda').style.display = 'none';
    
    // Esconder todos os talhões inicialmente
    document.querySelectorAll('[id^="talhoes-"]').forEach(t => {
        t.style.display = 'none';
    });
    
    // Configurar input de nova fazenda
    const inputSection = document.getElementById('inputFazenda');
    inputSection.innerHTML = `
        <div class="container-input">
            <input type="text" id="nomeFazenda" placeholder="Nome da fazenda" required>
            <button onclick="adicionarFazenda()">Confirmar</button>
        </div>
    `;
});