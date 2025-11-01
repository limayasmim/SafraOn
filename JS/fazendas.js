
function toggleTalhoes(num) {
    const talhoes = document.getElementById("talhoes-" + num);
    const botao = document.querySelector(`.toggle-button[onclick="toggleTalhoes(${num})"]`);

    // Fecha todos os outros talhões
    document.querySelectorAll('[id^="talhoes-"]').forEach(t => {
        if (t.id !== "talhoes-" + num) {
            t.style.display = "none";
            const outrosBotoes = document.querySelectorAll(`.toggle-button[onclick="toggleTalhoes(${t.id.split('-')[1]})"]`);
            outrosBotoes.forEach(btn => btn.innerHTML = "▼");
        }
    });

    // Alterna o atual
    if (talhoes.style.display === "block") {
        talhoes.style.display = "none";
        botao.innerHTML = "▼";
    } else {
        talhoes.style.display = "block";
        botao.innerHTML = "▲";
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
        // Aqui você pode adicionar a lógica para salvar a nova fazenda
        mostrarFeedback(`Fazenda "${nomeFazenda}" adicionada com sucesso!`);
        input.value = '';
        document.getElementById('inputFazenda').style.display = 'none';

        // Em uma implementação real, você adicionaria a nova fazenda à lista
        // const novaFazenda = criarFazenda(nomeFazenda);
        // adicionarFazendaNaLista(novaFazenda);
    } else {
        mostrarFeedback('Por favor, digite um nome para a fazenda');
    }
}

function adicionarTalhao(numFazenda) {
    // Aqui você pode adicionar a lógica para adicionar um novo talhão
    mostrarFeedback(`Novo talhão adicionado à Fazenda ${numFazenda}`);

    // Em uma implementação real:
    // - Abrir modal para cadastrar talhão
    // - Coletar dados do talhão
    // - Adicionar à lista de talhões da fazenda
}

// Fechar talhões ao clicar fora
document.addEventListener('click', function (event) {
    const isToggleButton = event.target.matches('.toggle-button') ||
        event.target.closest('.toggle-button');
    const isInsideTalhoes = event.target.closest('[id^="talhoes-"]');
    const isInsideInputFazenda = event.target.closest('#inputFazenda');
    const isAdicionarBtn = event.target.matches('#adicionarBtn');

    // Se não clicou em elementos relacionados, fecha tudo
    if (!isToggleButton && !isInsideTalhoes && !isInsideInputFazenda && !isAdicionarBtn) {
        document.querySelectorAll('[id^="talhoes-"]').forEach(container => {
            container.style.display = "none";
        });
        document.querySelectorAll(".toggle-button").forEach(btn => {
            btn.innerHTML = "▼";
        });
    }
});

// Pesquisa em tempo real
document.getElementById('pesquisa').addEventListener('input', function (e) {
    const termo = e.target.value.toLowerCase();
    const fazendas = document.querySelectorAll('main article h4');

    fazendas.forEach(fazenda => {
        const textoFazenda = fazenda.textContent.toLowerCase();
        const talhoes = fazenda.nextElementSibling;

        if (textoFazenda.includes(termo)) {
            fazenda.style.display = 'flex';
            if (talhoes && talhoes.id.startsWith('talhoes-')) {
                talhoes.style.display = 'none';
                const botao = fazenda.querySelector('.toggle-button');
                if (botao) botao.innerHTML = '▼';
            }
        } else {
            fazenda.style.display = 'none';
            if (talhoes && talhoes.id.startsWith('talhoes-')) {
                talhoes.style.display = 'none';
            }
        }
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    // Esconder input de nova fazenda inicialmente
    document.getElementById('inputFazenda').style.display = 'none';

    // Esconder todos os talhões inicialmente
    document.querySelectorAll('[id^="talhoes-"]').forEach(t => {
        t.style.display = 'none';
    });
});
