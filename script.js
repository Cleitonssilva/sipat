document.addEventListener('DOMContentLoaded', () => {
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
    const uploadArea = document.querySelector('.upload-area');
    const remainingCount = document.getElementById('remainingCount');
    const drawSound = document.getElementById('drawSound');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const backButton = document.getElementById('backButton');
    const enterButton = document.getElementById('enterButton');
    const loadAnotherSheetButton = document.getElementById('loadAnotherSheetButton'); // Certifique-se que este elemento existe no seu HTML

    let allNames = [];
    let availableNames = [];
    let drawnNames = [];
    let isFileLoaded = false;

    // Chaves para o localStorage
    const ALL_NAMES_KEY = 'sipat_allNames';
    const AVAILABLE_NAMES_KEY = 'sipat_availableNames';
    const DRAWN_NAMES_KEY = 'sipat_drawnNames';
    const IS_FILE_LOADED_KEY = 'sipat_isFileLoaded';

    const showMessage = (msg, type) => {
        messageDisplay.textContent = msg;
        messageDisplay.className = `message ${type}`;
        messageDisplay.style.display = 'block';
    };

    const clearMessage = () => {
        messageDisplay.textContent = '';
        messageDisplay.className = 'message';
        messageDisplay.style.display = 'none';
    };

    const updateButtonStates = () => {
        startButton.disabled = !isFileLoaded || availableNames.length === 0;
        startButton.classList.toggle('button-disabled', startButton.disabled);

        resetButton.disabled = !isFileLoaded && drawnNames.length === 0 && availableNames.length === 0;
        resetButton.classList.toggle('button-disabled', resetButton.disabled);

        // Atualiza a contagem de nomes restantes
        remainingCount.textContent = `Nomes Restantes: ${availableNames.length}`;
    };

    const renderDrawnNames = () => {
        drawnNamesList.innerHTML = '';
        if (drawnNames.length === 0) {
            noDrawnNamesMessage.style.display = 'block';
        } else {
            noDrawnNamesMessage.style.display = 'none';
            drawnNames.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                drawnNamesList.appendChild(li);
            });
        }
    };

    const showResultPopup = (name) => {
        drawnNameResult.textContent = name;
        resultPopup.classList.add('show');
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        if (drawSound) {
            drawSound.play();
        }
    };

    const hideResultPopup = () => {
        resultPopup.classList.remove('show');
    };

    // Função para salvar o estado no localStorage
    const saveState = () => {
        localStorage.setItem(ALL_NAMES_KEY, JSON.stringify(allNames));
        localStorage.setItem(AVAILABLE_NAMES_KEY, JSON.stringify(availableNames));
        localStorage.setItem(DRAWN_NAMES_KEY, JSON.stringify(drawnNames));
        localStorage.setItem(IS_FILE_LOADED_KEY, JSON.stringify(isFileLoaded));
        // console.log('Estado salvo:', { allNames, availableNames, drawnNames, isFileLoaded });
    };

    // Função para carregar o estado do localStorage
    const loadState = () => {
        const storedAllNames = localStorage.getItem(ALL_NAMES_KEY);
        const storedAvailableNames = localStorage.getItem(AVAILABLE_NAMES_KEY);
        const storedDrawnNames = localStorage.getItem(DRAWN_NAMES_KEY);
        const storedIsFileLoaded = localStorage.getItem(IS_FILE_LOADED_KEY);

        if (storedAllNames && storedAvailableNames && storedDrawnNames && storedIsFileLoaded) {
            allNames = JSON.parse(storedAllNames);
            availableNames = JSON.parse(storedAvailableNames);
            drawnNames = JSON.parse(storedDrawnNames);
            isFileLoaded = JSON.parse(storedIsFileLoaded);

            if (isFileLoaded && allNames.length > 0) {
                // Se os dados foram carregados e um arquivo estava carregado, pula a tela de boas-vindas
                welcomeScreen.classList.add('hidden');
                backButton.classList.remove('hidden');
                uploadArea.classList.add('hidden'); // Esconde área de upload, pois o arquivo está carregado
                loadAnotherSheetButton.classList.remove('hidden'); // Mostra botão para carregar outra planilha
                fileNameDisplay.textContent = `Arquivo carregado (${allNames.length} nomes - restaurado)`;
                showMessage('Dados do sorteio restaurados automaticamente!', 'info');
            } else {
                // Se isFileLoaded for falso ou não houver nomes, reinicia para o estado inicial
                // Isso cobre casos onde o estado salvo está vazio ou inválido
                allNames = [];
                availableNames = [];
                drawnNames = [];
                isFileLoaded = false;
                clearMessage(); // Limpa qualquer mensagem antiga
            }
            // console.log('Estado carregado:', { allNames, availableNames, drawnNames, isFileLoaded });
            return true; // Estado carregado com sucesso
        }
        return false; // Nenhum estado para carregar
    };


    const handleFileUpload = (file) => {
        if (!file) {
            showMessage('Nenhum arquivo selecionado.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Assume a primeira coluna (índice 0) contém os nomes
                // Filtra linhas vazias ou não-strings e remove espaços em branco
                allNames = json.map(row => row[0]).filter(name => name && typeof name === 'string').map(name => name.trim());

                if (allNames.length > 0) {
                    availableNames = [...allNames]; // Reinicia nomes disponíveis para um novo arquivo
                    drawnNames = []; // Limpa nomes sorteados para um novo arquivo
                    isFileLoaded = true;
                    fileNameDisplay.textContent = `Arquivo carregado: ${file.name} (${allNames.length} nomes)`;
                    showMessage('Arquivo carregado com sucesso! Clique em Iniciar Sorteio.', 'success');
                    uploadArea.classList.add('hidden');
                    loadAnotherSheetButton.classList.remove('hidden');

                    saveState(); // Salva o estado após o carregamento bem-sucedido
                } else {
                    showMessage('Nenhum nome encontrado na primeira coluna da planilha. Por favor, verifique o arquivo.', 'error');
                    isFileLoaded = false;
                    fileNameDisplay.textContent = '';
                    uploadArea.classList.remove('hidden');
                    loadAnotherSheetButton.classList.add('hidden');
                    // Se o arquivo estiver vazio, garante que o localStorage também seja limpo
                    localStorage.removeItem(ALL_NAMES_KEY);
                    localStorage.removeItem(AVAILABLE_NAMES_KEY);
                    localStorage.removeItem(DRAWN_NAMES_KEY);
                    localStorage.setItem(IS_FILE_LOADED_KEY, JSON.stringify(false));
                }
            } catch (error) {
                showMessage('Erro ao processar o arquivo. Certifique-se de que é uma planilha Excel válida.', 'error');
                console.error("Erro ao ler arquivo:", error);
                isFileLoaded = false;
                fileNameDisplay.textContent = '';
                uploadArea.classList.remove('hidden');
                loadAnotherSheetButton.classList.add('hidden');
            }
            renderDrawnNames();
            updateButtonStates();
        };
        reader.readAsArrayBuffer(file);
    };

    const drawName = () => {
        if (availableNames.length === 0) {
            showMessage('Todos os nomes foram sorteados! Clique em "Reiniciar Sorteio" para começar de novo.', 'info');
            startButton.disabled = true;
            startButton.classList.add('button-disabled');
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableNames.length);
        const drawnName = availableNames[randomIndex];

        drawnNames.push(drawnName);
        availableNames.splice(randomIndex, 1); // Remove o nome sorteado da lista de disponíveis

        showResultPopup(drawnName);
        renderDrawnNames();
        updateButtonStates();
        saveState(); // Salva o estado após sortear um nome
    };

    const resetSorteio = () => {
        availableNames = [...allNames]; // Reinicia com base nos nomes originais carregados
        drawnNames = [];
        isFileLoaded = allNames.length > 0; // Se allNames estiver vazio, considera que não há arquivo carregado
        fileNameDisplay.textContent = isFileLoaded ? `Arquivo carregado (${allNames.length} nomes)` : '';
        clearMessage();
        showMessage('Sorteio reiniciado! Clique em Iniciar Sorteio.', 'info');
        renderDrawnNames();
        updateButtonStates();
        saveState(); // Salva o estado após reiniciar
        // Garante que a área de upload e o botão "Carregar Outra Planilha" estejam corretos
        if (!isFileLoaded) {
             uploadArea.classList.remove('hidden');
             loadAnotherSheetButton.classList.add('hidden');
        } else {
             uploadArea.classList.add('hidden');
             loadAnotherSheetButton.classList.remove('hidden');
        }
    };

    // --- Lógica inicial de carregamento ao carregar a página ---
    if (!loadState()) {
        // Se nenhum estado foi carregado (primeira vez ou localStorage limpo), garante o estado inicial da UI
        welcomeScreen.classList.remove('hidden');
        backButton.classList.add('hidden');
        uploadArea.classList.remove('hidden');
        loadAnotherSheetButton.classList.add('hidden');
        clearMessage();
    }
    renderDrawnNames(); // Renderiza os nomes sorteados (se houver) ao iniciar
    updateButtonStates(); // Atualiza o estado dos botões ao iniciar


    // --- Event Listeners ---
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        handleFileUpload(file);
    });

    uploadArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        uploadArea.classList.add('highlight');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('highlight');
    });

    uploadArea.addEventListener('drop', (event) => {
        event.preventDefault();
        uploadArea.classList.remove('highlight');
        const file = event.dataTransfer.files[0];
        handleFileUpload(file);
    });

    startButton.addEventListener('click', drawName);
    resetButton.addEventListener('click', resetSorteio);

    closePopup.addEventListener('click', hideResultPopup);
    resultPopup.addEventListener('click', (event) => {
        if (event.target === resultPopup) {
            hideResultPopup();
        }
    });

    // Lógica da tela de boas-vindas
    enterButton.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        backButton.classList.remove('hidden');
        // A área de upload é inicialmente visível se nenhum arquivo foi carregado do localStorage.
        // Se um arquivo foi carregado via localStorage, uploadArea já estará hidden.
    });

    backButton.addEventListener('click', () => {
        welcomeScreen.classList.remove('hidden');
        backButton.classList.add('hidden');
        loadAnotherSheetButton.classList.add('hidden'); // Esconde botão de carregar outra planilha
        uploadArea.classList.remove('hidden'); // Mostra área de upload
        clearMessage(); // Limpa qualquer mensagem
        fileNameDisplay.textContent = ''; // Limpa nome do arquivo
        
        // Ao voltar para a tela inicial, limpa o localStorage para um novo sorteio
        localStorage.removeItem(ALL_NAMES_KEY);
        localStorage.removeItem(AVAILABLE_NAMES_KEY);
        localStorage.removeItem(DRAWN_NAMES_KEY);
        localStorage.removeItem(IS_FILE_LOADED_KEY);
        
        // Também reinicia as variáveis em memória
        allNames = [];
        availableNames = [];
        drawnNames = [];
        isFileLoaded = false;
        renderDrawnNames(); // Limpa nomes sorteados na tela
        updateButtonStates(); // Atualiza o estado dos botões
    });

    // Event listener para o botão "Carregar Outra Planilha"
    loadAnotherSheetButton.addEventListener('click', () => {
        uploadArea.classList.remove('hidden'); // Mostra a área de upload
        loadAnotherSheetButton.classList.add('hidden'); // Esconde este botão
        fileNameDisplay.textContent = ''; // Limpa o nome do arquivo atual
        clearMessage(); // Limpa mensagens

        // Opcional: Você pode querer limpar os dados em memória aqui
        // se carregar uma nova planilha deve ser um "reset" completo.
        // Por enquanto, apenas disponibiliza a UI para carregar.
        // O handleFileUpload cuidará de resetar as listas.
    });
});
