/* ========================================= */
/* 1. Variáveis                              */
/* ========================================= */
:root {
    --primary-color: #4CAF50; /* Verde para sucesso/iniciar sorteio */
    --primary-color-rgb: 76, 175, 80; /* RGB para uso com rgba() */
    --secondary-color: #FFC107; /* Amarelo para atenção/recomeçar */
    --tertiary-color: #03A9F4; /* Azul para elementos de informação */
    --danger-color: #F44336; /* Vermelho para erros */
    --dark-color: #4682B4; /* Azul escuro (Steel Blue) para títulos e outros */
    --light-color: #fff;
    --background-light: #f4f4f4; /* Fundo geral claro */
    --background-dark: #212121; /* Fundo do pop-up */
    --font-family-base: 'Roboto', sans-serif;
    --line-height-base: 1.6;
    --text-color-base: #444; /* Cor padrão para textos */
    --border-radius-base: 5px;
    --box-shadow-base: 0 4px 8px rgba(0,0,0,0.1);
    --spacing-sm: 10px;
    --spacing-md: 20px;
    --spacing-lg: 30px;

    /* Variáveis de tema para a transição de cores (solid color) */
    --color1: #ffd500;
    --color2: #fbba00;
    --color3: #46772e;
    --color4: #f39200;
    --color5: #ec6608;
}

/* ========================================= */
/* 2. Reset                                  */
/* ========================================= */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* ========================================= */
/* 3. Base/Globais                           */
/* ========================================= */
body {
    font-family: var(--font-family-base);
    line-height: var(--line-height-base);
    color: var(--text-color-base);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    /* Transição para suavizar a mudança da cor de fundo sólida */
    transition: background-color 2s ease;
}

/* Classes de tema dinâmicas para o body (solid color) */
.theme-1 { background-color: var(--color1); color: #000; }
.theme-2 { background-color: var(--color2); color: #000; }
.theme-3 { background-color: var(--color3); color: #fff; }
.theme-4 { background-color: var(--color4); color: #000; }
.theme-5 { background-color: var(--color5); color: #fff; }


h1, h2, h3 {
    color: var(--dark-color);
    margin-bottom: var(--spacing-md);
    text-align: center;
}

/* Estilos de h1 no header, adaptados por tema */
header h1 {
    transition: color 1s ease;
    font-size: 2.2em;
    font-weight: 700;
    margin-top: 8px;
}
/* Cores do h1 do header baseadas nas classes de tema do body */
.theme-1 header h1,
.theme-2 header h1,
.theme-4 header h1 {
  color: #000;
}
.theme-3 header h1,
.theme-5 header h1 {
  color: #fff;
}


p {
    margin-bottom: var(--spacing-sm);
}

a {
    text-decoration: none;
    color: var(--primary-color);
    transition: color 0.3s ease;
}

a:hover {
    color: var(--secondary-color);
}

button {
    cursor: pointer;
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-base);
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
    text-transform: uppercase;
}

button:hover {
    transform: translateY(-2px);
}

button:active {
    transform: translateY(0);
}

/* Estilo para botões desabilitados */
.button-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: none;
    transform: none;
}

/* Estilo para botões de "Voltar" */
.back-button {
    margin-top: 20px;
    background-color: var(--color3);
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1em;
    border-radius: 5px;
    cursor: pointer;
}
.back-button.hidden {
  display: none;
}


/* ========================================= */
/* 4. Layout                                 */
/* ========================================= */
.container {
    background-color: var(--light-color);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-base);
    box-shadow: var(--box-shadow-base);
    max-width: 600px;
    margin: var(--spacing-lg) auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

header {
    background-color: transparent;
    color: var(--dark-color);
    text-align: center;
    padding: var(--spacing-md) 0;
    width: 100%;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
}

.company-logo {
    background-color: rgba(255, 255, 255, 0.85);
    padding: 6px 10px;
    border-radius: 8px;
    transition: background-color 0.5s ease;
    height: 80px;
    max-width: 200px;
    object-fit: contain;
    margin-bottom: 8px;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.6),
                0 0 25px var(--secondary-color),
                2px 2px 4px rgba(0, 0, 0, 0.5);
    padding: 5px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.company-logo:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
                0 0 35px var(--secondary-color),
                4px 4px 8px rgba(0, 0, 0, 0.6);
}

footer {
    margin-top: auto;
    font-size: 0.85em;
    padding: var(--spacing-sm) 0;
    text-align: center;
    color: var(--text-color-base);
}

/* ========================================= */
/* 5. Componentes                            */
/* ========================================= */

/* File Upload Area */
.upload-area {
    border: 2px dashed var(--tertiary-color);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-base);
    text-align: center;
    margin-bottom: var(--spacing-lg);
    transition: border-color 0.3s ease, opacity 0.5s ease, visibility 0.5s ease, height 0.5s ease, margin-bottom 0.5s ease, padding 0.5s ease;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 150px;
}

.upload-area.hidden {
    opacity: 0;
    visibility: hidden;
    height: 0;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
    overflow: hidden;
}

.upload-area.highlight {
    border-color: var(--primary-color);
    background-color: rgba(var(--primary-color-rgb), 0.1);
}

.upload-area p:first-of-type {
    margin-bottom: var(--spacing-sm);
    font-size: 1.1em;
    color: var(--text-color-base);
}

.upload-area input[type="file"] {
    display: none;
}

.upload-area label {
    display: block;
    cursor: pointer;
    background-color: var(--tertiary-color);
    color: var(--light-color);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-base);
    margin-top: var(--spacing-sm);
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.upload-area label:hover {
    background-color: var(--primary-color);
}

.file-info {
    margin-top: var(--spacing-sm);
    font-size: 0.9em;
    color: #666;
    font-style: italic;
}

/* Control Buttons */
.button-group {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
}

.button-start {
    background-color: var(--primary-color);
    color: var(--light-color);
}

.button-start:hover {
    background-color: #45a049;
}

.button-reset {
    background-color: var(--secondary-color);
    color: var(--dark-color);
}

.button-reset:hover {
    background-color: #e6b100;
}

/* Mensagens de Feedback */
.message {
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-base);
    margin-top: var(--spacing-md);
    font-size: 0.95em;
    text-align: center;
    width: 100%;
}

