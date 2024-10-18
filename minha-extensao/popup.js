document.addEventListener('DOMContentLoaded', function() {
    const connectionsDiv = document.getElementById('connections');
    const clearButton = document.getElementById('clearButton');

    // Estabelece uma conexão com o background script
    const port = browser.runtime.connect({name: "port-from-popup"});
    console.log("Conexão estabelecida com o background script...");

    // Escuta mensagens do background script
    port.onMessage.addListener(function(message) {
        console.log("Mensagem recebida no popup:", message);
        
        // Trata as mensagens do tipo "host" (domínios de terceira parte)
        if (message.type === "host") {
            const hostElement = document.createElement('div');
            hostElement.style.color = "black"; // Cor para domínios de terceira parte
            hostElement.textContent = `Dominio de terceira parte: ${message.host}`;
            hostElement.style.marginBottom = "2px"; // Margem pequena entre domínios de terceira parte
            connectionsDiv.appendChild(hostElement);
        }

        // Exibe os dados de cookies
        if (message.type === "cookies") {
            const cookiesElement = document.createElement('div');
            cookiesElement.style.color = "blue"; // Cor para cookies
            cookiesElement.innerHTML = `
                <div>Cookies de Primeira Parte: ${message.firstParty}</div>
                <div>Cookies de Terceira Parte: ${message.thirdParty}</div>
                <div>Cookies de Sessão: ${message.session}</div>
                <div>Cookies Persistentes: ${message.persistent}</div>
            `;
            cookiesElement.style.marginBottom = "10px"; // Espaço maior entre cookies e próxima categoria
            connectionsDiv.appendChild(cookiesElement);
        }

        // Exibe os dados de armazenamento local e de sessão
        if (message.type === "storageData") {
            const storageElement = document.createElement('div');
            storageElement.style.color = "orange"; // Cor para dados de storage
            storageElement.innerHTML = `
                <div>LocalStorage:</div>
                <pre>${JSON.stringify(message.localStorage, null, 2)}</pre>
                <div>SessionStorage:</div>
                <pre>${JSON.stringify(message.sessionStorage, null, 2)}</pre>
            `;
            storageElement.style.marginBottom = "10px"; // Espaço maior entre storage e próxima categoria
            connectionsDiv.appendChild(storageElement);
        }

        // Exibe avisos de hijacking ou hooking
        if (message.type === "hijackWarning") {
            const hijackElement = document.createElement('div');
            hijackElement.style.color = "red"; // Cor para avisos de hijacking
            hijackElement.textContent = `${message.warning}`;
            hijackElement.style.marginBottom = "2px"; // Margem pequena entre avisos da mesma categoria
            connectionsDiv.appendChild(hijackElement);
        }

        // Exibe avisos de canvas fingerprinting
        if (message.type === "canvasFingerprint") {
            const canvasElement = document.createElement('div');
            canvasElement.style.color = "purple"; // Cor para Canvas Fingerprinting
            canvasElement.textContent = `Canvas fingerprinting detectado via ${message.method} na página ${message.url}`;
            canvasElement.style.marginBottom = "10px"; // Espaço maior entre fingerprinting e próxima categoria
            connectionsDiv.appendChild(canvasElement);
        }
    });

    // Adiciona evento de clique ao botão para limpar o histórico
    clearButton.addEventListener('click', function() {
        connectionsDiv.textContent = ''; // Limpa o conteúdo do div
    });
});
