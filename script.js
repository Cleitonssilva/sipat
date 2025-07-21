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
    const loadAnotherSheetButton = document.getElementById('loadAnotherSheetButton'); // Novo botão

    // Constantes para o confete
    const CONFETTI_DURATION = 15 * 1000;
    const CONFETTI_PARTICLE_COUNT = 50;

    let allNames = [];
    let availableNames = [];
    let drawnNames = [];
    let isFileLoaded = false;
    let loadedFileName = ''; // Armazena o nome do arquivo original

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

        resetButton.disabled = !isFileLoaded && drawnNames.length === 0;
        resetButton.classList.toggle('button-disabled', resetButton.disabled);

        // Ocultar/Exibir botão "Carregar Outra Planilha"
        if (isFileLoaded) {
            loadAnotherSheetButton.classList.remove('hidden');
        } else {
            loadAnotherSheetButton.classList.add('hidden');
        }
    };

    const updateRemainingDisplay = () => {
        if (remainingCount) {
            remainingCount.textContent = availableNames.length;
        }
    };

    const renderDrawnNames = () => {
        drawnNamesList.innerHTML = '';

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
        updateRemainingDisplay();
    };

    const showResultPopup = (name) => {
        drawnNameResult.textContent = name;
        resultPopup.classList.add('show');

        const animationEnd = Date.now() + CONFETTI_DURATION;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = CONFETTI_PARTICLE_COUNT * (timeLeft / CONFETTI_DURATION);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        if (drawSound) drawSound.play();
    };

    const hideResultPopup = () => {
        resultPopup.classList.remove('show');
    };

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
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const namesFromSheet = jsonData
                    .slice(1)
                    .map(row => (row[0] || '').toString().trim())
                    .filter(name => name !== '');

                if (namesFromSheet.length === 0) {
                    showMessage('A planilha não contém nomes válidos na primeira coluna.', 'error');
                    isFileLoaded = false;
                    fileNameDisplay.textContent = '';
                    loadedFileName = '';
                    uploadArea.classList.remove('hidden'); // Certifica que a área de upload está visível em caso de erro
                } else {
                    allNames = [...namesFromSheet];
                    availableNames = [...allNames];
                    drawnNames = [];
                    isFileLoaded = true;
                    loadedFileName = file.name;
                    fileNameDisplay.textContent = `Arquivo: ${loadedFileName} (${namesFromSheet.length} nomes)`;
                    showMessage(`Planilha "${loadedFileName}" carregada com sucesso! ${namesFromSheet.length} nomes encontrados.`, 'success');
                    renderDrawnNames();
                    uploadArea.classList.add('hidden'); // Oculta a área de upload após sucesso
                }
            } catch (error) {
                console.error('Erro ao processar a planilha:', error);
                showMessage('Erro ao ler a planilha. Certifique-se de que é um arquivo Excel/CSV válido.', 'error');
                isFileLoaded = false;
                loadedFileName = '';
                uploadArea.classList.remove('hidden'); // Certifica que a área de upload está visível em caso de erro
            } finally {
                updateButtonStates();
            }
        };

        reader.onerror = (error) => {
            console.error('Erro ao ler o arquivo:', error);
            showMessage('Não foi possível ler o arquivo.', 'error');
            isFileLoaded = false;
            loadedFileName = '';
            uploadArea.classList.remove('hidden'); // Certifica que a área de upload está visível em caso de erro
            updateButtonStates();
        };

        reader.readAsArrayBuffer(file);
    };

    const drawName = () => {
        if (availableNames.length === 0) {
            showMessage('Todos os nomes foram sorteados! Recomece para sortear novamente.', 'info');
            startButton.disabled = true;
            startButton.classList.add('button-disabled');
            return;
        }

        clearMessage();

        const randomIndex = Math.floor(Math.random() * availableNames.length);
        const selectedName = availableNames[randomIndex];

        availableNames.splice(randomIndex, 1);
        drawnNames.unshift(selectedName);

        renderDrawnNames();
        showResultPopup(selectedName);
        updateButtonStates();
    };

    const resetSorteio = () => {
        availableNames = [...allNames];
        drawnNames = [];
        isFileLoaded = allNames.length > 0;
        fileNameDisplay.textContent = isFileLoaded ? `Arquivo: ${loadedFileName} (${allNames.length} nomes)` : '';
        clearMessage();
        showMessage('Sorteio reiniciado! Clique em Iniciar Sorteio ou em "Carregar Outra Planilha".', 'info');
        renderDrawnNames();
        updateButtonStates();
        // Não ocultar a área de upload no reset se já havia um arquivo carregado
        // A área de upload só aparece no "Carregar Outra Planilha" ou se não houver nomes.
        if (allNames.length === 0) { // Se não há nomes carregados (primeiro acesso ou reset total)
            uploadArea.classList.remove('hidden');
        }
    };

    // Event Listeners
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

    // Evento para o novo botão "Carregar Outra Planilha"
    loadAnotherSheetButton.addEventListener('click', () => {
        uploadArea.classList.remove('hidden'); // Mostra a área de upload
        clearMessage(); // Limpa a mensagem atual
        fileNameDisplay.textContent = ''; // Limpa o nome do arquivo exibido
        isFileLoaded = false; // Reseta o estado de arquivo carregado
        allNames = []; // Limpa todos os nomes
        availableNames = []; // Limpa nomes disponíveis
        drawnNames = []; // Limpa nomes sorteados
        renderDrawnNames(); // Atualiza a lista de nomes sorteados (que estará vazia)
        updateButtonStates(); // Atualiza o estado dos botões
        showMessage('Carregue sua nova planilha para continuar.', 'info');
    });


    closePopup.addEventListener('click', hideResultPopup);
    resultPopup.addEventListener('click', (event) => {
        if (event.target === resultPopup) {
            hideResultPopup();
        }
    });

    // Inicialização
    updateButtonStates();
    renderDrawnNames();
    showMessage('Carregue sua planilha para começar!', 'info');
    uploadArea.classList.remove('hidden'); // Garante que a área de upload esteja visível no início
});
