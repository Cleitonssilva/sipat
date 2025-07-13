document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleção de Elementos DOM
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const messageDisplay = document.getElementById('message');
    const drawnNamesList = document.getElementById('drawnNames');
    const noDrawnNamesMessage = document.getElementById('noDrawnNamesMessage');
    const resultPopup = document.getElementById('resultPopup');
    const closePopup = resultPopup.querySelector('.close-popup');
    const drawnNameResult = document.getElementById('drawnNameResult');
    const uploadArea = document.querySelector('.upload-area'); // Adicionado para drag and drop

    // 2. Variáveis de Estado do Aplicativo
    let allNames = []; // Armazena todos os nomes da planilha
    let availableNames = []; // Nomes disponíveis para sorteio
    let drawnNames = []; // Nomes já sorteados
    let isFileLoaded = false; // Flag para controlar se a planilha foi carregada

    // 3. Funções Utilitárias

    /**
     * Exibe uma mensagem para o usuário.
     * @param {string} msg O texto da mensagem.
     * @param {string} type O tipo de mensagem (success, error, info).
     */
    const showMessage = (msg, type) => {
        messageDisplay.textContent = msg;
        messageDisplay.className = `message ${type}`;
        messageDisplay.style.display = 'block'; // Garante que a mensagem é visível
    };

    /**
     * Limpa a mensagem exibida.
     */
    const clearMessage = () => {
        messageDisplay.textContent = '';
        messageDisplay.className = 'message';
        messageDisplay.style.display = 'none'; // Esconde a mensagem
    };

    /**
     * Atualiza o estado dos botões (habilitado/desabilitado).
     */
    const updateButtonStates = () => {
        startButton.disabled = !isFileLoaded || availableNames.length === 0;
        startButton.classList.toggle('button-disabled', startButton.disabled);

        resetButton.disabled = !isFileLoaded && drawnNames.length === 0; // Pode reiniciar mesmo sem sorteados se precisar carregar de novo
        resetButton.classList.toggle('button-disabled', resetButton.disabled);
    };

    /**
     * Exibe os nomes sorteados na lista.
     */
    const renderDrawnNames = () => {
        drawnNamesList.innerHTML = ''; // Limpa a lista existente

        if (drawnNames.length === 0) {
            noDrawnNamesMessage.style.display = 'block';
            drawnNamesList.style.display = 'none';
        } else {
            noDrawnNamesMessage.style.display = 'none';
            drawnNamesList.style.display = 'block';
            drawnNames.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                drawnNamesList.appendChild(li);
            });
        }
    };

    /**
     * Mostra o pop-up com o nome sorteado e ativa os fogos de artifício.
     * @param {string} name O nome sorteado para exibir.
     */
    const showResultPopup = (name) => {
        drawnNameResult.textContent = name;
        resultPopup.classList.add('show');
        // Ativar fogos de artifício
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }; // zIndex 0 para ser atrás do popup

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, we can confine the cannon code to the top of the screen
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    /**
     * Esconde o pop-up e para os fogos de artifício (se houver).
     */
    const hideResultPopup = () => {
        resultPopup.classList.remove('show');
        // Interromper qualquer animação de fogos de artifício em andamento
        // (canvas-confetti não tem uma função de stop global, mas a animação para sozinha)
    };

    // 4. Lógica Principal do Sorteador

    /**
     * Lida com o carregamento do arquivo Excel/CSV.
     * @param {File} file O arquivo selecionado pelo usuário.
     */
    const handleFileUpload = (file) => {
        if (!file) {
            showMessage('Nenhum arquivo selecionado.', 'info');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // Assume que a primeira coluna tem os nomes, e ignora a primeira linha (cabeçalho)
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Filtra linhas vazias e pega o primeiro item (coluna A) de cada linha
                const namesFromSheet = jsonData
                    .slice(1) // Ignora a primeira linha (cabeçalho)
                    .map(row => (row[0] || '').toString().trim()) // Pega a primeira coluna e trata como string
                    .filter(name => name !== ''); // Remove nomes vazios após o trim

                if (namesFromSheet.length === 0) {
                    showMessage('A planilha não contém nomes válidos na primeira coluna.', 'error');
                    isFileLoaded = false;
                    fileNameDisplay.textContent = '';
                } else {
                    allNames = [...namesFromSheet]; // Copia todos os nomes para a lista original
                    availableNames = [...allNames]; // Inicializa disponíveis com todos os nomes
                    drawnNames = []; // Limpa nomes sorteados
                    isFileLoaded = true;
                    fileNameDisplay.textContent = `Arquivo: ${file.name} (${namesFromSheet.length} nomes)`;
                    showMessage(`Planilha "${file.name}" carregada com sucesso! ${namesFromSheet.length} nomes encontrados.`, 'success');
                    renderDrawnNames(); // Atualiza a lista de sorteados (que estará vazia)
                }
            } catch (error) {
                console.error('Erro ao processar a planilha:', error);
                showMessage('Erro ao ler a planilha. Certifique-se de que é um arquivo Excel/CSV válido.', 'error');
                isFileLoaded = false;
            } finally {
                updateButtonStates();
            }
        };

        reader.onerror = (error) => {
            console.error('Erro ao ler o arquivo:', error);
            showMessage('Não foi possível ler o arquivo.', 'error');
            isFileLoaded = false;
            updateButtonStates();
        };

        reader.readAsArrayBuffer(file);
    };

    /**
     * Realiza o sorteio de um nome.
     */
    const drawName = () => {
        if (availableNames.length === 0) {
            showMessage('Todos os nomes foram sorteados! Recomece para sortear novamente.', 'info');
            startButton.disabled = true;
            startButton.classList.add('button-disabled');
            return;
        }

        clearMessage(); // Limpa mensagens anteriores

        // Gera um índice aleatório
        const randomIndex = Math.floor(Math.random() * availableNames.length);
        const selectedName = availableNames[randomIndex];

        // Remove o nome sorteado da lista de disponíveis
        availableNames.splice(randomIndex, 1);

        // Adiciona o nome à lista de sorteados
        drawnNames.unshift(selectedName); // Adiciona no início para os mais recentes ficarem no topo

        renderDrawnNames();
        showResultPopup(selectedName);
        updateButtonStates();
    };

    /**
     * Reseta o sorteio, restaurando todos os nomes.
     */
    const resetSorteio = () => {
        availableNames = [...allNames]; // Restaura a lista de disponíveis
        drawnNames = []; // Limpa a lista de sorteados
        isFileLoaded = allNames.length > 0; // Mantém o isFileLoaded se houver nomes originais
        fileNameDisplay.textContent = isFileLoaded ? `Arquivo carregado (${allNames.length} nomes)` : ''; // Ajusta texto do arquivo
        clearMessage();
        showMessage('Sorteio reiniciado! Carregue uma nova planilha ou clique em Iniciar Sorteio.', 'info');
        renderDrawnNames();
        updateButtonStates();
    };

    // 5. Gerenciadores de Eventos

    // Evento para input de arquivo (seleção via botão)
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        handleFileUpload(file);
    });

    // Eventos para drag and drop
    uploadArea.addEventListener('dragover', (event) => {
        event.preventDefault(); // Necessário para permitir o drop
        uploadArea.classList.add('highlight');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('highlight');
    });

    uploadArea.addEventListener('drop', (event) => {
        event.preventDefault(); // Previne que o navegador abra o arquivo
        uploadArea.classList.remove('highlight');
        const file = event.dataTransfer.files[0];
        handleFileUpload(file);
    });

    // Botões de ação
    startButton.addEventListener('click', drawName);
    resetButton.addEventListener('click', resetSorteio);

    // Fechar pop-up
    closePopup.addEventListener('click', hideResultPopup);
    resultPopup.addEventListener('click', (event) => {
        if (event.target === resultPopup) { // Fecha apenas se clicar no overlay
            hideResultPopup();
        }
    });

    // 6. Inicialização
    updateButtonStates(); // Define o estado inicial dos botões
    renderDrawnNames(); // Renderiza a lista de sorteados (vazia no início)
    showMessage('Carregue sua planilha para começar!', 'info');
});