.message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.message.info {
    background-color: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
}

/* Estilos para a lista de nomes sorteados */
.drawn-names-list {
    margin-top: var(--spacing-lg);
    width: 100%;
    background-color: #f9f9f9;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-base);
    max-height: 250px;
    overflow-y: auto;
    border: 1px solid #eee;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
}

.drawn-names-list h3 {
    font-size: 1.2em;
    margin-bottom: var(--spacing-sm);
    color: var(--tertiary-color);
    text-align: left;
}

.drawn-names-list ul {
    list-style: none;
    padding-left: 0;
}

.drawn-names-list li {
    padding: 8px 0;
    border-bottom: 1px dashed #e0e0e0;
    font-size: 1em;
    color: var(--text-color-base);
    display: flex;
    align-items: center;
}

.drawn-names-list li:last-child {
    border-bottom: none;
}

.drawn-names-list li::before {
    content: '🎉';
    margin-right: 8px;
    font-size: 0.9em;
}

#noDrawnNamesMessage {
    text-align: center;
    color: #888;
    font-style: italic;
    margin-top: var(--spacing-sm);
}

/* Estilos do Pop-up */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.popup-overlay.show {
    visibility: visible;
    opacity: 1;
}

.popup-content {
    background-color: var(--background-dark);
    color: var(--light-color);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-base);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.5), 0 0 50px var(--primary-color);
    text-align: center;
    max-width: 90%;
    width: 500px;
    position: relative;
    transform: scale(0.8);
    transition: transform 0.3s ease;
}

.popup-overlay.show .popup-content {
    transform: scale(1);
}

.close-popup {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 2em;
    color: #aaa;
    cursor: pointer;
    transition: color 0.3s ease;
}

.close-popup:hover {
    color: var(--light-color);
}

.popup-message {
    font-size: 1.5em;
    color: var(--secondary-color);
    margin-bottom: var(--spacing-md);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.popup-result {
    font-size: 3.5em;
    font-weight: bold;
    color: var(--primary-color);
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
    margin-bottom: var(--spacing-lg);
    animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        color: var(--primary-color);
    }
    100% {
        transform: scale(1.05);
        color: var(--light-color);
    }
}

#fireworks-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999;
}

/* ========================================= */
/* 6. Responsividade                         */
/* ========================================= */

@media (max-width: 768px) {
    .container {
        padding: var(--spacing-md);
        margin: var(--spacing-md) auto;
        max-width: 90%;
    }

    .company-logo {
        height: 60px;
        max-width: 150px;
        margin-bottom: 5px;
    }

    header h1 {
        font-size: 1.5em;
    }

    .popup-result {
        font-size: 2.8em;
    }

    .button-group {
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    button {
        width: 100%;
    }
}

@media (max-width: 480px) {
    h1 {
        font-size: 1.3em;
    }

    .popup-result {
        font-size: 2em;
    }

    .upload-area {
        padding: var(--spacing-md);
    }
}
