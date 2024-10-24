document.addEventListener('DOMContentLoaded', function() {
    const connectionsDiv = document.getElementById('connections');
    const clearButton = document.getElementById('clearButton');
    const scoreElement = document.getElementById('score'); // Elemento para exibir a pontuação
    const cookieInfoDiv = document.getElementById('cookieInfo'); // Exibir informações de cookies
    const storageInfoDiv = document.getElementById('storageInfo'); // Exibir informações de armazenamento
    const hijackWarningDiv = document.getElementById('hijackWarning'); // Exibir contador de hijacking
    const fingerprintInfoDiv = document.getElementById('fingerprintInfo'); // Exibir contador de fingerprint

    let score = 10; // Pontuação inicial
    let thirdPartyCookieDetected = false;
    let hijackDetectedCount = 0; // Contador de scripts potencialmente perigosos
    let fingerprintDetected = false;
    let thirdPartyDomains = new Set(); // Usaremos um Set para evitar duplicados

    // Estabelece uma conexão com o background script
    const port = browser.runtime.connect({name: "port-from-popup"});
    console.log("Conexão estabelecida com o background script...");

    // Escuta mensagens do background script
    port.onMessage.addListener(function(message) {
        console.log("Mensagem recebida no popup:", message);

        // Trata as mensagens do tipo "host" (domínios de terceira parte)
        if (message.type === "host") {
            thirdPartyDomains.add(message.host); // Adiciona ao Set para eliminar duplicatas
        }

        // Exibe os dados de cookies
        if (message.type === "cookies") {
            cookieInfoDiv.innerHTML = `
                <div style="color: blue;">Cookies de Primeira Parte: ${message.firstParty}</div>
                <div style="color: blue;">Cookies de Terceira Parte: ${message.thirdParty}</div>
                <div style="color: blue;">Cookies de Sessão: ${message.session}</div>
                <div style="color: blue;">Cookies Persistentes: ${message.persistent}</div>
            `;

            // Verifica se há cookies de terceira parte
            if (message.thirdParty > 3) {
                thirdPartyCookieDetected = true;
            }
        }

        // Exibe os dados de armazenamento local e de sessão
        if (message.type === "storageData") {
            storageInfoDiv.innerHTML = `
                <div style="color: orange; font-weight: bold;">LocalStorage:</div>
                <pre>${JSON.stringify(message.localStorage, null, 2)}</pre>
                <div style="color: orange; font-weight: bold;">SessionStorage:</div>
                <pre>${JSON.stringify(message.sessionStorage, null, 2)}</pre>
            `;
        }

        // Detecta hijacking ou hooking
        if (message.type === "hijackWarning") {
            hijackDetectedCount++; // Incrementa o contador de scripts perigosos
        }

        // Detecta canvas fingerprinting
        if (message.type === "canvasFingerprint") {
            fingerprintInfoDiv.innerHTML = `<div style="color: purple; font-weight: bold;">Canvas Fingerprinting Detectado</div>`;
            fingerprintDetected = true;
        }

        // Atualiza a pontuação de privacidade com base nas detecções
        updateDisplay();
    });

    // Função para atualizar a exibição e a pontuação de privacidade
    function updateDisplay() {
        // Atualiza a quantidade de conexões de terceiros
        connectionsDiv.textContent = `Conexões de Terceiros: ${thirdPartyDomains.size}`;

        // Atualiza a quantidade de scripts potencialmente perigosos detectados
        hijackWarningDiv.innerHTML = `<div style="color: red; font-weight: bold;">Scripts Potencialmente Perigosos: ${hijackDetectedCount}</div>`;

        // Avaliação de cookies de terceira parte
        score = 10; // Pontuação inicial
        if (thirdPartyCookieDetected) {
            score -= 2;
        }

        // Avaliação de scripts potencialmente perigosos (hijacking)
        if (hijackDetectedCount > 0) {
            score -= 2;
        }

        // Avaliação de canvas fingerprinting
        if (fingerprintDetected) {
            score -= 2;
        }

        // Avaliação de domínios de terceira parte
        if (thirdPartyDomains.size > 5) {
            score -= 2;
        } else if (thirdPartyDomains.size >= 3) {
            score -= 1;
        }

        // Atualiza a exibição da pontuação na página
        scoreElement.textContent = `Pontuação de Privacidade: ${score}/10`;
    }

    // Adiciona evento de clique ao botão para limpar o histórico
    clearButton.addEventListener('click', function() {
        connectionsDiv.textContent = ''; // Limpa o conteúdo do div
        resetDetections(); // Reinicia as detecções e a pontuação
    });

    // Função para resetar as variáveis de detecção
    function resetDetections() {
        score = 10;
        thirdPartyCookieDetected = false;
        hijackDetectedCount = 0;
        fingerprintDetected = false;
        thirdPartyDomains.clear(); // Limpa o Set de domínios
        updateDisplay(); // Atualiza exibição após resetar
        cookieInfoDiv.innerHTML = ''; // Limpa informações de cookies
        storageInfoDiv.innerHTML = ''; // Limpa informações de armazenamento
        hijackWarningDiv.innerHTML = ''; // Limpa contagem de scripts perigosos
        fingerprintInfoDiv.innerHTML = ''; // Limpa mensagens de fingerprint
    }
});
